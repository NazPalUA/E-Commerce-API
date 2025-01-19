import { NotFoundError } from '@/errors/not-found-error';
import { InternalServerError } from '@/errors/server-error';
import { UnauthorizedError } from '@/errors/unauthorized-error';
import { ClientSession, Collection, ObjectId } from 'mongodb';
import { collections } from '../..';
import { RefreshTokenRevokedReason } from './constants';
import {
  RefreshToken_DbEntity,
  RefreshToken_DbEntity_Input,
  RefreshToken_DbEntity_Schema,
  RefreshToken_DTO,
} from './refreshToken.model';

class RefreshTokenRepository {
  private get collection(): Collection<RefreshToken_DbEntity> {
    return collections.refreshTokens;
  }

  private getDTO = (token: RefreshToken_DbEntity): RefreshToken_DTO => {
    const { _id, user, ...rest } = token;
    return {
      ...rest,
      id: _id.toString(),
      userId: user.toString(),
    };
  };

  public async createNew(
    token: Pick<
      RefreshToken_DbEntity_Input,
      'user' | 'refreshTokenSecret' | 'ip' | 'userAgent'
    >,
    session?: ClientSession
  ): Promise<RefreshToken_DTO> {
    const candidate = RefreshToken_DbEntity_Schema.safeParse({
      ...token,
      _id: new ObjectId(),
    });
    if (!candidate.success)
      throw new InternalServerError('Failed to parse refresh token');

    const result = await this.collection.insertOne(candidate.data, { session });
    if (!result.acknowledged)
      throw new InternalServerError('Failed to insert refresh token');

    const tokenDTO = this.getDTO({
      ...candidate.data,
      _id: result.insertedId,
    });

    return tokenDTO;
  }

  public async getUserIdByTokenSecret(
    refreshTokenSecret: string
  ): Promise<string> {
    const token = await this.collection.findOne(
      { refreshTokenSecret },
      { projection: { user: 1, _id: 0 } }
    );
    if (!token) throw new NotFoundError('Refresh token');
    return token.user.toString();
  }

  public async checkTokenSecret(refreshTokenSecret: string): Promise<void> {
    const token = await this.collection.findOne(
      { refreshTokenSecret },
      { projection: { _id: 0, isValid: 1, createdAt: 1 } }
    );
    if (!token || !token.isValid)
      throw new UnauthorizedError('Invalid refresh token');

    if (token.createdAt < new Date(Date.now() - 1000 * 60 * 60 * 24))
      throw new UnauthorizedError('Refresh token expired');

    const result = await this.collection.updateOne(
      { refreshTokenSecret },
      { $set: { lastUsedAt: new Date(), updatedAt: new Date() } }
    );
    if (!result.acknowledged)
      throw new InternalServerError('Failed to use refresh token');
  }

  public async invalidateUserTokens(
    userId: string,
    reason: RefreshTokenRevokedReason
  ): Promise<void> {
    const result = await this.collection.updateMany(
      { user: new ObjectId(userId) },
      {
        $set: {
          isValid: false,
          updatedAt: new Date(),
          revokedAt: new Date(),
          revokedReason: reason,
        },
      }
    );
    if (!result.acknowledged)
      throw new InternalServerError('Failed to invalidate refresh token');
  }
}

export const refreshTokenRepo = new RefreshTokenRepository();

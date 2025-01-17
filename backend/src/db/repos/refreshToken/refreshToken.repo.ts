import { ClientSession, Collection, ObjectId } from 'mongodb';
import { collections } from '../..';
import {
  getTokenDTO,
  RefreshRefreshToken_DbEntity,
  RefreshToken_DbEntity_Schema,
  RefreshToken_DTO,
  RefreshToken_Input,
} from './refreshToken.model';

class RefreshTokenRepository {
  private get collection(): Collection<RefreshRefreshToken_DbEntity> {
    return collections.refreshTokens;
  }

  public async insertToken(
    token: RefreshToken_Input,
    session?: ClientSession
  ): Promise<RefreshToken_DTO> {
    const candidate = RefreshToken_DbEntity_Schema.parse({
      ...token,
      _id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const result = await this.collection.insertOne(candidate, { session });
    const tokenDTO = getTokenDTO({
      ...candidate,
      _id: result.insertedId,
    });

    return tokenDTO;
  }

  public async findTokenByRefreshToken(
    refreshToken: string
  ): Promise<RefreshToken_DTO | null> {
    return this.collection
      .findOne({ refreshToken })
      .then(token => (token ? getTokenDTO(token) : null));
  }

  public async deleteTokenByUserId(userId: string): Promise<void> {
    await this.collection.deleteMany({ user: new ObjectId(userId) });
  }

  public async invalidateUserTokens(
    userId: string,
    exceptTokenId?: string
  ): Promise<void> {
    const query = exceptTokenId
      ? {
          user: new ObjectId(userId),
          _id: { $ne: new ObjectId(exceptTokenId) },
        }
      : { user: new ObjectId(userId) };

    await this.collection.updateMany(query, {
      $set: { isValid: false, updatedAt: new Date() },
    });
  }
}

export const refreshTokenRepo = new RefreshTokenRepository();

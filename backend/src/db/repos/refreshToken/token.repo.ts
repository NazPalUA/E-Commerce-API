import { NotFoundError } from '@/errors/not-found-error';
import { ClientSession, Collection, ObjectId } from 'mongodb';
import { collections } from '../..';
import {
  getTokenDTO,
  NewToken,
  Token_DbEntity,
  Token_DbEntity_Schema,
  Token_DTO,
} from './token.model';

export class TokenRepository {
  private get collection(): Collection<Token_DbEntity> {
    return collections.tokens;
  }

  public async isTokenOwner(tokenId: string, userId: string): Promise<boolean> {
    if (!(await this.checkTokenExists(tokenId)))
      throw new NotFoundError('Token not found');

    const token = await this.collection.findOne(
      { _id: new ObjectId(tokenId) },
      { projection: { user: 1 } }
    );
    return token?.user.toString() === userId;
  }

  public async checkTokenExists(tokenId: string): Promise<boolean> {
    const token = await this.collection.findOne(
      { _id: new ObjectId(tokenId) },
      { projection: { _id: 1 } }
    );
    return token !== null;
  }

  public async insertToken(
    token: NewToken,
    session?: ClientSession
  ): Promise<Token_DTO> {
    const candidate = Token_DbEntity_Schema.parse({
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

  public async updateToken(
    tokenId: string,
    tokenData: Partial<Pick<Token_DTO, 'ip' | 'userAgent' | 'isValid'>>
  ): Promise<Token_DTO | null> {
    if (!(await this.checkTokenExists(tokenId)))
      throw new NotFoundError('Token not found');

    const updatedToken = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(tokenId) },
      { $set: { ...tokenData, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!updatedToken) throw new NotFoundError('Token not found');

    return getTokenDTO(updatedToken);
  }

  public async findTokenById(tokenId: string): Promise<Token_DTO | null> {
    return this.collection
      .findOne({ _id: new ObjectId(tokenId) })
      .then(token => (token ? getTokenDTO(token) : null));
  }

  public async findTokenByRefreshToken(
    refreshToken: string
  ): Promise<Token_DTO | null> {
    return this.collection
      .findOne({ refreshToken })
      .then(token => (token ? getTokenDTO(token) : null));
  }

  public async findTokensByUser(userId: string): Promise<Token_DTO[]> {
    return this.collection
      .find({ user: new ObjectId(userId) })
      .toArray()
      .then(tokens => tokens.map(token => getTokenDTO(token)));
  }

  public async deleteToken(
    tokenId: string,
    session?: ClientSession
  ): Promise<boolean> {
    const token = await this.collection.findOne({ _id: new ObjectId(tokenId) });
    if (!token) throw new NotFoundError('Token not found');

    const result = await this.collection.deleteOne({
      _id: new ObjectId(tokenId),
    });

    return result.deletedCount === 1;
  }

  public async deleteTokenByUserId(userId: string): Promise<void> {
    await this.collection.deleteMany({ user: new ObjectId(userId) });
  }

  public async cleanupExpiredTokens(): Promise<void> {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() - 7); // Remove tokens older than 7 days

    await this.collection.deleteMany({
      $or: [{ isValid: false }, { createdAt: { $lt: expiryDate } }],
    });
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

export const tokenRepo = new TokenRepository();

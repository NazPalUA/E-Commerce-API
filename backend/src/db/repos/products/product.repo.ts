import { NotFoundError } from '@/errors/not-found-error';
import { ClientSession, Collection, ObjectId } from 'mongodb';
import { collections } from '../..';
import {
  getProductDTO,
  NewProduct,
  Product_DbEntity,
  Product_DbEntity_Schema,
  Product_DTO,
} from './product.model';

class ProductRepository {
  private get collection(): Collection<Product_DbEntity> {
    return collections.products;
  }

  public async isProductOwner(
    productId: string,
    userId: string
  ): Promise<boolean> {
    if (!(await this.checkProductExists(productId)))
      throw new NotFoundError('Product not found');

    const product = await this.collection.findOne(
      { _id: new ObjectId(productId) },
      { projection: { user: 1 } }
    );
    if (!product) throw new NotFoundError('Product');
    return product?.user.toString() === userId;
  }

  public async checkProductExists(productId: string): Promise<boolean> {
    const product = await this.collection.findOne(
      {
        _id: new ObjectId(productId),
      },
      { projection: { _id: 1 } }
    );
    return product !== null;
  }

  public async insertProduct(product: NewProduct): Promise<Product_DTO> {
    const candidate = Product_DbEntity_Schema.parse({
      ...product,
      _id: new ObjectId(),
    });
    const result = await this.collection.insertOne(candidate);
    const productDTO = getProductDTO({
      ...candidate,
      _id: result.insertedId,
    });
    return productDTO;
  }

  public async updateProduct(
    productId: string,
    productData: Partial<Omit<Product_DTO, 'id' | 'createdAt' | 'user'>>
  ): Promise<Product_DTO | null> {
    if (!(await this.checkProductExists(productId)))
      throw new NotFoundError('Product not found');

    const updatedProduct = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(productId) },
      { $set: { ...productData, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    return updatedProduct ? getProductDTO(updatedProduct) : null;
  }

  public async findAllProducts(): Promise<Product_DTO[]> {
    return this.collection
      .find()
      .toArray()
      .then(products => products.map(product => getProductDTO(product)));
  }

  public async findProductById(productId: string): Promise<Product_DTO | null> {
    return this.collection
      .findOne({ _id: new ObjectId(productId) })
      .then(product => (product ? getProductDTO(product) : null));
  }

  public async deleteProduct(
    productId: string,
    session?: ClientSession
  ): Promise<boolean> {
    if (!(await this.checkProductExists(productId)))
      throw new NotFoundError('Product not found');

    const result = await this.collection.deleteOne(
      {
        _id: new ObjectId(productId),
      },
      { session }
    );
    return result.deletedCount === 1;
  }

  public async updateAverageRating(
    productId: string,
    session?: ClientSession
  ): Promise<void> {
    if (!(await this.checkProductExists(productId)))
      throw new NotFoundError('Product not found');

    const pipeline = [
      {
        $match: { product: new ObjectId(productId) },
      },
      {
        $group: {
          _id: '$product',
          averageRating: { $avg: '$rating' },
        },
      },
    ];

    const aggregationResult = await collections.reviews
      .aggregate(pipeline, { session })
      .toArray();

    const averageRating =
      aggregationResult[0]?.averageRating !== undefined
        ? aggregationResult[0].averageRating
        : 0;

    await this.collection.updateOne(
      { _id: new ObjectId(productId) },
      { $set: { averageRating, updatedAt: new Date() } },
      { session }
    );
  }
}

export const productRepo = new ProductRepository();

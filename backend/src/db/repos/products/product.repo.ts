import { Collection, ObjectId } from 'mongodb';
import { collections } from '../..';
import {
  getProductDTO,
  NewProduct,
  Product_DbEntity,
  Product_DbEntity_Schema,
  Product_DTO,
} from './product.model';

export class ProductRepository {
  private get collection(): Collection<Product_DbEntity> {
    return collections.products;
  }

  public async isProductOwner(
    productId: string,
    userId: string
  ): Promise<boolean> {
    const product = await this.collection.findOne(
      { _id: new ObjectId(productId) },
      { projection: { user: 1 } }
    );
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

  public async findProductsByUser(userId: string): Promise<Product_DTO[]> {
    return this.collection
      .find({ user: new ObjectId(userId) })
      .toArray()
      .then(products => products.map(product => getProductDTO(product)));
  }

  public async deleteProduct(productId: string): Promise<boolean> {
    const result = await this.collection.deleteOne({
      _id: new ObjectId(productId),
    });
    return result.deletedCount === 1;
  }
}

export const productRepo = new ProductRepository();

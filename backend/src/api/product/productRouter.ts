import { Product_DTO_Schema } from '@/db/repos/products/product.model';
import { UserRoles } from '@/db/repos/users/constants';
import { authenticate, authorize } from '@/middleware/authenticate';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Router } from 'express';
import { createProduct } from './controllers/createProduct/controller';
import { createProductRouterConfig } from './controllers/createProduct/docs-config';
import { deleteProduct } from './controllers/deleteProduct/controller';
import { deleteProductRouterConfig } from './controllers/deleteProduct/docs-config';
import { getAllProducts } from './controllers/getAllProduct/controller';
import { getAllProductsRouterConfig } from './controllers/getAllProduct/docs-config';
import { getSingleProduct } from './controllers/getSingleProduct/controller';
import { getSingleProductRouterConfig } from './controllers/getSingleProduct/docs-config';
import { updateProduct } from './controllers/updateProduct/controller';
import { updateProductRouterConfig } from './controllers/updateProduct/docs-config';

export const productRegistry = new OpenAPIRegistry();
export const productRouter = Router();

productRegistry.register('Product', Product_DTO_Schema);

// Get all products (public)
productRouter.get('/', getAllProducts);
productRegistry.registerPath(getAllProductsRouterConfig);

// Get single product (public)
productRouter.get('/:id', getSingleProduct);
productRegistry.registerPath(getSingleProductRouterConfig);

// Create product (authenticated)
productRouter.post(
  '/',
  authenticate,
  authorize(UserRoles.ADMIN),
  createProduct
);
productRegistry.registerPath(createProductRouterConfig);

// Delete product (authenticated)
productRouter.delete(
  '/:id',
  authenticate,
  authorize(UserRoles.ADMIN),
  deleteProduct
);
productRegistry.registerPath(deleteProductRouterConfig);

// Update product (authenticated)
productRouter.patch(
  '/:id',
  authenticate,
  authorize(UserRoles.ADMIN),
  updateProduct
);
productRegistry.registerPath(updateProductRouterConfig);

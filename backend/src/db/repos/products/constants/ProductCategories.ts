export const ProductCategories = {
  OFFICE: 'office',
  KITCHEN: 'kitchen',
  BEDROOM: 'bedroom',
} as const;

export type ProductCategory =
  (typeof ProductCategories)[keyof typeof ProductCategories];

export const PRODUCT_CATEGORY_VALUES = Object.values(
  ProductCategories
) as ProductCategory[];

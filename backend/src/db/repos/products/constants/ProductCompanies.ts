export const ProductCompanies = {
  IKEA: 'ikea',
  LIDDY: 'liddy',
  MARCOS: 'marcos',
} as const;

export type ProductCompany =
  (typeof ProductCompanies)[keyof typeof ProductCompanies];

export const PRODUCT_COMPANY_VALUES = Object.values(
  ProductCompanies
) as ProductCompany[];

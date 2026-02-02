import { z } from 'zod';

export const stockStatusEnum = z.enum(['in-stock', 'check-availability', 'out-of-stock']);

export const productRetailerSchema = z
  .object({
    id: z.string(),
    retailerId: z.number().optional(),
    stockStatus: stockStatusEnum,
    regularPrice: z.string().optional(),
    salePrice: z.string().optional(),
    productUrl: z.string().optional(),
    isBestPrice: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.retailerId || data.retailerId < 1) {
      ctx.addIssue({
        path: ['retailerId'],
        message: 'Retailer is required',
        code: z.ZodIssueCode.custom,
      });
    }
    if (!data.regularPrice) {
      ctx.addIssue({
        path: ['regularPrice'],
        message: 'Regular price is required',
        code: z.ZodIssueCode.custom,
      });
    }
    if (data.regularPrice) {
      const isNumber = Number(data.regularPrice);
      if (!isNumber) {
        ctx.addIssue({
          path: ['regularPrice'],
          message: 'Regular price must be a number',
          code: z.ZodIssueCode.custom,
        });
      }
      if (isNumber < 1) {
        ctx.addIssue({
          path: ['regularPrice'],
          message: 'Regular price must be greater than 0',
          code: z.ZodIssueCode.custom,
        });
      }
    }
    if (data.salePrice) {
      const isNumber = Number(data.salePrice);
      if (!isNumber) {
        ctx.addIssue({
          path: ['salePrice'],
          message: 'Sale price must be a number',
          code: z.ZodIssueCode.custom,
        });
      } else if (isNumber < 1) {
        ctx.addIssue({
          path: ['salePrice'],
          message: 'Sale price must be greater than 0',
          code: z.ZodIssueCode.custom,
        });
      }
      if (data.regularPrice && isNumber >= Number(data.regularPrice)) {
        ctx.addIssue({
          path: ['salePrice'],
          message: 'Sale price must be less than regular price',
          code: z.ZodIssueCode.custom,
        });
      }
      if (data.productUrl) {
        if (!z.string().url().safeParse(data.productUrl).success) {
          ctx.addIssue({
            path: ['productUrl'],
            message: 'Product URL is not valid',
            code: z.ZodIssueCode.custom,
          });
        }
      }
    }
  });

export const productRetailersFormSchema = z.object({
  productRetailers: z.array(productRetailerSchema),
});

export type StockStatus = z.infer<typeof stockStatusEnum>;
export type ProductRetailer = z.infer<typeof productRetailerSchema>;
export type ProductRetailersFormData = z.infer<typeof productRetailersFormSchema>;

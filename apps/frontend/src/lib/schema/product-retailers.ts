import { z } from 'zod';

export const stockStatusEnum = z.enum(['in-stock', 'check-availability', 'out-of-stock']);

export const productRetailerSchema = z.object({
  id: z.string(),
  retailerId: z.number().optional(),
  stockStatus: stockStatusEnum,
  regularPrice: z.string().optional(),
  salePrice: z.string().optional(),
  productUrl: z.string().optional(),
  isBestPrice: z.boolean(),
});

export type StockStatus = z.infer<typeof stockStatusEnum>;
export type ProductRetailer = z.infer<typeof productRetailerSchema>;


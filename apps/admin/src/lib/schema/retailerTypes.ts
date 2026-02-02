import { __ } from '@wordpress/i18n';
import { z } from 'zod';

export const retailerTypeSchema = z.object({
  id: z.number().min(1),
  name: z.string().min(1, { message: __('Retailer type name is required') }),
  slug: z.string().optional(),
  description: z.string().optional(),
  status: z.boolean(),
  color: z.string().optional(),
  icon: z.string().optional(),
  retailersCount: z.number().optional(),
});

export const createRetailerTypeSchema = retailerTypeSchema.omit({
  id: true,
  slug: true,
  retailersCount: true,
});

export type RetailerTypeFormValues =
  | z.infer<typeof retailerTypeSchema>
  | z.infer<typeof createRetailerTypeSchema>;

const paginatedRetailerTypeSchema = z.object({
  currentPage: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
  data: z.array(retailerTypeSchema),
});
export type PaginatedRetailerTypeListValues = z.infer<typeof paginatedRetailerTypeSchema>;
export type RetailerTypeListValues = z.infer<typeof retailerTypeSchema>;

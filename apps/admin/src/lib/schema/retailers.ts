import { __ } from '@wordpress/i18n';
import { z } from 'zod';

export const retailerTypeInfoSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().optional(),
  color: z.string().optional(),
});

export const retailerSchema = z.object({
  id: z.number().min(1),
  name: z.string().min(1, { message: __('Retailer name is required') }),
  slug: z.string().optional(),
  type: z.coerce.number().optional(),
  type_info: retailerTypeInfoSchema.optional().nullable(),
  description: z.string().optional(),
  status: z.boolean(),
  logo: z.string().optional(),
  ecommerceUrl: z.string().optional(),
  phone: z.string().min(1, { message: __('Retailer phone is required') }),
  email: z.string().email(),
  address: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

export const createRetailerSchema = retailerSchema.omit({
  id: true,
  slug: true,
  type_info: true,
});

export type RetailerFormValues =
  | z.infer<typeof retailerSchema>
  | z.infer<typeof createRetailerSchema>;

const paginatedRetailersSchema = z.object({
  currentPage: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
  data: z.array(retailerSchema),
});

export type PaginatedRetailerListValues = z.infer<typeof paginatedRetailersSchema>;

export type RetailersListValues = z.infer<typeof retailerSchema>;

import { z } from 'zod';

export const retailerTypeInfoSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().optional(),
  color: z.string().optional(),
});

export const retailerSchema = z.object({
  id: z.number().min(1),
  name: z.string().min(1),
  slug: z.string().optional(),
  type: z.coerce.number().optional(),
  type_info: retailerTypeInfoSchema.optional().nullable(),
  description: z.string().optional(),
  status: z.boolean(),
  logo: z.string().optional(),
  ecommerceUrl: z.string().optional(),
  phone: z.string().min(1),
  email: z.string().email(),
  address: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

export type RetailersListValues = z.infer<typeof retailerSchema>;


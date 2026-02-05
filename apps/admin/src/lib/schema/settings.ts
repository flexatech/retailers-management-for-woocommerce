import { __ } from '@wordpress/i18n';
import { z } from 'zod';

export const settingsFormSchema = z.object({
  general: z.object({
    showOnProducts: z.boolean(),
    openNewTab: z.boolean(),
  }),
  display: z.object({
    sectionTitle: z.string().optional(),
    position: z.enum([
      'after_product_price',
      'after_add_to_cart_button',
      'below_product_details',
      'product_tab',
    ]),
    layoutStyle: z.enum(['list']),
    visibility: z.object({
      logo: z.boolean(),
      name: z.boolean(),
      type: z.boolean(),
      address: z.boolean(),
      stock: z.boolean(),
      price: z.boolean(),
      originalPrice: z.boolean(),
      button: z.boolean(),
    }),
  }),
  advanced: z.object({
    stockBasedDisplayRules: z.object({
      showWhen: z.enum(['always', 'out_of_stock', 'in_stock']),
      hideAddToCardWhenShow: z.boolean(),
    }),
    geoTargeting: z.object({
      showDifferentRetailersOnCountry: z.boolean(),
      autoDetectLocation: z.boolean(),
    }),
  }),
});
export type SettingsFormData = z.infer<typeof settingsFormSchema>;

import { __ } from '@wordpress/i18n';

import { SettingsFormData } from '@/lib/schema/settings';

export function formatNumberWithCurrency(value: number): string {
  const { currency_settings } = window.retailersManagement;
  const { symbol, position, thousand_sep, decimal_sep, num_decimals } = currency_settings;

  const [intPart, decPart] = value.toFixed(num_decimals).split('.');

  const formatted =
    intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousand_sep) + (decPart ? decimal_sep + decPart : '');

  const map: Record<string, string> = {
    left: `${symbol}${formatted}`,
    right: `${formatted}${symbol}`,
    left_space: `${symbol} ${formatted}`,
    right_space: `${formatted} ${symbol}`,
  };

  return map[position] || map.left;
}

export const DEFAULT_VISIBILITY: SettingsFormData['display']['visibility'] = {
  logo: true,
  name: true,
  type: true,
  address: true,
  stock: true,
  price: true,
  originalPrice: true,
  button: true,
};

export const DEFAULT_SETTINGS: SettingsFormData = {
  general: {
    showOnProducts: true,
    openNewTab: true,
  },
  display: {
    sectionTitle: __('Where to Buy', 'retailers-management-for-woocommerce'),
    position: 'after_product_price',
    layoutStyle: 'list',
    visibility: DEFAULT_VISIBILITY,
  },
  advanced: {
    stockBasedDisplayRules: {
      showWhen: 'always',
      hideAddToCardWhenShow: false,
    },
    geoTargeting: {
      showDifferentRetailersOnCountry: false,
      autoDetectLocation: false,
    },
  },
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const DISPLAY_POSITIONS = [
  {
    label: __('After product price', 'retailers-management-for-woocommerce'),
    value: 'after_product_price',
  },
  {
    label: __('After Add to Cart button', 'retailers-management-for-woocommerce'),
    value: 'after_add_to_cart_button',
  },
  {
    label: __('Below product details', 'retailers-management-for-woocommerce'),
    value: 'below_product_details',
  },
  {
    label: __('In product tabs', 'retailers-management-for-woocommerce'),
    value: 'product_tab',
  },
];

import { ProductRetailer } from '@/lib/schema/product-retailers';
import { RetailersListValues } from '@/lib/schema/retailers';

interface SettingsFormData {
  general: {
    showOnProducts: boolean;
    openNewTab: boolean;
  };
  display: {
    sectionTitle?: string;
    position: string;
    layoutStyle: 'list';
    visibility: {
      logo: boolean;
      name: boolean;
      type: boolean;
      address: boolean;
      stock: boolean;
      price: boolean;
      originalPrice: boolean;
      button: boolean;
    };
  };
  advanced: {
    stockBasedDisplayRules: {
      showWhen: string;
      hideAddToCardWhenShow: boolean;
    };
    geoTargeting: {
      showDifferentRetailersOnCountry: boolean;
      autoDetectLocation: boolean;
    };
  };
}

declare global {
  interface Window {
    retailersManagement: {
      plugin_url: string;
      rest_url: string;
      rest_nonce: string;
      rest_base: string;
      currency_settings: {
        currency: string;
        symbol: string;
        position: string;
        thousand_sep: string;
        decimal_sep: string;
        num_decimals: number;
      };
      product_retailers?: ProductRetailer[];
      active_retailers?: RetailersListValues[];
      settings?: SettingsFormData;
    };
  }
}

export {};


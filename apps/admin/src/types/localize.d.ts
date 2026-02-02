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
    wp: AnyObject;
  }
}

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    align?: 'left' | 'center' | 'right';
    isCheckbox?: boolean;
  }
}

export {};

import { __ } from '@wordpress/i18n';

import { api, ApiResponse, handleResponse } from '@/lib/api/base';
import { ProductRetailer } from '@/lib/schema/product-retailers';

export async function fetchProductRetailers(productId: number) {
  const response = await api.get(`products/${productId}/retailers`);
  const result = await handleResponse<ProductRetailer>(
    response,
    __('Failed to fetch product retailers'),
  );
  return result.data ?? [];
}

export async function saveProductRetailers(productId: number, retailers: ProductRetailer[]) {
  const response = await api.post(`products/${productId}/retailers`, {
    json: { retailers },
  });
  const result = await handleResponse<ProductRetailer[]>(
    response,
    __('Failed to save product retailers'),
  );
  return {
    data: result.data ?? [],
    message: result.message || __('Saved Changes'),
  };
}

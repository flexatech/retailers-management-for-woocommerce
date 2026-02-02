import { __ } from '@wordpress/i18n';

import { api, ApiResponse, handleResponse } from '@/lib/api/base';
import { RetailerFormValues, RetailersListValues } from '@/lib/schema/retailers';

import {
  PaginatedRetailerTypeListValues,
  RetailerTypeFormValues,
  RetailerTypeListValues,
} from '../schema/retailerTypes';

export async function fetchRetailerTypes(
  keyword: string,
  page: number,
  perPage: number,
  status: string,
) {
  const searchParams = new URLSearchParams({
    kw: keyword,
    page: String(page),
    per_page: String(perPage),
    status: status,
  });

  const response = await api.get('retailer-types', { searchParams });
  const result = await handleResponse<PaginatedRetailerTypeListValues>(
    response,
    __('Failed to fetch retailer types'),
  );

  return (
    result.data ?? {
      currentPage: 1,
      totalPage: 1,
      data: [],
    }
  );
}

export async function fetchActiveRetailerTypes() {
  const response = await api.get('retailer-types', { searchParams: { active: 'true' } });
  const result = await handleResponse<RetailerTypeListValues[]>(
    response,
    __('Failed to fetch retailer types'),
  );
  return result.data ?? [];
}

export async function fetchRetailerType(retailerTypeId: number) {
  const response = await api.get(`retailer-types/${retailerTypeId}`);
  const result = await handleResponse<RetailerTypeFormValues>(
    response,
    __('Failed to fetch retailer type'),
  );
  return result.data;
}

export async function postRetailerType(data: RetailerTypeFormValues) {
  const response = await api.post('retailer-types', { json: data });
  const result = await handleResponse<RetailerTypeFormValues>(
    response,
    __('Failed to create retailer type'),
  );
  return result;
}

export async function updateRetailerType(data: RetailerTypeFormValues, retailerTypeId: number) {
  const response = await api.put(`retailer-types/${retailerTypeId}`, { json: data });
  const result = await handleResponse<RetailerFormValues>(
    response,
    __('Failed to update retailer'),
  );
  return result;
}

export async function deleteRetailerType(retailerTypeId: number) {
  const response = await api.delete(`retailer-types/${retailerTypeId}`);
  const result = await handleResponse<RetailerTypeListValues[]>(
    response,
    __('Failed to delete retailer type'),
  );
  return result;
}

export async function deleteManyRetailerTypes(ids: number[]) {
  const response = await api.delete('retailer-types/bulk-delete', { json: { ids } });
  const result = await handleResponse<RetailerTypeListValues[]>(
    response,
    __('Failed to bulk delete retailer types'),
  );
  return result;
}

export async function updateRetailerTypeStatus(id: number, status: boolean) {
  const response = await api.put(`retailer-types/${id}`, { json: { status } });
  const result = await handleResponse<RetailerTypeListValues>(
    response,
    __('Failed to update retailer type status'),
  );
  return result;
}

// bulk update role status
export async function bulkUpdateRetailerTypeStatus(ids: number[], status: boolean) {
  const response = await api.put('retailer-types/bulk-status', { json: { ids, status } });
  const result = await handleResponse<RetailersListValues[]>(
    response,
    __('Failed to bulk update retailer status'),
  );
  return result;
}

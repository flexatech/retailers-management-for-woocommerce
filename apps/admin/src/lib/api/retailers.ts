import { __ } from '@wordpress/i18n';

import { api, ApiResponse, handleResponse } from '@/lib/api/base';
import {
  PaginatedRetailerListValues,
  RetailerFormValues,
  RetailersListValues,
} from '@/lib/schema/retailers';

export async function fetchRetailers(
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

  const response = await api.get('retailers', { searchParams });
  const result = await handleResponse<PaginatedRetailerListValues>(
    response,
    __('Failed to fetch retailers'),
  );

  return (
    result.data ?? {
      currentPage: 1,
      totalPage: 1,
      data: [],
    }
  );
}

export async function fetchActiveRetailers() {
  const response = await api.get('retailers', { searchParams: { active: 'true' } });
  const result = await handleResponse<RetailersListValues[]>(
    response,
    __('Failed to fetch retailers'),
  );
  return result.data ?? [];
}

// get role by id
export async function fetchRetailer(retailerId: number) {
  const response = await api.get(`retailers/${retailerId}`);
  const result = await handleResponse<RetailerFormValues>(response, __('Failed to fetch retailer'));
  return result.data;
}

// create new role
export async function postRetailer(data: RetailerFormValues) {
  const response = await api.post('retailers', { json: data });
  const result = await handleResponse<RetailerFormValues>(
    response,
    __('Failed to create retailer'),
  );
  return result;
}

// update role
export async function updateRetailer(data: RetailerFormValues, retailerId: number) {
  const response = await api.put(`retailers/${retailerId}`, { json: data });
  const result = await handleResponse<RetailerFormValues>(
    response,
    __('Failed to update retailer'),
  );
  return result;
}

// delete role
export async function deleteRetailer(id: number) {
  const response = await api.delete(`retailers/${id}`);
  const result = await handleResponse<RetailersListValues[]>(
    response,
    __('Failed to delete retailer'),
  );
  return result;
}

// delete many roles
export async function deleteManyRetailers(ids: number[]) {
  const response = await api.delete('retailers/bulk-delete', { json: { ids } });
  const result = await handleResponse<RetailersListValues[]>(
    response,
    __('Failed to bulk delete retailers'),
  );
  return result;
}

export async function updateRetailerStatus(id: number, status: boolean) {
  const response = await api.put(`retailers/${id}`, { json: { status } });
  const result = await handleResponse<RetailersListValues>(
    response,
    __('Failed to update retailer status'),
  );
  return result;
}

export async function bulkUpdateRetailerStatus(ids: number[], status: boolean) {
  const response = await api.put('retailers/bulk-status', { json: { ids, status } });
  const result = await handleResponse<RetailersListValues[]>(
    response,
    __('Failed to bulk update retailer status'),
  );
  return result;
}

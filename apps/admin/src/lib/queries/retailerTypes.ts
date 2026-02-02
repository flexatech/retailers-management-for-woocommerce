import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { __ } from '@wordpress/i18n';
import { useNavigate } from 'react-router-dom';

import {
  bulkUpdateRetailerTypeStatus,
  updateRetailerType,
  updateRetailerTypeStatus,
} from '@/lib/api/retailerTypes';
import { RetailerTypeFormValues } from '@/lib/schema/retailerTypes';
import { showToast } from '@/components/custom/showToast';

import {
  deleteManyRetailerTypes,
  deleteRetailerType,
  fetchActiveRetailerTypes,
  fetchRetailerType,
  fetchRetailerTypes,
  postRetailerType,
} from '../api/retailerTypes';

const QUERY_KEY = ['retailer-types'];

export function useRetailerTypesQuery(
  keyword: string,
  pagination: {
    pageIndex: number;
    pageSize: number;
  },
  status: string,
) {
  return useQuery({
    queryKey: [...QUERY_KEY, { keyword, pagination, status }],
    queryFn: () =>
      fetchRetailerTypes(keyword, pagination.pageIndex + 1, pagination.pageSize, status),
    placeholderData: keepPreviousData,
  });
}

export function useActiveRetailerTypesQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, { active: true }],
    queryFn: () => fetchActiveRetailerTypes(),
  });
}

/**
 * Query to fetch Retailer by ID
 * @param retailerId - ID of the Retailer
 * @returns Query to fetch Retailer data
 */
export function useRetailerTypeQuery(retailerTypeId: number) {
  return useQuery({
    queryKey: ['retailer-type', retailerTypeId],
    queryFn: async () => {
      if (!retailerTypeId) {
        throw new Error('No retailer type ID provided');
      }
      const response = await fetchRetailerType(retailerTypeId);
      return response;
    },
    enabled: !!retailerTypeId,
  });
}

// Mutation: create new role
export function useAddRetailerTypeMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: postRetailerType,
    onSuccess: (response) => {
      showToast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
        exact: false,
      });
      navigate('/retailer-types');
    },
    onError: (error: Error) => {
      showToast.error(error.message);
    },
  });
}

// Mutation: update role
export function useUpdateRetailerTypeMutation(retailerTypeId: number) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: RetailerTypeFormValues) => updateRetailerType(data, retailerTypeId),
    onSuccess: (response) => {
      showToast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ['retailer-type', retailerTypeId] });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
        exact: false,
      });
      navigate('/retailer-types');
    },
    onError: (error: Error) => {
      showToast.error(error.message);
    },
  });
}

// Mutation: delete role
export function useDeleteRetailerTypeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (retailerTypeId: number) => deleteRetailerType(retailerTypeId),
    onSuccess: (response) => {
      showToast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
        exact: false,
      });
    },
    onError: (error: Error) => {
      showToast.error(error.message);
    },
  });
}

// Mutation: delete many roles
export function useDeleteManyRetailerTypesMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteManyRetailerTypes,
    onSuccess: (response) => {
      showToast.success(response.message);
      if (!queryClient.isFetching({ queryKey: QUERY_KEY })) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEY,
          exact: false,
        });
      }
    },
    onError: (error: Error) => {
      showToast.error(error.message);
    },
  });
}

export function useUpdateRetailerTypeStatusMutation(retailerTypeId: number) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (status: boolean) => updateRetailerTypeStatus(retailerTypeId, status),
    onSuccess: (response) => {
      showToast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ['retailer-type', retailerTypeId] });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
        exact: false,
      });
      navigate('/retailer-types');
    },
    onError: (error: Error) => {
      showToast.error(error.message);
    },
  });
}

export function useBulkUpdateRetailerTypeStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: number[]; status: boolean }) =>
      bulkUpdateRetailerTypeStatus(ids, status),
    onSuccess: (response) => {
      showToast.success(response.message);
      if (!queryClient.isFetching({ queryKey: QUERY_KEY })) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEY,
          exact: false,
        });
      }
    },
    onError: (error: Error) => {
      showToast.error(error.message);
    },
  });
}

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
  bulkUpdateRetailerStatus,
  deleteManyRetailers,
  deleteRetailer,
  fetchActiveRetailers,
  fetchRetailer,
  fetchRetailers,
  postRetailer,
  updateRetailer,
  updateRetailerStatus,
} from '@/lib/api/retailers';
import { RetailerFormValues } from '@/lib/schema/retailers';
import { showToast } from '@/components/custom/showToast';

const QUERY_KEY = ['retailers'];

export function useRetailersQuery(
  keyword: string,
  pagination: {
    pageIndex: number;
    pageSize: number;
  },
  status: string,
) {
  return useQuery({
    queryKey: [...QUERY_KEY, { keyword, pagination, status }],
    queryFn: () => fetchRetailers(keyword, pagination.pageIndex + 1, pagination.pageSize, status),
    placeholderData: keepPreviousData,
  });
}

export function useActiveRetailersQuery() {
  return useQuery({
    queryKey: [...QUERY_KEY, { active: true }],
    queryFn: () => fetchActiveRetailers(),
  });
}

export function useRetailerQuery(retailerId: number) {
  return useQuery({
    queryKey: ['retailer', retailerId],
    queryFn: async () => {
      if (!retailerId) {
        throw new Error('No retailer ID provided');
      }
      const response = await fetchRetailer(retailerId);
      return response;
    },
    enabled: !!retailerId,
  });
}

export function useAddRetailerMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: postRetailer,
    onSuccess: (response) => {
      showToast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
        exact: false,
      });
      navigate('/retailers');
    },
    onError: (error: Error) => {
      showToast.error(error.message);
    },
  });
}

export function useUpdateRetailerMutation(retailerId: number) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: RetailerFormValues) => updateRetailer(data, retailerId),
    onSuccess: (response) => {
      showToast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ['retailer', retailerId] });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
        exact: false,
      });
      navigate('/retailers');
    },
    onError: (error: Error) => {
      showToast.error(error.message);
    },
  });
}

export function useDeleteRetailerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (retailerId: number) => deleteRetailer(retailerId),
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

export function useDeleteManyRetailersMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteManyRetailers,
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

export function useUpdateRetailerStatusMutation(retailerId: number) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (status: boolean) => updateRetailerStatus(retailerId, status),
    onSuccess: (response) => {
      showToast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ['retailer', retailerId] });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
        exact: false,
      });
      navigate('/retailers');
    },
    onError: (error: Error) => {
      showToast.error(error.message);
    },
  });
}

export function useBulkUpdateRetailerStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: number[]; status: boolean }) =>
      bulkUpdateRetailerStatus(ids, status),
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
  //
}

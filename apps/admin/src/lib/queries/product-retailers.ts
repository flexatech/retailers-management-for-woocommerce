import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchProductRetailers, saveProductRetailers } from '@/lib/api/product-retailers';
import { ProductRetailer, productRetailerSchema } from '@/lib/schema/product-retailers';
import { showToast } from '@/components/custom/showToast';

const QUERY_KEY = ['product-retailers'];
export function useProductRetailersQuery(productId: number) {
  return useQuery({
    queryKey: [...QUERY_KEY, { productId }],
    queryFn: () => fetchProductRetailers(productId),
    enabled: !!productId,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export function useSaveProductRetailersMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, retailers }: { productId: number; retailers: ProductRetailer[] }) =>
      saveProductRetailers(productId, retailers),

    onSuccess: (response, variables) => {
      const { productId } = variables;

      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEY, { productId }],
      });
    },

    onError: (error: Error) => {
      showToast.error(error.message);
    },
  });
}

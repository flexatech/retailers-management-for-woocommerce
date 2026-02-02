import '../main.css';

import React from 'react';
import { ProductRetailersTab } from '@/woocommerce/ProductRetailersTab';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { __ } from '@wordpress/i18n';
import { createRoot } from 'react-dom/client';

import { Toaster } from '@/components/ui/sonner';
import { showToast } from '@/components/custom/showToast';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: Error) => {
      showToast.error(__(`An error occurred: ${error.message}`));
    },
  }),
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Get product ID from the page
const productIdElement = document.getElementById('post_ID');
const productId = productIdElement
  ? parseInt(productIdElement.getAttribute('value') || '0', 10)
  : 0;

const container = document.getElementById('rmfw-product-retailers-tab');
if (container) {
  createRoot(container).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ProductRetailersTab productId={productId} />
        <Toaster />
      </QueryClientProvider>
    </React.StrictMode>,
  );
}

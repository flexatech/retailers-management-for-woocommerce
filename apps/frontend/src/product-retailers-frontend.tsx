import './main.css';

import React from 'react';
import { ProductRetailersFrontend } from '@/components/ProductRetailersFrontend';
import { createRoot } from 'react-dom/client';

// Get product ID from the page
const productIdElement = document.getElementById('rmfw-product-retailers-frontend');
const productId = productIdElement
  ? parseInt(productIdElement.getAttribute('data-product-id') || '0', 10)
  : 0;

const container = document.getElementById('rmfw-product-retailers-frontend');
if (container) {
  createRoot(container).render(
    <React.StrictMode>
      <ProductRetailersFrontend productId={productId} />
    </React.StrictMode>,
  );
}


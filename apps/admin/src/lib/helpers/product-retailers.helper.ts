import { v4 as uuidv4 } from 'uuid';

import { ProductRetailer, StockStatus } from '@/lib/schema/product-retailers';
import { RetailersListValues } from '@/lib/schema/retailers';

// Helper to get retailer CPT data
export function getRetailerById(retailerId: number, active_retailers: RetailersListValues[]) {
  return active_retailers.find((r) => r.id === retailerId);
}

export function newProductRetailer(): ProductRetailer {
  return {
    id: uuidv4(),
    retailerId: undefined,
    regularPrice: undefined,
    salePrice: undefined,
    productUrl: undefined,
    stockStatus: 'in-stock',
    isBestPrice: false,
  };
}

export function getStockStatusInfo(stockStatus: StockStatus, color: boolean = false): string {
  switch (stockStatus) {
    case 'in-stock':
      return color ? 'bg-green-100 text-green-800 border-green-200' : 'In Stock';
    case 'check-availability':
      return color ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'Check Availability';
    case 'out-of-stock':
      return color ? 'bg-red-100 text-red-800 border-red-200' : 'Out of Stock';
    default:
      return color ? 'bg-green-100 text-green-800 border-green-200' : 'In Stock';
  }
}

import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { RetailersListValues } from '@/lib/schema/retailers';
import { Button } from '@/components/ui/button';
import { __ } from '@wordpress/i18n';

interface RetailerPaginationProps {
  table: Table<RetailersListValues>;
  total: number;
  from: number;
  to: number;
}

export function RetailerPagination({ table, total, from, to }: RetailerPaginationProps) {
  const pageIndex = table.getState().pagination.pageIndex;

  if (table.getPageCount() <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      {/* Showing */}
      <p className="text-muted-foreground text-sm">
        {total > 0 && (
          <>
            {__('Showing', 'retailers-management-for-woocommerce')} <strong>{from}</strong> {__('to', 'retailers-management-for-woocommerce')} <strong>{to}</strong> {__('of', 'retailers-management-for-woocommerce')} <strong>{total}</strong>{' '}
            {__('results', 'retailers-management-for-woocommerce')}
          </>
        )}
      </p>

      {/* Pagination */}
      <div className="flex items-center gap-4">
        <span className="text-muted-foreground text-sm">
          {__('Page', 'retailers-management-for-woocommerce')} {pageIndex + 1} {__('of', 'retailers-management-for-woocommerce')} {table.getPageCount()}
        </span>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

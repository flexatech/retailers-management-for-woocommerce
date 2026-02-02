import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { RetailerTypeListValues } from '@/lib/schema/retailerTypes';
import { Button } from '@/components/ui/button';

interface RetailerTypesPaginationProps {
  table: Table<RetailerTypeListValues>;
  total: number;
  from: number;
  to: number;
}

export function RetailerTypesPagination({ table, total, from, to }: RetailerTypesPaginationProps) {
  const pageIndex = table.getState().pagination.pageIndex;

  if (table.getPageCount() <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      {/* Showing */}
      <p className="text-muted-foreground text-sm">
        {total > 0 && (
          <>
            Showing <strong>{from}</strong> to <strong>{to}</strong> of <strong>{total}</strong>{' '}
            results
          </>
        )}
      </p>

      {/* Pagination */}
      <div className="flex items-center gap-4">
        <span className="text-muted-foreground text-sm">
          Page {pageIndex + 1} of {table.getPageCount()}
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

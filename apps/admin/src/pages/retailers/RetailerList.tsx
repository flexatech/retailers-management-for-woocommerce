import { useMemo, useState } from 'react';
import PageHeader from '@/pages/layout/PageHeader';
import { getCoreRowModel, PaginationState, useReactTable } from '@tanstack/react-table';
import { __ } from '@wordpress/i18n';
import { Plus, RefreshCcw, SquareCheck, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { DEFAULT_RETAILER_PAGINATION, LITE_MAX_RETAILERS } from '@/lib/helpers/retailers.helper';
import {
  useBulkUpdateRetailerStatusMutation,
  useDeleteManyRetailersMutation,
  useDeleteRetailerMutation,
  useRetailersQuery,
} from '@/lib/queries/retailers';
import { isLite } from '@/lib/utils';
import BulkActionBox from '@/components/ui/bulk-actions-box';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import RetailerLimitPopup from '@/components/custom/RetailerLimitPopup';
import { DataTable as RetailerTypesTableList } from '@/components/retailer-types/DataTable';

import { RetailerPagination } from './data-view/RetailerPagination';
import { RetailersToolbar } from './data-view/RetailersToolbar';
import RetailersGrid from './grid/RetailersGrid';
import { RetailersColumns } from './list/RetailersColumns';

export default function RetailersList() {
  const navigate = useNavigate();
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: DEFAULT_RETAILER_PAGINATION.pageIndex,
    pageSize: DEFAULT_RETAILER_PAGINATION.pageSize,
  });

  const {
    data,
    isLoading: isLoadingRetailers,
    isFetching: isFetchingRetailers,
  } = useRetailersQuery(keyword, pagination, statusFilter);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { mutate: deleteRetailerType } = useDeleteRetailerMutation();
  const { mutate: bulkDeleteRetailers } = useDeleteManyRetailersMutation();

  const { mutate: bulkUpdateRetailerStatus, isPending: isBulkUpdatingRetailerStatusPending } =
    useBulkUpdateRetailerStatusMutation();

  const handleBulkDelete = (retailerTypeIds: number[]) => {
    if (!confirm(__('Are you sure you want to delete these retailer types?'))) return;
    bulkDeleteRetailers(retailerTypeIds, {
      onSettled: () => {
        table.resetRowSelection();
      },
    });
  };
  const handleDelete = (retailerTypeId: number) => {
    if (!confirm(__('Are you sure you want to delete this retailer type?'))) return;
    deleteRetailerType(retailerTypeId, {
      onSettled: () => {
        setDeletingId(null);
        table.resetRowSelection();
      },
    });
  };

  // Table columns with actions
  const columns = useMemo(
    () =>
      RetailersColumns({
        onEdit: (retailer) => navigate(`/retailers/edit/${retailer.id}`),
        onDelete: (retailer) => handleDelete(retailer.id),
      }),
    [navigate],
  );

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    state: {
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,

    pageCount: data?.totalPages ?? 0,
    rowCount: data?.totalItems ?? 0,
  });

  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const from = pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, data?.totalItems ?? 0);
  const total = data?.totalItems ?? 0;

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const selectedIds = useMemo(
    () => Array.from(table.getSelectedRowModel().rows, (row) => row.original.id),
    [selectedCount],
  );

  const retailers = data?.data ?? [];

  const handleAddNewRetailer = () => {
    if (isLite && retailers.length > LITE_MAX_RETAILERS) {
      setShowLimitPopup(true);
      return;
    }
    navigate('/retailers/new');
  };
  return (
    <>
      <PageHeader
        title="Retailers"
        description="Manage your retail partners and distribution network"
      >
        <Button
          variant="primary"
          className="gap-2 rounded-sm px-4 text-sm font-medium"
          onClick={handleAddNewRetailer}
        >
          <Plus className="h-4 w-4" />
          {__('Add New Retailer')}
        </Button>
      </PageHeader>
      {/* Toolbar */}
      <RetailersToolbar
        totalItems={total}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onSearch={(keyword) => {
          table.setPageIndex(0);
          setKeyword(keyword);
        }}
        onStatusChange={(status) => {
          table.setPageIndex(0);
          setStatusFilter(status);
        }}
      />
      {/* Types View */}
      {viewMode === 'list' && (
        <RetailerTypesTableList
          isLoading={isLoadingRetailers || isFetchingRetailers}
          table={table}
          columnsLength={columns.length}
          totalItems={total}
        />
      )}
      {/* Types Grid */}
      {viewMode === 'grid' && (
        <RetailersGrid
          retailers={retailers}
          isLoading={isLoadingRetailers || isFetchingRetailers}
          table={table}
          deletingId={deletingId}
          onDelete={handleDelete}
        />
      )}

      <RetailerPagination table={table} total={total} from={from} to={to} />

      <BulkActionBox selected={selectedCount} onClose={() => table.resetRowSelection()}>
        <span className="text-sm font-medium">{selectedCount} selected</span>

        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => {
            if (table.getIsAllPageRowsSelected()) {
              table.toggleAllPageRowsSelected(false);
            } else {
              table.toggleAllPageRowsSelected(true);
            }
          }}
        >
          {table.getIsAllPageRowsSelected() ? (
            <RefreshCcw className="size-4" />
          ) : (
            <SquareCheck className="size-4" />
          )}
          {table.getIsAllPageRowsSelected() ? 'Unselect All' : 'Select All'}
        </Button>

        <Select
          onValueChange={(value) => {
            if (!selectedIds.length) return;

            bulkUpdateRetailerStatus(
              {
                ids: selectedIds,
                status: value === 'active',
              },
              {
                onSuccess: () => {
                  table.resetRowSelection();
                },
              },
            );
          }}
        >
          <SelectTrigger className="border-none px-0 shadow-none">
            <SelectValue placeholder="Update status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="icon"
          className="text-destructive"
          onClick={() => handleBulkDelete(selectedIds)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </BulkActionBox>

      <RetailerLimitPopup
        open={showLimitPopup}
        onOpenChange={setShowLimitPopup}
        currentCount={retailers.length}
        maxLimit={LITE_MAX_RETAILERS}
      />
    </>
  );
}

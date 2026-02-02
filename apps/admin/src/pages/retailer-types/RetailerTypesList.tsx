import { useMemo, useState } from 'react';
import PageHeader from '@/pages/layout/PageHeader';
import { getCoreRowModel, PaginationState, useReactTable } from '@tanstack/react-table';
import { Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Plus, RefreshCcw, SquareCheck, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { DEFAULT_RETAILER_TYPE_PAGINATION } from '@/lib/helpers/retailer-types.helper';
import {
  useBulkUpdateRetailerTypeStatusMutation,
  useDeleteManyRetailerTypesMutation,
  useDeleteRetailerTypeMutation,
  useRetailerTypesQuery,
} from '@/lib/queries/retailerTypes';
import BulkActionBox from '@/components/ui/bulk-actions-box';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTable as RetailerTypesTableList } from '@/components/retailer-types/DataTable';

import { RetailerTypesPagination } from './data-view/RetailerTypesPagination';
import { RetailerTypesToolbar } from './data-view/RetailerTypesToolbar';
import RetailerTypesGrid from './grid/RetailerTypesGrid';
import { RetailerTypesColumns } from './list/RetailerTypesColumns';

export default function RetailerTypesList() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: DEFAULT_RETAILER_TYPE_PAGINATION.pageIndex,
    pageSize: DEFAULT_RETAILER_TYPE_PAGINATION.pageSize,
  });

  const {
    data,
    isLoading: isLoadingRetailerTypes,
    isFetching: isFetchingRetailerTypes,
  } = useRetailerTypesQuery(keyword, pagination, statusFilter);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { mutate: deleteRetailerType } = useDeleteRetailerTypeMutation();
  const { mutate: bulkDeleteRetailerTypes, isPending: isDeletingManyRetailerTypesPending } =
    useDeleteManyRetailerTypesMutation();

  const {
    mutate: bulkUpdateRetailerTypeStatus,
    isPending: isBulkUpdatingRetailerTypeStatusPending,
  } = useBulkUpdateRetailerTypeStatusMutation();

  const handleBulkDelete = (retailerTypeIds: number[]) => {
    if (!confirm(__('Are you sure you want to delete these retailer types?'))) return;
    bulkDeleteRetailerTypes(retailerTypeIds, {
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
      RetailerTypesColumns({
        onEdit: (type) => navigate(`/retailer-types/edit/${type.id}`),
        onDelete: (type) => handleDelete(type.id),
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

  const retailerTypes = data?.data ?? [];

  return (
    <>
      <PageHeader
        title={__('Retailer Types', 'retailers-management-for-woocommerce')}
        description={__('Manage categories and types for your retailers', 'retailers-management-for-woocommerce')}
      >
        <Button
          variant="primary"
          className="gap-2 rounded-sm px-4 text-sm font-medium"
          onClick={() => navigate('/retailer-types/new')}
        >
          <Plus className="h-4 w-4" />
          {__('Add Retailer Type', 'retailers-management-for-woocommerce')}
        </Button>
      </PageHeader>
      {/* Toolbar */}
      {total > 0 && (
        <RetailerTypesToolbar
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
      )}

      {/* Overlay Spinner */}
      {(isDeletingManyRetailerTypesPending || isBulkUpdatingRetailerTypeStatusPending) && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <Spinner className="text-muted-foreground size-6 animate-spin" />
        </div>
      )}

      {/* Types View */}
      {viewMode === 'list' && (
        <RetailerTypesTableList
          isLoading={isLoadingRetailerTypes || isFetchingRetailerTypes}
          table={table}
          columnsLength={columns.length}
          totalItems={total}
        />
      )}
      {/* Types Grid */}
      {viewMode === 'grid' && (
        <RetailerTypesGrid
          retailerTypes={retailerTypes}
          isLoading={isLoadingRetailerTypes || isFetchingRetailerTypes}
          table={table}
          deletingId={deletingId}
          onDelete={handleDelete}
        />
      )}
      <RetailerTypesPagination table={table} total={total} from={from} to={to} />

      <BulkActionBox selected={selectedCount} onClose={() => table.resetRowSelection()}>
        <span className="text-sm font-medium">{selectedCount} {__('selected', 'retailers-management-for-woocommerce')}</span>

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
          {table.getIsAllPageRowsSelected() ? __('Unselect All', 'retailers-management-for-woocommerce') : __('Select All', 'retailers-management-for-woocommerce')}
        </Button>

        <Select
          onValueChange={(value) => {
            if (!selectedIds.length) return;

            bulkUpdateRetailerTypeStatus(
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
            <SelectValue placeholder={__('Update status', 'retailers-management-for-woocommerce')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">{__('Active', 'retailers-management-for-woocommerce')}</SelectItem>
            <SelectItem value="inactive">{__('Inactive', 'retailers-management-for-woocommerce')}</SelectItem>
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
    </>
  );
}

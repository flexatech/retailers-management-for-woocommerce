import { ColumnDef } from '@tanstack/react-table';
import { Bolt, MapPin, Store, Trash2 } from 'lucide-react';

import { RetailersListValues } from '@/lib/schema/retailers';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RetailersManagementToolTip } from '@/components/custom/RetailersManagementToolTip';

import RetailerStatusSwitch from '../RetailerStatusSwitch';
import { __ } from '@wordpress/i18n';

interface ColumnActions {
  onEdit: (retailer: RetailersListValues) => void;
  onDelete: (retailer: RetailersListValues) => void;
}

export const RetailersColumns = (actions: ColumnActions): ColumnDef<RetailersListValues>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? 'indeterminate'
              : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const retailer = row.original;
      return (
        <div
          onClick={() => actions.onEdit(row.original)}
          className="hover:text-primary flex cursor-pointer items-center gap-3"
        >
          <div className="bg-muted flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
            {retailer.logo ? (
              <img src={retailer.logo} alt={retailer.name} className="size-5" />
            ) : (
              <Store className="text-muted-foreground size-5" />
            )}
          </div>
          <div className="min-w-0">
            <p
              className="text-foreground truncate font-medium"
              dangerouslySetInnerHTML={{ __html: retailer.name }}
            ></p>
            <p className="text-muted-foreground truncate text-xs">{retailer.email}</p>
          </div>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const typeInfo = row.original.type_info;

      return (
        <span
          className={cn(
            'bg-muted/10 text-muted-foreground border-muted/20 inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-medium',
            !typeInfo && 'bg-foreground/10',
          )}
          style={{ backgroundColor: `${typeInfo?.color}15` }}
        >
          {typeInfo ? typeInfo.name : 'N/A'}
        </span>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => (
      <RetailersManagementToolTip
        trigger={
          <div className="text-muted-foreground flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="text-sm">
              {row.original.address
                ? row.original.address.length > 35
                  ? `${row.original.address.slice(0, 35)}...`
                  : row.original.address
                : 'N/A'}
            </span>
          </div>
        }
        content={row.original.address && row.original.address.length > 35 ? <span>{row.original.address}</span> : undefined}
      />
    ),
  },
  {
    accessorKey: 'products',
    header: 'Products',
    cell: ({ row }) => <span className="text-foreground text-sm font-medium">0</span>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'clicks',
    header: 'Clicks',
    cell: ({ row }) => <span className="text-foreground text-sm font-medium">0</span>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="flex items-center gap-2">
          <RetailerStatusSwitch size="md" id={row.original.id} status={status} />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    header: () => <div className="pr-2 text-right">Actions</div>,
    cell: ({ row }) => {
      const retailer = row.original;
      return (
        <div className="flex items-center justify-end gap-1">
          <RetailersManagementToolTip
            trigger={<Button
              onClick={() => actions.onEdit(retailer)}
              variant="ghost"
              size="icon"
              className="hover:text-primary h-8 w-8"
            >
              <Bolt className="h-4 w-4" />
            </Button>}
            content={__('Edit retailer', 'retailers-management-for-woocommerce')}
          />
          <RetailersManagementToolTip
            trigger={<Button
              onClick={() => actions.onDelete(retailer)}
              variant="ghost"
              size="icon"
              className="hover:text-destructive h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>}
            content={__('Delete retailer', 'retailers-management-for-woocommerce')}
          />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

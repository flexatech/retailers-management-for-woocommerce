
import { ColumnDef } from '@tanstack/react-table';
import { Bolt, Tag, Trash2 } from 'lucide-react';

import { RetailerTypeListValues } from '@/lib/schema/retailerTypes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import RetailerTypeStatusSwitch from '../RetailerTypeStatusSwitch';
import { RetailersManagementToolTip } from '@/components/custom/RetailersManagementToolTip';
import { __ } from '@wordpress/i18n';

interface ColumnActions {
  onEdit: (type: RetailerTypeListValues) => void;
  onDelete: (type: RetailerTypeListValues) => void;
}

export const RetailerTypesColumns = (
  actions: ColumnActions,
): ColumnDef<RetailerTypeListValues>[] => [
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
        const { name, color, icon, slug } = row.original;
        return (
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg"
              style={{ backgroundColor: `${color}15` }}
              onClick={() => actions.onEdit(row.original)}
            >
              {icon ? (
                <img src={icon} alt={name} className="h-5 w-5" />
              ) : (
                <Tag className="h-5 w-5" style={{ color: color }} />
              )}
            </div>
            <div onClick={() => actions.onEdit(row.original)}>
              <p className="text-foreground hover:text-primary cursor-pointer font-medium">{name}</p>
              <div
                className={cn('text-muted-foreground bg-primary/10 rounded-sm px-1.5 py-0.5 text-xs')}
              >
                {slug}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <p className="text-muted-foreground max-w-[300px] truncate text-sm">
          {row.original.description}
        </p>
      ),
    },
    {
      accessorKey: 'color',
      header: 'Color',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div
            className="border-border h-4 w-4 rounded-full border"
            style={{ backgroundColor: row.original.color }}
          />
          <span className="text-muted-foreground font-mono text-sm">{row.original.color}</span>
        </div>
      ),
    },
    {
      accessorKey: 'retailerCount',
      header: 'Retailers',
      cell: ({ row }) => {
        const { color, retailersCount } = row.original;
        return (
          <Badge
            variant="outline"
            style={{
              backgroundColor: `${color}10`,
              borderColor: `${color}30`,
              color: color,
            }}
            className="rounded-sm"
          >
            {retailersCount} Retailer {retailersCount && retailersCount > 1 ? 's' : ''}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const { status, id } = row.original;

        return (
          <div className="flex items-center gap-2">
            <RetailerTypeStatusSwitch size="md" id={id} status={status} />
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: () => <div className="pr-2 text-right">Actions</div>,
      cell: ({ row }) => {
        const type = row.original;
        return (
          <div className="flex items-center justify-end gap-1">

            <RetailersManagementToolTip
              trigger={<Button
                onClick={() => actions.onEdit(type)}
                variant="ghost"
                size="icon"
                className="hover:text-primary h-8 w-8"
              >
                <Bolt className="size-4.5" />
              </Button>}
              content={__('Edit retailer type', 'retailers-management-for-woocommerce')}
            />
            <RetailersManagementToolTip
              trigger={<Button
                onClick={() => actions.onDelete(type)}
                variant="ghost"
                size="icon"
                className="hover:text-destructive h-8 w-8"
              >
                <Trash2 className="size-4.5" />
              </Button>}
              content={__('Delete retailer type', 'retailers-management-for-woocommerce')}
            />

          </div>
        );
      },
    },
  ];

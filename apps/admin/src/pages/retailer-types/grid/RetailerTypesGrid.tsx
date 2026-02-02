import { Table } from '@tanstack/react-table';
import { Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Bolt, Tag, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { RetailerTypeListValues } from '@/lib/schema/retailerTypes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

import RetailerTypeStatusSwitch from '../RetailerTypeStatusSwitch';
import EmptyRetailerTypesGrid from './Empty';
import { RetailersManagementToolTip } from '@/components/custom/RetailersManagementToolTip';

interface RetailerTypesGridProps {
  retailerTypes: RetailerTypeListValues[];
  isLoading: boolean;
  table: Table<RetailerTypeListValues>;
  deletingId: number | null;
  onDelete: (id: number) => void;
}

export default function RetailerTypesGrid({
  retailerTypes,
  isLoading = false,
  table,
  deletingId,
  onDelete,
}: RetailerTypesGridProps) {
  const navigate = useNavigate();

  if (retailerTypes.length === 0) {
    return <EmptyRetailerTypesGrid />;
  }

  return (
    <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-3', isLoading && 'opacity-50')}>
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <Spinner className="text-muted-foreground size-6 animate-spin" />
        </div>
      )}
      {retailerTypes?.map((type, index) => (
        <Card
          key={type.id}
          className="border-border/50 animate-slide-up overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md"
          style={{
            animationDelay: `${index * 50}ms`,
          }}
        >
          {/* Color Bar */}
          <div className="h-1.5 w-full" style={{ backgroundColor: type.color }} />

          <CardContent className="h-[170px] p-5">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl text-2xl"
                  style={{ backgroundColor: `${type.color}15` }}
                  onClick={() => navigate(`/retailer-types/edit/${type.id}`)}
                >
                  {type.icon ? (
                    <img src={type.icon} alt={type.name} className="h-6 w-6" />
                  ) : (
                    <Tag className="text-muted-foreground h-6 w-6" />
                  )}
                </div>
                <div onClick={() => navigate(`/retailer-types/edit/${type.id}`)}>
                  <h3 className="text-foreground hover:text-primary cursor-pointer font-semibold">
                    {type.name}
                  </h3>
                  <code className="text-muted-foreground bg-muted rounded-sm px-1.5 py-0.5 text-xs">
                    {type.slug}
                  </code>
                </div>
              </div>

              <Checkbox
                checked={
                  table
                    .getRowModel()
                    .rows.find((r) => r.original.id === type.id)
                    ?.getIsSelected() ?? false
                }
                onCheckedChange={(value) =>
                  table
                    .getRowModel()
                    .rows.find((r) => r.original.id === type.id)
                    ?.toggleSelected(!!value)
                }
                aria-label="Select row"
                className="translate-y-[2px]"
              />
            </div>

            <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">{type.description}</p>

            <div className="mb-4 flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-border/50 rounded-sm"
                style={{
                  backgroundColor: `${type.color}10`,
                  borderColor: `${type.color}30`,
                  color: type.color,
                }}
              >
                {type.retailersCount ?? 0} {__('Retailer', 'retailers-management-for-woocommerce')}
                {type.retailersCount && type.retailersCount > 1 ? 's' : ''}
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2 border-t p-3">
            <div className="border-border/50 flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                {/*  */}
                <RetailersManagementToolTip
                  trigger={<Button
                    variant="outline"
                    size="sm"
                    className="hover:text-foreground text-muted-foreground gap-1.5 shadow-sm transition-all hover:bg-transparent hover:shadow"
                    onClick={() => navigate(`/retailer-types/edit/${type.id}`)}
                  >
                    <Bolt className="h-3.5 w-3.5" />
                    {__('Edit', 'retailers-management-for-woocommerce')}
                  </Button>}
                  content={__('Edit retailer type', 'retailers-management-for-woocommerce')}
                />
                <RetailersManagementToolTip
                  trigger={<Button
                    variant="outline"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive gap-1.5 shadow-sm transition-all hover:bg-transparent hover:shadow"
                    onClick={() => onDelete(type.id)}
                    disabled={deletingId === type.id}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>}
                  content={__('Delete retailer type', 'retailers-management-for-woocommerce')}
                />

              </div>

              <RetailerTypeStatusSwitch size="lg" id={type.id} status={type.status} />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

import { Table } from '@tanstack/react-table';
import { Spinner } from '@wordpress/components';
import { Bolt, MapPin, Store, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { RetailersListValues } from '@/lib/schema/retailers';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

import { RetailersManagementToolTip } from '@/components/custom/RetailersManagementToolTip';

import RetailerStatusSwitch from '../RetailerStatusSwitch';
import EmptyRetailersGrid from './Empty';
import { __ } from '@wordpress/i18n';

interface RetailersGridProps {
  retailers: RetailersListValues[];
  isLoading: boolean;
  table: Table<RetailersListValues>;
  deletingId: number | null;
  onDelete: (id: number) => void;
}

export default function RetailersGrid({
  retailers,
  isLoading = false,
  table,
  deletingId,
  onDelete,
}: RetailersGridProps) {
  const navigate = useNavigate();

  if (retailers.length === 0) {
    return <EmptyRetailersGrid />;
  }

  return (
    <div
      className={cn(
        'animate-fade-in grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3',
        isLoading && 'opacity-50',
      )}
    >
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <Spinner className="text-muted-foreground size-6 animate-spin" />
        </div>
      )}
      {retailers?.map((retailer, index) => (
        <Card
          key={retailer.id}
          className="border-border transition-all duration-200 hover:shadow-lg"
          style={{
            animationDelay: `${index * 50}ms`,
          }}
        >
          <CardContent className="h-[220px] p-5">
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
              <div
                className="flex cursor-pointer items-center gap-3"
                onClick={() => navigate(`/retailers/edit/${retailer.id}`)}
              >
                <div className="from-primary/10 to-primary/5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-2xl">
                  {retailer.logo ? (
                    <img src={retailer.logo} alt={retailer.name} className="size-6" />
                  ) : (
                    <Store className="size-6" />
                  )}
                </div>
                <div>
                  <h3
                    className="text-foreground font-semibold"
                    dangerouslySetInnerHTML={{ __html: retailer.name.slice(0, 25) }}
                  ></h3>
                  <p className="text-muted-foreground text-sm">{retailer.email}</p>
                </div>
              </div>

              <Checkbox
                checked={
                  table
                    .getRowModel()
                    .rows.find((r) => r.original.id === retailer.id)
                    ?.getIsSelected() ?? false
                }
                onCheckedChange={(value) =>
                  table
                    .getRowModel()
                    .rows.find((r) => r.original.id === retailer.id)
                    ?.toggleSelected(!!value)
                }
                aria-label="Select row"
                className="translate-y-[2px]"
              />
            </div>

            {/* Type & Location */}
            <div className="mb-4 flex flex-col gap-2">
              <div>
                <Badge
                  variant="outline"
                  className="rounded-sm"
                  style={{
                    backgroundColor: `${retailer.type_info?.color}15`,
                    borderColor: `${retailer.type_info?.color}30`,
                    color: retailer.type_info?.color,
                  }}
                >
                  {retailer.type_info?.name ?? 'N/A'}
                </Badge>
              </div>
              <RetailersManagementToolTip
                trigger={
                  <span className="text-muted-foreground flex items-center gap-1 text-sm">
                    <MapPin className="size-3.5" />
                    {retailer.address ? (
                      <span>
                        {retailer.address.length > 35
                          ? `${retailer.address.slice(0, 35)}...`
                          : retailer.address}
                      </span>
                    ) : (
                      <span>{retailer.address}</span>
                    )}
                  </span>
                }
                content={retailer.address && retailer.address.length > 35 ? <span>{retailer.address}</span> : undefined}
              />
            </div>

            {/* Stats */}
            <div className="bg-muted/30 grid grid-cols-2 gap-4 rounded-lg">
              <div className="bg-muted-foreground/10 rounded-md px-3 py-2">
                <p className="text-muted-foreground text-xs tracking-wide uppercase">{__('Products', 'retailers-management-for-woocommerce')}</p>
                <p className="text-foreground text-lg font-semibold">0</p>
              </div>
              <div className="bg-primary/10 rounded-md px-3 py-2">
                <p className="text-muted-foreground text-xs tracking-wide uppercase">
                  {__('Total Clicks', 'retailers-management-for-woocommerce')}
                </p>
                <p className="text-foreground text-lg font-semibold">0</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2 border-t p-3">
            <div className="border-border/50 flex w-full items-center justify-between">
              <div className="flex items-center gap-2">

                <RetailersManagementToolTip
                  trigger={<Button
                    variant="outline"
                    size="sm"
                    className="hover:text-primary text-muted-foreground gap-1.5 shadow-sm transition-all hover:bg-transparent hover:shadow"
                    onClick={() => navigate(`/retailers/edit/${retailer.id}`)}
                  >
                    <Bolt className="h-3.5 w-3.5" />
                    {__('Edit', 'retailers-management-for-woocommerce')}
                  </Button>}
                  content={__('Edit retailer', 'retailers-management-for-woocommerce')}
                />
                <RetailersManagementToolTip
                  trigger={<Button
                    variant="outline"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive gap-1.5 shadow-sm transition-all hover:bg-transparent hover:shadow"
                    onClick={() => onDelete(retailer.id)}
                    disabled={deletingId === retailer.id}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>}
                  content={__('Delete retailer', 'retailers-management-for-woocommerce')}
                />

              </div>
              <RetailerStatusSwitch size="lg" id={retailer.id} status={retailer.status} />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

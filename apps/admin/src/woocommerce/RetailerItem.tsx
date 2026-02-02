import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { __ } from '@wordpress/i18n';
import {
  Award,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  GripVertical,
  Store,
  Trash2,
} from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { getRetailerById, getStockStatusInfo } from '@/lib/helpers/product-retailers.helper';
import { formatNumberWithCurrency } from '@/lib/helpers/settings.helper';
import {
  ProductRetailer,
  ProductRetailersFormData,
  stockStatusEnum,
} from '@/lib/schema/product-retailers';
import { RetailersListValues } from '@/lib/schema/retailers';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { SwitchField } from '@/components/ui/switch-field';
import { RetailersManagementToolTip } from '@/components/custom/RetailersManagementToolTip';

interface RetailerItemProps {
  index: number;
  activeRetailers: RetailersListValues[];
  retailer: ProductRetailer;
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
}

export function RetailerItem({
  index,
  activeRetailers,
  retailer,
  isExpanded,
  onToggle,
  onRemove,
}: RetailerItemProps) {
  const { control, setValue, watch } = useFormContext<ProductRetailersFormData>();
  const productRetailers = watch('productRetailers');
  const productRetailer = productRetailers[index];
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: retailer.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const selectedRetailerCPT = getRetailerById(retailer.retailerId ?? 0, activeRetailers);
  const effectiveUrl = retailer.productUrl || selectedRetailerCPT?.ecommerceUrl || '';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'border-border bg-card mb-4 rounded-md border',
        isDragging && 'opacity-50 shadow-lg',
      )}
    >
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <div className="bg-muted/30 flex items-center gap-2 px-3 py-2">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" />
          </button>

          <CollapsibleTrigger asChild>
            <button type="button" className="flex flex-1 items-center gap-3 text-left">
              <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium">
                {selectedRetailerCPT?.logo ? (
                  <img
                    src={selectedRetailerCPT.logo}
                    alt={selectedRetailerCPT.name}
                    className="size-5 object-contain"
                  />
                ) : (
                  <Store className="text-muted-foreground size-5" />
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {selectedRetailerCPT?.name || 'Select Retailer'}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    'rounded-sm text-xs',
                    getStockStatusInfo(retailer.stockStatus, true),
                  )}
                >
                  {getStockStatusInfo(retailer.stockStatus)}
                </Badge>

                {retailer.isBestPrice && (
                  <Badge className="gradient-primary text-primary-foreground gap-1 rounded-sm text-xs font-medium shadow-sm">
                    <Award className="h-3 w-3" />
                    {__('Best Price', 'retailers-management-for-woocommerce')}
                  </Badge>
                )}
              </div>

              <div className="text-muted-foreground ml-auto flex items-center gap-2 text-sm">
                {retailer.salePrice ? (
                  <>
                    <span className="line-through">
                      {formatNumberWithCurrency(Number(retailer.regularPrice ?? 0))}
                    </span>
                    <span className="text-destructive font-medium">
                      {formatNumberWithCurrency(Number(retailer.salePrice ?? 0))}
                    </span>
                  </>
                ) : (
                  <span>{formatNumberWithCurrency(Number(retailer.regularPrice ?? 0))}</span>
                )}
              </div>

              {isExpanded ? (
                <ChevronUp className="text-muted-foreground h-4 w-4" />
              ) : (
                <ChevronDown className="text-muted-foreground h-4 w-4" />
              )}
            </button>
          </CollapsibleTrigger>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <CollapsibleContent>
          <div className="border-border border-t p-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Retailer (100%) */}
              <div className="space-y-2">
                <FormField
                  control={control}
                  name={`productRetailers.${index}.retailerId`}
                  render={({ field: { ...field }, fieldState: { error, invalid } }) => (
                    <FormItem className="flex w-full flex-col gap-1">
                      <div className="block text-sm font-medium">
                        {__('Retailer', 'retailers-management-for-woocommerce')}
                      </div>
                      <FormControl>
                        <Select
                          value={field.value?.toString() || ''}
                          onValueChange={(value) => field.onChange(Number(value))}
                        >
                          <SelectTrigger
                            className={cn(
                              'w-full',
                              invalid && 'border-destructive ring-destructive',
                            )}
                          >
                            <SelectValue placeholder="Select a retailer" />
                          </SelectTrigger>
                          <SelectContent>
                            {activeRetailers.map((activeRetailer) => (
                              <SelectItem
                                key={activeRetailer.id}
                                value={activeRetailer.id.toString()}
                              >
                                <div className="flex items-center gap-2">
                                  {activeRetailer.logo ? (
                                    <img
                                      src={activeRetailer.logo}
                                      alt={activeRetailer.name}
                                      className="size-4 object-contain"
                                    />
                                  ) : (
                                    <Store className="text-muted-foreground size-4" />
                                  )}
                                  {activeRetailer.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {error && (
                        <FormMessage className="text-destructive m-0 p-0 text-xs">
                          {error.message}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={control}
                  name={`productRetailers.${index}.isBestPrice`}
                  render={({ field: { ...field }, fieldState: { error, invalid } }) => (
                    <FormItem className="flex w-full flex-col gap-1">
                      <FormControl>
                        <SwitchField
                          className={cn('pb-0 pl-0! hover:bg-transparent')}
                          isCustomLabel={true}
                          customLabel={
                            <h3 className="text-foreground m-0 p-0 text-sm font-medium transition-colors">
                              {__('Best Price Badge', 'retailers-management-for-woocommerce')}
                            </h3>
                          }
                          checked={!!field.value}
                          onCheckedChange={field.onChange}
                          label={__('Best Price Badge', 'retailers-management-for-woocommerce')}
                          description={
                            <p className="text-muted-foreground m-0 p-0 text-sm">
                              {__(
                                'Highlight this as the best deal',
                                'retailers-management-for-woocommerce',
                              )}
                            </p>
                          }
                          tooltip={__(
                            'Enable to show the best price badge',
                            'retailers-management-for-woocommerce',
                          )}
                          icon={
                            <div
                              className={cn(
                                'text-muted-foreground my-2 flex items-center rounded-sm p-2',
                                retailer.isBestPrice
                                  ? 'bg-primary text-primary-foreground shadow-sm'
                                  : 'bg-secondary/10 text-muted-foreground group-hover/toggle:bg-secondary/20',
                              )}
                            >
                              <Award className="size-5" />
                            </div>
                          }
                        />
                      </FormControl>
                      {error && (
                        <FormMessage className="text-destructive m-0 p-0 text-xs">
                          {error.message}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              {/* Regular Price (50%) */}
              <div className="space-y-2">
                <FormField
                  control={control}
                  name={`productRetailers.${index}.regularPrice`}
                  render={({ field: { ...field }, fieldState: { error, invalid } }) => (
                    <FormItem className="flex w-full flex-col gap-1">
                      <div className="block text-sm font-medium">
                        {__('Regular Price ($)', 'retailers-management-for-woocommerce')}
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          aria-invalid={invalid}
                          className={cn(
                            'w-full!',
                            invalid && 'border-destructive focus-visible:ring-0',
                          )}
                          value={field.value ?? ''}
                        />
                      </FormControl>

                      {error && (
                        <FormMessage className="text-destructive m-0 p-0 text-xs">
                          {error.message}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              {/* Sale Price (50%) */}
              <div className="space-y-2">
                <FormField
                  control={control}
                  name={`productRetailers.${index}.salePrice`}
                  render={({ field: { ...field }, fieldState: { error, invalid } }) => (
                    <FormItem className="flex w-full flex-col gap-1">
                      <div className="block text-sm font-medium">
                        {__('Sale Price ($)', 'retailers-management-for-woocommerce')}
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          aria-invalid={invalid}
                          className={cn(
                            'w-full!',
                            invalid && 'border-destructive focus-visible:ring-0',
                          )}
                          value={field.value ?? ''}
                        />
                      </FormControl>

                      {error && (
                        <FormMessage className="text-destructive m-0 p-0 text-xs">
                          {error.message}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              {/* Stock Status (50%) */}
              <div className="space-y-2">
                <FormField
                  control={control}
                  name={`productRetailers.${index}.stockStatus`}
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col gap-1">
                      <div className="block text-sm font-medium">
                        {__('Stock Status', 'retailers-management-for-woocommerce')}
                      </div>
                      <FormControl>
                        <Select
                          value={field.value?.toString() || ''}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger className={cn('w-full')}>
                            <SelectValue placeholder="Select a stock status" />
                          </SelectTrigger>
                          <SelectContent>
                            {stockStatusEnum.options.map((status) => (
                              <SelectItem key={status} value={status}>
                                {getStockStatusInfo(status)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Product URL (50%) */}
              <div className="space-y-2">
                <FormField
                  control={control}
                  name={`productRetailers.${index}.productUrl`}
                  render={({ field: { ...field }, fieldState: { error, invalid } }) => (
                    <FormItem className="flex w-full flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <div className="block text-sm font-medium">
                          {__('Product URL', 'retailers-management-for-woocommerce')}
                        </div>
                        <RetailersManagementToolTip
                          content={
                            <span>
                              {__(
                                'Leave this field blank if you want to use the default product URL for this retailer.',
                                'retailers-management-for-woocommerce',
                              )}
                            </span>
                          }
                        />
                      </div>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            {...field}
                            aria-invalid={invalid}
                            className={cn(
                              'w-full!',
                              invalid && 'border-destructive focus-visible:ring-0',
                            )}
                            value={field.value || ''}
                            placeholder={
                              selectedRetailerCPT?.ecommerceUrl ||
                              'Enter the product URL for this retailer'
                            }
                          />
                          {effectiveUrl && (
                            <Button
                              type="button"
                              className="hover-text-primary"
                              variant="primary-outline"
                              size="icon"
                              onClick={() => window.open(effectiveUrl, '_blank')}
                            >
                              <ExternalLink className="size-4" />
                            </Button>
                          )}
                        </div>
                      </FormControl>

                      {error && (
                        <FormMessage className="text-destructive m-0 p-0 text-xs">
                          {error.message}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

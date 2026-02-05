import { __ } from '@wordpress/i18n';
import { CheckCircle2, ExternalLink, MapPin, Sparkles, Store } from 'lucide-react';

import { getRetailerById, getStockStatusInfo } from '@/lib/helpers/product-retailers.helper';
import { formatNumberWithCurrency } from '@/lib/helpers/settings.helper';
import { ProductRetailer } from '@/lib/schema/product-retailers';
import { RetailersListValues } from '@/lib/schema/retailers';
import { cn } from '@/lib/utils';

interface ProductRetailersFrontendProps {
  productId: number;
}

export function ProductRetailersFrontend({ productId }: ProductRetailersFrontendProps) {
  const { settings, active_retailers, product_retailers } = window.retailersManagement;
  const productRetailers: ProductRetailer[] = product_retailers || [];
  const activeRetailers: RetailersListValues[] = active_retailers || [];
  const sectionTitle =
    settings?.display.sectionTitle || __('Where to Buy', 'retailers-management-for-woocommerce');
  const visibility = settings?.display.visibility;
  const primaryColor = '#9333ea';
  const accentColor = '#22c55e';
  const buttonStyle = 'solid' as 'solid' | 'outline' | 'ghost' | 'gradient';
  const general = settings?.general;

  // Filter out retailers without retailerId
  const validRetailers = productRetailers.filter(
    (retailer) => retailer.retailerId && retailer.retailerId > 0,
  );

  if (validRetailers.length === 0) {
    return null;
  }

  const getButtonStyle = () => {
    switch (buttonStyle) {
      case 'solid':
        return { backgroundColor: primaryColor, color: '#fff' };
      case 'outline':
        return {
          border: `2px solid ${primaryColor}`,
          color: primaryColor,
          backgroundColor: 'transparent',
        };
      case 'ghost':
        return { backgroundColor: `${primaryColor}15`, color: primaryColor };
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
          color: '#fff',
        };
      default:
        return { backgroundColor: primaryColor, color: '#fff' };
    }
  };

  // Retailer Card Component (matching RetailerPreview)
  const RetailerCard = ({
    retailer,
    index,
    compact = false,
  }: {
    retailer: ProductRetailer;
    index: number;
    compact?: boolean;
  }) => {
    const retailerData = getRetailerById(retailer.retailerId || 0, activeRetailers);
    if (!retailerData) return null;

    const effectiveUrl = retailer.productUrl || retailerData.ecommerceUrl || '';
    const regularPrice = parseFloat(retailer.regularPrice || '0');
    const salePrice =
      retailer.salePrice && parseFloat(retailer.salePrice) > 0
        ? parseFloat(retailer.salePrice)
        : null;
    const displayPrice = salePrice || regularPrice;
    const originalPrice = salePrice ? regularPrice : null;
    const stockInfo = getStockStatusInfo(retailer.stockStatus);
    const isInStock = retailer.stockStatus === 'in-stock';

    return (
      <div
        className={cn(
          'bg-card relative flex items-center gap-4 rounded-xl border transition-all hover:shadow-md',
          compact ? 'p-3' : 'p-4',
          retailer.isBestPrice ? 'border-primary ring-primary/20 ring-1' : 'border-border',
        )}
      >
        {retailer.isBestPrice && (
          <div
            className={cn(
              'text-primary-foreground absolute right-4 flex items-center gap-1 rounded-full font-semibold',
              compact ? '-top-2 px-2 py-0.5 text-[10px]' : '-top-2.5 px-2.5 py-0.5 text-xs',
            )}
            style={{ backgroundColor: accentColor }}
          >
            <Sparkles className="h-3 w-3" />
            {__('Best Price', 'retailers-management-for-woocommerce')}
          </div>
        )}

        {/* Logo */}
        {visibility?.logo && (
          <div
            className={cn(
              'text-muted-foreground flex shrink-0 items-center justify-center rounded-lg bg-transparent',
              compact ? 'size-12' : 'size-14',
            )}
          >
            {retailerData.logo ? (
              <img
                src={retailerData.logo}
                alt={retailerData.name}
                className={cn('rounded-lg object-contain', compact ? 'size-12' : 'size-14')}
              />
            ) : (
              <Store className={compact ? 'size-12' : 'size-14'} />
            )}
          </div>
        )}

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {visibility?.name && (
              <span className={cn('text-foreground font-semibold', compact ? 'text-sm' : '')}>
                {retailerData.name}
              </span>
            )}
            {visibility?.type && retailerData.type && (
              <span
                className={cn(
                  'border-border bg-muted/50 text-muted-foreground rounded-sm border',
                  compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs',
                )}
              >
                {retailerData.type_info?.name}
              </span>
            )}
          </div>
          {visibility?.address && retailerData.address && (
            <div className="text-muted-foreground mt-1 flex items-center gap-1">
              <MapPin className={compact ? 'size-3' : 'size-3.5'} />
              <span className={cn('text-sm', compact ? 'text-xs' : '')}>
                {retailerData.address
                  ? retailerData.address.length > 35
                    ? `${retailerData.address.slice(0, 35)}...`
                    : retailerData.address
                  : 'N/A'}
              </span>
            </div>
          )}
          {visibility?.stock && (
            <div
              className={cn('mt-1 flex items-center gap-1', compact ? 'text-xs' : 'text-sm')}
              style={{ color: isInStock ? accentColor : '#9ca3af' }}
            >
              <CheckCircle2 className={compact ? 'size-3' : 'size-3.5'} />
              {stockInfo}
            </div>
          )}
        </div>

        {/* Price & CTA */}
        <div className="shrink-0 text-right">
          {visibility?.price && (
            <div className={cn('text-foreground font-bold', compact ? 'text-sm' : '')}>
              {formatNumberWithCurrency(displayPrice)}
            </div>
          )}
          {visibility?.originalPrice && originalPrice && (
            <div
              className={cn('text-muted-foreground line-through', compact ? 'text-xs' : 'text-sm')}
            >
              {formatNumberWithCurrency(originalPrice)}
            </div>
          )}
          {visibility?.button && effectiveUrl && (
            <a
              href={effectiveUrl}
              target={general?.openNewTab ? '_blank' : '_self'}
              rel={general?.openNewTab ? 'noopener noreferrer' : undefined}
              className={cn(
                'mt-2 inline-flex items-center gap-1.5 rounded-lg font-medium transition-transform hover:scale-105',
                compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm',
              )}
              style={getButtonStyle()}
            >
              {__('Shop Now', 'retailers-management-for-woocommerce')}
              {general?.openNewTab && <ExternalLink className={compact ? 'size-3' : 'size-3.5'} />}
            </a>
          )}
        </div>
      </div>
    );
  };

  // Common header component
  const SectionHeader = () => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-full p-2" style={{ backgroundColor: `${primaryColor}15` }}>
          <MapPin className="h-5 w-5" style={{ color: primaryColor }} />
        </div>
        <div>
          <h3 className="text-foreground text-base font-semibold">{sectionTitle}</h3>
          <p className="text-muted-foreground text-sm">
            {validRetailers.length}{' '}
            {validRetailers.length === 1
              ? __('authorized retailer', 'retailers-management-for-woocommerce')
              : __('authorized retailers', 'retailers-management-for-woocommerce')}
          </p>
        </div>
      </div>
    </div>
  );

  // List mode (only supported display)
  return (
    <div className="rmfw-retailers-ui rmfw-product-retailers-frontend mt-6">
      <div className="space-y-4">
        <SectionHeader />
        <div className="space-y-3">
          {validRetailers.map((retailer, index) => (
            <RetailerCard key={retailer.id} retailer={retailer} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}


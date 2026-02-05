import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { CheckCircle2, ExternalLink, MapPin, Sparkles, Store, X } from 'lucide-react';

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
  const displayMode = settings?.display.layoutStyle || 'list';
  const sectionTitle =
    settings?.display.sectionTitle || __('Where to Buy', 'retailers-management-for-woocommerce');
  const visibility = settings?.display.visibility;
  const primaryColor = '#9333ea';
  const accentColor = '#22c55e';
  const buttonStyle = 'solid' as 'solid' | 'outline' | 'ghost' | 'gradient';
  const general = settings?.general;
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Modal component
  const ModalContent = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => setIsModalOpen(false)}
    >
      <div
        className="bg-background relative max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsModalOpen(false)}
          className="text-muted-foreground hover:text-foreground absolute top-4 right-4 z-10 rounded-full p-2 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="p-6">
          <SectionHeader />
          <div className="mt-6 space-y-3">
            {validRetailers.map((retailer, index) => (
              <RetailerCard key={retailer.id} retailer={retailer} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Render based on display mode
  if (displayMode === 'modal') {
    return (
      <div className="rmfw-retailers-ui rmfw-product-retailers-frontend mt-6">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors"
          style={{ backgroundColor: primaryColor, color: '#fff' }}
        >
          <MapPin className="h-4 w-4" />
          {sectionTitle}
        </button>
        {isModalOpen && <ModalContent />}
      </div>
    );
  }

  // Grid Card Component (matching admin preview)
  const GridCard = ({ retailer, index }: { retailer: ProductRetailer; index: number }) => {
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
          'group relative flex flex-col rounded-xl border-2 p-4 md:p-5 transition-all duration-300',
          retailer.isBestPrice
            ? 'border-primary from-primary/10 via-primary/5 shadow-primary/10 bg-gradient-to-br to-transparent shadow-lg'
            : 'border-border bg-card hover:border-primary/30 hover:shadow-lg',
        )}
      >
        {/* Best Price Badge */}
        {retailer.isBestPrice && (
          <div className="absolute -top-3 -right-2 z-10">
            <div
              className="text-primary-foreground flex items-center gap-1 rounded-full px-2.5 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs font-bold shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                boxShadow: `0 4px 14px ${accentColor}40`,
              }}
            >
              <Sparkles className="h-2.5 w-2.5 md:h-3 md:w-3" />
              {__('Best Price', 'retailers-management-for-woocommerce')}
            </div>
          </div>
        )}

        {/* Top section: Logo + Name */}
        <div className="mb-3 md:mb-4 flex items-start gap-3 md:gap-4">
          {visibility?.logo && (
            <div
              className="flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-xl text-base md:text-lg font-bold shadow-sm transition-transform group-hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}05)`,
                color: primaryColor,
              }}
            >
              {retailerData.logo ? (
                <img
                  src={retailerData.logo}
                  alt={retailerData.name}
                  className="h-12 w-12 md:h-14 md:w-14 rounded-xl object-contain"
                />
              ) : (
                <Store className="h-6 w-6 md:h-8 md:w-8" style={{ color: primaryColor }} />
              )}
            </div>
          )}
          <div className="min-w-0 flex-1">
            {visibility?.name && (
              <h4 className="text-foreground text-base md:text-lg leading-tight font-semibold">
                {retailerData.name}
              </h4>
            )}
            {visibility?.type && retailerData.type && (
              <span
                className="mt-1 inline-flex rounded-full px-2 py-0.5 md:px-2.5 text-[10px] md:text-[11px] font-medium"
                style={{
                  backgroundColor: `${primaryColor}15`,
                  color: primaryColor,
                }}
              >
                {retailerData.type_info?.name}
              </span>
            )}
          </div>
        </div>

        {/* Address */}
        {visibility?.address && retailerData.address && (
          <div className="text-muted-foreground mb-2 flex items-center gap-1.5 text-xs md:text-sm">
            <MapPin className="h-3 w-3 md:h-3.5 md:w-3.5 shrink-0" />
            <span className="truncate">
              {retailerData.address.length > 50
                ? `${retailerData.address.slice(0, 50)}...`
                : retailerData.address}
            </span>
          </div>
        )}

        {/* Stock status */}
        {visibility?.stock && (
          <div
            className="mb-3 md:mb-4 flex items-center gap-2 rounded-lg px-2.5 py-1.5 md:px-3 md:py-2 text-[10px] md:text-xs font-medium"
            style={{
              backgroundColor: isInStock ? `${accentColor}15` : '#9ca3af15',
              color: isInStock ? accentColor : '#9ca3af',
            }}
          >
            <CheckCircle2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
            {stockInfo}
          </div>
        )}

        {/* Price */}
        <div className="mb-2 flex items-center gap-2">
          {visibility?.price && (
            <div className="text-foreground text-xl md:text-2xl font-bold">
              {formatNumberWithCurrency(displayPrice)}
            </div>
          )}
          {visibility?.originalPrice && originalPrice && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs md:text-sm line-through">
                {formatNumberWithCurrency(originalPrice)}
              </span>
            </div>
          )}
        </div>

        {/* Bottom section: Button */}
        <div className="border-border/50 mt-auto flex items-end justify-between border-t pt-3 md:pt-4">
          {visibility?.button && effectiveUrl && (
            <a
              href={effectiveUrl}
              target={general?.openNewTab ? '_blank' : '_self'}
              rel={general?.openNewTab ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center gap-1.5 md:gap-2 rounded-xl px-4 py-2 md:px-5 md:py-2.5 text-xs md:text-sm font-semibold shadow-lg transition-shadow hover:shadow-xl"
              style={{
                ...getButtonStyle(),
                boxShadow: `0 4px 14px ${primaryColor}30`,
              }}
            >
              {__('Shop Now', 'retailers-management-for-woocommerce')}
              {general?.openNewTab && <ExternalLink className="h-3.5 w-3.5 md:h-4 md:w-4" />}
            </a>
          )}
        </div>
      </div>
    );
  };

  if (displayMode === 'grid') {
    return (
      <div className="rmfw-retailers-ui rmfw-product-retailers-frontend mt-6">
        <div className="space-y-3 md:space-y-5">
          {/* Header */}
          <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div
                className="rounded-xl p-2 md:p-2.5 shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}10)`,
                }}
              >
                <MapPin className="h-4 w-4 md:h-5 md:w-5" style={{ color: primaryColor }} />
              </div>
              <div>
                <h3 className="text-foreground text-sm font-semibold md:text-base">{sectionTitle}</h3>
                <p className="text-muted-foreground text-xs md:text-sm">
                  {validRetailers.length}{' '}
                  {validRetailers.length === 1
                    ? __('authorized retailer', 'retailers-management-for-woocommerce')
                    : __('authorized retailers', 'retailers-management-for-woocommerce')}
                </p>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-2 md:gap-4 md:grid-cols-2 lg:grid-cols-2">
            {validRetailers.map((retailer, index) => (
              <GridCard key={retailer.id} retailer={retailer} index={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (displayMode === 'map-card') {
    // Map-card mode - simplified version (full map integration would require additional libraries)
    return (
      <div className="rmfw-retailers-ui rmfw-product-retailers-frontend mt-6">
        <div className="space-y-4">
          <SectionHeader />
          <div className="border-border bg-muted/20 relative h-64 rounded-lg border">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="text-muted-foreground mx-auto mb-2 h-12 w-12" />
                <p className="text-muted-foreground text-sm">
                  {__('Store Locator Map', 'retailers-management-for-woocommerce')}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {__(
                    'Interactive map feature coming soon',
                    'retailers-management-for-woocommerce',
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {validRetailers.map((retailer, index) => (
              <RetailerCard key={retailer.id} retailer={retailer} index={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default: list mode
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


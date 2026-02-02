import { __ } from '@wordpress/i18n';
import { motion } from 'framer-motion';
import { ArrowUpDown, CheckCircle2, ExternalLink, Filter, MapPin, Sparkles, X } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { DEFAULT_VISIBILITY, formatNumberWithCurrency } from '@/lib/helpers/settings.helper';
import { SettingsFormData } from '@/lib/schema/settings';
import { cn } from '@/lib/utils';

interface RetailerItem {
  name: string;
  type: string;
  location: string;
  inStock: boolean;
  price: string;
  originalPrice?: string;
  isBestPrice?: boolean;
}

const retailers: RetailerItem[] = [
  {
    name: 'Amazon',
    type: 'Marketplace',
    location: 'Ships Worldwide',
    inStock: true,
    price: formatNumberWithCurrency(279.0),
    originalPrice: formatNumberWithCurrency(299.0),
    isBestPrice: true,
  },
  {
    name: 'Best Buy',
    type: 'Retailer',
    location: 'USA & Canada',
    inStock: true,
    price: formatNumberWithCurrency(289.99),
  },
  {
    name: 'Walmart',
    type: 'Retailer',
    location: 'USA Only',
    inStock: true,
    price: formatNumberWithCurrency(284.0),
  },
];

interface VisibilitySettings {
  logo: boolean;
  name: boolean;
  type: boolean;
  address: boolean;
  stock: boolean;
  price: boolean;
  originalPrice: boolean;
  button: boolean;
}

interface RetailerPreviewProps {
  buttonStyle?: 'solid' | 'outline' | 'ghost' | 'gradient';
  primaryColor?: string;
  accentColor?: string;
  visibility?: VisibilitySettings;
  isMobile?: boolean;
}

export const RetailerPreview = ({
  buttonStyle = 'solid',
  primaryColor = '#9333ea',
  accentColor = '#22c55e',
  isMobile = false,
}: RetailerPreviewProps) => {
  const { control, watch, setValue } = useFormContext<SettingsFormData>();
  const displaySetting = watch('display') || {};
  const displayMode = displaySetting.layoutStyle || 'list';
  const visibility = displaySetting.visibility || DEFAULT_VISIBILITY;
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

  const sectionTitle =
    displaySetting.sectionTitle || __('Where to Buy', 'retailers-management-for-woocommerce');
  const sectionDescription =
    retailers.length === 1
      ? __('authorized retailer', 'retailers-management-for-woocommerce')
      : __('authorized retailers', 'retailers-management-for-woocommerce');

  // Reusable retailer card component with all visibility options
  const RetailerCard = ({
    retailer,
    index,
    compact = false,
  }: {
    retailer: RetailerItem;
    index: number;
    compact?: boolean;
  }) => (
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

      {/* Logo placeholder */}
      {visibility.logo && (
        <div
          className={cn(
            'bg-muted flex shrink-0 items-center justify-center rounded-lg',
            compact ? 'h-12 w-12' : 'h-14 w-14',
          )}
        >
          <span
            className={cn('text-muted-foreground font-medium', compact ? 'text-xs' : 'text-sm')}
          >
            {retailer.name[0]}
          </span>
        </div>
      )}

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {visibility.name && (
            <span className={cn('text-foreground font-semibold', compact ? 'text-sm' : '')}>
              {retailer.name}
            </span>
          )}
          {visibility.type && (
            <span
              className={cn(
                'border-border bg-muted/50 text-muted-foreground rounded-sm border',
                compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs',
              )}
            >
              {retailer.type}
            </span>
          )}
        </div>
        {visibility.address && (
          <div
            className={cn(
              'text-muted-foreground mt-1 flex items-center gap-1',
              compact ? 'text-xs' : 'text-sm',
            )}
          >
            <MapPin className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
            {retailer.location}
          </div>
        )}
        {visibility.stock && (
          <div
            className={cn('mt-1 flex items-center gap-1', compact ? 'text-xs' : 'text-sm')}
            style={{ color: retailer.inStock ? accentColor : '#9ca3af' }}
          >
            <CheckCircle2 className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
            {retailer.inStock
              ? __('In Stock', 'retailers-management-for-woocommerce')
              : __('Check availability', 'retailers-management-for-woocommerce')}
          </div>
        )}
      </div>

      {/* Price & CTA */}
      <div className="shrink-0 text-right">
        {visibility.price && (
          <div className={cn('text-foreground font-bold', compact ? 'text-sm' : '')}>
            {retailer.price}
          </div>
        )}
        {visibility.originalPrice && retailer.originalPrice && (
          <div
            className={cn('text-muted-foreground line-through', compact ? 'text-xs' : 'text-sm')}
          >
            {retailer.originalPrice}
          </div>
        )}
        {visibility.button && (
          <button
            className={cn(
              'mt-2 inline-flex items-center gap-1.5 rounded-lg font-medium transition-transform hover:scale-105',
              compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm',
            )}
            style={getButtonStyle()}
          >
            {__('Shop Now', 'retailers-management-for-woocommerce')}
            <ExternalLink className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
          </button>
        )}
      </div>
    </div>
  );

  if (displayMode === 'list') {
    return (
      <div className={cn('space-y-4', isMobile && 'space-y-3')}>
        {/* Header */}
        <div className={cn('flex items-center justify-between', isMobile && 'flex-col items-start gap-2')}>
          <div className="flex items-center gap-3">
            <div className={cn('rounded-full p-2', isMobile && 'p-1.5')} style={{ backgroundColor: `${primaryColor}15` }}>
              <MapPin className={cn('h-5 w-5', isMobile && 'h-4 w-4')} style={{ color: primaryColor }} />
            </div>
            <div>
              <h3 className={cn('text-foreground font-semibold', isMobile && 'text-sm')}>{sectionTitle}</h3>
              <p className={cn('text-muted-foreground text-sm', isMobile && 'text-xs')}>{sectionDescription}</p>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className={cn('space-y-3', isMobile && 'space-y-2')}>
          {retailers.map((retailer, index) => (
            <RetailerCard key={retailer.name} retailer={retailer} index={index} compact={isMobile} />
          ))}
        </div>
      </div>
    );
  }

  if (displayMode === 'modal') {
    return (
      <div className="relative">
        {/* Dimmed background simulation */}
        <div className="bg-foreground/5 absolute inset-0 rounded-lg" />

        {/* Modal */}
        <div className="border-border bg-card relative mx-auto max-w-md rounded-xl border p-6 shadow-2xl">
          <button className="hover:bg-muted absolute top-4 right-4 rounded-full p-1">
            <X className="text-muted-foreground h-5 w-5" />
          </button>

          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-full p-2" style={{ backgroundColor: `${primaryColor}15` }}>
              <MapPin className="h-5 w-5" style={{ color: primaryColor }} />
            </div>
            <div>
              <h3 className="text-foreground font-semibold">{sectionTitle}</h3>
              <p className="text-muted-foreground text-sm">{sectionDescription}</p>
            </div>
          </div>

          <div className="max-h-80 space-y-3 overflow-y-auto">
            {retailers.map((retailer, index) => (
              <RetailerCard key={retailer.name} retailer={retailer} index={index} compact />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (displayMode === 'map-card') {
    return (
      <div className="border-border overflow-hidden rounded-xl border">
        {/* Map simulation */}
        <div className="from-muted to-muted/50 relative h-32 bg-gradient-to-br">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div
                className="mx-auto mb-1 flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: `${primaryColor}20` }}
              >
                <MapPin className="h-5 w-5" style={{ color: primaryColor }} />
              </div>
              <span className="text-muted-foreground text-xs">
                {__('Interactive Map', 'retailers-management-for-woocommerce')}
              </span>
            </div>
          </div>
          {/* Map pins */}
          <div className="absolute top-6 left-10">
            <div
              className="h-5 w-5 rounded-full shadow-lg"
              style={{ backgroundColor: primaryColor }}
            />
          </div>
          <div className="absolute top-12 right-16">
            <div
              className="h-5 w-5 rounded-full shadow-lg"
              style={{ backgroundColor: accentColor }}
            />
          </div>
          <div className="absolute bottom-8 left-1/3">
            <div
              className="h-5 w-5 rounded-full shadow-lg"
              style={{ backgroundColor: primaryColor }}
            />
          </div>
        </div>

        {/* Retailer list below map */}
        <div className="divide-border bg-card max-h-64 divide-y overflow-y-auto">
          {retailers.map((retailer, index) => (
            <div
              key={retailer.name}
              className={cn(
                'relative flex items-center gap-3 p-3',
                retailer.isBestPrice && 'bg-primary/5',
              )}
            >
              {retailer.isBestPrice && (
                <div
                  className="text-primary-foreground absolute top-1 right-2 flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-semibold"
                  style={{ backgroundColor: accentColor }}
                >
                  <Sparkles className="h-3 w-3" />
                  {__('Best Price', 'retailers-management-for-woocommerce')}
                </div>
              )}

              {visibility.logo && (
                <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg text-xs font-medium">
                  {retailer.name[0]}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  {visibility.name && (
                    <span className="text-foreground text-sm font-semibold">{retailer.name}</span>
                  )}
                  {visibility.type && (
                    <span className="border-border bg-muted/50 text-muted-foreground rounded border px-1 py-0.5 text-[9px]">
                      {retailer.type}
                    </span>
                  )}
                </div>
                {visibility.address && (
                  <div className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
                    <MapPin className="h-3 w-3" />
                    {retailer.location}
                  </div>
                )}
                {visibility.stock && (
                  <div
                    className="mt-0.5 flex items-center gap-1 text-xs"
                    style={{ color: retailer.inStock ? accentColor : '#9ca3af' }}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    {retailer.inStock
                      ? __('In Stock', 'retailers-management-for-woocommerce')
                      : __('Check availability', 'retailers-management-for-woocommerce')}
                  </div>
                )}
              </div>

              <div className="shrink-0 text-right">
                {visibility.price && (
                  <div className="text-foreground text-sm font-bold">{retailer.price}</div>
                )}
                {visibility.originalPrice && retailer.originalPrice && (
                  <div className="text-muted-foreground text-[10px] line-through">
                    {retailer.originalPrice}
                  </div>
                )}
              </div>

              {visibility.button && (
                <button
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-transform hover:scale-105"
                  style={getButtonStyle()}
                >
                  {__('Directions', 'retailers-management-for-woocommerce')}
                  <ExternalLink className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (displayMode === 'grid') {
    return (
      <div className={cn('space-y-5', isMobile && 'space-y-3')}>
        {/* Header */}
        <div className={cn('flex items-center justify-between', isMobile && 'flex-col items-start gap-2')}>
          <div className="flex items-center gap-3">
            <div
              className={cn('rounded-xl p-2.5 shadow-sm', isMobile && 'p-2')}
              style={{
                background: `linear-gradient(135deg, ${primaryColor}20, ${primaryColor}10)`,
              }}
            >
              <MapPin className={cn('h-5 w-5', isMobile && 'h-4 w-4')} style={{ color: primaryColor }} />
            </div>
            <div>
              <h3 className={cn('text-foreground font-semibold', isMobile && 'text-sm')}>{sectionTitle}</h3>
              <p className={cn('text-muted-foreground text-sm', isMobile && 'text-xs')}>{sectionDescription}</p>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className={cn('grid gap-4', isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3')}>
          {retailers.map((retailer, index) => (
            <div
              key={retailer.name}
              className={cn(
                'group relative flex flex-col rounded-xl border-2 p-5 transition-all duration-300',
                retailer.isBestPrice
                  ? 'border-primary from-primary/10 via-primary/5 shadow-primary/10 bg-gradient-to-br to-transparent shadow-lg'
                  : 'border-border bg-card hover:border-primary/30 hover:shadow-lg',
              )}
            >
              {/* Best Price Badge */}
              {retailer.isBestPrice && (
                <div className="absolute -top-3 -right-2 z-10">
                  <div
                    className="text-primary-foreground flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                      boxShadow: `0 4px 14px ${accentColor}40`,
                    }}
                  >
                    <Sparkles className="h-3 w-3" />
                    {__('Best Price', 'retailers-management-for-woocommerce')}
                  </div>
                </div>
              )}

              {/* Top section: Logo + Name */}
              <div className="mb-4 flex items-start gap-4">
                {visibility.logo && (
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold shadow-sm transition-transform group-hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}05)`,
                      color: primaryColor,
                    }}
                  >
                    {retailer.name[0]}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  {visibility.name && (
                    <h4 className="text-foreground text-lg leading-tight font-semibold">
                      {retailer.name}
                    </h4>
                  )}
                  {visibility.type && (
                    <span
                      className="mt-1 inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                      style={{
                        backgroundColor: `${primaryColor}15`,
                        color: primaryColor,
                      }}
                    >
                      {retailer.type}
                    </span>
                  )}
                </div>
              </div>
              {visibility.address && (
                <div className="text-muted-foreground mb-2 flex items-center gap-1.5 text-sm">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{retailer.location}</span>
                </div>
              )}
              {/* Stock status */}
              {visibility.stock && (
                <div
                  className="mb-4 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium"
                  style={{
                    backgroundColor: retailer.inStock ? `${accentColor}15` : '#9ca3af15',
                    color: retailer.inStock ? accentColor : '#9ca3af',
                  }}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {retailer.inStock
                    ? __('In Stock', 'retailers-management-for-woocommerce')
                    : __('Check availability', 'retailers-management-for-woocommerce')}
                </div>
              )}
              <div className="mb-2 flex items-center gap-2">
                {visibility.price && (
                  <div className="text-foreground text-2xl font-bold">{retailer.price}</div>
                )}
                {visibility.originalPrice && retailer.originalPrice && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm line-through">
                      {retailer.originalPrice}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom section: Price + Button */}
              <div className="border-border/50 mt-auto flex items-end justify-between border-t pt-4">
                {visibility.button && (
                  <button
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-lg transition-shadow hover:shadow-xl"
                    style={{
                      ...getButtonStyle(),
                      boxShadow: `0 4px 14px ${primaryColor}30`,
                    }}
                  >
                    {__('Shop Now', 'retailers-management-for-woocommerce')}
                    <ExternalLink className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

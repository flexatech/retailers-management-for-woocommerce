import { __ } from '@wordpress/i18n';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  DollarSign,
  ExternalLink,
  Eye,
  EyeOff,
  Image,
  Layout,
  MapPin,
  Store,
  Tag,
} from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { DEFAULT_VISIBILITY } from '@/lib/helpers/settings.helper';
import { SettingsFormData } from '@/lib/schema/settings';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

import ButtonToggleSection from './ButtonToggleSection';

const visibilityOptions = [
  {
    id: 'logo',
    label: __('Retailer Logo', 'retailers-management-for-woocommerce'),
    icon: Image,
    description: __('Show retailer logo/avatar', 'retailers-management-for-woocommerce'),
  },
  {
    id: 'name',
    label: __('Retailer Name', 'retailers-management-for-woocommerce'),
    icon: Store,
    description: __('Show retailer name', 'retailers-management-for-woocommerce'),
  },
  {
    id: 'type',
    label: __('Retailer Type', 'retailers-management-for-woocommerce'),
    icon: Tag,
    description: __(
      'Show type badge (Marketplace, Retailer)',
      'retailers-management-for-woocommerce',
    ),
  },
  {
    id: 'address',
    label: __('Address/Location', 'retailers-management-for-woocommerce'),
    icon: MapPin,
    description: __('Show shipping location', 'retailers-management-for-woocommerce'),
  },
  {
    id: 'stock',
    label: __('Stock Status', 'retailers-management-for-woocommerce'),
    icon: Eye,
    description: __('Show in-stock indicator', 'retailers-management-for-woocommerce'),
  },
  {
    id: 'price',
    label: __('Price', 'retailers-management-for-woocommerce'),
    icon: DollarSign,
    description: __('Show product price', 'retailers-management-for-woocommerce'),
  },
  {
    id: 'originalPrice',
    label: __('Original Price', 'retailers-management-for-woocommerce'),
    icon: DollarSign,
    description: __('Show strikethrough price', 'retailers-management-for-woocommerce'),
  },
  {
    id: 'button',
    label: __('Action Button', 'retailers-management-for-woocommerce'),
    icon: ExternalLink,
    description: __('Show Shop Now button', 'retailers-management-for-woocommerce'),
  },
];

interface ElementVisibilityProps {
  expanded: boolean;
  toggleSection: () => void;
}

export default function ElementVisibility({ expanded, toggleSection }: ElementVisibilityProps) {
  const { control, watch, setValue } = useFormContext<SettingsFormData>();
  const visibility = watch('display.visibility') || DEFAULT_VISIBILITY;
  return (
    <div>
      <ButtonToggleSection
        expanded={expanded}
        toggleSection={toggleSection}
        title={__('Element Visibility', 'retailers-management-for-woocommerce')}
        description={__(
          'Toggle which elements to show for each retailer',
          'retailers-management-for-woocommerce',
        )}
        icon={<EyeOff className="size-4" />}
      />
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="my-6 grid gap-3 px-6 sm:grid-cols-2 xl:grid-cols-3">
              {visibilityOptions.map((option) => {
                const Icon = option.icon;
                const isVisible = visibility[option.id as keyof typeof visibility];
                return (
                  <motion.div
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'group relative flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all',
                      isVisible
                        ? 'border-primary/40 from-primary/10 to-primary/5 bg-gradient-to-br shadow-sm'
                        : 'border-border bg-muted/20 hover:border-muted-foreground/30',
                    )}
                  >
                    <div
                      className={cn(
                        'rounded-lg p-2 transition-all',
                        isVisible
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-muted text-muted-foreground group-hover:bg-muted-foreground/20',
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          'truncate text-sm font-medium',
                          isVisible ? 'text-foreground' : 'text-muted-foreground',
                        )}
                      >
                        {option.label}
                      </p>
                    </div>
                    <Switch
                      checked={isVisible}
                      onCheckedChange={(checked) =>
                        setValue(
                          `display.visibility.${option.id as keyof typeof visibility}`,
                          checked,
                        )
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0"
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

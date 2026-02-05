import { __ } from '@wordpress/i18n';
import { motion } from 'framer-motion';
import { Globe, Shield, Sparkles } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { containerVariants, itemVariants } from '@/lib/helpers/settings.helper';
import { SettingsFormData } from '@/lib/schema/settings';
import { cn } from '@/lib/utils';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SettingRow } from '@/components/settings/SettingRow';

const STOCK_BASED_DISPLAY_RULES = [
  {
    label: __('Always Show', 'retailers-management-for-woocommerce'),
    value: 'always',
  },
  {
    label: __('Only When Out of Stock', 'retailers-management-for-woocommerce'),
    value: 'out_of_stock',
  },
  {
    label: __('Only When In Stock', 'retailers-management-for-woocommerce'),
    value: 'in_stock',
  },
];

const GEO_TARGETING = [
  {
    label: __('Enable Geo-Targeting', 'retailers-management-for-woocommerce'),
    value: 'enable',
  },
  {
    label: __('Auto-Detect Location', 'retailers-management-for-woocommerce'),
    value: 'auto_detect',
  },
];

export default function AdvancedTab() {
  const { control, watch, setValue } = useFormContext<SettingsFormData>();
  const advancedSetting = watch('advanced') || {};

  return (
    <>
      <motion.div
        key="advanced"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        {/* Stock Rules */}
        <motion.div
          variants={itemVariants}
          className="border-border bg-card overflow-hidden rounded-lg border shadow-sm"
        >
          <div className="border-border bg-muted/30 border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <Shield className="text-primary h-5 w-5" />
              </div>
              <div>
                <h3 className="text-foreground font-semibold">
                  {__('Stock-Based Display Rules', 'retailers-management-for-woocommerce')}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {__('Control when retailers are shown', 'retailers-management-for-woocommerce')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-6">
            <div className="space-y-2">
              <FormField
                control={control}
                name={`advanced.stockBasedDisplayRules.showWhen`}
                render={({ field: { ...field }, fieldState: { error, invalid } }) => (
                  <FormItem className="flex flex-col gap-1.5">
                    <FormLabel className="text-xs font-medium">
                      {__('Show Retailers When', 'retailers-management-for-woocommerce')}
                    </FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={(value) => field.onChange(value)}>
                        <SelectTrigger
                          className={cn(
                            'h-10! w-full rounded-md shadow-none',
                            invalid && 'border-destructive ring-destructive',
                          )}
                        >
                          <SelectValue
                            placeholder={__(
                              'Select a stock-based display rule',
                              'retailers-management-for-woocommerce',
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {STOCK_BASED_DISPLAY_RULES.map((rule) => (
                            <SelectItem key={rule.value} value={rule.value}>
                              {rule.label}
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
          </div>

          <div className="divide-border border-border divide-y border-t">
            <SettingRow
              icon={<Shield className="h-5 w-5" />}
              title={__(
                'Hide Add to Cart When Showing Retailers',
                'retailers-management-for-woocommerce',
              )}
              description={__(
                'Remove the default Add to Cart button when retailers are displayed',
                'retailers-management-for-woocommerce',
              )}
              checked={advancedSetting.stockBasedDisplayRules.hideAddToCardWhenShow || false}
              onCheckedChange={(checked) =>
                setValue('advanced.stockBasedDisplayRules.hideAddToCardWhenShow', checked)
              }
            />
          </div>
        </motion.div>

        {/* Geo Targeting */}
        <motion.div
          variants={itemVariants}
          className="border-border bg-card relative overflow-hidden rounded-lg border shadow-sm"
        >
          <div className="border-border bg-muted/30 border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <Globe className="text-primary h-5 w-5" />
              </div>
              <div>
                <h3 className="text-foreground font-semibold">
                  {__('Country-Based Targeting', 'retailers-management-for-woocommerce')}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {__('Geo-targeting configuration', 'retailers-management-for-woocommerce')}
                </p>
              </div>
            </div>
          </div>

          <div className="divide-border divide-y">
            <SettingRow
              icon={<Globe className="h-5 w-5" />}
              title={__('Enable Geo-Targeting', 'retailers-management-for-woocommerce')}
              description={__(
                "Show different retailers based on user's country",
                'retailers-management-for-woocommerce',
              )}
              checked={advancedSetting.geoTargeting.showDifferentRetailersOnCountry || false}
              onCheckedChange={(checked) =>
                setValue('advanced.geoTargeting.showDifferentRetailersOnCountry', checked)
              }
            />
            <SettingRow
              icon={<Sparkles className="h-5 w-5" />}
              title={__('Auto-Detect Location', 'retailers-management-for-woocommerce')}
              description={__(
                "Automatically detect user's country from IP address",
                'retailers-management-for-woocommerce',
              )}
              checked={advancedSetting.geoTargeting.autoDetectLocation || false}
              onCheckedChange={(checked) =>
                setValue('advanced.geoTargeting.autoDetectLocation', checked)
              }
            />
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

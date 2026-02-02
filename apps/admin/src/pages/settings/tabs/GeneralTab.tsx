import { __ } from '@wordpress/i18n';
import { motion } from 'framer-motion';
import { ExternalLink, MousePointerClick, Sparkles, ToggleLeft } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { containerVariants, itemVariants } from '@/lib/helpers/settings.helper';
import { SettingsFormData } from '@/lib/schema/settings';
import { isLite } from '@/lib/utils';
import { SettingRow } from '@/components/settings/SettingRow';

export default function GeneralTab() {
  const { control, watch, setValue } = useFormContext<SettingsFormData>();
  const generalSetting = watch('general') || {};
  return (
    <>
      <motion.div
        key="general"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <motion.div
          variants={itemVariants}
          className="border-border bg-card overflow-hidden rounded-lg border shadow-sm"
        >
          <div className="border-border bg-muted/30 border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <ToggleLeft className="text-primary h-5 w-5" />
              </div>
              <div>
                <h3 className="text-foreground font-semibold">
                  {__('Core Settings', 'retailers-management-for-woocommerce')}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {__('Essential configuration options', 'retailers-management-for-woocommerce')}
                </p>
              </div>
            </div>
          </div>

          <div className="divide-border divide-y">
            <SettingRow
              icon={<Sparkles className="h-5 w-5" />}
              title={__('Enable Retailer Functionality', 'retailers-management-for-woocommerce')}
              description={__(
                'Display retailers on product pages',
                'retailers-management-for-woocommerce',
              )}
              checked={generalSetting.showOnProducts}
              onCheckedChange={(checked) => setValue('general.showOnProducts', checked)}
            />
            <SettingRow
              icon={<ExternalLink className="h-5 w-5" />}
              title={__('Open Links in New Tab', 'retailers-management-for-woocommerce')}
              description={__(
                'Retailer links will open in a new browser tab',
                'retailers-management-for-woocommerce',
              )}
              checked={generalSetting.openNewTab}
              onCheckedChange={(checked) => setValue('general.openNewTab', checked)}
            />

            <SettingRow
              icon={<MousePointerClick className="h-5 w-5" />}
              title={__('Enable Click Tracking', 'retailers-management-for-woocommerce')}
              description={__(
                'Track clicks on retailer buttons for analytics',
                'retailers-management-for-woocommerce',
              )}
              checked={generalSetting.enableClickTracking}
              onCheckedChange={
                isLite ? () => {} : (checked) => setValue('general.enableClickTracking', checked)
              }
              disabled={isLite}
              tooltip={__(
                'Analytics data will be available in the Dashboard',
                'retailers-management-for-woocommerce',
              )}
            />
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

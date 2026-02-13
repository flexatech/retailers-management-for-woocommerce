import { __ } from '@wordpress/i18n';
import { motion } from 'framer-motion';
import { ExternalLink, HelpCircle } from 'lucide-react';

import { containerVariants, itemVariants } from '@/lib/helpers/settings.helper';

const SUPPORT_URL = 'https://flexacommerce.com/contact';

export default function SupportTab() {
  return (
    <motion.div
      key="support"
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
              <HelpCircle className="text-primary h-5 w-5" />
            </div>
            <div>
              <h3 className="text-foreground font-semibold">
                {__('Support & Custom Development', 'retailers-management-for-woocommerce')}
              </h3>
              <p className="text-muted-foreground text-sm">
                {__('Get in touch for extended features or custom solutions', 'retailers-management-for-woocommerce')}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="text-foreground mb-4 text-sm leading-relaxed">
            {__(
              'Need a custom solution? Contact us for bespoke features tailored to your website.',
              'retailers-management-for-woocommerce',
            )}
          </p>
          <a
            href={SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/90 inline-flex items-center gap-2 font-medium transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            {__('Contact FlexaTech', 'retailers-management-for-woocommerce')}
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

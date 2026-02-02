import { useRef, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { motion } from 'framer-motion';
import { Eye, Layout } from 'lucide-react';

import { containerVariants, itemVariants } from '@/lib/helpers/settings.helper';
import { Button } from '@/components/ui/button';

import DisplayModes from './sections/DisplayModes';
import DisplayPosition from './sections/DisplayPosition';
import ElementVisibility from './sections/ElementVisibility';

export default function DisplayTab({ onPreview }: { onPreview: () => void }) {
  const displayCardRef = useRef<HTMLDivElement | null>(null);

  const [expandedSections, setExpandedSections] = useState({
    position: true,
    mode: true,
    visibility: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };
  return (
    <>
      <motion.div
        key="display"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        <motion.div
          ref={displayCardRef}
          variants={itemVariants}
          className="border-border bg-card overflow-hidden rounded-lg border shadow-sm"
        >
          {/* Main Header */}
          <div className="border-border bg-muted/30 border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-lg p-2">
                  <Layout className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold">
                    {__('Display', 'retailers-management-for-woocommerce')}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {__('Layout & styling', 'retailers-management-for-woocommerce')}
                  </p>
                </div>
              </div>
              <Button
                variant="primary-outline"
                size="sm"
                onClick={onPreview}
                className="hover:bg-primary hover:text-primary-foreground cursor-pointer gap-2"
              >
                <Eye className="h-4 w-4" />
                {__('Live Preview', 'retailers-management-for-woocommerce')}
              </Button>
            </div>
          </div>

          {/* Section 1: Display Position - Collapsible */}
          <DisplayPosition
            expanded={expandedSections.position}
            toggleSection={() => toggleSection('position')}
          />

          {/* Section 2: Display Mode - Collapsible */}
          <DisplayModes
            expanded={expandedSections.mode}
            toggleSection={() => toggleSection('mode')}
          />

          {/* Section 3: Element Visibility - Collapsible */}
          <ElementVisibility
            expanded={expandedSections.visibility}
            toggleSection={() => toggleSection('visibility')}
          />
        </motion.div>
      </motion.div>
    </>
  );
}

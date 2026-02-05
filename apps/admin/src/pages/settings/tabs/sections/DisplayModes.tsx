import { __ } from '@wordpress/i18n';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Eye, Grid3X3, List, MapPin, SquareStack } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { SettingsFormData } from '@/lib/schema/settings';
import { RadioGroup } from '@/components/ui/radio-group';
import { DisplayModeCard } from '@/components/settings/DisplayModeCard';

import ButtonToggleSection from './ButtonToggleSection';
import CardGridPreview from './previews/CardGridPreview';
import ClassicListPreview from './previews/ClassicListPreview';
import ModalPopupPreview from './previews/ModalPopupPreview';
import StoreLocatorPreview from './previews/StoreLocatiorPreview';

const displayModes = [
  {
    id: 'list',
    name: __('Classic List', 'retailers-management-for-woocommerce'),
    description: __('Vertical list with full details', 'retailers-management-for-woocommerce'),
    icon: <List className="size-4" />,
    preview: <ClassicListPreview />,
  },
  {
    id: 'modal',
    name: __('Modal Popup', 'retailers-management-for-woocommerce'),
    description: __('Opens in a centered dialog', 'retailers-management-for-woocommerce'),
    icon: <SquareStack className="size-4" />,
    preview: <ModalPopupPreview />,
  },
  {
    id: 'map-card',
    name: __('Store Locator', 'retailers-management-for-woocommerce'),
    description: __('Interactive map with pins', 'retailers-management-for-woocommerce'),
    icon: <MapPin className="size-4" />,
    preview: <StoreLocatorPreview />,
  },
  {
    id: 'grid',
    name: __('Card Grid', 'retailers-management-for-woocommerce'),
    description: __('Modern responsive cards', 'retailers-management-for-woocommerce'),
    icon: <Grid3X3 className="size-4" />,
    preview: <CardGridPreview />,
  },
];

interface DisplayModesProps {
  expanded: boolean;
  toggleSection: () => void;
}
export default function DisplayModes({ expanded, toggleSection }: DisplayModesProps) {
  const { control, watch, setValue } = useFormContext<SettingsFormData>();
  const displaySetting = watch('display') || {};

  return (
    <div className="border-border border-b">
      <ButtonToggleSection
        expanded={expanded}
        toggleSection={toggleSection}
        title={__('Display Mode', 'retailers-management-for-woocommerce')}
        description={__(
          'Choose how retailers are presented to customers',
          'retailers-management-for-woocommerce',
        )}
        icon={<Eye className="size-4" />}
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
            <div className="my-6 px-6">
              <RadioGroup
                value={displaySetting.layoutStyle}
                onValueChange={(value) =>
                  setValue(
                    'display.layoutStyle',
                    value as SettingsFormData['display']['layoutStyle'],
                  )
                }
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                {displayModes.map((mode) => (
                  <DisplayModeCard
                    key={mode.id}
                    id={mode.id}
                    name={mode.name}
                    description={mode.description}
                    icon={mode.icon}
                    preview={mode.preview}
                    isSelected={displaySetting.layoutStyle === mode.id}
                  />
                ))}
              </RadioGroup>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

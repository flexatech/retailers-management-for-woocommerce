import { __ } from '@wordpress/i18n';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Eye, Layout } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { DISPLAY_POSITIONS } from '@/lib/helpers/settings.helper';
import { SettingsFormData } from '@/lib/schema/settings';
import { cn } from '@/lib/utils';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import ButtonToggleSection from './ButtonToggleSection';

interface DisplayPositionProps {
  expanded: boolean;
  toggleSection: () => void;
}
export default function DisplayPosition({ expanded, toggleSection }: DisplayPositionProps) {
  const { control } = useFormContext<SettingsFormData>();

  return (
    <div className="border-border border-b">
      <ButtonToggleSection
        expanded={expanded}
        toggleSection={toggleSection}
        title={__('Display Position', 'retailers-management-for-woocommerce')}
        description={__(
          'Where to show retailers on product pages',
          'retailers-management-for-woocommerce',
        )}
        icon={<Layout className="size-4" />}
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
            <div className="my-6 grid gap-4 px-6 md:grid-cols-2">
              <div className="space-y-2">
                <FormField
                  control={control}
                  name={`display.position`}
                  render={({ field: { ...field }, fieldState: { error, invalid } }) => (
                    <FormItem className="flex flex-col gap-1.5">
                      <FormLabel className="text-xs font-medium">
                        {__('Show Retailers', 'retailers-management-for-woocommerce')}
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger
                            className={cn(
                              'h-10! w-full rounded-md shadow-none',
                              invalid && 'border-destructive ring-destructive',
                            )}
                          >
                            <SelectValue placeholder="Select a display position" />
                          </SelectTrigger>
                          <SelectContent>
                            {DISPLAY_POSITIONS.map((displayPosition) => (
                              <SelectItem key={displayPosition.value} value={displayPosition.value}>
                                {displayPosition.label}
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
                  name="display.sectionTitle"
                  render={({ field: { ref, ...field }, fieldState: { error } }) => (
                    <FormItem className="flex w-full flex-col gap-1.5">
                      <FormLabel className="text-xs font-medium">
                        {__('Section Title', 'retailers-management-for-woocommerce')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          placeholder={__('e.g. Where to Buy')}
                          className={cn(
                            'h-10 rounded-md shadow-none',
                            error ? 'border-destructive' : '',
                          )}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

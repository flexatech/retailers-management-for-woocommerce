import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, RotateCcw, Save } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { useSaveSettingsMutation } from '@/lib/queries/settings';
import { SettingsFormData } from '@/lib/schema/settings';
import { cn } from '@/lib/utils';
import { useScrolled } from '@/hooks/useScrolled';

interface FloatingActionsProps {
  onPreview: () => void;
  showPreviewButton?: boolean;
}

export function FloatingActions({ onPreview }: FloatingActionsProps) {
  const scrolled = useScrolled();
  const saveSettingsMutation = useSaveSettingsMutation();
  const form = useFormContext<SettingsFormData>();
  const [hoveredButton, setHoveredButton] = useState<'preview' | 'save' | null>(null);
  return (
    <AnimatePresence>
      {scrolled && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25,
          }}
          className="fixed top-1/2 right-2 z-50 flex -translate-y-1/2 flex-col items-end gap-3"
        >
          {/* Live Preview Button */}
          <motion.button
            type="button"
            onClick={onPreview}
            onMouseEnter={() => setHoveredButton('preview')}
            onMouseLeave={() => setHoveredButton(null)}
            className={cn(
              'group relative flex items-center overflow-hidden rounded-lg',
              'bg-card border-border/50 border',
              'backdrop-blur-xl',
              'transition-all duration-300 ease-out',
              'cursor-pointer',
            )}
            style={{
              boxShadow: 'var(--shadow-card)',
            }}
            animate={{
              width: hoveredButton === 'preview' ? 160 : 54,
              boxShadow:
                hoveredButton === 'preview' ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
            }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center gap-2 p-3">
              {/* Icon Container */}
              <motion.div
                className={cn(
                  'relative flex size-7 items-center justify-center rounded-lg',
                  'transition-all duration-300',
                  hoveredButton === 'preview'
                    ? 'bg-primary!'
                    : 'text-muted-foreground! bg-[#e5e7eb]!',
                )}
                animate={{
                  background:
                    hoveredButton === 'preview'
                      ? 'linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.05))'
                      : 'linear-gradient(135deg, hsl(var(--muted)), hsl(var(--muted) / 0.5))',
                }}
              >
                <Eye
                  className={cn(
                    'size-5 transition-colors duration-300',
                    hoveredButton === 'preview'
                      ? 'text-primary-foreground'
                      : 'text-mute-foreground!',
                  )}
                />
              </motion.div>

              {/* Text Label */}
              <AnimatePresence>
                {hoveredButton === 'preview' && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {__('Live Preview', 'retailers-management-for-woocommerce')}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.button>

          {/* Save Settings Button */}
          <motion.button
            type="button"
            onClick={() => saveSettingsMutation.mutate(form.getValues())}
            disabled={saveSettingsMutation.isPending}
            onMouseEnter={() => setHoveredButton('save')}
            onMouseLeave={() => setHoveredButton(null)}
            className={cn(
              'group relative flex items-center overflow-hidden rounded-lg',
              'from-primary to-primary/90 bg-gradient-to-r',
              'transition-all duration-300 ease-out',
              'disabled:opacity-70',
              'cursor-pointer',
            )}
            animate={{
              width: hoveredButton === 'save' ? 160 : 54,
              boxShadow:
                hoveredButton === 'save'
                  ? 'var(--shadow-floating-hover)'
                  : 'var(--shadow-floating)',
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Animated Background Glow */}
            <motion.div
              className="from-primary via-accent to-primary absolute inset-0 bg-gradient-to-r opacity-0"
              animate={{
                opacity: hoveredButton === 'save' ? [0, 0.3, 0] : 0,
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ backgroundSize: '200% 100%' }}
            />

            <div className="relative flex items-center gap-2 p-3">
              {/* Icon Container */}
              <motion.div
                className={cn(
                  'relative flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl',
                  'bg-primary-foreground/20',
                  'transition-all duration-300',
                )}
                animate={{
                  backgroundColor:
                    hoveredButton === 'save' ? 'hsla(0, 0%, 100%, 0.25)' : 'hsla(0, 0%, 100%, 0.2)',
                }}
              >
                {saveSettingsMutation.isPending ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <RotateCcw className="text-primary-foreground h-4 w-4" />
                  </motion.div>
                ) : (
                  <Save className="text-primary-foreground h-4 w-4" />
                )}
              </motion.div>

              {/* Text Label */}
              <AnimatePresence>
                {hoveredButton === 'save' && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="text-primary-foreground text-sm font-medium whitespace-nowrap"
                  >
                    {saveSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { __ } from '@wordpress/i18n';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

import { cn, isLite } from '@/lib/utils';
import { DisplayLabel } from '@/components/ui/display-label';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { ProLockedOverlay } from '@/components/custom/ProLockedOverlay';

interface DisplayModeCardProps {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  preview: React.ReactNode;
  isSelected: boolean;
}

export const DisplayModeCard = ({
  id,
  name,
  description,
  icon,
  preview,
  isSelected,
}: DisplayModeCardProps) => (
  <DisplayLabel
    htmlFor={id}
    className={cn(
      'group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-xl border-2 transition-all duration-300',
      isSelected
        ? 'border-primary bg-primary/5 shadow-primary/10 shadow-lg'
        : 'border-border hover:border-primary/40 hover:bg-muted/30',
      isLite && id === 'map-card' && 'relative cursor-not-allowed',
    )}
  >
    <RadioGroupItem value={id} id={id} className="sr-only" disabled={isLite && id === 'map-card'} />

    {/* Header */}
    <div className="border-border/50 bg-muted/30 flex items-center gap-3 border-b px-4 py-3">
      <div
        className={cn(
          'rounded-lg p-2 transition-colors',
          isSelected ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground',
        )}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-foreground font-semibold">{name}</span>
        </div>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-primary flex h-6 w-6 items-center justify-center rounded-full"
        >
          <Check className="text-primary-foreground h-3.5 w-3.5" />
        </motion.div>
      )}
    </div>

    {/* Preview */}
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="w-full">{preview}</div>
    </div>
    {isLite && id === 'map-card' && <ProLockedOverlay size="small" />}
  </DisplayLabel>
);

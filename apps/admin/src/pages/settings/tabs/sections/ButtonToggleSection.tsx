import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

interface ButtonToggleSectionProps {
  expanded: boolean;
  toggleSection: () => void;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function ButtonToggleSection({
  expanded,
  toggleSection,
  title,
  description,
  icon,
}: ButtonToggleSectionProps) {
  return (
    <button
      type="button"
      onClick={toggleSection}
      className="bg-muted flex w-full items-center justify-between px-6 py-4 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'rounded-lg p-2',
            expanded ? 'text-primary bg-primary/10!' : 'text-muted-foreground! bg-[#eeeeee]!',
          )}
        >
          {icon}
        </div>
        <div className="text-left">
          <h4 className="text-foreground font-medium">{title}</h4>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
      <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
        <ChevronDown className="text-muted-foreground h-5 w-5" />
      </motion.div>
    </button>
  );
}

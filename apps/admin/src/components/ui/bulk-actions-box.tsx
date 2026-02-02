import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from './button';

type BulkActionBoxProps = {
  selected: number;
  onClose: () => void;
  children?: React.ReactNode;
  className?: string;
};

const BulkActionBox = ({ selected, onClose, children, className }: BulkActionBoxProps) => {
  return (
    <AnimatePresence>
      {selected > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{
            duration: 0.12,
            ease: [0.4, 0, 0.2, 1],
          }}
          className={cn(
            'fixed bottom-6 left-1/2 z-50 -translate-x-1/2',
            'border-border bg-background flex items-center gap-2 rounded-md border px-1.5 py-1 shadow-lg',
            className,
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-foreground text-muted-foreground h-6 w-6 shrink-0 hover:bg-transparent"
            onClick={onClose}
          >
            <XIcon className="size-4" />
          </Button>

          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BulkActionBox;

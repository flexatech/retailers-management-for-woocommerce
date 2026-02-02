import { __ } from '@wordpress/i18n';
import { motion } from 'framer-motion';
import { Lock, Sparkles } from 'lucide-react';

import { cn } from '@/lib/utils';

interface ProLockedOverlayProps {
  size?: 'small' | 'medium';
  onUpgrade?: () => void;
}

export function ProLockedOverlay({ size = 'medium', onUpgrade }: ProLockedOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(241, 245, 249, 0.6), rgba(226, 232, 240, 0.65))',
        backdropFilter: 'blur(1px)',
      }}
    >
      <motion.button
        onClick={onUpgrade}
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.98 }}
        className="group relative flex items-center gap-2.5 overflow-hidden rounded-md px-5 py-2.5 font-semibold text-white shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.35)',
        }}
        type="button"
      >
        {/* Shimmer effect */}
        <div
          className="animate-shimmer absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
            backgroundSize: '200% 100%',
          }}
        />

        <Lock className="relative z-10 h-4 w-4 transition-all group-hover:hidden" />
        <Sparkles className="relative z-10 hidden h-4 w-4 transition-all group-hover:block" />
        <span className={cn('relative z-10', size === 'small' ? 'text-xs' : 'text-sm')}>
          {__('Unlock with Pro', 'retailers-management-for-woocommerce')}
        </span>
      </motion.button>
    </motion.div>
  );
}

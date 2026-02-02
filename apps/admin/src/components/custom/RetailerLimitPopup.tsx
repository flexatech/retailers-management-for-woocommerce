import { DialogTitle } from '@radix-ui/react-dialog';
import { __ } from '@wordpress/i18n';
import { motion } from 'framer-motion';
import { Check, Crown, Lock, Sparkles, X, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface RetailerLimitPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCount: number;
  maxLimit: number;
}

const features = [
  'Unlimited retailers',
  'Country-Based Targeting',
  'Store Locator (Map) Feature',
  'Advanced analytics',
];

export default function RetailerLimitPopup({
  open,
  onOpenChange,
  currentCount,
  maxLimit,
}: RetailerLimitPopupProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle hidden={true}></DialogTitle>
      <DialogContent className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl sm:max-w-[420px]">
        {/* Header */}
        <div className="relative px-6 pt-8 pb-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-ring mb-4 inline-flex h-16 w-16 items-center justify-center rounded-xl from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25"
          >
            <Lock className="h-7 w-7 text-white" />
          </motion.div>

          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mb-2 text-xl font-bold text-slate-900"
          >
            {__('Retailer Limit Reached', 'retailers-management-for-woocommerce')}
          </motion.h2>

          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-slate-500"
          >
            {__(
              `Lite plan allows up to ${maxLimit} retailers`,
              'retailers-management-for-woocommerce',
            )}
          </motion.p>

          {/* Progress indicator */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mt-4 flex items-center justify-center gap-3"
          >
            <div className="bg-muted flex items-center gap-2 rounded-xl px-4 py-2">
              <span className="text-foreground text-lg font-bold">{currentCount}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground text-lg font-bold">{maxLimit}</span>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="bg-border h-px from-transparent via-slate-200 to-transparent" />

        {/* Body */}
        <div className="px-4 pt-2">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-5 flex items-center justify-center gap-2"
          >
            <Crown className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-slate-700">
              {__('Upgrade to Pro', 'retailers-management-for-woocommerce')}
            </span>
          </motion.div>

          {/* Features grid */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mb-8 grid grid-cols-1 gap-2"
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-md border border-slate-100 bg-slate-50 p-2"
              >
                <div className="bg-success flex size-5 flex-shrink-0 items-center justify-center rounded-lg">
                  <Check className="size-3 text-white" />
                </div>
                <span className="text-muted-foreground text-xs font-medium">{feature}</span>
              </div>
            ))}
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="my-4 space-y-3"
          >
            <button
              className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                boxShadow: '0 4px 15px -3px rgba(59, 130, 246, 0.4)',
              }}
            >
              <Zap className="h-4 w-4" />
              {__('Upgrade to Pro', 'retailers-management-for-woocommerce')}
              <Sparkles className="h-4 w-4" />
            </button>
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:bg-muted hover:text-foreground mt-4 w-full"
            >
              {__('Maybe later', 'retailers-management-for-woocommerce')}
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

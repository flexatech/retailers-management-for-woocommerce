import { __ } from '@wordpress/i18n';
import { motion } from 'framer-motion';
import { ChevronRight, Layout, SettingsIcon, Zap } from 'lucide-react';

import { cn } from '@/lib/utils';

export const settingsTabs = [
  {
    id: 'general',
    label: __('General', 'retailers-management-for-woocommerce'),
    icon: SettingsIcon,
    description: __('Core plugin settings', 'retailers-management-for-woocommerce'),
  },
  {
    id: 'display',
    label: __('Display', 'retailers-management-for-woocommerce'),
    icon: Layout,
    description: __('Layout & styling', 'retailers-management-for-woocommerce'),
  },
  {
    id: 'advanced',
    label: __('Advanced', 'retailers-management-for-woocommerce'),
    icon: Zap,
    description: __('Extended functionality', 'retailers-management-for-woocommerce'),
  },
];

interface SettingsNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
export default function SettingsNavigation({ activeTab, setActiveTab }: SettingsNavigationProps) {
  return (
    <>
      {/* Sidebar Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="shrink-0 lg:w-64"
      >
        <nav className="space-y-1.5 lg:sticky lg:top-28">
          {settingsTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'group my-2 flex w-full items-center gap-3 rounded-lg px-4 py-3.5 text-left transition-all duration-200 first:mt-0',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-primary/25 shadow-lg'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <div
                  className={cn(
                    'rounded-lg p-2 transition-colors',
                    isActive ? 'bg-primary-foreground/20' : 'bg-muted group-hover:bg-background',
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{tab.label}</span>
                  </div>
                  <p
                    className={cn(
                      'truncate text-xs transition-colors',
                      isActive ? 'text-primary-foreground/70' : 'text-muted-foreground',
                    )}
                  >
                    {tab.description}
                  </p>
                </div>
                <ChevronRight
                  className={cn('h-4 w-4 transition-transform', isActive && 'rotate-90')}
                />
              </button>
            );
          })}
        </nav>
      </motion.div>
    </>
  );
}

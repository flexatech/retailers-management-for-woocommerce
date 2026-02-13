import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { __ } from '@wordpress/i18n';
import { AnimatePresence, motion } from 'framer-motion';
import { Monitor, Smartphone } from 'lucide-react';
import { FieldErrors, useForm } from 'react-hook-form';

import { DEFAULT_SETTINGS } from '@/lib/helpers/settings.helper';
import { useSaveSettingsMutation, useSettingsQuery } from '@/lib/queries/settings';
import { SettingsFormData, settingsFormSchema } from '@/lib/schema/settings';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormProvider } from '@/components/ui/form';
import { TooltipProvider } from '@/components/ui/tooltip';
import { FloatingActions } from '@/components/settings/FloatingActions';
import { RetailerPreview } from '@/components/settings/RetailerPreview';

import SettingsHeader from './SettingsHeader';
import SettingsNavigation from './SettingsNavigation';
import AdvancedTab from './tabs/AdvancedTab';
import DisplayTab from './tabs/DisplayTab';
import GeneralTab from './tabs/GeneralTab';
import SupportTab from './tabs/SupportTab';

export default function Settings() {
  const { data: settings } = useSettingsQuery();

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: settings ?? DEFAULT_SETTINGS,
  });

  const [activeTab, setActiveTab] = useState('general');

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    if (settings) {
      form.reset(settings);
    } else {
      form.reset(DEFAULT_SETTINGS);
    }
  }, [settings, form]);

  const saveSettingsMutation = useSaveSettingsMutation();

  const onSubmit = (data: SettingsFormData) => {
    console.log(data);
    saveSettingsMutation.mutate(data);
  };
  const onError = (errors: FieldErrors<SettingsFormData>) => {
    console.log('errors', errors);
  };

  return (
    <TooltipProvider>
      <FormProvider {...form}>
        <form id="settings-form" onSubmit={form.handleSubmit(onSubmit, onError)}>
          <div className="mx-auto mt-[84px] min-h-screen max-w-7xl space-y-6 px-6">
            {/* Header */}
            <SettingsHeader saving={saveSettingsMutation.isPending} />

            <div className="flex flex-col gap-8 lg:flex-row">
              {/* Sidebar Navigation */}
              <SettingsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
              {/* Content Area */}
              <div className="min-w-0 flex-1">
                <AnimatePresence mode="wait">
                  {/* General Tab */}
                  {activeTab === 'general' && <GeneralTab />}
                  {/* Display Tab - Consolidated Single Card */}
                  {activeTab === 'display' && (
                    <DisplayTab onPreview={() => setShowPreviewModal(true)} />
                  )}

                  {/* Advanced Tab */}
                  {activeTab === 'advanced' && <AdvancedTab />}

                  {/* Support Tab */}
                  {activeTab === 'support' && <SupportTab />}
                </AnimatePresence>
              </div>
            </div>
            {/* Floating Actions */}
            <FloatingActions onPreview={() => setShowPreviewModal(true)} />
            {/* Live Preview Modal */}
            <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
              <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col overflow-hidden">
                <DialogHeader className="shrink-0">
                  <div className="mt-5 flex items-center justify-between">
                    <DialogTitle className="flex items-center gap-3">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <Monitor className="text-primary h-5 w-5" />
                      </div>
                      {__('Live Preview', 'retailers-management-for-woocommerce')}
                    </DialogTitle>
                    <div className="border-border bg-muted/30 flex items-center gap-1 rounded-lg border p-1">
                      <button
                        onClick={() => setPreviewDevice('desktop')}
                        className={cn(
                          'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                          previewDevice === 'desktop'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground',
                        )}
                      >
                        <Monitor className="h-4 w-4" />
                        {__('Desktop', 'retailers-management-for-woocommerce')}
                      </button>
                      <button
                        onClick={() => setPreviewDevice('mobile')}
                        className={cn(
                          'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                          previewDevice === 'mobile'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground',
                        )}
                      >
                        <Smartphone className="h-4 w-4" />
                        {__('Mobile', 'retailers-management-for-woocommerce')}
                      </button>
                    </div>
                  </div>
                </DialogHeader>

                <div className="flex-1 overflow-auto">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      'mx-auto transition-all',
                      previewDevice === 'mobile'
                        ? 'w-[375px] max-w-full'
                        : 'w-full max-w-4xl',
                    )}
                  >
                    {previewDevice === 'mobile' ? (
                      <div className="border-border bg-muted/20 rounded-[2.5rem] border-8 border-t-12 p-4 shadow-2xl">
                        {/* Mobile notch simulation */}
                        <div className="bg-foreground mx-auto mb-4 h-6 w-32 rounded-full" />
                        <div className="bg-background rounded-[1.5rem] p-4 shadow-inner">
                          <RetailerPreview isMobile={true} />
                        </div>
                      </div>
                    ) : (
                      <div className="border-border bg-muted/20 rounded-lg border border-dashed p-6">
                        <div className="bg-background rounded-lg p-4 shadow-sm">
                          <RetailerPreview isMobile={false} />
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </form>
      </FormProvider>
    </TooltipProvider>
  );
}

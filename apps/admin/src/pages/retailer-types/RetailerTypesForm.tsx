import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { X } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMatch, useNavigate, useParams } from 'react-router-dom';
import { useUpdateEffect } from 'react-use';

import { DEFAULT_RETAILER_TYPE } from '@/lib/helpers/retailer-types.helper';
import {
  useAddRetailerTypeMutation,
  useRetailerTypeQuery,
  useUpdateRetailerTypeMutation,
} from '@/lib/queries/retailerTypes';
import {
  createRetailerTypeSchema,
  RetailerTypeFormValues,
  retailerTypeSchema,
} from '@/lib/schema/retailerTypes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ColorPicker } from '@/components/ui/color-picker';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ImagePicker } from '@/components/ui/image-picker';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export default function RetailerTypesForm() {
  const params = useParams();
  const [isWpMediaOpen, setIsWpMediaOpen] = useState(false);
  const isAddingRetailerType = useMatch({ path: '/retailer-types/new' }) !== null;
  const editRetailerTypeId = params.retailerTypeId ? Number(params.retailerTypeId) : 0;

  const navigate = useNavigate();
  const { mutate: addRetailerType, isPending: isAddingRetailerTypePending } =
    useAddRetailerTypeMutation();
  const { mutate: updateRetailerType, isPending: isUpdatingRetailerTypePending } =
    useUpdateRetailerTypeMutation(editRetailerTypeId);

  // Use the custom hook to fetch retailer data and handle loading and error states
  const {
    data,
    isLoading: isLoadingRetailerType,
    isError: isErrorRetailerType,
  } = useRetailerTypeQuery(editRetailerTypeId);

  const isSheetOpen = isAddingRetailerType || editRetailerTypeId !== 0;

  const form = useForm<RetailerTypeFormValues>({
    resolver: zodResolver(isAddingRetailerType ? createRetailerTypeSchema : retailerTypeSchema),
    mode: 'onChange',
    defaultValues: data ?? DEFAULT_RETAILER_TYPE,
  });

  const onError = (errors: any, event: any) => {
    console.log('errors', errors);
    console.log('event', event);
  };

  function onSubmit(data: RetailerTypeFormValues): void {
    console.log('data', data);
    if (isAddingRetailerType) {
      addRetailerType(data);
    } else {
      updateRetailerType(data);
    }
  }

  useUpdateEffect(() => {
    if (isAddingRetailerType) {
      form.reset(DEFAULT_RETAILER_TYPE);
    } else if (data) {
      form.reset(data);
    }
  }, [isAddingRetailerType, data, form]);

  return (
    <FormProvider {...form}>
      <form
        id="retailer-type-form"
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="flex h-full flex-col"
      >
        <Sheet
          modal={!isWpMediaOpen}
          open={isSheetOpen}
          onOpenChange={(open) => {
            if (!open) {
              if (isWpMediaOpen) return;
              navigate('/retailer-types');
            }
          }}
        >
          <SheetContent
            side="right"
            className={cn(
              'top-[32px] h-[calc(100%-32px)] w-full gap-0 overflow-x-auto pt-0 md:min-w-[490px]',
            )}
            onInteractOutside={(e) => isWpMediaOpen && e.preventDefault()}
            onFocusOutside={(e) => isWpMediaOpen && e.preventDefault()}
            onEscapeKeyDown={(e) => isWpMediaOpen && e.preventDefault()}
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
            disableAnimation={isWpMediaOpen}
          >
            {(isLoadingRetailerType || isErrorRetailerType) && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70">
                <Spinner className="text-muted-foreground size-6 animate-spin" />
              </div>
            )}
            <SheetHeader className="border-border border-b p-5">
              <div className="flex items-start justify-between">
                <div>
                  <SheetTitle className="text-[18px] font-semibold text-[#151619]">
                    {isAddingRetailerType ? __('Add New Retailer Type', 'retailers-management-for-woocommerce') : __('Edit Retailer Type', 'retailers-management-for-woocommerce')}
                  </SheetTitle>
                  <SheetDescription className="text-base-muted-foreground mt-[4px] text-sm leading-[20px] font-normal">
                    {__('Enter the information below to add a new retailer type', 'retailers-management-for-woocommerce')}
                  </SheetDescription>
                </div>
                <SheetClose asChild>
                  <button className="mt-1 text-[#67708066] hover:text-[#677080]">
                    <X className="h-5 w-5" />
                  </button>
                </SheetClose>
              </div>
            </SheetHeader>

            <div className="grid gap-5 overflow-auto p-5">
              {/* Retailer Details */}
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name={`status`}
                  render={({ field }) => (
                    <div className="base-base-border flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <h2 className="text-base-secondary text-sm font-normal">{__('Active Status', 'retailers-management-for-woocommerce')}</h2>
                        <p className="text-base-muted-foreground mt-1 text-xs font-normal">
                          {__('Enable to show this retailer on product pages', 'retailers-management-for-woocommerce')}
                        </p>
                      </div>
                      <Switch size="md" checked={field.value} onCheckedChange={field.onChange} />
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field: { ref, ...field }, fieldState: { error } }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-base-secondary space-y-2.5 text-xs font-medium">
                        {__('Retailer Type Name', 'retailers-management-for-woocommerce')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          placeholder={__('e.g. Enter a name', 'retailers-management-for-woocommerce')}
                          className={`h-9 rounded-md ${error ? 'border-destructive' : ''} focus-visible:ring-0`}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`description`}
                  render={({ field: { ref, ...field }, fieldState: { error } }) => (
                    <FormItem className="w-full gap-2.5">
                      <FormLabel className="text-base-secondary text-xs font-medium">
                        {__('Description', 'retailers-management-for-woocommerce')}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={__('Enter a description', 'retailers-management-for-woocommerce')}
                          className="h-24 rounded-md"
                        />
                      </FormControl>
                      {error && <FormMessage>{error.message}</FormMessage>}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`color`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-base-secondary space-y-2.5 text-xs font-medium">
                        {__('Color', 'retailers-management-for-woocommerce')}
                      </FormLabel>
                      <FormControl>
                        <ColorPicker
                          value={field.value}
                          defaultColor={field.value}
                          onChangeColor={(color: string) => field.onChange(color)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field, fieldState: { error } }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>{__('Icon', 'retailers-management-for-woocommerce')}</FormLabel>
                      <FormControl>
                        <ImagePicker
                          coverSrc={field.value ?? ''}
                          onSelectCover={(src: string) => field.onChange(src)}
                          onRemoveCover={() => field.onChange('')}
                          onOpenMedia={() => setIsWpMediaOpen(true)}
                          onCloseMedia={() => setIsWpMediaOpen(false)}
                        />
                      </FormControl>
                      {error && <FormMessage>{error.message}</FormMessage>}
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <SheetFooter className="p-0">
              <div className="flex justify-end gap-4 border-t border-[#E5E7EB] bg-white p-5">
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    className="border-base-border text-base-secondary hover:text-mute border px-5 hover:bg-transparent"
                  >
                    {__('Cancel', 'retailers-management-for-woocommerce')}
                  </Button>
                </SheetClose>
                <Button
                  type="submit"
                  form="retailer-type-form"
                  className="bg-primary hover:bg-primary-accent px-5 font-medium text-white"
                  disabled={isAddingRetailerTypePending || isUpdatingRetailerTypePending}
                >
                  {isAddingRetailerType ? __('Add Retailer Type', 'retailers-management-for-woocommerce') : __('Save changes', 'retailers-management-for-woocommerce')}
                </Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </form>
    </FormProvider>
  );
}

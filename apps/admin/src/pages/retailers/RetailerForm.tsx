import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Tag, X } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMatch, useNavigate, useParams } from 'react-router-dom';
import { useUpdateEffect } from 'react-use';

import { DEFAULT_RETAILER } from '@/lib/helpers/retailers.helper';
import {
  useAddRetailerMutation,
  useRetailerQuery,
  useUpdateRetailerMutation,
} from '@/lib/queries/retailers';
import { useActiveRetailerTypesQuery } from '@/lib/queries/retailerTypes';
import { createRetailerSchema, RetailerFormValues, retailerSchema } from '@/lib/schema/retailers';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ImagePicker } from '@/components/ui/image-picker';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

import { AddressAutocomplete } from './AddressAutocomplete';

export default function RetailerForm() {
  const params = useParams();

  const [isWpMediaOpen, setIsWpMediaOpen] = useState(false);
  const isAddingRetailer = useMatch({ path: '/retailers/new' }) !== null;
  const editRetailerId = params.retailerId ? Number(params.retailerId) : 0;

  const navigate = useNavigate();
  const { mutate: addRetailer, isPending: isAddingRetailerPending } = useAddRetailerMutation();
  const { mutate: updateRetailer, isPending: isUpdatingRetailerPending } =
    useUpdateRetailerMutation(editRetailerId);
  //
  const { data: retailerTypes } = useActiveRetailerTypesQuery();
  // Use the custom hook to fetch retailer data and handle loading and error states
  const {
    data,
    isLoading: isLoadingRetailer,
    isError: isErrorRetailer,
  } = useRetailerQuery(editRetailerId);

  const isSheetOpen = isAddingRetailer || editRetailerId !== 0;

  const form = useForm<RetailerFormValues>({
    resolver: zodResolver(isAddingRetailer ? createRetailerSchema : retailerSchema),
    mode: 'onChange',
    defaultValues: data ?? DEFAULT_RETAILER,
  });

  const onError = (errors: any, event: any) => {
    console.log('errors', errors);
    console.log('event', event);
  };

  function onSubmit(data: RetailerFormValues): void {
    if (isAddingRetailer) {
      addRetailer(data);
    } else {
      updateRetailer(data);
    }
  }

  useUpdateEffect(() => {
    if (isAddingRetailer) {
      form.reset(DEFAULT_RETAILER);
    } else if (data) {
      form.reset(data);
    }
  }, [isAddingRetailer, data, form]);
  const lat = form.watch('latitude');
  const lng = form.watch('longitude');
  return (
    <FormProvider {...form}>
      <form
        id="retailer-form"
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="flex h-full flex-col"
      >
        <Sheet
          open={isSheetOpen}
          modal={!isWpMediaOpen}
          onOpenChange={(open) => {
            if (!open) {
              if (isWpMediaOpen) return;
              navigate('/retailers');
            }
          }}
        >
          <SheetContent
            side="right"
            className="top-[32px] h-[calc(100%-32px)] w-full gap-0 overflow-x-auto pt-0 md:min-w-[490px]"
            onInteractOutside={(e) => isWpMediaOpen && e.preventDefault()}
            onFocusOutside={(e) => isWpMediaOpen && e.preventDefault()}
            onEscapeKeyDown={(e) => isWpMediaOpen && e.preventDefault()}
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
            disableAnimation={isWpMediaOpen}
          >
            {(isLoadingRetailer || isErrorRetailer) && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70">
                <Spinner className="text-muted-foreground size-6 animate-spin" />
              </div>
            )}
            <SheetHeader className="border-border border-b p-5">
              <div className="flex items-start justify-between">
                <div>
                  <SheetTitle className="text-[18px] font-semibold text-[#151619]">
                    {isAddingRetailer ? __('Add New Retailer', 'retailers-management-for-woocommerce') : __('Edit Retailer', 'retailers-management-for-woocommerce')}
                  </SheetTitle>
                  <SheetDescription className="text-base-muted-foreground mt-[4px] text-sm leading-[20px] font-normal">
                    {__('Enter the information below to add a new retailer', 'retailers-management-for-woocommerce')}
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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field: { ref, ...field }, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-base-secondary space-y-2.5 text-xs font-medium">
                          {__('Retailer Name', 'retailers-management-for-woocommerce')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            placeholder={__('Enter a retailer name', 'retailers-management-for-woocommerce')}
                            className={`h-9 rounded-md ${error ? 'border-destructive' : ''} focus-visible:ring-0`}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field: { ref, ...field }, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-base-secondary space-y-2.5 text-xs font-medium">
                          {__('Retailer Type', 'retailers-management-for-woocommerce')}
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value?.toString() ?? ''}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              value={field.value?.toString() ?? ''}
                              id="retailer-type"
                              className="w-full font-normal"
                            >
                              <SelectValue placeholder={__('Select a retailer type', 'retailers-management-for-woocommerce')} />
                            </SelectTrigger>
                            <SelectContent>
                              {retailerTypes?.map((retailerType) => (
                                <SelectItem
                                  key={retailerType.id}
                                  value={retailerType.id.toString()}
                                >
                                  <div className="flex items-center gap-2">
                                    {retailerType.icon ? (
                                      <img
                                        src={retailerType.icon}
                                        alt={retailerType.name}
                                        width={20}
                                        height={20}
                                      />
                                    ) : (
                                      <Tag
                                        className="h-5 w-5"
                                        style={{ color: retailerType.color }}
                                      />
                                    )}
                                  </div>
                                  {retailerType.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
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
                  name={`description`}
                  render={({ field: { ref, ...field }, fieldState: { error } }) => (
                    <FormItem className="w-full gap-2.5">
                      <FormLabel className="text-base-secondary text-xs font-medium">
                        {__('Retailer Description', 'retailers-management-for-woocommerce')}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={__('Enter a retailer description', 'retailers-management-for-woocommerce')}
                          className="h-24 rounded-md"
                        />
                      </FormControl>
                      {error && <FormMessage>{error.message}</FormMessage>}
                    </FormItem>
                  )}
                />

                {/* Contact Information */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field: { ref, ...field }, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-base-secondary space-y-2.5 text-xs font-medium">
                          {__('Email', 'retailers-management-for-woocommerce')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            placeholder={__('e.g. contact@retailer.com', 'retailers-management-for-woocommerce')}
                            className={`h-9 rounded-md ${error ? 'border-destructive' : ''} focus-visible:ring-0`}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field: { ref, ...field }, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-base-secondary space-y-2.5 text-xs font-medium">
                          {__('Phone Number', 'retailers-management-for-woocommerce')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            placeholder={__('e.g. +1 (555) 000-0000', 'retailers-management-for-woocommerce')}
                            className={`h-9 rounded-md ${error ? 'border-destructive' : ''} focus-visible:ring-0`}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="ecommerceUrl"
                  render={({ field: { ref, ...field }, fieldState: { error } }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-base-secondary space-y-2.5 text-xs font-medium">
                        {__('Website / E-commerce URL', 'retailers-management-for-woocommerce')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          placeholder={__('e.g. https://retailer.com', 'retailers-management-for-woocommerce')}
                          className={`h-9 rounded-md ${error ? 'border-destructive' : ''} focus-visible:ring-0`}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Location Data */}

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field, fieldState: { error } }) => (
                    <FormItem>
                      <FormLabel>{__('Full Address', 'retailers-management-for-woocommerce')}</FormLabel>
                      <FormControl>
                        <AddressAutocomplete
                          // value={form.watch('address')}
                          value={field.value}
                          error={!!error}
                          onSelect={({ address, lat, lng }) => {
                            form.setValue('address', address, { shouldDirty: true });
                            form.setValue('latitude', lat, { shouldDirty: true });
                            form.setValue('longitude', lng, { shouldDirty: true });
                          }}
                          onClear={() => {
                            form.setValue('latitude', '', { shouldDirty: true });
                            form.setValue('longitude', '', { shouldDirty: true });
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field: { ref, ...field }, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-base-secondary space-y-2.5 text-xs font-medium">
                          {__('Latitude', 'retailers-management-for-woocommerce')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            placeholder={__('e.g. 10.762622', 'retailers-management-for-woocommerce')}
                            className={`h-9 rounded-md ${error ? 'border-destructive' : ''} focus-visible:ring-0`}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field: { ref, ...field }, fieldState: { error } }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-base-secondary space-y-2.5 text-xs font-medium">
                          {__('Longitude', 'retailers-management-for-woocommerce')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            placeholder={__('e.g. 10.762622', 'retailers-management-for-woocommerce')}
                            className={`h-9 rounded-md ${error ? 'border-destructive' : ''} focus-visible:ring-0`}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                {lat && lng && (
                  <div className="overflow-hidden rounded-lg border">
                    <iframe
                      key={`${lat}-${lng}`}
                      className="h-48 w-full"
                      loading="lazy"
                      src={`https://www.openstreetmap.org/export/embed.html?marker=${lat},${lng}&zoom=15`}
                    />
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field, fieldState: { error } }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>{__('Logo', 'retailers-management-for-woocommerce')}</FormLabel>
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
                    className="border-base-border text-base-secondary border bg-white px-5 hover:bg-gray-50"
                  >
                    {__('Cancel', 'retailers-management-for-woocommerce')}
                  </Button>
                </SheetClose>
                <Button
                  type="submit"
                  form="retailer-form"
                  className="bg-primary hover:bg-primary-accent px-5 font-medium text-white"
                  disabled={isAddingRetailerPending || isUpdatingRetailerPending}
                >
                  {isAddingRetailer ? __('Add Retailer', 'retailers-management-for-woocommerce') : __('Save changes', 'retailers-management-for-woocommerce')}
                </Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </form>
    </FormProvider>
  );
}

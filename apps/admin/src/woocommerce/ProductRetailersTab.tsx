import { useMemo, useState } from 'react';
import { RetailerItem } from '@/woocommerce/RetailerItem';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { zodResolver } from '@hookform/resolvers/zod';
import { __ } from '@wordpress/i18n';
import { Loader2, Plus, Store } from 'lucide-react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';

import { newProductRetailer } from '@/lib/helpers/product-retailers.helper';
import { useSaveProductRetailersMutation } from '@/lib/queries/product-retailers';
import {
  ProductRetailersFormData,
  productRetailersFormSchema,
} from '@/lib/schema/product-retailers';
import type { ProductRetailer } from '@/lib/schema/product-retailers';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { showToast } from '@/components/custom/showToast';

type Props = {
  productId: number;
};

export function ProductRetailersTab({ productId }: Props) {
  const { product_retailers = [], active_retailers = [] } = window.retailersManagement;
  const form = useForm<ProductRetailersFormData>({
    resolver: zodResolver(productRetailersFormSchema),
    defaultValues: {
      productRetailers: product_retailers ?? [],
    },
  });

  const { mutate: saveProductRetailersMutation, isPending: isLoadingSaveProductRetailers } =
    useSaveProductRetailersMutation();

  const onError = (errors: any, event: any) => {
    console.log('errors', errors);
    console.log('event', event);
  };

  async function onSubmit(data: ProductRetailersFormData): Promise<void> {
    try {
      await saveProductRetailersMutation(
        { productId, retailers: data.productRetailers },
        {
          onSuccess: () => {
            showToast.success(__('Saved changes', 'retailers-management-for-woocommerce'));
          },
        },
      );
    } catch (error) {
      console.error('Error saving product retailers', error);
    }
  }

  const {
    control,
    reset,
    watch,
    formState: { isDirty },
  } = form;

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'productRetailers',
    keyName: '_key',
  });

  const retailers = watch('productRetailers');
  /* ------------------------------------------------------------------
   * UI STATE
   * ------------------------------------------------------------------ */
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState('');

  /* ------------------------------------------------------------------
   * DND
   * ------------------------------------------------------------------ */
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);

    move(oldIndex, newIndex);

    const next = [...retailers];
    const sorted = arrayMove(next, oldIndex, newIndex).map((r, i) => ({
      ...r,
      order: i,
    }));
    reset({ productRetailers: sorted });
  };

  /* ------------------------------------------------------------------
   * ACTIONS
   * ------------------------------------------------------------------ */
  const addRetailer = () => {
    const item = newProductRetailer();
    append(item);
    setExpandedIds((s) => new Set(s).add(item.id));
  };

  const updateIfClearAllRetailers = async (length: number) => {
    if (length === 0) {
      await saveProductRetailersMutation({ productId, retailers: [] });
      reset({ productRetailers: [] });
      setExpandedIds(new Set());
      setSelectedIds(new Set());
      return;
    }
  };

  const removeRetailer = async (id: string, index: number) => {
    if (!confirm(__('Are you sure you want to delete this retailer?'))) return;
    remove(index);
    setExpandedIds((s) => {
      const n = new Set(s);
      n.delete(id);
      return n;
    });
    setSelectedIds((s) => {
      const n = new Set(s);
      n.delete(id);
      return n;
    });
    updateIfClearAllRetailers(fields.length - 1);
  };

  const toggleExpanded = (id: string) => {
    setExpandedIds((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === retailers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(retailers.map((r) => r.id)));
    }
  };

  const applyBulkAction = () => {
    if (!bulkAction || !selectedIds.size) return;

    let next: ProductRetailer[] = retailers;

    if (bulkAction === 'delete') {
      if (
        !confirm(
          __('Are you sure you want to delete these retailers? This action cannot be undone.'),
        )
      ) {
        return;
      }

      next = retailers.filter((r) => !selectedIds.has(r.id));
      setSelectedIds(new Set());

      updateIfClearAllRetailers(next.length);
    }

    if (bulkAction === 'enable') {
      if (!confirm(__('Are you sure you want to enable these retailers?'))) {
        return;
      }
      next = retailers.map((r) => (selectedIds.has(r.id) ? { ...r, isEnabled: true } : r));
    }

    if (bulkAction === 'disable') {
      if (!confirm(__('Are you sure you want to disable these retailers?'))) {
        return;
      }
      next = retailers.map((r) => (selectedIds.has(r.id) ? { ...r, isEnabled: false } : r));
    }

    reset({ productRetailers: next });
    setBulkAction('');
  };

  const expandAll = () => setExpandedIds(new Set(retailers.map((r) => r.id)));
  const collapseAll = () => setExpandedIds(new Set());

  /* ------------------------------------------------------------------
   * RENDER
   * ------------------------------------------------------------------ */
  const totalRetailers = useMemo(() => {
    return retailers.length;
  }, [retailers]);

  return (
    <FormProvider {...form}>
      <form
        id="role-form"
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="flex h-full flex-col"
      >
        {/* Toolbar */}
        {totalRetailers > 0 && (
          <div className="flex items-center justify-between border-b">
            <div className="flex items-center gap-4 p-4">
              <Button size="sm" variant="primary" onClick={addRetailer}>
                <Plus className="size-4" />
                Add New
              </Button>

              <div className="flex items-center gap-2">
                <Checkbox
                  checked={retailers.length > 0 && selectedIds.size === retailers.length}
                  onCheckedChange={toggleSelectAll}
                />
                <span className="text-muted-foreground text-sm">Select All</span>
              </div>

              <div className="flex items-center gap-2">
                <Select value={bulkAction} onValueChange={setBulkAction}>
                  <SelectTrigger className="h-8!">
                    <SelectValue placeholder="Bulk Actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delete">Delete</SelectItem>
                    <SelectItem value="enable">Enable</SelectItem>
                    <SelectItem value="disable">Disable</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  size="sm"
                  variant="primary-outline"
                  disabled={!bulkAction || !selectedIds.size}
                  onClick={applyBulkAction}
                >
                  Apply
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2">
              <span>
                {totalRetailers} {totalRetailers === 1 ? 'retailer' : 'retailers'}
              </span>
              <span>
                (
                <Button
                  size="sm"
                  className="hover:text-secondary-accent p-0 text-xs text-[#777777]"
                  variant="link"
                  onClick={expandAll}
                >
                  Expand
                </Button>{' '}
                /{' '}
                <Button
                  size="sm"
                  className="hover:text-secondary-accent p-0 text-xs text-[#777777]"
                  variant="link"
                  onClick={collapseAll}
                >
                  Collapse
                </Button>
                )
              </span>
            </div>
          </div>
        )}

        {/* LIST */}
        {totalRetailers === 0 ? (
          <div className="text-muted-foreground py-12 text-center">
            <Store className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <p className="mb-2 text-lg font-medium">No retailers added yet</p>
            <p className="mb-4 text-sm">Add retailers where customers can purchase this product</p>
            <Button type="button" onClick={addRetailer}>
              <Plus className="mr-1 h-4 w-4" />
              Add Your First Retailer
            </Button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
              <div className="p-4">
                {fields.map((field, index) => {
                  const item = retailers[index];
                  if (!item) return null;

                  return (
                    <div key={field._key} className="flex items-start gap-2">
                      <div className="pt-3">
                        <Checkbox
                          checked={selectedIds.has(item.id)}
                          onCheckedChange={() => toggleSelected(item.id)}
                        />
                      </div>

                      <div className="flex-1">
                        <RetailerItem
                          index={index}
                          activeRetailers={active_retailers}
                          retailer={item}
                          isExpanded={expandedIds.has(item.id)}
                          onToggle={() => toggleExpanded(item.id)}
                          onRemove={() => removeRetailer(item.id, index)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/*Save Changes Button*/}
        {totalRetailers > 0 && (
          <div className="flex items-center justify-end gap-4 p-4">
            <Button
              onClick={() => {
                // Reset the form to the initial data (discard changes)
                reset({
                  productRetailers: product_retailers ?? [],
                });
              }}
              size="sm"
              variant="primary-outline"
              disabled={isLoadingSaveProductRetailers}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoadingSaveProductRetailers}
              size="sm"
              variant="primary"
            >
              {!isLoadingSaveProductRetailers ? (
                __('Save Changes', 'retailers-management-for-woocommerce')
              ) : (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
}

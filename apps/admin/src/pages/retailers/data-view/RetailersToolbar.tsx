import { useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import { Grid3X3, LayoutList, Search } from 'lucide-react';
import { __ } from '@wordpress/i18n';

import { DEFAULT_RETAILER_PAGINATION } from '@/lib/helpers/retailers.helper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

interface RetailersToolbarProps {
  totalItems: number;
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;

  onSearch: (keyword: string) => void;
  onStatusChange: (status: string) => void;
}

export function RetailersToolbar({
  totalItems,
  viewMode,
  onViewModeChange,
  onSearch,
  onStatusChange,
}: RetailersToolbarProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        onSearch(value);
      }, 500),
    [onSearch],
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onStatusChange(value);
  };

  return (
    <div className="flex items-center justify-end gap-4">
      <div className="flex gap-4">
        {/* Search */}
        {totalItems > DEFAULT_RETAILER_PAGINATION.pageSize && (
          <div className="relative w-sm">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder={__('Search retailer types...', 'retailers-management-for-woocommerce')}
              value={search}
              onChange={handleSearchChange}
              className="bg-primary-foreground h-10 w-full pl-10"
            />
          </div>
        )}

        {/* Status filter */}
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="border-input bg-background text-muted-foreground h-10! w-[160px] rounded-sm px-3 text-sm shadow-xs">
            {status === 'all' ? __('All Statuses', 'retailers-management-for-woocommerce') : status === '1' ? __('Active', 'retailers-management-for-woocommerce') : __('Inactive', 'retailers-management-for-woocommerce')}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{__('All Statuses', 'retailers-management-for-woocommerce')}</SelectItem>
            <SelectItem value="1">{__('Active', 'retailers-management-for-woocommerce')}</SelectItem>
            <SelectItem value="0">{__('Inactive', 'retailers-management-for-woocommerce')}</SelectItem>
          </SelectContent>
        </Select>

        {/* View toggle */}
        <div className="bg-primary-foreground ml-2 flex items-center gap-1 rounded-lg p-1">
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 px-3"
            onClick={() => onViewModeChange('list')}
          >
            <LayoutList className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-8 px-3"
            onClick={() => onViewModeChange('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

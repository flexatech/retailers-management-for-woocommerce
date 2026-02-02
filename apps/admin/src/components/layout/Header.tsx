import { useCallback, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Bolt, LayoutDashboard, ShoppingBag, Store, Tag } from 'lucide-react';
import { useMatch, useNavigate } from 'react-router-dom';

import { cn } from '@/lib/utils';
import { useScrolled } from '@/hooks/useScrolled';
import { HeaderNavMenuItem, HeaderNavMenuList } from '@/components/ui/navmenu-header';

const PRO_NAV_ITEMS = [
  { path: '/dashboard/*', to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
];

const BASE_NAV_ITEMS = [
  { path: '/retailers/*', to: '/retailers', icon: Store, label: 'Retailers' },
  { path: '/retailer-types/*', to: '/retailer-types', icon: Tag, label: 'Types' },
  { path: '/settings/*', to: '/settings', icon: Bolt, label: 'Settings' },
];

const NAV_ITEMS = [...PRO_NAV_ITEMS, ...BASE_NAV_ITEMS];

export default function Header() {
  const navigate = useNavigate();
  const scrolled = useScrolled();
  const [collapsed, setCollapsed] = useState(false);
  const handleNavClick = useCallback((to: string) => navigate(to), [navigate]);

  const baseItemClass =
    'flex cursor-pointer flex-row items-center gap-1.5 sm:flex-col md:flex-col lg:flex-row font-semibold';
  const activeItemClass =
    'text-primary border-primary hover:text-primary-accent hover:border-primary-accent focus-visible:text-primary-accent focus-visible:border-primary-accent';

  return (
    <header
      className={cn(
        'bg-background fixed z-50 flex h-[56px] w-full items-center justify-between pt-0 transition-shadow duration-300',
        scrolled ? 'top-0 shadow-[0_8px_8px_0_rgba(85,93,102,0.3)]' : 'top-[45px] shadow-none',
        'sm:top-[45px]',
        'md:top-8 md:pr-3',
        'lg:left-40 lg:w-[calc(100%-160px)]',
      )}
    >
      {/* Logo */}
      <div className="border-border flex h-full items-center gap-3 border-r px-4">
        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
          <ShoppingBag className="h-4 w-4" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in flex flex-col">
            <span className="text-foreground text-sm font-semibold">Retailers Management</span>
            <span className="text-muted-foreground text-[10px]">for WooCommerce</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <HeaderNavMenuList className="h-[54px] justify-start gap-5 pl-4 sm:gap-7.5">
        {NAV_ITEMS.map(({ path, to, icon: Icon, label }) => {
          const isActive = !!useMatch({ path });
          return (
            <HeaderNavMenuItem
              key={to}
              onClick={() => handleNavClick(to)}
              className={cn(baseItemClass, isActive && activeItemClass)}
            >
              <Icon className="size-5" />
              <span className="hidden sm:inline">{__(label)}</span>
            </HeaderNavMenuItem>
          );
        })}
      </HeaderNavMenuList>
    </header>
  );
}

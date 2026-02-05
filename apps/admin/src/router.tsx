import Retailers from '@/pages/retailers/Retailers';
import { createHashRouter, redirect, type RouteObject } from 'react-router-dom';

import AppLayout from './AppLayout';
import NotFoundPage from './pages/NotFound';
import RetailerTypes from './pages/retailer-types/RetailerTypes';
import Settings from './pages/settings/Settings';

const baseRoutes: RouteObject[] = [
  {
    index: true,
    loader: () => redirect('/retailers'),
  },
  {
    path: 'retailers',
    children: [
      { index: true, element: <Retailers /> },
      { path: 'new', element: <Retailers /> },
      { path: 'edit/:retailerId', element: <Retailers /> },
    ],
  },
  {
    path: 'retailer-types',
    children: [
      { index: true, element: <RetailerTypes /> },
      { path: 'new', element: <RetailerTypes /> },
      { path: 'edit/:retailerTypeId', element: <RetailerTypes /> },
    ],
  },
  {
    path: 'settings',
    element: <Settings />,
  },
];

export function getManagerRouter() {
  return createHashRouter([
    {
      path: '/',
      element: <AppLayout />,
      errorElement: <NotFoundPage />,
      children: baseRoutes,
    },
  ]);
}

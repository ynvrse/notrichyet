import { Coffee, Home, PlusCircle, Receipt, Settings } from 'lucide-react';

import asyncComponentLoader from '@/utils/loader';

import { Routes } from './types';

const routes: Routes = [
    {
        component: asyncComponentLoader(() => import('@/pages/Home')),
        path: '/',
        title: 'Home',
        icon: Home,
    },
    {
        component: asyncComponentLoader(() => import('@/pages/Expense')),
        path: '/expense',
        title: 'Expenses',
        icon: Receipt,
    },

    {
        component: asyncComponentLoader(() => import('@/pages/Add')),
        path: '/add',
        title: 'Add',
        icon: PlusCircle,
        center: true,
    },

    {
        component: asyncComponentLoader(() => import('@/pages/Hangout')),
        path: '/hangout',
        title: 'Nongki',
        icon: Coffee,
    },
    {
        component: asyncComponentLoader(() => import('@/pages/HangoutDetail')),
        path: '/hangout/:id',
        title: 'Hangout Detail',
        isHide: true,
    },
    {
        component: asyncComponentLoader(() => import('@/pages/Setting')),
        path: '/setting',
        title: 'Settings',
        icon: Settings,
        isHide: false,
    },

    {
        component: asyncComponentLoader(() => import('@/pages/NotFound')),
        path: '*',
    },
];

export default routes;

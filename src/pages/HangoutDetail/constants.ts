import {
    CarIcon,
    CoffeeIcon,
    GamepadIcon,
    HeartIcon,
    HomeIcon,
    MoreHorizontalIcon,
    ShoppingBagIcon,
} from 'lucide-react';

export const expenseIcons = [
    { icon: CoffeeIcon, label: 'Food & Drink', value: 'food' },
    { icon: CarIcon, label: 'Transport', value: 'transport' },
    { icon: ShoppingBagIcon, label: 'Shopping', value: 'shopping' },
    { icon: HomeIcon, label: 'Home', value: 'home' },
    { icon: GamepadIcon, label: 'Entertainment', value: 'entertainment' },
    { icon: HeartIcon, label: 'Health', value: 'health' },
    { icon: MoreHorizontalIcon, label: 'Others', value: 'others' },
];

export const quickAmounts = [10000, 25000, 50000, 100000, 250000, 500000];

export const splitMethods = [
    { value: 'treat', label: 'Treat', description: 'Host pays everything' },
    { value: 'equal', label: 'Equal Split', description: 'Split evenly among all participants' },
    // { value: 'percentage', label: 'Percentage', description: 'Split by custom percentages' },
    { value: 'manual', label: 'Manual', description: 'Custom amounts for each person' },
];

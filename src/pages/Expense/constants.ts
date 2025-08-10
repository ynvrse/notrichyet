import {
    CarIcon,
    CoffeeIcon,
    GamepadIcon,
    HeartIcon,
    HomeIcon,
    MoreHorizontalIcon,
    ShoppingBagIcon,
} from 'lucide-react';

export const expenseIcons = {
    food: { icon: CoffeeIcon, label: 'Food & Drink', color: 'text-orange-500' },
    transport: { icon: CarIcon, label: 'Transport', color: 'text-blue-500' },
    shopping: { icon: ShoppingBagIcon, label: 'Shopping', color: 'text-pink-500' },
    home: { icon: HomeIcon, label: 'Home', color: 'text-green-500' },
    entertainment: { icon: GamepadIcon, label: 'Entertainment', color: 'text-purple-500' },
    health: { icon: HeartIcon, label: 'Health', color: 'text-red-500' },
    others: { icon: MoreHorizontalIcon, label: 'Others', color: 'text-gray-500' },
};

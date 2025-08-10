import { ExpenseForm } from './components';
import { ExpenseProps } from './types';

export function Expense({ userId }: ExpenseProps) {
    return <ExpenseForm userId={userId} />;
}

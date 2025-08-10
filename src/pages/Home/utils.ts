
export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

export const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
    }).format(new Date(date));
};

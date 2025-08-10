
export const generateJoinCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(Number(amount));
};

export const formatCategoryName = (category) => {
  if (!category) return 'Other';
  return category
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const formatRecurrence = (recurrence) => {
  if (!recurrence) return 'Monthly';
  switch (recurrence.toUpperCase()) {
    case 'DAILY': return 'Daily';
    case 'WEEKLY': return 'Weekly';
    case 'MONTHLY': return 'Monthly';
    case 'YEARLY': return 'Yearly';
    case 'ONE_TIME': return 'One-time';
    default: return recurrence;
  }
};

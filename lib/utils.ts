import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '';

  return process.env.NEXT_PUBLIC_URL;
};

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export const getReviewAverage = (reviews: number[]) => {
  if (!reviews.length) return 0;
  return reviews.reduce((acc, review) => acc + review, 0) / reviews.length;
};

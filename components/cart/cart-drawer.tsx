'use client';

import { useCartStore } from '@/lib/client-store';
import { ShoppingBagIcon } from 'lucide-react';

export const CartDrawer = () => {
  const { cart, addToCart } = useCartStore();

  return (
    <div>
      <ShoppingBagIcon />
    </div>
  );
};

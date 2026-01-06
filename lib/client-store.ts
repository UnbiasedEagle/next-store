import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Variant {
  variantId: number;
  quantity: number;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  variant: Variant;
  image: string;
}

export interface CartState {
  cart: CartItem[];
  checkoutProgress: 'cart-page' | 'payment-page' | 'confirmation-page';
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    devtools(
      (set) => ({
        cart: [],
        checkoutProgress: 'cart-page',
        addToCart: (item: CartItem) =>
          set((state) => {
            // Find if the item with the same id and variantId exists in the cart
            const existingItemIndex = state.cart.findIndex(
              (cartItem) =>
                cartItem.id === item.id &&
                cartItem.variant.variantId === item.variant.variantId
            );

            if (existingItemIndex !== -1) {
              // If item exists, update its quantity
              return {
                cart: state.cart.map((cartItem, idx) =>
                  idx === existingItemIndex
                    ? {
                        ...cartItem,
                        variant: {
                          ...cartItem.variant,
                          quantity:
                            cartItem.variant.quantity + item.variant.quantity,
                        },
                      }
                    : cartItem
                ),
              };
            } else {
              // If item does not exist, add it to the cart
              return {
                cart: [...state.cart, item],
              };
            }
          }),
        removeFromCart: (item: CartItem) =>
          set((state) => {
            return {
              cart: state.cart.filter(
                (cartItem) =>
                  cartItem.id !== item.id &&
                  cartItem.variant.variantId !== item.variant.variantId
              ),
            };
          }),
      }),
      { name: 'cart-store' }
    ),
    {
      name: 'cart-storage',
    }
  )
);

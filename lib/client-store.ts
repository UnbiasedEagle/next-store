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
  setCheckoutProgress: (
    progress: 'cart-page' | 'payment-page' | 'confirmation-page'
  ) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    devtools(
      (set) => ({
        cart: [],
        cartOpen: false,
        clearCart: () => set({ cart: [] }),
        setCartOpen: (open: boolean) => set({ cartOpen: open }),
        checkoutProgress: 'cart-page',
        setCheckoutProgress: (
          progress: 'cart-page' | 'payment-page' | 'confirmation-page'
        ) =>
          set({
            checkoutProgress: progress,
          }),
        addToCart: (item: CartItem) =>
          set((state) => {
            const existingItemIndex = state.cart.findIndex(
              (cartItem) =>
                cartItem.id === item.id &&
                cartItem.variant.variantId === item.variant.variantId
            );

            if (existingItemIndex !== -1) {
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
              return {
                cart: [...state.cart, item],
              };
            }
          }),
        removeFromCart: (item: CartItem) =>
          set((state) => {
            const updatedCart = state.cart
              .map((cartItem) => {
                if (
                  cartItem.id === item.id &&
                  cartItem.variant.variantId === item.variant.variantId
                ) {
                  return {
                    ...cartItem,
                    variant: {
                      ...cartItem.variant,
                      quantity: cartItem.variant.quantity - 1,
                    },
                  };
                }
                return cartItem;
              })
              .filter((cartItem) => cartItem.variant.quantity > 0);
            return {
              cart: updatedCart,
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

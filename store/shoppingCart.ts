import { create } from 'zustand';

type CartItem = {
  sku: string;
  name: string;
  image: string;
  price?: number;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (product: Omit<CartItem, 'quantity'>) => void;
  removeItem: (sku: string) => void;
  increaseQuantity: (sku: string) => void;
  decreaseQuantity: (sku: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (product) => {
    set((state) => {
      const existing = state.items.findIndex(item => item.sku === product.sku);

      if (existing !== -1) {
        // Increase quantity if already in cart
        const updated = [...state.items];
        updated[existing].quantity += 1;
        return { items: updated };
      } else {
        return {
          items: [...state.items, { ...product, quantity: 1 }]
        };
      }
    });
  },

  removeItem: (sku) => set((state) => ({
    items: state.items.filter(item => item.sku !== sku)
  })),

  increaseQuantity: (sku) => set((state) => {
    const updated = state.items.map(item =>
      item.sku === sku ? { ...item, quantity: item.quantity + 1 } : item
    );
    return { items: updated };
  }),

  decreaseQuantity: (sku) => set((state) => {
    const updated = state.items.map(item =>
      item.sku === sku && item.quantity > 1 
        ? { ...item, quantity: item.quantity - 1 } 
        : item
    ).filter(item => item.quantity > 0);
    return { items: updated };
  }),

  clearCart: () => set({ items: [] }),

  get totalItems() {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  get totalPrice() {
    return get().items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  },
}));

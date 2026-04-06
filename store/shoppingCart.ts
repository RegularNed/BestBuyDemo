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
  totalItems: 0,
  totalPrice: 0,

  calculateTotals: (items: CartItem[]) => ({
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0),
  }),

  addItem: (product) => {
    set((state) => {
      let newItems: CartItem[];
      const existingIndex = state.items.findIndex(item => item.sku === product.sku);

    if (existingIndex !== -1) {
      // Update existing item
      newItems = [...state.items];
      newItems[existingIndex] = {
        ...newItems[existingIndex],
        quantity: newItems[existingIndex].quantity + 1,
      };
    } else {
      // Add new item
      newItems = [...state.items, { ...product, quantity: 1 }];
    }

      const newTotalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const newTotalPrice = newItems.reduce(
        (sum, item) => sum + (item.price || 0) * item.quantity,
        0
      );

      return {
        items: newItems,
        totalItems: newTotalItems,
        totalPrice: newTotalPrice,
      };
    });
  },

  removeItem: (sku) => set((state) => ({
    items: state.items.filter(item => item.sku !== sku)
  })),

  increaseQuantity: (sku: string) => {
    set((state) => {
      const newItems = state.items.map(item =>
        item.sku === sku 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      );

      const { totalItems, totalPrice } = state.calculateTotals(newItems);

      return { items: newItems, totalItems, totalPrice };
    });
  },

  decreaseQuantity: (sku: string) => {
    set((state) => {
      const newItems = state.items
        .map(item =>
          item.sku === sku && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0);   // remove if quantity becomes 0

      const { totalItems, totalPrice } = state.calculateTotals(newItems);

      return { items: newItems, totalItems, totalPrice };
    });
  },

  removeItem: (sku: string) => {
    set((state) => {
      const newItems = state.items.filter(item => item.sku !== sku);
      const { totalItems, totalPrice } = state.calculateTotals(newItems);

      return { items: newItems, totalItems, totalPrice };
    });
  },

  clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),

}));

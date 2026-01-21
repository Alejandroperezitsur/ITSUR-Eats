import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { productService, orderService } from '@services/product.service';
import { Product, Category, Order } from '@types/index';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

interface ProductState {
  categories: Category[];
  products: Product[];
  cart: CartState;
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  categories: [],
  products: [],
  cart: {
    items: [],
    total: 0,
  },
  selectedOrder: null,
  loading: false,
  error: null,
};

// Thunks
export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await productService.getCategories();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (
    {
      page = 1,
      limit = 10,
      categoryId,
      search,
    }: { page?: number; limit?: number; categoryId?: string; search?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      return await productService.getProducts(page, limit, categoryId, search);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const existing = state.cart.items.find((item) => item.product.id === action.payload.product.id);

      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.cart.items.push(action.payload);
      }

      // Recalcular total
      state.cart.total = state.cart.items.reduce((sum, item) => {
        return sum + parseFloat(item.product.price) * item.quantity;
      }, 0);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart.items = state.cart.items.filter((item) => item.product.id !== action.payload);

      state.cart.total = state.cart.items.reduce((sum, item) => {
        return sum + parseFloat(item.product.price) * item.quantity;
      }, 0);
    },

    updateCartQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.cart.items.find((item) => item.product.id === action.payload.productId);
      if (item) {
        item.quantity = action.payload.quantity;
      }

      state.cart.total = state.cart.items.reduce((sum, item) => {
        return sum + parseFloat(item.product.price) * item.quantity;
      }, 0);
    },

    clearCart: (state) => {
      state.cart.items = [];
      state.cart.total = 0;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart, clearError } =
  productSlice.actions;

export default productSlice.reducer;

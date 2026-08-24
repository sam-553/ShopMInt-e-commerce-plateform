import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import axios from "axios";

axios.defaults.baseURL =
  `${import.meta.env.VITE_BASE_URL}`;

axios.defaults.withCredentials = true;

export const addtoCart =
  createAsyncThunk(
    "cart/addtoCart",

    async (
      { id, quantity },
      { rejectWithValue }
    ) => {

      try {

        const { data } =
          await axios.get(
            `/api/product/getproductdetails/${id}`
          );

        const product =
          data?.product;

        if (!product) {
          return rejectWithValue(
            "Product not found"
          );
        }

        return {
          product: product._id,
          name: product.name,
          price: product.price,
          image:
            product.image?.[0]?.url ||
            product.image?.[0] ||
            "",
          stock: product.stock,
          quantity,
        };

      } catch (error) {

        return rejectWithValue(
          error.response?.data?.message ||
          "Failed to add product to cart"
        );
      }
    }
  );

const getStorage = (key, fallback) => {

  if (
    typeof window === "undefined"
  ) {
    return fallback;
  }

  try {

    const value =
      localStorage.getItem(key);

    return value
      ? JSON.parse(value)
      : fallback;

  } catch {

    return fallback;
  }
};

const cartSlice = createSlice({

  name: "cart",

  initialState: {

    cartItems: getStorage(
      "cartItems",
      []
    ),

    shippingInfo: getStorage(
      "shippingInfo",
      {}
    ),

    loading: false,
    success: false,
    error: null,
    message: null,
  },

  reducers: {

    removeError: (state) => {
      state.error = null;
    },

    removeMessage: (state) => {
      state.message = null;
    },

    removeFromCart: (
      state,
      action
    ) => {

      state.cartItems =
        state.cartItems.filter(
          (item) =>
            item.product !==
            action.payload
        );

      if (
        typeof window !== "undefined"
      ) {

        localStorage.setItem(
          "cartItems",
          JSON.stringify(
            state.cartItems
          )
        );
      }
    },

    clearCart: (state) => {

      state.cartItems = [];
      state.shippingInfo = {};

      if (
        typeof window !== "undefined"
      ) {

        localStorage.removeItem(
          "cartItems"
        );

        localStorage.removeItem(
          "shippingInfo"
        );
      }
    },

    saveShippingInfo: (
      state,
      action
    ) => {

      state.shippingInfo =
        action.payload;

      if (
        typeof window !== "undefined"
      ) {

        localStorage.setItem(
          "shippingInfo",
          JSON.stringify(
            state.shippingInfo
          )
        );
      }
    },
  },

  extraReducers: (builder) => {

    builder

      .addCase(
        addtoCart.pending,
        (state) => {

          state.loading = true;
          state.error = null;
          state.success = false;
        }
      )

      .addCase(
        addtoCart.fulfilled,
        (state, action) => {

          const item =
            action.payload;

          const existing =
            state.cartItems.find(
              (i) =>
                i.product ===
                item.product
            );

          if (existing) {

            existing.quantity =
              item.quantity;

            state.message =
              `${item.name} quantity updated.`;

          } else {

            state.cartItems.push(
              item
            );

            state.message =
              `${item.name} added to cart.`;
          }

          state.loading = false;
          state.success = true;

          if (
            typeof window !== "undefined"
          ) {

            localStorage.setItem(
              "cartItems",
              JSON.stringify(
                state.cartItems
              )
            );
          }
        }
      )

      .addCase(
        addtoCart.rejected,
        (state, action) => {

          state.loading = false;

          state.error =
            action.payload ||
            "Failed to add product to cart";
        }
      );
  },
});

export const {
  removeError,
  removeMessage,
  removeFromCart,
  saveShippingInfo,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
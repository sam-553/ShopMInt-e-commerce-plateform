import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import { api } from "../user/userSlice";

const getError = (
  error,
  fallback
) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.message ||
  fallback;

// CREATE ORDER
export const createNewOrder =
  createAsyncThunk(
    "order/createOrder",
    async (
      order,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await api.post(
            "/api/order/createOrder",
            order
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          getError(
            error,
            "Order creation failed"
          )
        );
      }
    }
  );

// MY ORDERS
export const getAllMyOrders =
  createAsyncThunk(
    "order/getAllMyOrders",
    async (
      _,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await api.get(
            "/api/order/allMyOrders"
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          getError(
            error,
            "Failed to fetch orders"
          )
        );
      }
    }
  );

// SINGLE ORDER
export const getSingleOrder =
  createAsyncThunk(
    "order/getSingleOrder",
    async (
      id,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await api.get(
            `/api/order/getSingleOrder/${id}`
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          getError(
            error,
            "Failed to fetch order"
          )
        );
      }
    }
  );

const orderSlice =
  createSlice({
    name: "order",

    initialState: {
      orders: [],
      order: {},
      loading: false,
      error: null,
      success: false,
    },

    reducers: {
      removeError: (
        state
      ) => {
        state.error = null;
      },

      removeSuccess: (
        state
      ) => {
        state.success = false;
      },
    },

    extraReducers: (
      builder
    ) => {

      // CREATE ORDER
      builder
        .addCase(
          createNewOrder.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          createNewOrder.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.success =
              action.payload
                ?.success;

            state.order =
              action.payload
                ?.order || {};
          }
        )

        .addCase(
          createNewOrder.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.error =
              action.payload;
          }
        );

      // ALL MY ORDERS
      builder
        .addCase(
          getAllMyOrders.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          getAllMyOrders.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.success =
              action.payload
                ?.success;

            state.orders =
              action.payload
                ?.orders || [];
          }
        )

        .addCase(
          getAllMyOrders.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.error =
              action.payload;
          }
        );

      // SINGLE ORDER
      builder
        .addCase(
          getSingleOrder.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          getSingleOrder.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.success =
              action.payload
                ?.success;

            state.order =
              action.payload
                ?.order || {};
          }
        )

        .addCase(
          getSingleOrder.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.error =
              action.payload;
          }
        );
    },
  });

export const {
  removeError,
  removeSuccess,
} =
  orderSlice.actions;

export default orderSlice.reducer;
import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import { api } from "../user/userSlice";

// --------------------------------
// ERROR HELPER
// --------------------------------
const extractError = (
  error,
  fallback
) => {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    fallback
  );
};

// --------------------------------
// ADMIN PRODUCTS
// --------------------------------
export const fetchAdminProducts =
  createAsyncThunk(
    "admin/fetchAdminProducts",
    async (
      _,
      { rejectWithValue }
    ) => {
      try {
        const { data } =
          await api.get(
            "/api/product/getAdminProducts"
          );

        return data;
      } catch (error) {
        return rejectWithValue(
          extractError(
            error,
            "Failed to fetch products"
          )
        );
      }
    }
  );

// --------------------------------
// ADD PRODUCT
// --------------------------------
export const uploadProducts =
  createAsyncThunk(
    "admin/uploadProducts",
    async (
      productData,
      { rejectWithValue }
    ) => {
      try {
        const { data } =
          await api.post(
            "/api/product/addproduct",
            productData
          );

        return data;
      } catch (error) {
        return rejectWithValue(
          extractError(
            error,
            "Failed to create product"
          )
        );
      }
    }
  );

// --------------------------------
// DELETE PRODUCT
// --------------------------------
export const deleteProduct =
  createAsyncThunk(
    "admin/deleteProduct",
    async (
      id,
      { rejectWithValue }
    ) => {
      try {
        const { data } =
          await api.delete(
            `/api/product/deleteproduct/${id}`
          );

        return data;
      } catch (error) {
        return rejectWithValue(
          extractError(
            error,
            "Failed to delete product"
          )
        );
      }
    }
  );

// --------------------------------
// UPDATE PRODUCT
// --------------------------------
export const updateProduct =
  createAsyncThunk(
    "admin/updateProduct",
    async (
      { id, formData },
      { rejectWithValue }
    ) => {
      try {
        const { data } =
          await api.put(
            `/api/product/updateproduct/${id}`,
            formData
          );

        return data;
      } catch (error) {
        return rejectWithValue(
          extractError(
            error,
            "Failed to update product"
          )
        );
      }
    }
  );

// --------------------------------
// ALL USERS
// --------------------------------
export const fetchAllUsers =
  createAsyncThunk(
    "admin/fetchAllUsers",
    async (
      _,
      { rejectWithValue }
    ) => {
      try {
        const { data } =
          await api.get(
            "/api/user/getUsersList"
          );

        return data;
      } catch (error) {
        return rejectWithValue(
          extractError(
            error,
            "Failed to fetch users"
          )
        );
      }
    }
  );

// --------------------------------
// DELETE USER
// --------------------------------
export const deleteuser =
  createAsyncThunk(
    "admin/deleteuser",
    async (
      id,
      { rejectWithValue }
    ) => {
      try {
        const { data } =
          await api.delete(
            `/api/user/deleteUser/${id}`
          );

        return data;
      } catch (error) {
        return rejectWithValue(
          extractError(
            error,
            "Failed to delete user"
          )
        );
      }
    }
  );

// --------------------------------
// SINGLE USER
// --------------------------------
export const getSingleUser =
  createAsyncThunk(
    "admin/getSingleUser",
    async (
      id,
      { rejectWithValue }
    ) => {
      try {
        const { data } =
          await api.get(
            `/api/user/getSingleUser/${id}`
          );

        return data;
      } catch (error) {
        return rejectWithValue(
          extractError(
            error,
            "Failed to fetch user"
          )
        );
      }
    }
  );

// --------------------------------
// UPDATE USER ROLE
// --------------------------------
export const updateUserRole =
  createAsyncThunk(
    "admin/updateUserRole",
    async (
      { id, formData },
      { rejectWithValue }
    ) => {
      try {
        const { data } =
          await api.put(
            `/api/user/updateUserRole/${id}`,
            formData
          );

        return data;
      } catch (error) {
        return rejectWithValue(
          extractError(
            error,
            "Failed to update user"
          )
        );
      }
    }
  );

// --------------------------------
// ALL ORDERS
// --------------------------------
export const fetchAllOrders =
  createAsyncThunk(
    "admin/fetchAllOrders",
    async (
      _,
      { rejectWithValue }
    ) => {
      try {
        const { data } =
          await api.get(
            "/api/order/getAllOrders"
          );

        return data;
      } catch (error) {
        return rejectWithValue(
          extractError(
            error,
            "Failed to fetch orders"
          )
        );
      }
    }
  );

// --------------------------------
// UPDATE ORDER
// --------------------------------
export const updateOrderStatus =
  createAsyncThunk(
    "admin/updateOrderStatus",
    async (
      { orderId, status },
      { rejectWithValue }
    ) => {
      try {
        const { data } =
          await api.put(
            `/api/order/updateOrderStatus/${orderId}`,
            { status }
          );

        return data;
      } catch (error) {
        return rejectWithValue(
          extractError(
            error,
            "Error updating order"
          )
        );
      }
    }
  );

// --------------------------------
// DELETE ORDER
// --------------------------------
export const deleteOrder =
  createAsyncThunk(
    "admin/deleteOrder",
    async (
      id,
      { rejectWithValue }
    ) => {
      try {
        const { data } =
          await api.delete(
            `/api/order/deleteOrder/${id}`
          );

        return data;
      } catch (error) {
        return rejectWithValue(
          extractError(
            error,
            "Failed to delete order"
          )
        );
      }
    }
  );

// --------------------------------
// ALL REVIEWS
// --------------------------------
export const fetchAllReviews =
  createAsyncThunk(
    "admin/fetchAllReviews",
    async (
      _,
      { rejectWithValue }
    ) => {
      try {
        const { data } =
          await api.get(
            "/api/product/getProductReviews"
          );

        return data;
      } catch (error) {
        return rejectWithValue(
          extractError(
            error,
            "Failed to fetch reviews"
          )
        );
      }
    }
  );

// --------------------------------
// DELETE REVIEW
// --------------------------------
export const deleteReviews =
  createAsyncThunk(
    "admin/deleteReviews",
    async (
      {
        productId,
        reviewId,
      },
      { rejectWithValue }
    ) => {
      try {
        const { data } =
          await api.delete(
            `/api/product/deleteReview/${productId}/${reviewId}`
          );

        return data;
      } catch (error) {
        return rejectWithValue(
          extractError(
            error,
            "Failed to delete review"
          )
        );
      }
    }
  );

// --------------------------------
// SINGLE PRODUCT REVIEWS
// --------------------------------
export const fetchSingleProductReviews =
  createAsyncThunk(
    "admin/fetchSingleProductReviews",
    async (
      productId,
      { rejectWithValue }
    ) => {
      try {
        const { data } =
          await api.get(
            `/api/product/getSingleProductReviews/${productId}`
          );

        return data;
      } catch (error) {
        return rejectWithValue(
          extractError(
            error,
            "Failed to fetch reviews"
          )
        );
      }
    }
  );

// --------------------------------
// SLICE
// --------------------------------
const adminSlice =
  createSlice({
    name: "admin",

    initialState: {
      products: [],
      users: [],
      loading: false,
      error: null,
      success: false,
      product: {},
      user: {},
      message: null,
      orders: [],
      order: {},
      reviews: [],
      review: {},
      totalAmount: 0,
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

      clearmessage: (
        state
      ) => {
        state.message = null;
      },
    },

    extraReducers: (
      builder
    ) => {

      // PRODUCTS
      builder
        .addCase(
          fetchAdminProducts.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchAdminProducts.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.products =
              action.payload
                ?.products || [];
          }
        )

        .addCase(
          fetchAdminProducts.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.error =
              action.payload;
          }
        );

      // ADD PRODUCT
      builder
        .addCase(
          uploadProducts.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          uploadProducts.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            if (
              action.payload?.product
            ) {
              state.products.push(
                action.payload.product
              );
            }

            state.success = true;
            state.error = null;
          }
        )

        .addCase(
          uploadProducts.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.error =
              action.payload;
          }
        );

      // DELETE PRODUCT
      builder
        .addCase(
          deleteProduct.pending,
          (state) => {
            state.loading = true;
          }
        )

        .addCase(
          deleteProduct.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            const deletedId =
              action.payload
                ?.deletedProductId;

            if (deletedId) {
              state.products =
                state.products.filter(
                  (product) =>
                    product._id !==
                    deletedId
                );
            }

            state.success = true;
          }
        )

        .addCase(
          deleteProduct.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.error =
              action.payload;
          }
        );

      // UPDATE PRODUCT
      builder
        .addCase(
          updateProduct.pending,
          (state) => {
            state.loading = true;
          }
        )

        .addCase(
          updateProduct.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            const updated =
              action.payload
                ?.product;

            if (updated?._id) {
              state.products =
                state.products.map(
                  (product) =>
                    product._id ===
                    updated._id
                      ? updated
                      : product
                );
            }

            state.success = true;
          }
        )

        .addCase(
          updateProduct.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.error =
              action.payload;
          }
        );

      // USERS
      builder
        .addCase(
          fetchAllUsers.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.users =
              action.payload
                ?.users || [];
          }
        )

        .addCase(
          fetchAllUsers.pending,
          (state) => {
            state.loading = true;
          }
        )

        .addCase(
          fetchAllUsers.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.error =
              action.payload;
          }
        );

      // SINGLE USER
      builder
        .addCase(
          getSingleUser.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.user =
              action.payload
                ?.user || {};
          }
        )

        .addCase(
          getSingleUser.pending,
          (state) => {
            state.loading = true;
          }
        )

        .addCase(
          getSingleUser.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.error =
              action.payload;
          }
        );

      // DELETE USER
      builder
        .addCase(
          deleteuser.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            const deletedId =
              action.payload
                ?.deleteduserId;

            if (deletedId) {
              state.users =
                state.users.filter(
                  (user) =>
                    user._id !==
                    deletedId
                );
            }

            state.success = true;
          }
        )

        .addCase(
          deleteuser.pending,
          (state) => {
            state.loading = true;
          }
        )

        .addCase(
          deleteuser.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.error =
              action.payload;
          }
        );

      // UPDATE ROLE
      builder
        .addCase(
          updateUserRole.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.success = true;
            state.message =
              action.payload
                ?.message || null;
          }
        )

        .addCase(
          updateUserRole.pending,
          (state) => {
            state.loading = true;
          }
        )

        .addCase(
          updateUserRole.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.error =
              action.payload;
          }
        );

      // ORDERS
      builder
        .addCase(
          fetchAllOrders.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.orders =
              action.payload
                ?.orders || [];

            state.totalAmount =
              state.orders.reduce(
                (sum, order) =>
                  sum +
                  (order.totalPrice ||
                    0),
                0
              );
          }
        )

        .addCase(
          fetchAllOrders.pending,
          (state) => {
            state.loading = true;
          }
        )

        .addCase(
          fetchAllOrders.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.error =
              action.payload;
          }
        );

      // UPDATE ORDER
      builder
        .addCase(
          updateOrderStatus.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.success = true;
            state.order =
              action.payload?.order ||
              {};
          }
        )

        .addCase(
          updateOrderStatus.pending,
          (state) => {
            state.loading = true;
          }
        )

        .addCase(
          updateOrderStatus.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.error =
              action.payload;
          }
        );

      // DELETE ORDER
      builder
        .addCase(
          deleteOrder.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.success = true;

            const deletedId =
              action.payload
                ?.deletedOrderId;

            if (deletedId) {
              state.orders =
                state.orders.filter(
                  (order) =>
                    order._id !==
                    deletedId
                );
            }
          }
        )

        .addCase(
          deleteOrder.pending,
          (state) => {
            state.loading = true;
          }
        )

        .addCase(
          deleteOrder.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.error =
              action.payload;
          }
        );

      // REVIEWS
      builder
        .addCase(
          fetchAllReviews.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.reviews =
              action.payload
                ?.reviews || [];

            state.success =
              Boolean(
                action.payload?.success
              );
          }
        )

        .addCase(
          fetchAllReviews.pending,
          (state) => {
            state.loading = true;
          }
        )

        .addCase(
          fetchAllReviews.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.error =
              action.payload;
          }
        );

      // DELETE REVIEW
      builder
        .addCase(
          deleteReviews.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.success = true;

            const deletedId =
              action.payload
                ?.deletedReviewId;

            if (deletedId) {
              state.reviews =
                state.reviews.filter(
                  (review) =>
                    review._id !==
                    deletedId
                );
            }
          }
        )

        .addCase(
          deleteReviews.pending,
          (state) => {
            state.loading = true;
          }
        )

        .addCase(
          deleteReviews.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.error =
              action.payload;
          }
        );

      // SINGLE PRODUCT REVIEWS
      builder
        .addCase(
          fetchSingleProductReviews.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.review =
              action.payload
                ?.review ||
              {};

            state.success =
              Boolean(
                action.payload?.success
              );
          }
        )

        .addCase(
          fetchSingleProductReviews.pending,
          (state) => {
            state.loading = true;
          }
        )

        .addCase(
          fetchSingleProductReviews.rejected,
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
  clearmessage,
} =
  adminSlice.actions;

export default adminSlice.reducer;
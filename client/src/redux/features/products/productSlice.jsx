import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL =
  "http://localhost:5000/api/product";

export const getproduct = createAsyncThunk(
  "product/getproduct",

  async (
    {
      keyword = "",
      page = 1,
      category = "",
    } = {},
    { rejectWithValue }
  ) => {

    try {

      const params = new URLSearchParams();

      params.append("page", page);

      if (keyword) {
        params.append(
          "keyword",
          keyword
        );
      }

      if (category) {
        params.append(
          "category",
          category
        );
      }

      const { data } =
        await axios.get(
          `${BASE_URL}/getAllProduct?${params.toString()}`
        );

      return data;

    } catch (error) {

      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch products"
      );
    }
  }
);

export const getproductDetails =
  createAsyncThunk(
    "product/getproductDetails",

    async (id, { rejectWithValue }) => {

      try {

        const { data } =
          await axios.get(
            `${BASE_URL}/getproductdetails/${id}`
          );

        return data;

      } catch (error) {

        return rejectWithValue(
          error.response?.data?.message ||
          "Failed to fetch product"
        );
      }
    }
  );

export const createReview =
  createAsyncThunk(
    "product/createReview",

    async (
      { rating, comment, productId },
      { rejectWithValue }
    ) => {

      try {

        const { data } =
          await axios.put(
            `${BASE_URL}/createReviewForProduct`,
            {
              rating,
              comment,
              productId,
            }
          );

        return data;

      } catch (error) {

        return rejectWithValue(
          error.response?.data?.message ||
          "Failed to create review"
        );
      }
    }
  );

const initialState = {
  product: [],
  productDetails: null,
  productCount: 0,
  loading: false,
  error: null,
  resultPerPage: 0,
  totalpages: 0,
  reviewLoading: false,
  reviewSuccess: false,
};

const productSlice = createSlice({

  name: "product",

  initialState,

  reducers: {

    removeError: (state) => {
      state.error = null;
    },

    removeSuccess: (state) => {
      state.reviewSuccess = false;
    },

  },

  extraReducers: (builder) => {

    builder

      .addCase(
        getproduct.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getproduct.fulfilled,
        (state, action) => {

          state.loading = false;

          state.product =
            Array.isArray(
              action.payload?.product
            )
              ? action.payload.product
              : [];

          state.productCount =
            action.payload?.productCount || 0;

          state.resultPerPage =
            action.payload?.resultPerPage || 0;

          state.totalpages =
            action.payload?.totalpages || 0;
        }
      )

      .addCase(
        getproduct.rejected,
        (state, action) => {

          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch products";
        }
      )

      .addCase(
        getproductDetails.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getproductDetails.fulfilled,
        (state, action) => {

          state.loading = false;

          state.productDetails =
            action.payload?.product ||
            null;
        }
      )

      .addCase(
        getproductDetails.rejected,
        (state, action) => {

          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch product";
        }
      )

      .addCase(
        createReview.pending,
        (state) => {

          state.reviewLoading = true;
          state.error = null;
        }
      )

      .addCase(
        createReview.fulfilled,
        (state) => {

          state.reviewLoading = false;
          state.reviewSuccess = true;
        }
      )

      .addCase(
        createReview.rejected,
        (state, action) => {

          state.reviewLoading = false;

          state.error =
            action.payload ||
            "Failed to create review";
        }
      );
  },
});

export const {
  removeError,
  removeSuccess,
} = productSlice.actions;

export default productSlice.reducer;
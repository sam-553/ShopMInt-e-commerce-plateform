import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import axios from "axios";

const API =
  import.meta.env.VITE_BASE_URL;

// --------------------------------
// AXIOS INSTANCE
// --------------------------------
export const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

// --------------------------------
// ADD AUTHORIZATION TOKEN
// --------------------------------
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    config.withCredentials = true;

    console.log(
      "API REQUEST:",
      config.method?.toUpperCase(),
      config.baseURL + config.url
    );

    console.log(
      "HAS TOKEN:",
      Boolean(token)
    );

    return config;
  },
  (error) =>
    Promise.reject(error)
);

// --------------------------------
// ERROR
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
// REGISTER
// --------------------------------
export const register =
  createAsyncThunk(
    "user/register",
    async (
      userdata,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await api.post(
            "/api/user/registerUser",
            userdata
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          extractError(
            error,
            "Registration failed"
          )
        );
      }
    }
  );

// --------------------------------
// LOGIN
// --------------------------------
export const login =
  createAsyncThunk(
    "user/login",
    async (
      userdata,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await api.post(
            "/api/user/loginUser",
            userdata
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          extractError(
            error,
            "Login failed"
          )
        );
      }
    }
  );

// --------------------------------
// LOAD USER
// --------------------------------
export const loadUser =
  createAsyncThunk(
    "user/loadUser",
    async (
      _,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await api.get(
            "/api/user/getuserDetails"
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          extractError(
            error,
            "Failed to load profile"
          )
        );
      }
    }
  );

// --------------------------------
// LOGOUT
// --------------------------------
export const logout =
  createAsyncThunk(
    "user/logout",
    async (
      _,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await api.post(
            "/api/user/logout"
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          extractError(
            error,
            "Logout failed"
          )
        );
      }
    }
  );

// --------------------------------
// UPDATE PROFILE
// --------------------------------
export const updateUser =
  createAsyncThunk(
    "user/update",
    async (
      userdata,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await api.put(
            "/api/user/updateProfile",
            userdata
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          extractError(
            error,
            "Profile update failed"
          )
        );
      }
    }
  );

// --------------------------------
// REQUEST RESET
// --------------------------------
export const requestResetPassword =
  createAsyncThunk(
    "user/requestResetPassword",
    async (
      userdata,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await api.post(
            "/api/user/requestresetpassword",
            userdata
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          extractError(
            error,
            "Reset request failed"
          )
        );
      }
    }
  );

// --------------------------------
// UPDATE PASSWORD
// --------------------------------
export const updatePassword =
  createAsyncThunk(
    "user/updatePassword",
    async (
      userdata,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await api.put(
            "/api/user/updatePassword",
            userdata
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          extractError(
            error,
            "Password update failed"
          )
        );
      }
    }
  );

// --------------------------------
// RESET PASSWORD
// --------------------------------
export const resetPassword =
  createAsyncThunk(
    "user/resetPassword",
    async (
      {
        token,
        password,
        confirmPassword,
      },
      { rejectWithValue }
    ) => {
      try {
        const response =
          await api.put(
            `/api/user/resetPassword/${token}`,
            {
              password,
              confirmPassword,
            }
          );

        return response.data;
      } catch (error) {
        return rejectWithValue(
          extractError(
            error,
            "Password reset failed"
          )
        );
      }
    }
  );

const initialState = {
  loading: false,
  error: null,
  user: null,
  isAuthenticated: false,
  success: false,
  message: null,
};

const userSlice =
  createSlice({
    name: "user",

    initialState,

    reducers: {
      removeError: (state) => {
        state.error = null;
      },

      removeSuccess: (state) => {
        state.success = false;
      },

      resetUser: (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        state.success = false;
        state.message = null;
      },
    },

    extraReducers: (
      builder
    ) => {
      const pending = (
        state
      ) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      };

      const rejected = (
        state,
        action
      ) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Something went wrong";
        state.success = false;
      };

      // REGISTER
      builder
        .addCase(
          register.pending,
          pending
        )

        .addCase(
          register.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.user =
              action.payload?.user ||
              null;

            state.isAuthenticated =
              Boolean(
                state.user
              );

            state.success = true;
            state.error = null;

            state.message =
              action.payload
                ?.message ||
              null;

            // Save token
            if (
              action.payload?.token
            ) {
              localStorage.setItem(
                "token",
                action.payload.token
              );
            }
          }
        )

        .addCase(
          register.rejected,
          rejected
        );

      // LOGIN
      builder
        .addCase(
          login.pending,
          pending
        )

        .addCase(
          login.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.user =
              action.payload?.user ||
              null;

            state.isAuthenticated =
              Boolean(
                state.user
              );

            state.success = true;
            state.error = null;

            state.message =
              action.payload
                ?.message ||
              null;

            // IMPORTANT
            if (
              action.payload?.token
            ) {
              localStorage.setItem(
                "token",
                action.payload.token
              );
            }
          }
        )

        .addCase(
          login.rejected,
          rejected
        );

      // LOAD USER
      builder
        .addCase(
          loadUser.pending,
          pending
        )

        .addCase(
          loadUser.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.user =
              action.payload?.user ||
              null;

            state.isAuthenticated =
              Boolean(
                state.user
              );

            state.error = null;
          }
        )

        .addCase(
          loadUser.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Failed to load user";

            state.isAuthenticated =
              false;

            state.user = null;
          }
        );

      // LOGOUT
      builder
        .addCase(
          logout.pending,
          pending
        )

        .addCase(
          logout.fulfilled,
          (state) => {
            state.loading = false;
            state.user = null;
            state.isAuthenticated =
              false;
            state.success = false;
            state.error = null;
            state.message = null;

            localStorage.removeItem(
              "token"
            );
          }
        )

        .addCase(
          logout.rejected,
          rejected
        );

      // UPDATE USER
      builder
        .addCase(
          updateUser.pending,
          pending
        )

        .addCase(
          updateUser.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.user =
              action.payload?.user ||
              state.user;

            state.isAuthenticated =
              true;

            state.success = true;
            state.error = null;

            state.message =
              action.payload
                ?.message ||
              null;
          }
        )

        .addCase(
          updateUser.rejected,
          rejected
        );

      // RESET REQUEST
      builder
        .addCase(
          requestResetPassword.pending,
          pending
        )

        .addCase(
          requestResetPassword.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.success = true;
            state.error = null;

            state.message =
              action.payload
                ?.message ||
              "Request sent to your email";
          }
        )

        .addCase(
          requestResetPassword.rejected,
          rejected
        );

      // UPDATE PASSWORD
      builder
        .addCase(
          updatePassword.pending,
          pending
        )

        .addCase(
          updatePassword.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.success = true;
            state.error = null;

            state.message =
              action.payload
                ?.message ||
              "Password updated successfully";

            if (
              action.payload?.token
            ) {
              localStorage.setItem(
                "token",
                action.payload.token
              );
            }
          }
        )

        .addCase(
          updatePassword.rejected,
          rejected
        );

      // RESET PASSWORD
      builder
        .addCase(
          resetPassword.pending,
          pending
        )

        .addCase(
          resetPassword.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;
            state.success = true;
            state.error = null;

            state.message =
              action.payload
                ?.message ||
              "Password reset successfully";

            state.user =
              action.payload?.user ||
              null;

            state.isAuthenticated =
              Boolean(
                state.user
              );

            if (
              action.payload?.token
            ) {
              localStorage.setItem(
                "token",
                action.payload.token
              );
            }
          }
        )

        .addCase(
          resetPassword.rejected,
          rejected
        );
    },
  });

export const {
  removeError,
  removeSuccess,
  resetUser,
} = userSlice.actions;

export default userSlice.reducer;
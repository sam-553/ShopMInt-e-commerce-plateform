import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = `${import.meta.env.VITE_BASE_URL}/api`;

const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

const extractError = (error, fallback) => {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    fallback
  );
};


export const register = createAsyncThunk(
  "user/register",
  async (userdata, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/user/registerUser",
        userdata
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        extractError(error, "Registration failed")
      );
    }
  }
);


export const login = createAsyncThunk(
  "user/login",
  async (userdata, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/user/loginUser",
        userdata
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        extractError(error, "Login failed")
      );
    }
  }
);


export const loadUser = createAsyncThunk(
  "user/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(
        "/user/getuserDetails"
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        extractError(error, "Failed to load profile")
      );
    }
  }
);


export const logout = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/user/logout"
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        extractError(error, "Logout failed")
      );
    }
  }
);


export const updateUser = createAsyncThunk(
  "user/update",
  async (userdata, { rejectWithValue }) => {
    try {
      const response = await api.put(
        "/user/updateProfile",
        userdata
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        extractError(error, "Profile update failed")
      );
    }
  }
);


export const requestResetPassword = createAsyncThunk(
  "user/requestResetPassword",
  async (userdata, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/user/requestresetpassword",
        userdata
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        extractError(error, "Reset request failed")
      );
    }
  }
);


export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (userdata, { rejectWithValue }) => {
    try {
      const response = await api.put(
        "/user/updatePassword",
        userdata
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        extractError(error, "Password update failed")
      );
    }
  }
);


export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (
    { token, password, confirmPassword },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(
        `/user/resetPassword/${token}`,
        {
          password,
          confirmPassword,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        extractError(error, "Password reset failed")
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


const userSlice = createSlice({
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

  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    };

    const rejected = (state, action) => {
      state.loading = false;
      state.error =
        action.payload || "Something went wrong";
      state.success = false;
    };

    // =========================
    // REGISTER
    // =========================
    builder
      .addCase(register.pending, pending)

      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;

        state.user =
          action.payload?.user || null;

        state.isAuthenticated =
          Boolean(state.user);

        state.success = true;
        state.error = null;

        state.message =
          action.payload?.message || null;
      })

      .addCase(register.rejected, rejected)

      // =========================
      // LOGIN
      // =========================
      .addCase(login.pending, pending)

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;

        state.user =
          action.payload?.user || null;

        state.isAuthenticated =
          Boolean(state.user);

        state.success = true;
        state.error = null;

        state.message =
          action.payload?.message || null;
      })

      .addCase(login.rejected, rejected)

      // =========================
      // LOAD USER
      // =========================
      .addCase(loadUser.pending, pending)

      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;

        state.user =
          action.payload?.user || null;

        state.isAuthenticated =
          Boolean(state.user);

        state.error = null;
      })

      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to load user";
        state.isAuthenticated = false;
        state.user = null;
      })

      // =========================
      // LOGOUT
      // =========================
      .addCase(logout.pending, pending)

      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.success = false;
        state.error = null;
        state.message = null;

        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
      })

      .addCase(logout.rejected, rejected)

      // =========================
      // UPDATE USER
      // =========================
      .addCase(updateUser.pending, pending)

      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;

        state.user =
          action.payload?.user || state.user;

        state.isAuthenticated = true;
        state.success = true;
        state.error = null;

        state.message =
          action.payload?.message || null;
      })

      .addCase(updateUser.rejected, rejected)

      // =========================
      // REQUEST RESET
      // =========================
      .addCase(
        requestResetPassword.pending,
        pending
      )

      .addCase(
        requestResetPassword.fulfilled,
        (state, action) => {
          state.loading = false;
          state.success = true;
          state.error = null;

          state.message =
            action.payload?.message ||
            "Request sent to your email";
        }
      )

      .addCase(
        requestResetPassword.rejected,
        rejected
      )

      // =========================
      // UPDATE PASSWORD
      // =========================
      .addCase(updatePassword.pending, pending)

      .addCase(
        updatePassword.fulfilled,
        (state, action) => {
          state.loading = false;
          state.success = true;
          state.error = null;

          state.message =
            action.payload?.message ||
            "Password updated successfully";
        }
      )

      .addCase(
        updatePassword.rejected,
        rejected
      )

      // =========================
      // RESET PASSWORD
      // =========================
      .addCase(resetPassword.pending, pending)

      .addCase(
        resetPassword.fulfilled,
        (state, action) => {
          state.loading = false;
          state.success = true;
          state.error = null;

          state.message =
            action.payload?.message ||
            "Password reset successfully";

          state.user = null;
          state.isAuthenticated = false;
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
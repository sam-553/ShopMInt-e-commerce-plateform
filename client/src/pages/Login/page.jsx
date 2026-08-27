import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  IconEye,
  IconEyeOff,
  IconLoader3,
} from "@tabler/icons-react";
import { toast } from "react-toastify";
import {
  login,
  removeError,
  removeSuccess,
} from "../../redux/features/user/userSlice";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email"),

  password: Yup.string()
    .required("Please enter your password"),

  remember: Yup.boolean().oneOf(
    [true],
    "You must check Remember me to proceed"
  ),
});

const Login = () => {
  const [showPassword, setShowPassword] =
    useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    error,
    loading,
    success,
  } = useSelector(
    (state) => state.user
  );

  const loginForm = useFormik({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },

    validationSchema: loginSchema,

    onSubmit: async (values) => {
      const resultAction =
        await dispatch(
          login({
            email: values.email,
            password: values.password,
          })
        );

      // --------------------------------
      // LOGIN SUCCESS
      // --------------------------------
      if (login.fulfilled.match(resultAction)) {
        const token =
          resultAction.payload?.token;

        console.log(
          "LOGIN TOKEN RECEIVED:",
          Boolean(token)
        );

        if (token) {
          localStorage.setItem(
            "token",
            token
          );
        }

        // Cookie is also created by backend.
        console.log(
          "Login successful - authentication saved"
        );
      }
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message ||
              "Something went wrong"
      );

      dispatch(removeError());
    }

    if (success) {
      toast.success(
        "Login successful!"
      );

      dispatch(removeSuccess());

      navigate("/");

      loginForm.resetForm();
    }
  }, [
    error,
    success,
    dispatch,
    navigate,
  ]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="w-full max-w-md p-6 bg-gray-50 border border-gray-200 rounded-2xl shadow-xl">

        <div className="text-center mb-6">
          <img
            src="/images/assest/signin.png"
            alt="Sign In"
            className="w-20 h-20 mx-auto mb-3 rounded-full shadow-sm"
          />

          <h2 className="text-2xl font-bold text-gray-800">
            Welcome Back
          </h2>

          <p className="text-sm text-gray-500">
            Sign in to continue
          </p>
        </div>

        <form
          className="space-y-5"
          onSubmit={
            loginForm.handleSubmit
          }
          noValidate
        >

          {/* EMAIL */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>

            <input
              type="email"
              id="email"
              name="email"
              onChange={
                loginForm.handleChange
              }
              onBlur={
                loginForm.handleBlur
              }
              value={
                loginForm.values.email
              }
              className="w-full px-4 py-3 rounded-md border border-gray-300"
              placeholder="you@example.com"
            />

            {loginForm.touched.email &&
              loginForm.errors.email && (
                <p className="text-xs text-red-600 mt-1">
                  {loginForm.errors.email}
                </p>
              )}
          </div>

          {/* PASSWORD */}
          <div>
            <div className="flex justify-between mb-1">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <Link
                to="/forgotPassword"
                className="text-sm text-red-600 hover:underline"
              >
                Forgot?
              </Link>
            </div>

            <div className="relative">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                id="password"
                name="password"
                onChange={
                  loginForm.handleChange
                }
                onBlur={
                  loginForm.handleBlur
                }
                value={
                  loginForm.values.password
                }
                className="w-full px-4 py-3 rounded-md border border-gray-300"
                placeholder="••••••••"
              />

              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword ? (
                  <IconEye size={20} />
                ) : (
                  <IconEyeOff size={20} />
                )}
              </span>
            </div>

            {loginForm.touched.password &&
              loginForm.errors.password && (
                <p className="text-xs text-red-600 mt-1">
                  {
                    loginForm.errors
                      .password
                  }
                </p>
              )}
          </div>

          {/* REMEMBER */}
          <div>
            <div className="flex items-center">

              <input
                id="remember"
                name="remember"
                type="checkbox"
                onChange={
                  loginForm.handleChange
                }
                onBlur={
                  loginForm.handleBlur
                }
                checked={
                  loginForm.values.remember
                }
                className="h-4 w-4"
              />

              <label
                htmlFor="remember"
                className="ml-2 text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            {loginForm.touched.remember &&
              loginForm.errors.remember && (
                <p className="text-xs text-red-600 mt-1">
                  {
                    loginForm.errors
                      .remember
                  }
                </p>
              )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gray-700 text-white rounded-md flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <IconLoader3 className="animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <p className="text-center text-sm text-gray-700">
            Don't have an account?

            <Link
              to="/signup"
              className="ml-1 text-red-600 font-medium"
            >
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
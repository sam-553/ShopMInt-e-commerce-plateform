import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  IconEyeOff,
  IconCheck,
  IconEye,
  IconLoader3,
  IconCamera,
} from "@tabler/icons-react";

import { useFormik } from "formik";
import * as Yup from "yup";

import { useDispatch, useSelector } from "react-redux";
import {
  register,
  removeError,
} from "../../redux/features/user/userSlice";

import { toast } from "react-toastify";



const signupSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .required("Please enter your name"),

  email: Yup.string()
    .trim()
    .email("Please enter a valid email address")
    .required("Please enter your email"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Please enter a password"),

  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf(
      [Yup.ref("password")],
      "Passwords must match"
    ),
});



const RegisterUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const { error, loading } = useSelector(
    (state) => state.user
  );

  

  const signupForm = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      image: "",
    },

    validationSchema: signupSchema,

    onSubmit: async (values, { resetForm }) => {
      
      if (error) {
        dispatch(removeError());
      }

      const dataToSend = {
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        avatar: values.image || "",
      };

      try {
        const resultAction = await dispatch(
          register(dataToSend)
        );

        if (register.fulfilled.match(resultAction)) {
          toast.success("Account created successfully!");

          resetForm();

          navigate("/");
        }

        if (register.rejected.match(resultAction)) {
          const errorMessage =
            resultAction.payload ||
            resultAction.error?.message ||
            "Registration failed";

          toast.error(
            typeof errorMessage === "string"
              ? errorMessage
              : "Registration failed"
          );
        }
      } catch (err) {
        toast.error(
          err?.message || "Something went wrong"
        );
      }
    },
  });

  /* =========================
     Redux Error
  ========================= */

  useEffect(() => {
    if (!error) return;

    const errorMessage =
      typeof error === "string"
        ? error
        : error?.message ||
          error?.error ||
          "Registration failed";

    toast.error(errorMessage);

    dispatch(removeError());
  }, [error, dispatch]);

  /* =========================
     Image Upload
  ========================= */

  const uploadImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      e.target.value = "";
      return;
    }

    // Maximum 2 MB
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2 MB");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      signupForm.setFieldValue(
        "image",
        reader.result
      );
    };

    reader.onerror = () => {
      toast.error("Unable to read the image");
    };

    reader.readAsDataURL(file);
  };

  /* =========================
     Helpers
  ========================= */

  const getError = (field) => {
    return (
      signupForm.touched[field] &&
      signupForm.errors[field]
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">

      <div className="w-full max-w-md bg-gray-50 rounded-2xl shadow-2xl px-6 py-7">

        {/* =========================
            Header
        ========================= */}

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Create Account
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Sign up to start shopping
          </p>
        </div>

        {/* =========================
            Profile Image
        ========================= */}

        <div className="flex justify-center mb-6">

          <label
            htmlFor="image"
            className="relative w-24 h-24 rounded-full overflow-hidden shadow-md cursor-pointer block group"
          >

            <img
              src={
                signupForm.values.image ||
                "/images/assest/signin.png"
              }
              alt="Profile preview"
              className="w-full h-full object-cover transition group-hover:brightness-75"
            />

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/30">
              <IconCamera
                size={24}
                className="text-white"
              />
            </div>

            <input
              type="file"
              id="image"
              name="image"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
              onChange={uploadImage}
              disabled={loading}
            />

          </label>

        </div>

        {/* =========================
            Form
        ========================= */}

        <form
          onSubmit={signupForm.handleSubmit}
          className="space-y-4"
          noValidate
        >

          {/* Name */}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>

            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              autoComplete="name"
              value={signupForm.values.name}
              onChange={signupForm.handleChange}
              onBlur={signupForm.handleBlur}
              className={`w-full px-3 py-2.5 rounded-md border outline-none transition ${
                getError("name")
                  ? "border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:ring-2 focus:ring-gray-600"
              }`}
            />

            {getError("name") && (
              <p className="text-xs text-red-600 mt-1">
                {signupForm.errors.name}
              </p>
            )}
          </div>

          {/* Email */}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>

            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={signupForm.values.email}
              onChange={signupForm.handleChange}
              onBlur={signupForm.handleBlur}
              className={`w-full px-3 py-2.5 rounded-md border outline-none transition ${
                getError("email")
                  ? "border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:ring-2 focus:ring-gray-600"
              }`}
            />

            {getError("email") && (
              <p className="text-xs text-red-600 mt-1">
                {signupForm.errors.email}
              </p>
            )}
          </div>

          {/* Password */}

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>

            <div className="relative">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                id="password"
                name="password"
                placeholder="Enter your password"
                autoComplete="new-password"
                value={signupForm.values.password}
                onChange={signupForm.handleChange}
                onBlur={signupForm.handleBlur}
                className={`w-full px-3 py-2.5 pr-10 rounded-md border outline-none transition ${
                  getError("password")
                    ? "border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:ring-2 focus:ring-gray-600"
                }`}
              />

              <button
                type="button"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-800"
              >
                {showPassword ? (
                  <IconEye size={20} />
                ) : (
                  <IconEyeOff size={20} />
                )}
              </button>

            </div>

            {getError("password") && (
              <p className="text-xs text-red-600 mt-1">
                {signupForm.errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>

            <div className="relative">

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                autoComplete="new-password"
                value={
                  signupForm.values.confirmPassword
                }
                onChange={signupForm.handleChange}
                onBlur={signupForm.handleBlur}
                className={`w-full px-3 py-2.5 pr-10 rounded-md border outline-none transition ${
                  getError("confirmPassword")
                    ? "border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-gray-300 focus:ring-2 focus:ring-gray-600"
                }`}
              />

              <button
                type="button"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                onClick={() =>
                  setShowConfirmPassword(
                    (prev) => !prev
                  )
                }
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-800"
              >
                {showConfirmPassword ? (
                  <IconEye size={20} />
                ) : (
                  <IconEyeOff size={20} />
                )}
              </button>

            </div>

            {getError("confirmPassword") && (
              <p className="text-xs text-red-600 mt-1">
                {signupForm.errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-800 active:bg-gray-900 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <IconLoader3
                  size={20}
                  className="animate-spin"
                />
                Creating Account...
              </>
            ) : (
              <>
                <IconCheck size={20} />
                Create Account
              </>
            )}
          </button>

          {/* Login */}

          <p className="text-sm text-center text-gray-600 pt-2">
            Already have an account?

            <Link
              to="/login"
              className="text-gray-800 ml-1 hover:underline font-semibold"
            >
              Sign In
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default RegisterUser;
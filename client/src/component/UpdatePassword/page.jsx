import React, { useState } from "react";
import {
  IconEye,
  IconEyeOff,
  IconCheck,
  IconLoader2,
} from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  logout,
  updatePassword,
} from "../../redux/features/user/userSlice";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector(
    (state) => state.user
  );

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !oldPassword.trim() ||
      !newPassword.trim() ||
      !confirmNewPassword.trim()
    ) {
      toast.error("All password fields are required");
      return;
    }

    if (newPassword.length < 8) {
      toast.error(
        "New password must be at least 8 characters long"
      );
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (oldPassword === newPassword) {
      toast.error(
        "New password must be different from old password"
      );
      return;
    }

    try {
      await dispatch(
        updatePassword({
          oldPassword,
          newPassword,
          confirmPassword: confirmNewPassword,
        })
      ).unwrap();

      toast.success(
        "Password updated successfully"
      );

      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      await dispatch(logout()).unwrap();

      navigate("/login");
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message ||
              "Password update failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/60 backdrop-blur-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 tracking-tight">
          Update Your Password
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <InputField
            label="Old Password"
            type={showOld ? "text" : "password"}
            value={oldPassword}
            onChange={setOldPassword}
            show={showOld}
            setShow={setShowOld}
            placeholder="Enter your current password"
          />

          <InputField
            label="New Password"
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={setNewPassword}
            show={showNew}
            setShow={setShowNew}
            placeholder="Enter your new password"
          />

          <InputField
            label="Confirm New Password"
            type={
              showConfirm ? "text" : "password"
            }
            value={confirmNewPassword}
            onChange={setConfirmNewPassword}
            show={showConfirm}
            setShow={setShowConfirm}
            placeholder="Confirm your new password"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white flex items-center justify-center gap-2 transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black"
            }`}
          >
            {loading ? (
              <IconLoader2
                className="animate-spin"
                size={20}
              />
            ) : (
              <IconCheck size={20} />
            )}

            {loading
              ? "Updating..."
              : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

const InputField = ({
  label,
  type,
  value,
  onChange,
  show,
  setShow,
  placeholder,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none transition"
          placeholder={placeholder}
          required
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-800"
          aria-label={
            show
              ? "Hide password"
              : "Show password"
          }
        >
          {show ? (
            <IconEye size={20} />
          ) : (
            <IconEyeOff size={20} />
          )}
        </button>
      </div>
    </div>
  );
};

export default UpdatePassword;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../Navbar/page.jsx";
import Loader from "../Loader/page.jsx";
import Footer from "../Footer/page.jsx";

import { updateUser } from "../../redux/features/user/userSlice";

const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=3";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    user,
    loading,
    isAuthenticated,
    error,
  } = useSelector((state) => state.user);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] =
    useState(DEFAULT_AVATAR);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!user) return;

    setName(user.name || "");
    setEmail(user.email || "");

    const avatarUrl =
      user.avatar?.url || DEFAULT_AVATAR;

    setAvatarPreview(avatarUrl);
    setAvatar("");
  }, [user]);

  const uploadImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setAvatar(reader.result);
      setAvatarPreview(reader.result);
      toast.success("Profile image selected successfully.");
    };

    reader.onerror = () => {
      toast.error("Unable to read image. Please try again.");
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }

    if (!email.trim()) {
      toast.error("Email is required.");
      return;
    }

    try {
      const updateData = {
        name: name.trim(),
        email: email.trim(),
      };

      if (avatar) {
        updateData.avatar = avatar;
      }

      await dispatch(updateUser(updateData)).unwrap();

      toast.success("Profile updated successfully.");

      setIsEditing(false);
      setAvatar("");
    } catch (err) {
      const message =
        typeof err === "string"
          ? err
          : err?.message || "Profile update failed.";

      toast.error(message);
    }
  };

  const handleCancel = () => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");

      setAvatarPreview(
        user.avatar?.url || DEFAULT_AVATAR
      );

      setAvatar("");
    }

    setIsEditing(false);
  };

  if (loading || !user) {
    return <Loader />;
  }

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "N/A";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-24">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-3xl shadow-md p-8 space-y-6"
        >
          <div className="flex flex-col items-center space-y-3">
            <img
              src={avatarPreview || DEFAULT_AVATAR}
              alt="User Avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-gray-300 shadow"
            />

            {isEditing && (
              <label className="cursor-pointer text-sm text-gray-700 hover:text-blue-600 transition">
                <span className="underline">
                  Change Avatar
                </span>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={uploadImage}
                />
              </label>
            )}

            <h2 className="text-2xl font-semibold text-gray-800">
              {name || "User"}
            </h2>

            <p className="text-sm text-gray-500">
              Joined on {joinedDate}
            </p>
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
              autoComplete="name"
              className={`w-full mt-1 px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition ${isEditing
                  ? "border-gray-300 bg-white text-gray-800"
                  : "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
                }`}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing}
              autoComplete="email"
              className={`w-full mt-1 px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition ${isEditing
                  ? "border-gray-300 bg-white text-gray-800"
                  : "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
                }`}
            />
          </div>

          {error && isEditing && (
            <p className="text-sm text-red-600 text-center">
              {typeof error === "string"
                ? error
                : "Unable to update profile"}
            </p>
          )}

          {isEditing ? (
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="w-full py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition text-sm font-medium disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-gray-700 text-white rounded-full hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition text-sm font-medium"
            >
              Edit Profile
            </button>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/updatePassword"
              className="w-full py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition text-sm font-medium text-center"
            >
              Change Password
            </Link>

            <Link
              to="/orders"
              className="w-full py-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition text-sm font-medium text-center"
            >
              My Orders
            </Link>
          </div>
        </form>
      </main>

      <Footer />
    </>
  );
};

export default UserProfile;
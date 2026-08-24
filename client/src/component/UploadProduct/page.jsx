import React, { useEffect, useState } from "react";
import {
  IconCloudUpload,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import Navbar from "../Navbar/page.jsx";
import Loader from "../Loader/page.jsx";
import Footer from "../Footer/page.jsx";
import productCategory from "../category/page.jsx";

import {
  removeError,
  removeSuccess,
  uploadProducts,
} from "../../redux/features/admin/adminSlice";

const UploadProduct = () => {
  const dispatch = useDispatch();

  const {
    loading,
    error,
    success,
  } = useSelector((state) => state.admin);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const [fullscreenImage, setFullscreenImage] =
    useState("");

  const [
    openFullscreenImage,
    setOpenFullscreenImage,
  ] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(
          `${file.name} is not a valid image`
        );
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(
          `${file.name} must be less than 5MB`
        );
        return false;
      }

      return true;
    });

    validFiles.forEach((file) => {
      const previewUrl =
        URL.createObjectURL(file);

      setPreviewUrls((prev) => [
        ...prev,
        previewUrl,
      ]);

      const reader = new FileReader();

      reader.onload = () => {
        setImages((prev) => [
          ...prev,
          reader.result,
        ]);
      };

      reader.onerror = () => {
        URL.revokeObjectURL(previewUrl);
        toast.error(
          "Failed to read image"
        );
      };

      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const handleDeleteImage = (index) => {
    setPreviewUrls((prev) => {
      const url = prev[index];

      if (url) {
        URL.revokeObjectURL(url);
      }

      return prev.filter(
        (_, i) => i !== index
      );
    });

    setImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const resetForm = () => {
    previewUrls.forEach((url) => {
      URL.revokeObjectURL(url);
    });

    setName("");
    setCategory("");
    setPrice("");
    setStock("");
    setDescription("");
    setImages([]);
    setPreviewUrls([]);
  };

  const createProductSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error(
        "Please enter product name"
      );
      return;
    }

    if (!category) {
      toast.error(
        "Please select a category"
      );
      return;
    }

    if (!price || Number(price) <= 0) {
      toast.error(
        "Please enter a valid price"
      );
      return;
    }

    if (
      stock === "" ||
      Number(stock) < 0
    ) {
      toast.error(
        "Please enter a valid stock quantity"
      );
      return;
    }

    if (!description.trim()) {
      toast.error(
        "Please enter product description"
      );
      return;
    }

    if (!images.length) {
      toast.error(
        "Please upload at least one image"
      );
      return;
    }

    try {
      await dispatch(
        uploadProducts({
          name: name.trim(),
          price: Number(price),
          category,
          description: description.trim(),
          stock: Number(stock),
          image: images,
        })
      ).unwrap();
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message ||
          "Product upload failed"
      );
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(
        "Product created successfully"
      );

      resetForm();

      dispatch(removeSuccess());
    }
  }, [success, dispatch]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  return (
    <>
      <Navbar />

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 mt-16 pb-10 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl">
              <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
                Create Product
              </h2>

              <form
                className="grid gap-4"
                onSubmit={
                  createProductSubmit
                }
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter product name"
                  className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition bg-gray-50"
                />

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value
                    )
                  }
                  className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition bg-gray-50 text-gray-700"
                >
                  <option value="">
                    Select Category
                  </option>

                  {Array.isArray(
                    productCategory
                  ) &&
                    productCategory.map(
                      (item) => (
                        <option
                          value={item.value}
                          key={item.id}
                        >
                          {item.label}
                        </option>
                      )
                    )}
                </select>

                <label
                  htmlFor="uploadImages"
                  className="cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-gray-500 hover:bg-gray-50 transition">
                    <IconCloudUpload
                      size={40}
                      className="text-gray-500 mb-2"
                    />

                    <p className="text-gray-600 text-center">
                      Click to upload product
                      images
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, JPEG up to 5MB
                    </p>

                    <input
                      type="file"
                      id="uploadImages"
                      className="hidden"
                      multiple
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={
                        handleFileChange
                      }
                    />
                  </div>
                </label>

                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                    {previewUrls.map(
                      (url, index) => (
                        <div
                          key={`${url}-${index}`}
                          className="relative group"
                        >
                          <img
                            src={url}
                            alt={`Product preview ${index + 1
                              }`}
                            className="rounded-xl object-cover w-full h-24 cursor-pointer border border-gray-300 shadow hover:scale-105 transition"
                            onClick={() => {
                              setFullscreenImage(
                                url
                              );
                              setOpenFullscreenImage(
                                true
                              );
                            }}
                          />

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteImage(
                                index
                              )
                            }
                            className="absolute top-1 right-1 bg-gray-800 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                          >
                            <IconTrash
                              size={16}
                            />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) =>
                    setPrice(
                      e.target.value
                    )
                  }
                  placeholder="Enter price"
                  className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition bg-gray-50"
                />

                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) =>
                    setStock(
                      e.target.value
                    )
                  }
                  placeholder="Enter stock quantity"
                  className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition bg-gray-50"
                />

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  placeholder="Enter product description"
                  rows={5}
                  className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition bg-gray-50 resize-none"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-gray-700 hover:bg-gray-800 text-white rounded-xl py-3 font-medium transition ${loading
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                    }`}
                >
                  {loading
                    ? "Uploading..."
                    : "Upload Product"}
                </button>
              </form>
            </div>
          </div>

          {openFullscreenImage && (
            <div
              className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4"
              onClick={() =>
                setOpenFullscreenImage(
                  false
                )
              }
            >
              <div
                className="relative max-w-4xl w-full flex justify-center"
                onClick={(e) =>
                  e.stopPropagation()
                }
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenFullscreenImage(
                      false
                    )
                  }
                  className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 transition z-10"
                >
                  <IconX size={24} />
                </button>

                <img
                  src={fullscreenImage}
                  alt="Fullscreen product preview"
                  className="rounded-xl max-w-full object-contain max-h-[85vh]"
                />
              </div>
            </div>
          )}
        </>
      )}

      <Footer />
    </>
  );
};

export default UploadProduct;
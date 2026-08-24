import React, { useEffect, useState } from "react";
import { IconCloudUpload, IconTrash } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../../Navbar/page";
import Loader from "../../Loader/page";
import Footer from "../../Footer/page";
import productCategory from "../../category/page";

import {
  updateProduct,
  removeError,
  removeSuccess,
} from "../../../redux/features/admin/adminSlice";

import { getproductDetails } from "../../../redux/features/products/productSlice";

const UpdateProduct = () => {
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const dispatch = useDispatch();

  const { productDetails } = useSelector(
    (state) => state.product
  );

  const {
    success,
    error,
    loading,
  } = useSelector((state) => state.admin);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [oldImages, setOldImages] = useState([]);

  useEffect(() => {
    if (productId) {
      dispatch(getproductDetails(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (!productDetails) {
      return;
    }

    setName(productDetails.name || "");

    let categoryValue = productDetails.category;

    if (Array.isArray(categoryValue)) {
      categoryValue = categoryValue[0] || "";
    }

    if (
      typeof categoryValue === "object" &&
      categoryValue !== null
    ) {
      categoryValue =
        categoryValue.value ||
        categoryValue.name ||
        categoryValue.label ||
        "";
    }

    setCategory(String(categoryValue || ""));

    setPrice(
      productDetails.price !== undefined &&
        productDetails.price !== null
        ? String(productDetails.price)
        : ""
    );

    setStock(
      productDetails.stock !== undefined &&
        productDetails.stock !== null
        ? String(productDetails.stock)
        : ""
    );

    setDescription(
      productDetails.description || ""
    );

    if (Array.isArray(productDetails.image)) {
      setOldImages(
        productDetails.image
          .map((image) => image?.url)
          .filter(Boolean)
      );
    } else {
      setOldImages([]);
    }

    setImages([]);
    setImagePreview([]);
  }, [productDetails]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) {
      return;
    }

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(
          `${file.name} is not a valid image`
        );
        return;
      }

      const previewUrl =
        URL.createObjectURL(file);

      setImagePreview((prev) => [
        ...prev,
        previewUrl,
      ]);

      const reader = new FileReader();

      reader.onload = () => {
        if (reader.result) {
          setImages((prev) => [
            ...prev,
            reader.result,
          ]);
        }
      };

      reader.onerror = () => {
        toast.error(
          "Failed to read image"
        );
      };

      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const handleRemoveNewImage = (index) => {
    setImagePreview((prev) => {
      const url = prev[index];

      if (url?.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }

      return prev.filter(
        (_, i) => i !== index
      );
    });

    setImages((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  const handleRemoveOldImage = (index) => {
    setOldImages((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!productId) {
      toast.error(
        "Product ID is missing"
      );
      return;
    }

    if (!name.trim()) {
      toast.error(
        "Product name is required"
      );
      return;
    }

    if (!category) {
      toast.error(
        "Please select a category"
      );
      return;
    }

    if (
      price === "" ||
      Number(price) <= 0
    ) {
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
        "Product description is required"
      );
      return;
    }

    const payload = {
      name: name.trim(),
      price: Number(price),
      category: String(category),
      description: description.trim(),
      stock: Number(stock),
      image: images,
      oldImages,
    };

    try {
      await dispatch(
        updateProduct({
          id: productId,
          formData: payload,
        })
      ).unwrap();

      toast.success(
        "Product updated successfully"
      );

      navigate("/productList");
    } catch (err) {
      toast.error(
        typeof err === "string"
          ? err
          : err?.message ||
              "Product update failed"
      );
    }
  };

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
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      dispatch(removeSuccess());
    }
  }, [success, dispatch]);

  useEffect(() => {
    return () => {
      imagePreview.forEach((url) => {
        if (url?.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreview]);

  if (loading && !productDetails) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />

      <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 mt-16 py-10 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl">

          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            Update Product
          </h2>

          <form
            className="grid gap-4"
            onSubmit={handleUpdateSubmit}
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
                setCategory(e.target.value)
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
                  (item, index) => (
                    <option
                      key={
                        item.id || index
                      }
                      value={String(
                        item.value || ""
                      )}
                    >
                      {item.label}
                    </option>
                  )
                )}
            </select>

            <label htmlFor="uploadImages">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-gray-500 hover:bg-gray-50 transition cursor-pointer">

                <IconCloudUpload
                  size={40}
                  className="text-gray-500 mb-2"
                />

                <p className="text-gray-600">
                  Click or drag files to upload
                </p>

                <input
                  type="file"
                  id="uploadImages"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={
                    handleImageChange
                  }
                />

              </div>
            </label>

            {imagePreview.length > 0 && (
              <div>

                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  New Images
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

                  {imagePreview.map(
                    (url, index) => (
                      <div
                        key={`new-${index}`}
                        className="relative group rounded-xl overflow-hidden border border-gray-300 shadow"
                      >

                        <img
                          src={url}
                          alt={`New image ${
                            index + 1
                          }`}
                          className="object-cover w-full h-28"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveNewImage(
                              index
                            )
                          }
                          className="absolute top-1 right-1 bg-gray-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <IconTrash
                            size={16}
                          />
                        </button>

                      </div>
                    )
                  )}

                </div>
              </div>
            )}

            {oldImages.length > 0 && (
              <div>

                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Existing Images
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

                  {oldImages.map(
                    (url, index) => (
                      <div
                        key={`old-${index}`}
                        className="relative group rounded-xl overflow-hidden border border-gray-300 shadow"
                      >

                        <img
                          src={url}
                          alt={`Existing image ${
                            index + 1
                          }`}
                          className="object-cover w-full h-28"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveOldImage(
                              index
                            )
                          }
                          className="absolute top-1 right-1 bg-gray-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <IconTrash
                            size={16}
                          />
                        </button>

                      </div>
                    )
                  )}

                </div>
              </div>
            )}

            <input
              type="number"
              min="0"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              placeholder="Enter price"
              className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition bg-gray-50"
            />

            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) =>
                setStock(e.target.value)
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
              className={`bg-gray-700 hover:bg-gray-800 text-white rounded-xl py-3 font-medium transition ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {loading
                ? "Updating..."
                : "Update Product"}
            </button>

          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default UpdateProduct;
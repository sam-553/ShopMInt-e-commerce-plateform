import React, { useEffect, useState } from "react";
import { Pencil, Trash, Table, Rows, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import Navbar from "../Navbar/page";
import Footer from "../Footer/page";
import Loader from "../Loader/page";

import {
  deleteProduct,
  fetchAdminProducts,
  removeError,
} from "../../redux/features/admin/adminSlice";

const ProductList = () => {
  const [view, setView] = useState("table");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    products = [],
    loading,
    error,
  } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Error fetching products"
      );

      dispatch(removeError());
    }
  }, [error, dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) {
      return "N/A";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "N/A";
    }

    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getProductImage = (product) => {
    const image = product?.image;

    if (Array.isArray(image)) {
      const firstImage = image[0];

      if (
        firstImage &&
        typeof firstImage === "object" &&
        typeof firstImage.url === "string" &&
        firstImage.url.trim() !== ""
      ) {
        return firstImage.url;
      }

      if (
        typeof firstImage === "string" &&
        firstImage.trim() !== ""
      ) {
        return firstImage;
      }
    }

    if (
      typeof image === "string" &&
      image.trim() !== ""
    ) {
      return image;
    }

    return "/placeholder.jpg";
  };

  const handleImageError = (e) => {
    if (e.currentTarget.dataset.fallback === "true") {
      return;
    }

    e.currentTarget.dataset.fallback = "true";
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/placeholder.jpg";
  };

  const handleEdit = (productId) => {
    if (!productId) {
      toast.error("Product ID not found");
      return;
    }

    navigate(`/updateProduct/${productId}`);
  };

  const handleDelete = async (productId) => {
    if (!productId) {
      toast.error("Product ID not found");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(
        deleteProduct(productId)
      ).unwrap();

      toast.success(
        "Product deleted successfully"
      );

      dispatch(fetchAdminProducts());
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message ||
              "Error deleting product"
      );
    }
  };

  const validProducts = Array.isArray(products)
    ? products.filter(
        (product) =>
          product &&
          product.name
      )
    : [];

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-100 px-4 py-8 mt-16">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">

            <h2 className="text-gray-800 font-bold text-3xl">
              All Products
            </h2>

            <div className="flex gap-2">

              <button
                type="button"
                onClick={() =>
                  setView("table")
                }
                className={`p-2 rounded-lg shadow transition ${
                  view === "table"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-200"
                }`}
                title="Table View"
              >
                <Table className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() =>
                  setView("row")
                }
                className={`p-2 rounded-lg shadow transition ${
                  view === "row"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-200"
                }`}
                title="Card View"
              >
                <Rows className="w-5 h-5" />
              </button>

            </div>
          </div>

          {validProducts.length === 0 ? (

            <div className="bg-white rounded-2xl shadow p-10 text-center">

              <h3 className="text-xl font-semibold text-gray-700">
                No Products Found
              </h3>

              <p className="text-gray-500 mt-2">
                There are currently no products available.
              </p>

            </div>

          ) : view === "table" ? (

            <div className="overflow-x-auto rounded-xl shadow bg-white">

              <table className="min-w-full divide-y divide-gray-200">

                <thead className="bg-gray-100">

                  <tr>

                    {[
                      "S.No",
                      "Image",
                      "Name",
                      "Price",
                      "Rating",
                      "Category",
                      "Stock",
                      "Created At",
                      "Action",
                    ].map((heading) => (

                      <th
                        key={heading}
                        className="text-left p-4 text-sm font-semibold text-gray-700 whitespace-nowrap"
                      >
                        {heading}
                      </th>

                    ))}

                  </tr>

                </thead>

                <tbody className="bg-white divide-y divide-gray-100">

                  {validProducts.map(
                    (product, index) => (

                      <tr
                        key={
                          product._id ||
                          index
                        }
                        className="hover:bg-gray-50 transition"
                      >

                        <td className="p-4 text-gray-600">
                          {index + 1}
                        </td>

                        <td className="p-4">

                          <img
                            src={getProductImage(
                              product
                            )}
                            alt={
                              product.name ||
                              "Product"
                            }
                            className="w-14 h-14 rounded-lg object-cover shadow-sm border"
                            onError={
                              handleImageError
                            }
                          />

                        </td>

                        <td className="p-4 text-gray-800 font-medium">
                          {product.name}
                        </td>

                        <td className="p-4 font-medium text-gray-700">
                          ₹
                          {Number(
                            product.price || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td className="p-4">

                          <div className="flex items-center gap-1 text-gray-700">

                            <span>
                              {product.ratings ??
                                0}
                            </span>

                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />

                          </div>

                        </td>

                        <td className="p-4">

                          <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded-md text-xs">
                            {product.category ||
                              "N/A"}
                          </span>

                        </td>

                        <td
                          className={`p-4 font-medium ${
                            Number(
                              product.stock
                            ) > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {product.stock ?? 0}
                        </td>

                        <td className="p-4 text-gray-600 whitespace-nowrap">
                          {formatDate(
                            product.createdAt
                          )}
                        </td>

                        <td className="p-4">

                          <div className="flex gap-3">

                            <button
                              type="button"
                              title="Edit"
                              onClick={() =>
                                handleEdit(
                                  product._id
                                )
                              }
                              className="text-blue-600 hover:text-blue-800 transition"
                            >
                              <Pencil className="w-5 h-5" />
                            </button>

                            <button
                              type="button"
                              title="Delete"
                              onClick={() =>
                                handleDelete(
                                  product._id
                                )
                              }
                              className="text-red-600 hover:text-red-800 transition"
                            >
                              <Trash className="w-5 h-5" />
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {validProducts.map(
                (product, index) => (

                  <div
                    key={
                      product._id ||
                      index
                    }
                    className="bg-white rounded-2xl shadow p-5 flex flex-col gap-4 hover:shadow-xl transition"
                  >

                    <div className="flex justify-between items-center text-sm text-gray-500">

                      <span>
                        #{index + 1}
                      </span>

                      <div className="flex gap-3">

                        <button
                          type="button"
                          title="Edit"
                          onClick={() =>
                            handleEdit(
                              product._id
                            )
                          }
                          className="text-blue-600 hover:text-blue-800 transition"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>

                        <button
                          type="button"
                          title="Delete"
                          onClick={() =>
                            handleDelete(
                              product._id
                            )
                          }
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <Trash className="w-5 h-5" />
                        </button>

                      </div>

                    </div>

                    <div className="relative overflow-hidden rounded-xl bg-gray-50">

                      <img
                        src={getProductImage(
                          product
                        )}
                        alt={
                          product.name ||
                          "Product"
                        }
                        className="w-full h-48 object-contain transition duration-300 hover:scale-105"
                        onError={
                          handleImageError
                        }
                      />

                    </div>

                    <h3 className="text-xl font-semibold text-gray-800">
                      {product.name}
                    </h3>

                    <div className="space-y-3 text-sm text-gray-700">

                      <div className="flex justify-between">

                        <span>
                          Price
                        </span>

                        <span className="font-semibold">
                          ₹
                          {Number(
                            product.price ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </span>

                      </div>

                      <div className="flex justify-between items-center">

                        <span>
                          Rating
                        </span>

                        <span className="flex items-center gap-1">

                          {product.ratings ??
                            0}

                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />

                        </span>

                      </div>

                      <div className="flex justify-between items-center">

                        <span>
                          Category
                        </span>

                        <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs">
                          {product.category ||
                            "N/A"}
                        </span>

                      </div>

                      <div className="flex justify-between">

                        <span>
                          Stock
                        </span>

                        <span
                          className={`font-medium ${
                            Number(
                              product.stock
                            ) > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {product.stock ??
                            0}
                        </span>

                      </div>

                      <div className="flex justify-between">

                        <span>
                          Created
                        </span>

                        <span className="text-gray-600">
                          {formatDate(
                            product.createdAt
                          )}
                        </span>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>
      </main>

      <Footer />
    </>
  );
};

export default ProductList;
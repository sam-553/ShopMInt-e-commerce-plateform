import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Package,
  ShoppingCart,
  Star,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  User,
} from "lucide-react";

import {
  fetchAdminProducts,
  fetchAllOrders,
} from "../../redux/features/admin/adminSlice";

import Loader from "../Loader/page";
import Navbar from "../Navbar/page";
import Footer from "../Footer/page";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    user,
    loading: userLoading,
    isAuthenticated,
  } = useSelector((state) => state.user);

  const {
    products = [],
    orders = [],
    totalAmount = 0,
    loading: adminLoading,
  } = useSelector((state) => state.admin);

  useEffect(() => {
    if (
      !userLoading &&
      (!isAuthenticated || !user || user.role !== "admin")
    ) {
      navigate("/");
    }
  }, [
    user,
    userLoading,
    isAuthenticated,
    navigate,
  ]);

  useEffect(() => {
    if (
      !userLoading &&
      isAuthenticated &&
      user?.role === "admin"
    ) {
      dispatch(fetchAdminProducts());
      dispatch(fetchAllOrders());
    }
  }, [
    dispatch,
    user,
    userLoading,
    isAuthenticated,
  ]);

  const totalProducts = Array.isArray(products)
    ? products.length
    : 0;

  const totalOrders = Array.isArray(orders)
    ? orders.length
    : 0;

  const outOfStock = Array.isArray(products)
    ? products.filter(
        (product) => Number(product.stock) === 0
      ).length
    : 0;

  const inStock = Array.isArray(products)
    ? products.filter(
        (product) => Number(product.stock) > 0
      ).length
    : 0;

  const totalReviews = Array.isArray(products)
    ? products.reduce(
        (total, product) =>
          total +
          (Array.isArray(product.reviews)
            ? product.reviews.length
            : 0),
        0
      )
    : 0;

  const revenue = Number(totalAmount) || 0;

  const stats = [
    {
      label: "Total Products",
      value: totalProducts,
      icon: (
        <Package className="text-indigo-500 w-6 h-6" />
      ),
    },
    {
      label: "Total Orders",
      value: totalOrders,
      icon: (
        <ShoppingCart className="text-green-500 w-6 h-6" />
      ),
    },
    {
      label: "Total Reviews",
      value: totalReviews,
      icon: (
        <Star className="text-yellow-500 w-6 h-6" />
      ),
    },
    {
      label: "Total Revenue",
      value: `₹${revenue.toLocaleString("en-IN")}`,
      icon: (
        <DollarSign className="text-emerald-500 w-6 h-6" />
      ),
    },
    {
      label: "Out of Stock",
      value: outOfStock,
      icon: (
        <AlertTriangle className="text-red-500 w-6 h-6" />
      ),
    },
    {
      label: "In Stock",
      value: inStock,
      icon: (
        <CheckCircle className="text-green-600 w-6 h-6" />
      ),
    },
  ];

  const sidebarSections = [
    {
      title: "Products",
      items: [
        "All Products",
        "Create Product",
      ],
      links: [
        "productList",
        "uploadProduct",
      ],
      icon: Package,
    },
    {
      title: "Users",
      items: ["All Users"],
      links: ["allUsers"],
      icon: User,
    },
    {
      title: "Orders",
      items: ["All Orders"],
      links: ["allOrder"],
      icon: ShoppingCart,
    },
    {
      title: "Reviews",
      items: ["All Reviews"],
      links: ["reviewList"],
      icon: Star,
    },
  ];

  const socialStats = [
    {
      label: "Instagram",
      followers: "122k",
      posts: 12,
      icon: "IG",
      style: "bg-pink-100 text-pink-600",
    },
    {
      label: "LinkedIn",
      followers: "45k",
      posts: 34,
      icon: "in",
      style: "bg-blue-100 text-blue-600",
    },
    {
      label: "Facebook",
      followers: "78k",
      posts: 20,
      icon: "f",
      style: "bg-blue-100 text-blue-700",
    },
  ];

  if (userLoading || adminLoading) {
    return <Loader />;
  }

  if (
    !isAuthenticated ||
    !user ||
    user.role !== "admin"
  ) {
    return null;
  }

  return (
    <>
      <Navbar />

      <div className="grid grid-cols-1 md:grid-cols-4 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 mt-16">
        <aside className="bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6 md:col-span-1 flex flex-col gap-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-6 h-6 text-indigo-400" />

            <h1 className="text-xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
          </div>

          <div className="border-t border-gray-700" />

          {sidebarSections.map(
            (section, index) => {
              const SectionIcon =
                section.icon;

              return (
                <div key={index}>
                  <p className="font-semibold mb-2 text-xs text-gray-400 uppercase tracking-wide">
                    {section.title}
                  </p>

                  <ul className="space-y-1">
                    {section.items.map(
                      (item, idx) => (
                        <li
                          key={idx}
                          className="hover:bg-gray-700 rounded-lg px-3 py-2 transition flex items-center gap-2 group"
                        >
                          <SectionIcon className="w-4 h-4 text-indigo-300 group-hover:text-indigo-400 transition" />

                          <Link
                            to={`/${section.links[idx]}`}
                            className="text-sm w-full"
                          >
                            {item}
                          </Link>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              );
            }
          )}
        </aside>

        <main className="p-6 md:col-span-3 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {stats.map(
              (item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow hover:shadow-xl p-6 flex flex-col justify-center items-center transition transform hover:scale-105"
                >
                  {item.icon}

                  <p className="text-gray-600 mt-2 text-sm">
                    {item.label}
                  </p>

                  <p className="text-2xl font-bold mt-1">
                    {item.value}
                  </p>
                </div>
              )
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {socialStats.map(
              (item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow hover:shadow-xl p-10 flex flex-col justify-center items-center transition transform hover:scale-105"
                >
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold ${item.style}`}
                  >
                    {item.icon}
                  </div>

                  <p className="mt-3 text-center text-gray-700 font-medium">
                    {item.label}
                  </p>

                  <p className="text-sm text-gray-700">
                    {item.followers} followers,{" "}
                    {item.posts} posts
                  </p>
                </div>
              )
            )}
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default AdminDashboard;
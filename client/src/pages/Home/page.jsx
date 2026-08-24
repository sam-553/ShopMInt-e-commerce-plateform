import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { getproduct } from "../../redux/features/products/productSlice";

import Banner from "../../component/Banner/page.jsx";

import Footer from "../../component/Footer/page.jsx";
import Navbar from "../../component/Navbar/page.jsx";
import Loader from "../../component/Loader/page.jsx";
import ProductCard from "../../component/ProductCard/page.jsx";

const Home = () => {
  const dispatch = useDispatch();

  const {
    product = [],
    loading,
    error,
  } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(
      getproduct({
        keyword: "",
        page: 1,
        category: "",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Something went wrong"
      );
    }
  }, [error]);

  const products = Array.isArray(product) ? product : [];

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />

      <Banner />

      <main className="p-8 mt-12 flex flex-col items-center text-gray-800">
        <h2 className="text-4xl font-semibold mb-8 text-center text-gray-800">
          Trending Now
        </h2>

        {products.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">
              No products available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-[1200px] p-4">
            {products.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default Home;
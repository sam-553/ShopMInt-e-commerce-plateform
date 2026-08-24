import React, { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";

import { getproduct } from "../../redux/features/products/productSlice";


import Navbar from "../Navbar/page.jsx";
import Loader from "../Loader/page.jsx";

import NoProductFound from "../noproduct/page.jsx";
import Footer from "../Footer/page.jsx";
import Pagination from "../Pagination/page.jsx";
import productCategory from "../Category/page.jsx";
import Productcard from "../Productcard/page.jsx";

const ProductsContent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // IMPORTANT:
    // useSearchParams returns [searchParams, setSearchParams]
    const [searchParams] = useSearchParams();

    const [keyword, setKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [category, setCategory] = useState("");

    const {
        product = [],
        loading,
        error,
        totalpages = 1,
    } = useSelector((state) => state.product);

    // Read URL parameters
    useEffect(() => {
        const kw = searchParams.get("keyword") || "";

        const page =
            parseInt(searchParams.get("page"), 10) || 1;

        const cat =
            searchParams.get("category") || "";

        setKeyword(kw);
        setCurrentPage(page);
        setCategory(cat);
    }, [searchParams]);

    // Fetch products
    useEffect(() => {
        dispatch(
            getproduct({
                keyword,
                page: currentPage,
                category,
            })
        );
    }, [dispatch, keyword, currentPage, category]);

    // Handle empty product results
    useEffect(() => {
        if (loading || error || product.length !== 0) {
            return;
        }

        const params = new URLSearchParams(
            searchParams.toString()
        );

        let modified = false;

        // Keyword + category
        if (keyword && category) {
            toast.info(
                "No products found for this keyword in this category. Showing category products."
            );

            params.delete("keyword");
            params.set("page", "1");

            modified = true;
        }

        // Category only
        else if (category) {
            toast.info(
                "No products found in this category. Showing all products."
            );

            params.delete("category");
            params.set("page", "1");

            modified = true;
        }

        // Keyword only
        else if (keyword) {
            toast.info(
                "No products found for this keyword. Showing all products."
            );

            params.delete("keyword");
            params.set("page", "1");

            modified = true;
        }

        if (modified) {
            const query = params.toString();

            navigate(
                query
                    ? `/products?${query}`
                    : "/products"
            );
        }
    }, [
        loading,
        product,
        keyword,
        category,
        searchParams,
        navigate,
        error,
    ]);

    // Show API errors
    useEffect(() => {
        if (error) {
            toast.error(
                typeof error === "string"
                    ? error
                    : "Failed to load products"
            );
        }
    }, [error]);

    // Pagination
    const handlePageChange = (_, page) => {
        const params = new URLSearchParams(
            searchParams.toString()
        );

        if (page === 1) {
            params.delete("page");
        } else {
            params.set("page", page);
        }

        if (keyword) {
            params.set("keyword", keyword);
        } else {
            params.delete("keyword");
        }

        if (category) {
            params.set("category", category);
        } else {
            params.delete("category");
        }

        const query = params.toString();

        navigate(
            query
                ? `/products?${query}`
                : "/products"
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // Category selection
    const handleCategoryClick = (catValue) => {
        const params = new URLSearchParams(
            searchParams.toString()
        );

        if (catValue) {
            params.set("category", catValue);
        } else {
            params.delete("category");
        }

        if (keyword) {
            params.set("keyword", keyword);
        } else {
            params.delete("keyword");
        }

        // Always reset page when category changes
        params.delete("page");

        const query = params.toString();

        navigate(
            query
                ? `/products?${query}`
                : "/products"
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <>
            <Navbar />

            <div className="flex flex-col md:flex-row gap-6 p-4 md:p-8 min-h-screen mt-16">

                {/* Categories Sidebar */}
                <div className="w-full md:w-1/4 bg-white p-6 shadow-md rounded-2xl border border-gray-200">

                    <h2 className="text-2xl font-bold mb-6 border-b pb-3 text-gray-800">
                        Categories
                    </h2>

                    <ul className="space-y-1">

                        {/* All Categories */}
                        <li>
                            <button
                                type="button"
                                onClick={() =>
                                    handleCategoryClick("")
                                }
                                aria-pressed={!category}
                                className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${!category
                                        ? "bg-gray-200 text-gray-900 font-semibold ring-1 ring-gray-300"
                                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    }`}
                            >
                                All Categories
                            </button>
                        </li>

                        {/* Categories */}
                        {Array.isArray(productCategory) &&
                            productCategory.map((cat) => (
                                <li key={cat.id}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleCategoryClick(
                                                cat.value
                                            )
                                        }
                                        aria-pressed={
                                            cat.value === category
                                        }
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${cat.value === category
                                                ? "bg-gray-200 text-gray-900 font-semibold ring-1 ring-gray-300"
                                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                            }`}
                                    >
                                        {cat.label}
                                    </button>
                                </li>
                            ))}
                    </ul>
                </div>

                {/* Products Section */}
                <div className="w-full md:w-3/4">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

                        {/* Loading */}
                        {loading ? (
                            <div className="col-span-full flex justify-center items-center h-32">
                                <Loader
                                    size={35}
                                    color="#4F46E5"
                                />
                            </div>
                        ) : product.length > 0 ? (

                            /* Products */
                            product.map((item) => (
                                <Productcard
                                    product={item}
                                    key={item._id}
                                />
                            ))

                        ) : (

                            /* No Products */
                            <div className="col-span-full text-center text-gray-600">
                                <NoProductFound
                                    keyword={keyword}
                                />
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {Number(totalpages) > 1 && (
                        <div className="mt-10 flex justify-center">
                            <Pagination
                                count={Number(totalpages)}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="standard"
                            />
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
};

const Products = () => {
    return (
        <Suspense
            fallback={
                <Loader
                    size={40}
                    color="#4F46E5"
                />
            }
        >
            <ProductsContent />
        </Suspense>
    );
};

export default Products;
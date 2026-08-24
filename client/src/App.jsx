import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Keep Loader as a normal import if it is small
import Loader from "./component/Loader/page.jsx";

// Lazy load pages/components
const Home = lazy(() => import("./page.jsxs/Home/page.jsx"));
const Login = lazy(() => import("./page.jsxs/Login/page.jsx"));
const Signup = lazy(() => import("./page.jsxs/Signup/page.jsx"));

const UserProfile = lazy(() => import("./component/UserProfile/page.jsx"));
const UpdatePassword = lazy(() => import("./component/UpdatePassword/page.jsx"));

const AdminDashboard = lazy(
  () => import("./component/AdminDashboard/page.jsx")
);

const UploadProduct = lazy(
  () => import("./component/UploadProduct/page.jsx")
);

const ProductList = lazy(
  () => import("./component/ProductList/page.jsx")
);

const UpdateProduct = lazy(
  () => import("./component/UpdateProduct/[id]/page.jsx")
);

const AllUsers = lazy(
  () => import("./component/AllUsers/page.jsx")
);

const UpdateUser = lazy(
  () => import("./component/UpdateUser/[id]/page.jsx")
);

const ProductDetails = lazy(
  () => import("./component/ProductDetails/[id]/page.jsx")
);

const Cartitem = lazy(
  () => import("./component/CartItem/page.jsx")
);

const Shipping = lazy(
  () => import("./component/Shipping/page.jsx")
);

const ConfirmOrder = lazy(
  () => import("./component/ConfirmOrder/page.jsx")
);

const AddPayment = lazy(
  () => import("./component/AddPayment/page.jsx")
);

const PaymentSuccess = lazy(
  () => import("./component/PaymentSuccess/page.jsx")
);

const Orders = lazy(
  () => import("./component/Orders/page.jsx")
);

const VieworderDetails = lazy(
  () => import("./component/VieworderDetails/[id]/page.jsx")
);

const Products = lazy(
  () => import("./component/Products/page.jsx")
);

const AllOrders = lazy(
  () => import("./component/AllOrder/page.jsx")
);

const UpdateOrder = lazy(
  () => import("./component/UpdateOrder/[id]/page.jsx")
);

const AdminReview = lazy(
  () => import("./component/ReviewList/page.jsx")
);

const ForgotPassword = lazy(
  () => import("./component/forgotPassword/page.jsx")
);

const ResetPassword = lazy(
  () => import("./component/ResetPassword/[token]/page.jsx")
);

const App = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/forgotPassword"
          element={<ForgotPassword />}
        />

        <Route
          path="/resetPassword/:token"
          element={<ResetPassword />}
        />

        {/* User Routes */}
        <Route
          path="/userProfile"
          element={<UserProfile />}
        />

        <Route
          path="/updatePassword"
          element={<UpdatePassword />}
        />

        <Route
          path="/cartItem"
          element={<Cartitem />}
        />

        <Route
          path="/shipping"
          element={<Shipping />}
        />

        <Route
          path="/confirmOrder"
          element={<ConfirmOrder />}
        />

        <Route
          path="/addPayment"
          element={<AddPayment />}
        />

        <Route
          path="/paymentSuccess"
          element={<PaymentSuccess />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        <Route
          path="/vieworderDetails/:id"
          element={<VieworderDetails />}
        />

        {/* Product Routes */}
        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/productDetails/:id"
          element={<ProductDetails />}
        />

        {/* Admin Routes */}
        <Route
          path="/adminDashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/uploadProduct"
          element={<UploadProduct />}
        />

        <Route
          path="/productList"
          element={<ProductList />}
        />

        <Route
          path="/updateProduct/:id"
          element={<UpdateProduct />}
        />

        <Route
          path="/allUsers"
          element={<AllUsers />}
        />

        <Route
          path="/updateUser/:id"
          element={<UpdateUser />}
        />

        <Route
          path="/allOrder"
          element={<AllOrders />}
        />

        <Route
          path="/updateOrder/:id"
          element={<UpdateOrder />}
        />

        <Route
          path="/reviewList"
          element={<AdminReview />}
        />
      </Routes>
    </Suspense>
  );
};

export default App;
import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Keep Loader as a normal import if it is small
import Loader from "./component/Loader/page";

// Lazy load pages/components
const Home = lazy(() => import("./pages/Home/page"));
const Login = lazy(() => import("./pages/Login/page"));
const Signup = lazy(() => import("./pages/Signup/page"));

const UserProfile = lazy(() => import("./component/UserProfile/page"));
const UpdatePassword = lazy(() => import("./component/UpdatePassword/page"));

const AdminDashboard = lazy(
  () => import("./component/AdminDashboard/page")
);

const UploadProduct = lazy(
  () => import("./component/UploadProduct/page")
);

const ProductList = lazy(
  () => import("./component/ProductList/page")
);

const UpdateProduct = lazy(
  () => import("./component/UpdateProduct/[id]/page")
);

const AllUsers = lazy(
  () => import("./component/AllUsers/page")
);

const UpdateUser = lazy(
  () => import("./component/UpdateUser/[id]/page")
);

const ProductDetails = lazy(
  () => import("./component/ProductDetails/[id]/page")
);

const Cartitem = lazy(
  () => import("./component/CartItem/page")
);

const Shipping = lazy(
  () => import("./component/Shipping/page")
);

const ConfirmOrder = lazy(
  () => import("./component/ConfirmOrder/page")
);

const AddPayment = lazy(
  () => import("./component/AddPayment/page")
);

const PaymentSuccess = lazy(
  () => import("./component/PaymentSuccess/page")
);

const Orders = lazy(
  () => import("./component/Orders/page")
);

const VieworderDetails = lazy(
  () => import("./component/VieworderDetails/[id]/page")
);

const Products = lazy(
  () => import("./component/Products/page")
);

const AllOrders = lazy(
  () => import("./component/AllOrder/page")
);

const UpdateOrder = lazy(
  () => import("./component/UpdateOrder/[id]/page")
);

const AdminReview = lazy(
  () => import("./component/ReviewList/page")
);

const ForgotPassword = lazy(
  () => import("./component/forgotPassword/page")
);

const ResetPassword = lazy(
  () => import("./component/ResetPassword/[token]/page")
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
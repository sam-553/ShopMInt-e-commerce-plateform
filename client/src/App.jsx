import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login/page";
import Signup from "./pages/Signup/page";

import Home from "./pages/Home/page";
import UserProfile from "./component/UserProfile/page";
import UpdatePassword from "./component/UpdatePassword/page";
import AdminDashboard from "./component/AdminDashboard/page";
import UploadProduct from "./component/UploadProduct/page";
import ProductList from "./component/ProductList/page";
import UpdateProduct from "./component/UpdateProduct/[id]/page";
import AllUsers from "./component/AllUsers/page";
import UpdateUser from "./component/UpdateUser/[id]/page";
import ProductDetails from "./component/ProductDetails/[id]/page";
import Cartitem from "./component/CartItem/page";
import Shipping from "./component/Shipping/page";
import ConfirmOrder from "./component/ConfirmOrder/page";
import AddPayment from "./component/AddPayment/page";
import PaymentSuccess from "./component/PaymentSuccess/page";
import Orders from "./component/Orders/page";
import VieworderDetails from "./component/VieworderDetails/[id]/page";
import Products from "./component/Products/page";
import AllOrders from "./component/AllOrder/page";
import UpdateOrder from "./component/UpdateOrder/[id]/page";
import AdminReview from "./component/ReviewList/page";
import ForgotPassword from "./component/forgotPassword/page";
import ResetPassword from "./component/ResetPassword/[token]/page";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/home" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/userProfile" element={<UserProfile/>} />
      <Route path="/updatePassword" element={<UpdatePassword/>} />
      <Route path="/adminDashboard" element={<AdminDashboard/>} />
      <Route path="/uploadProduct" element={<UploadProduct/>} />
      <Route path="/productList" element={<ProductList/>} />
      <Route path="/updateProduct/:id" element={<UpdateProduct/>} />
      <Route path="/allUsers" element={<AllUsers/>} />
      <Route path="/updateUser/:id" element={<UpdateUser/>} />
      <Route path="/productDetails/:id" element={<ProductDetails/>} />
      <Route path="/cartItem" element={<Cartitem/>} />
      <Route path="/shipping" element={<Shipping/>} />
      <Route path="/confirmOrder" element={<ConfirmOrder/>} />
      <Route path="/addPayment" element={<AddPayment/>} />
      <Route path="/paymentSuccess" element={<PaymentSuccess/>} />
      <Route path="/orders" element={<Orders/>} />
      <Route path="/vieworderDetails/:id" element={<VieworderDetails/>} />
      <Route path="/products" element={<Products/>} />
      <Route path="/allOrder" element={<AllOrders/>} />
      <Route path="/updateOrder/:id" element={<UpdateOrder/>} />
      <Route path="/reviewList" element={<AdminReview/>} />
      <Route path="/forgotPassword" element={<ForgotPassword/>} />
      <Route path="/resetPassword/:token" element={<ResetPassword/>} />


      

    
     
    </Routes>
  );
};

export default App;
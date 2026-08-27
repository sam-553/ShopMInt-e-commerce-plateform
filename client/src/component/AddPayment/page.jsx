import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Navbar from "../Navbar/page.jsx";
import Footer from "../Footer/page.jsx";
import CheckoutPath from "../CheckoutPath/page.jsx";

const API_URL = `${import.meta.env.VITE_BASE_URL}/api/payment`;

const AddPayment = () => {
  const navigate = useNavigate();

  const { shippingInfo, cartItems = [] } = useSelector(
    (state) => state.cart
  );

  const { user } = useSelector((state) => state.user);

  const [hydrated, setHydrated] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null;
  }

  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc +
      Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const shippingCharges = subtotal > 1000 ? 0 : 100;
  const tax = subtotal * 0.18;
  const total = subtotal + shippingCharges + tax;

  // IMPORTANT:
  // Authentication is handled by the HTTP-only cookie.
  // Do NOT depend on localStorage.getItem("token").
  const authConfig = {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const completePayment = async () => {
    if (paymentLoading) {
      return;
    }

    try {
      setPaymentLoading(true);

      // Check Redux user instead of localStorage token
      if (!user) {
        toast.error("Please login again to continue payment.");
        setPaymentLoading(false);
        navigate("/login");
        return;
      }

      if (!cartItems.length) {
        toast.error("Your cart is empty.");
        setPaymentLoading(false);
        navigate("/cart");
        return;
      }

      if (!shippingInfo) {
        toast.error("Please complete your shipping information.");
        setPaymentLoading(false);
        navigate("/shipping");
        return;
      }

      if (total <= 0) {
        toast.error("Invalid payment amount.");
        setPaymentLoading(false);
        return;
      }

      console.log("Starting payment...");
      console.log("User:", user);
      console.log("Amount:", Math.round(total));

      // ------------------------------------------------
      // 1. GET RAZORPAY KEY
      // ------------------------------------------------

      const keyResponse = await axios.get(
        `${API_URL}/getKey`,
        authConfig
      );

      console.log("Razorpay key response:", keyResponse.data);

      const razorpayKey =
        keyResponse.data?.key ||
        keyResponse.data?.Key ||
        keyResponse.data?.razorpayKey;

      if (!razorpayKey) {
        throw new Error(
          "Razorpay key was not received from server."
        );
      }

      // ------------------------------------------------
      // 2. CREATE RAZORPAY ORDER
      // ------------------------------------------------

      const orderResponse = await axios.post(
        `${API_URL}/processPayment`,
        {
          amount: Math.round(total),
        },
        authConfig
      );

      console.log(
        "Razorpay order response:",
        orderResponse.data
      );

      const order =
        orderResponse.data?.order ||
        orderResponse.data?.data?.order;

      if (!order) {
        throw new Error(
          "Razorpay order was not created."
        );
      }

      const razorpayOrderId = order.id;

      if (!razorpayOrderId) {
        throw new Error(
          "Razorpay order ID is missing."
        );
      }

      // ------------------------------------------------
      // 3. CHECK RAZORPAY SDK
      // ------------------------------------------------

      if (!window.Razorpay) {
        toast.error(
          "Razorpay SDK not loaded. Please refresh the page."
        );
        setPaymentLoading(false);
        return;
      }

      // ------------------------------------------------
      // 4. RAZORPAY OPTIONS
      // ------------------------------------------------

      const options = {
        key: razorpayKey,

        amount: order.amount,

        currency: order.currency || "INR",

        name: "ShopMint",

        description: "ShopMint Order Payment",

        order_id: razorpayOrderId,

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: shippingInfo?.phone || "",
        },

        notes: {
          address: [
            shippingInfo?.address,
            shippingInfo?.city,
            shippingInfo?.state,
            shippingInfo?.country,
            shippingInfo?.pincode,
          ]
            .filter(Boolean)
            .join(", "),
        },

        theme: {
          color: "#3399cc",
        },

        // ------------------------------------------------
        // 5. PAYMENT SUCCESS
        // ------------------------------------------------

        handler: async function (response) {
          try {
            console.log(
              "Razorpay payment response:",
              response
            );

            const verificationResponse =
              await axios.post(
                `${API_URL}/paymentVerification`,
                {
                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,
                },
                authConfig
              );

            console.log(
              "Payment verification response:",
              verificationResponse.data
            );

            if (verificationResponse.data?.success) {
              toast.success("Payment successful!");

              setPaymentLoading(false);

              const reference =
                verificationResponse.data?.reference ||
                response.razorpay_payment_id;

              navigate(
                `/paymentSuccess?reference=${reference}`
              );
            } else {
              setPaymentLoading(false);

              toast.error(
                verificationResponse.data?.message ||
                  "Payment verification failed."
              );
            }
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            setPaymentLoading(false);

            if (error.response?.status === 401) {
              toast.error(
                "Your login session has expired. Please login again."
              );

              navigate("/login");
              return;
            }

            toast.error(
              error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Payment verification failed."
            );
          }
        },

        // ------------------------------------------------
        // 6. PAYMENT MODAL CLOSED
        // ------------------------------------------------

        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
            toast.info("Payment cancelled.");
          },
        },
      };

      // ------------------------------------------------
      // 7. OPEN RAZORPAY
      // ------------------------------------------------

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.error(
          "Razorpay payment failed:",
          response.error
        );

        setPaymentLoading(false);

        toast.error(
          response.error?.description ||
            "Payment could not be completed."
        );
      });

      razorpay.open();

    } catch (error) {
      console.error(
        "Payment processing error:",
        error
      );

      setPaymentLoading(false);

      const status = error.response?.status;

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Payment processing failed.";

      console.error("Payment status:", status);
      console.error("Payment message:", message);

      if (status === 401) {
        toast.error(
          "Your login session has expired. Please login again."
        );

        navigate("/login");
        return;
      }

      toast.error(message);
    }
  };

  return (
    <>
      <Navbar />

      <main className="container mx-auto px-4 py-10 mt-16 max-w-2xl">
        <CheckoutPath activepath={2} />

        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-gray-800">
          Payment
        </h1>

        <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transition hover:shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
            Order Summary
          </h2>

          <div className="space-y-3 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping Charges:</span>
              <span>
                ₹{shippingCharges.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Tax:</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row justify-center gap-4">
            <button
              type="button"
              onClick={completePayment}
              disabled={paymentLoading}
              className={`w-full md:w-[60%] bg-gray-700 hover:bg-gray-900 text-white py-3 rounded-xl font-semibold shadow-md transition ${
                paymentLoading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {paymentLoading
                ? "Processing..."
                : "Pay Now"}
            </button>

            <button
              type="button"
              onClick={handleGoBack}
              disabled={paymentLoading}
              className="w-full md:w-[30%] bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-semibold shadow-md transition"
            >
              Go Back
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default AddPayment;
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Loader2,
  PackageCheck,
  ShoppingCart,
  Truck,
  IndianRupee,
} from "lucide-react";
import { getSingleOrder } from "../../../redux/features/order/orderSlice";
import Navbar from "../../Navbar/page.jsx";
import Footer from "../../Footer/page.jsx";


const VieworderDetails = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const { order, loading, error } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    if (id) {
      dispatch(getSingleOrder(id));
    }
  }, [dispatch, id]);

  return (
    <>
      <Navbar />

      <main className="container mx-auto px-4 py-12 mt-16 max-w-4xl min-h-screen">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-800 mb-10">
          Order Details
        </h1>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center text-gray-600 py-10">
            <Loader2 className="animate-spin mr-2 w-6 h-6" />
            Loading your order...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center bg-red-50 border border-red-200 text-red-600 rounded-xl p-5">
            {typeof error === "string"
              ? error
              : error?.message || "Something went wrong"}
          </div>
        )}

        {/* Order */}
        {!loading &&
          !error &&
          order &&
          Array.isArray(order.orderItems) && (
            <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-6 sm:p-8 space-y-8">

              {/* Order ID */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-700">
                <div className="flex items-center gap-2">
                  <PackageCheck className="w-6 h-6" />
                  <span className="font-semibold">Order ID:</span>
                </div>

                <span className="text-sm text-gray-500 break-all">
                  {order._id}
                </span>
              </div>

              <hr className="border-gray-200" />

              {/* Order Information */}
              <section>
                <h2 className="text-2xl font-bold text-gray-700 mb-4">
                  Order Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoCard
                    label="Order Status"
                    value={order.orderStatus || "Pending"}
                    color={
                      order.orderStatus === "Delivered"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }
                  />

                  <InfoCard
                    label="Payment Status"
                    value={
                      order.paymentInfo?.status === "paid"
                        ? "Paid"
                        : "Pending"
                    }
                    color={
                      order.paymentInfo?.status === "paid"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  />

                  <InfoCard
                    label="Paid At"
                    value={
                      order.paidAt
                        ? new Date(order.paidAt).toLocaleString()
                        : "Not Paid"
                    }
                  />

                  <InfoCard
                    label="Ordered On"
                    value={
                      order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : "N/A"
                    }
                  />
                </div>
              </section>

              <hr className="border-gray-200" />

              {/* Items */}
              <section>
                <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-700 mb-5">
                  <ShoppingCart />
                  Items Ordered
                </h2>

                <div className="overflow-x-auto rounded-2xl border border-gray-200">
                  {/* Header */}
                  <div className="min-w-[600px] grid grid-cols-12 gap-2 bg-gray-100 text-gray-700 font-semibold text-sm py-4 px-4">
                    <div className="col-span-2 text-center">
                      Image
                    </div>

                    <div className="col-span-4">
                      Product Name
                    </div>

                    <div className="col-span-3 text-center">
                      Quantity
                    </div>

                    <div className="col-span-3 text-center">
                      Price
                    </div>
                  </div>

                  {/* Rows */}
                  {order.orderItems.map((item, index) => (
                    <div
                      key={item._id || item.product || index}
                      className="min-w-[600px] grid grid-cols-12 gap-2 items-center py-4 px-4 border-t border-gray-200 hover:bg-gray-50"
                    >
                      {/* Image */}
                      <div className="col-span-2 flex justify-center">
                        <img
                          src={item.image}
                          alt={item.name || "Product"}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                          onError={(e) => {
                            e.currentTarget.src =
                              "/images/assest/signin.png";
                          }}
                        />
                      </div>

                      {/* Name */}
                      <div className="col-span-4">
                        <p className="font-medium text-gray-800">
                          {item.name || "Product"}
                        </p>
                      </div>

                      {/* Quantity */}
                      <div className="col-span-3 text-center text-gray-700 font-medium">
                        {item.quantity || 0}
                      </div>

                      {/* Price */}
                      <div className="col-span-3 text-center text-gray-800 font-semibold">
                        ₹{Number(item.price || 0).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <hr className="border-gray-200" />

              {/* Price */}
              <section>
                <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-700 mb-5">
                  <IndianRupee />
                  Price Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoCard
                    label="Items Price"
                    value={`₹${Number(
                      order.itemPrice || 0
                    ).toFixed(2)}`}
                  />

                  <InfoCard
                    label="Tax Price"
                    value={`₹${Number(
                      order.taxPrice || 0
                    ).toFixed(2)}`}
                  />

                  <InfoCard
                    label="Shipping Price"
                    value={`₹${Number(
                      order.shippingPrice || 0
                    ).toFixed(2)}`}
                  />

                  <InfoCard
                    label="Total Price"
                    value={`₹${Number(
                      order.totalPrice || 0
                    ).toFixed(2)}`}
                    valueClass="text-lg text-green-600"
                  />
                </div>
              </section>

              <hr className="border-gray-200" />

              {/* Shipping */}
              <section>
                <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-700 mb-5">
                  <Truck />
                  Shipping Information
                </h2>

                <div className="bg-gray-50 rounded-xl p-5 text-gray-700 space-y-2">
                  <p>
                    <strong>Address:</strong>{" "}
                    {order.shippingInfo?.address || "N/A"}
                  </p>

                  <p>
                    <strong>City:</strong>{" "}
                    {order.shippingInfo?.city || "N/A"}
                  </p>

                  <p>
                    <strong>State:</strong>{" "}
                    {order.shippingInfo?.state || "N/A"}
                  </p>

                  <p>
                    <strong>PIN Code:</strong>{" "}
                    {order.shippingInfo?.pinCode || "N/A"}
                  </p>

                  <p>
                    <strong>Phone:</strong>{" "}
                    {order.shippingInfo?.phoneNo || "N/A"}
                  </p>
                </div>
              </section>
            </div>
          )}

        {/* No order */}
        {!loading &&
          !error &&
          (!order || !Array.isArray(order.orderItems)) && (
            <p className="text-center text-gray-500 py-10">
              No order details found.
            </p>
          )}
      </main>

      <Footer />
    </>
  );
};

/* Reusable information card */
const InfoCard = ({
  label,
  value,
  color = "text-gray-800",
  valueClass = "",
}) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="text-gray-500 text-sm mb-1">
        {label}
      </div>

      <div className={`font-semibold ${color} ${valueClass}`}>
        {value}
      </div>
    </div>
  );
};

export default VieworderDetails;
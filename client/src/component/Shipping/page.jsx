import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { saveShippingInfo } from "../../redux/features/cart/cartSlice";
import Navbar from "../Navbar/page.jsx";
import Checkoutpath from "../checkoutPath/page.jsx";
import Footer from "../Footer/page.jsx";

const INDIA_STATES = {
  "Andhra Pradesh": [
    "Visakhapatnam",
    "Vijayawada",
    "Guntur",
    "Tirupati",
    "Nellore",
  ],

  "Arunachal Pradesh": [
    "Itanagar",
    "Tawang",
    "Naharlagun",
    "Pasighat",
  ],

  Assam: [
    "Guwahati",
    "Dibrugarh",
    "Silchar",
    "Jorhat",
    "Tezpur",
  ],

  Bihar: [
    "Patna",
    "Gaya",
    "Muzaffarpur",
    "Bhagalpur",
    "Darbhanga",
  ],

  Chhattisgarh: [
    "Raipur",
    "Bhilai",
    "Bilaspur",
    "Korba",
    "Durg",
  ],

  Goa: [
    "Panaji",
    "Margao",
    "Vasco da Gama",
    "Mapusa",
  ],

  Gujarat: [
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    "Gandhinagar",
  ],

  Haryana: [
    "Gurugram",
    "Faridabad",
    "Panipat",
    "Ambala",
    "Hisar",
  ],

  "Himachal Pradesh": [
    "Shimla",
    "Manali",
    "Dharamshala",
    "Solan",
    "Mandi",
  ],

  Jharkhand: [
    "Ranchi",
    "Jamshedpur",
    "Dhanbad",
    "Bokaro",
    "Deoghar",
  ],

  Karnataka: [
    "Bengaluru",
    "Mysuru",
    "Mangaluru",
    "Hubballi",
    "Belagavi",
  ],

  Kerala: [
    "Thiruvananthapuram",
    "Kochi",
    "Kozhikode",
    "Kollam",
    "Thrissur",
  ],

  "Madhya Pradesh": [
    "Bhopal",
    "Indore",
    "Jabalpur",
    "Gwalior",
    "Ujjain",
  ],

  Maharashtra: [
    "Mumbai",
    "Pune",
    "Nagpur",
    "Nashik",
    "Aurangabad",
  ],

  Manipur: [
    "Imphal",
    "Thoubal",
    "Bishnupur",
  ],

  Meghalaya: [
    "Shillong",
    "Tura",
    "Jowai",
  ],

  Mizoram: [
    "Aizawl",
    "Lunglei",
    "Champhai",
  ],

  Nagaland: [
    "Kohima",
    "Dimapur",
    "Mokokchung",
  ],

  Odisha: [
    "Bhubaneswar",
    "Cuttack",
    "Rourkela",
    "Puri",
    "Sambalpur",
  ],

  Punjab: [
    "Ludhiana",
    "Amritsar",
    "Jalandhar",
    "Patiala",
    "Bathinda",
  ],

  Rajasthan: [
    "Jaipur",
    "Jodhpur",
    "Udaipur",
    "Kota",
    "Ajmer",
  ],

  Sikkim: [
    "Gangtok",
    "Namchi",
    "Gyalshing",
  ],

  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Salem",
    "Tiruchirappalli",
  ],

  Telangana: [
    "Hyderabad",
    "Warangal",
    "Nizamabad",
    "Karimnagar",
    "Khammam",
  ],

  Tripura: [
    "Agartala",
    "Dharmanagar",
    "Udaipur",
  ],

  "Uttar Pradesh": [
    "Lucknow",
    "Kanpur",
    "Agra",
    "Varanasi",
    "Prayagraj",
    "Ghaziabad",
    "Noida",
    "Meerut",
    "Gorakhpur",
    "Ayodhya",
  ],

  Uttarakhand: [
    "Dehradun",
    "Haridwar",
    "Rishikesh",
    "Haldwani",
    "Nainital",
  ],

  "West Bengal": [
    "Kolkata",
    "Howrah",
    "Durgapur",
    "Siliguri",
    "Asansol",
  ],
};

const INDIA_UNION_TERRITORIES = {
  "Andaman and Nicobar Islands": [
    "Port Blair",
  ],

  Chandigarh: [
    "Chandigarh",
  ],

  "Dadra and Nagar Haveli and Daman and Diu": [
    "Daman",
    "Diu",
    "Silvassa",
  ],

  Delhi: [
    "New Delhi",
    "Delhi",
  ],

  Jammu: [
    "Jammu",
    "Srinagar",
  ],

  Ladakh: [
    "Leh",
    "Kargil",
  ],

  Lakshadweep: [
    "Kavaratti",
  ],

  Puducherry: [
    "Puducherry",
    "Karaikal",
  ],
};

const Shipping = () => {
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("India");

  const { shippinfInfo } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const states = Object.keys({
    ...INDIA_STATES,
    ...INDIA_UNION_TERRITORIES,
  }).sort();

  const cities = state
    ? [
      ...(INDIA_STATES[state] || []),
      ...(INDIA_UNION_TERRITORIES[state] || []),
    ]
    : [];

  const handleshopinginfoSubmit = (e) => {
    e.preventDefault();

    if (!address.trim()) {
      toast.error("Please enter your address");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error(
        "Phone number is invalid, please enter a valid 10 digit phone number"
      );
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      toast.error(
        "Please enter a valid 6 digit PIN code"
      );
      return;
    }

    if (!state) {
      toast.error("Please select your state");
      return;
    }

    if (!city) {
      toast.error("Please select your city");
      return;
    }

    dispatch(
      saveShippingInfo({
        phone,
        pincode,
        country,
        state,
        city,
        address,
      })
    );

    toast.success("Address added successfully");

    navigate("/confirmOrder");
  };

  return (
    <>
      <Navbar />

      <main className="container mx-auto px-4 py-10 mt-12 max-w-4xl">
        <Checkoutpath activepath={0} />

        <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-800">
          Shipping Details
        </h1>

        <form
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100 w-full"
          onSubmit={handleshopinginfoSubmit}
        >
          {/* Address and Country */}
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex flex-col flex-1">
              <label
                htmlFor="address"
                className="mb-1 text-gray-700 font-medium"
              >
                Address
              </label>

              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main Street"
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition shadow-sm"
              />
            </div>

            <div className="flex flex-col flex-1">
              <label
                htmlFor="country"
                className="mb-1 text-gray-700 font-medium"
              >
                Country
              </label>

              <select
                id="country"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setState("");
                  setCity("");
                }}
                className="border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition shadow-sm"
              >
                <option value="India">India</option>
              </select>
            </div>
          </div>

          {/* Phone and State */}
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex flex-col flex-1">
              <label
                htmlFor="phone"
                className="mb-1 text-gray-700 font-medium"
              >
                Phone Number
              </label>

              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                maxLength="10"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value.replace(/\D/g, "")
                  )
                }
                placeholder="10 digit phone number"
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition shadow-sm"
              />
            </div>

            <div className="flex flex-col flex-1">
              <label
                htmlFor="state"
                className="mb-1 text-gray-700 font-medium"
              >
                State
              </label>

              <select
                id="state"
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  setCity("");
                }}
                className="border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition shadow-sm"
              >
                <option value="">Select State</option>

                {states.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pincode and City */}
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex flex-col flex-1">
              <label
                htmlFor="pincode"
                className="mb-1 text-gray-700 font-medium"
              >
                Pin Code
              </label>

              <input
                id="pincode"
                type="text"
                inputMode="numeric"
                maxLength="6"
                value={pincode}
                onChange={(e) =>
                  setPincode(
                    e.target.value.replace(/\D/g, "")
                  )
                }
                placeholder="6 digit PIN code"
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition shadow-sm"
              />
            </div>

            <div className="flex flex-col flex-1">
              <label
                htmlFor="city"
                className="mb-1 text-gray-700 font-medium"
              >
                City
              </label>

              <select
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!state}
                className="border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition shadow-sm disabled:bg-gray-100"
              >
                <option value="">
                  {state ? "Select City" : "Select State First"}
                </option>

                {cities.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold shadow-lg transition transform hover:scale-[1.02] active:scale-95"
          >
            Continue to Confirm Order
          </button>
        </form>
      </main>

      <Footer />
    </>
  );
};

export default Shipping;
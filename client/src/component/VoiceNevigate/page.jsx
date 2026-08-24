import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logout } from "../../redux/features/user/userSlice";
import { getproduct } from "../../redux/features/products/productSlice";

const Ai = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const recognitionRef = useRef(null);

  const [listening, setListening] = useState(false);
  const [lastCommand, setLastCommand] = useState("");

  const { user } = useSelector(
    (state) => state.user
  );

  const speak = useCallback((message) => {

    if (
      typeof window === "undefined" ||
      !window.speechSynthesis
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(message);

    utterance.lang = "en-IN";

    const voices =
      window.speechSynthesis.getVoices();

    const voice =
      voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          /female|zira|lekha|raveena/i.test(v.name)
      ) ||
      voices.find((v) =>
        v.lang.startsWith("en")
      );

    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(
      utterance
    );

  }, []);

  const voiceRoutes = [
    {
      keywords: ["cart", "card"],
      path: "/cartItem",
      message: "Opening cart",
    },
    {
      keywords: ["order", "orders"],
      path: "/orders",
      message: "Opening orders",
    },
    {
      keywords: ["profile"],
      path: "/userProfile",
      message: "Opening profile",
    },
    {
      keywords: ["products", "product"],
      path: "/products",
      message: "Opening products",
    },
    {
      keywords: ["home"],
      path: "/",
      message: "Opening home",
    },
    {
      keywords: ["login", "sign in"],
      path: "/login",
      message: "Opening login",
    },
    {
      keywords: ["signup", "register"],
      path: "/signup",
      message: "Opening signup",
    },
    {
      keywords: ["payment"],
      path: "/addPayment",
      message: "Opening payment",
    },
    {
      keywords: ["confirm order"],
      path: "/confirmOrder",
      message: "Opening confirm order",
    },
    {
      keywords: ["success"],
      path: "/paymentSuccess",
      message: "Opening payment success",
    },
    {
      keywords: ["update password", "change password"],
      path: "/updatePassword",
      message: "Opening update password",
    },
    {
      keywords: ["forgot password"],
      path: "/forgotPassword",
      message: "Opening forgot password",
    },
  ];

  if (user?.role === "admin") {

    voiceRoutes.push(
      {
        keywords: ["admin", "dashboard"],
        path: "/adminDashboard",
        message: "Opening admin dashboard",
      },
      {
        keywords: ["reviews"],
        path: "/reviewList",
        message: "Opening reviews",
      },
      {
        keywords: ["upload product"],
        path: "/uploadProduct",
        message: "Opening upload product",
      },
      {
        keywords: ["product list"],
        path: "/productList",
        message: "Opening product list",
      },
      {
        keywords: ["all users"],
        path: "/allUsers",
        message: "Opening all users",
      },
      {
        keywords: ["all orders"],
        path: "/allOrders",
        message: "Opening all orders",
      }
    );
  }

  const faqCommands = [
    {
      keywords: [
        "who created",
        "who made",
        "developer",
      ],
      response:
        "This website was created by Sameer Tiwari as a portfolio e-commerce project.",
    },

    {
      keywords: [
        "what can you do",
        "help",
      ],
      response:
        "I can help you navigate the website using your voice.",
    },

    {
      keywords: [
        "payment methods",
        "how to pay",
      ],
      response:
        "We support Razorpay, credit cards, debit cards and UPI.",
    },

    {
      keywords: [
        "contact",
        "support",
      ],
      response:
        "You can contact our support through the contact page.",
    },

    {
      keywords: [
        "return policy",
        "policy",
      ],
      response:
        "Our return policy allows returns within 7 days of delivery.",
    },

    {
      keywords: ["shipping"],
      response:
        "We provide shipping across India with delivery within 5 to 7 business days.",
    },
  ];

  useEffect(() => {

    if (typeof window === "undefined") {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event) => {

      const transcript =
        event.results[0][0]
          .transcript
          .trim()
          .toLowerCase();

      setLastCommand(transcript);

      let matched = false;

      // Routes
      for (const route of voiceRoutes) {

        const routeMatched =
          route.keywords.some(
            (keyword) =>
              transcript.includes(
                keyword.toLowerCase()
              )
          );

        if (routeMatched) {

          speak(route.message);
          navigate(route.path);

          matched = true;
          break;
        }
      }

      // FAQ
      if (!matched) {

        for (const faq of faqCommands) {

          const faqMatched =
            faq.keywords.some(
              (keyword) =>
                transcript.includes(
                  keyword.toLowerCase()
                )
            );

          if (faqMatched) {

            speak(faq.response);

            matched = true;
            break;
          }
        }
      }

      // Logout
      if (
        !matched &&
        transcript.includes("logout")
      ) {

        dispatch(logout());

        speak(
          "Logging you out now."
        );

        navigate("/login");

        matched = true;
      }

      // Search
      if (!matched && transcript) {

        speak(
          `Searching for ${transcript}`
        );

        dispatch(
          getproduct({
            keyword: transcript,
            page: 1,
            category: "",
          })
        );

        navigate(
          `/products?keyword=${encodeURIComponent(
            transcript
          )}&page=1`
        );

        matched = true;
      }

      if (!matched) {
        speak(
          "Sorry, I did not understand that."
        );
      }

      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = () => {

      setListening(false);

      speak(
        "Sorry, there was an error. Please try again."
      );
    };

    recognitionRef.current =
      recognition;

    return () => {

      recognition.stop();

      recognitionRef.current = null;
    };

  }, [dispatch, navigate, speak, user]);

  const handleClick = () => {

    if (!recognitionRef.current) {

      speak(
        "Speech recognition is not available in this browser."
      );

      return;
    }

    try {

      recognitionRef.current.start();

      setListening(true);

      speak(
        "Listening for your command."
      );

    } catch (error) {

      console.log(
        "Recognition already running"
      );
    }
  };

  return (
    <div
      className="fixed lg:bottom-5 md:bottom-10 bottom-20 left-[1%] flex flex-col items-center gap-2 z-50"
    >

      <button
        type="button"
        onClick={handleClick}
        className="cursor-pointer"
      >

        <img
          src={
            listening
              ? "/images/assest/listening.webp"
              : "/images/assest/ai.jpeg"
          }
          alt="AI Voice Assistant"
          width={80}
          height={80}
          className="w-20 h-20 object-cover rounded-full border-4 border-blue-500 shadow-lg transition-transform hover:scale-105"
        />

      </button>

      {lastCommand && (
        <div className="text-xs text-gray-800 bg-white px-2 py-1 rounded shadow border max-w-[200px] text-center">
          Heard: "{lastCommand}"
        </div>
      )}

    </div>
  );
};

export default Ai;
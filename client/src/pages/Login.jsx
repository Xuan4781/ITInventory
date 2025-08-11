import React from "react";
import logo from "../assets/socotec_img.png";
import MicrosoftLoginButton from "../components/MicrosoftLoginButton";

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f3f2f1]">
      <div className="w-full max-w-md bg-white p-10 rounded-xl shadow-md">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="SOCOTEC Logo" className="h-16 w-auto" />
        </div>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          Sign in
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Use your <b>@socotec.us</b> Microsoft account
        </p>

        <MicrosoftLoginButton /> {/* ✅ Only triggers login on click */}

        <div className="mt-8 text-center text-sm text-gray-500">
          New to SOCOTEC? Contact IT to request access.
        </div>
      </div>
    </div>
  );
};

export default Login;

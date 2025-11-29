// AdminWinnerLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/images/logo.png";
import logo2 from "../../assets/images/logo2.png";

const AdminWinnerLogin = () => {
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Same admin credentials as your existing system
    if (adminId === "winner@25") {
      localStorage.setItem("adminWinnerAuth", "true");
      navigate("/adminwinner");
    } else {
      setError("Invalid Admin ID. Only authorized admins can access winner selection.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[linear-gradient(296.82deg,#E9F4FF_0%,#FFFFFF_50%,#E9F4FF_100%)] flex flex-col items-center px-4 sm:px-6 md:px-10 py-10">
      
      <div className="w-full max-w-[1440px] mb-10">
        <div className="hidden md:flex items-center justify-center gap-6 lg:gap-10">
          <img
            src={logo}
            alt="Logo Left"
            className="w-16 h-16 md:w-20 md:h-20 lg:w-[89px] lg:h-[89px] shrink-0"
          />

          <h1 className="font-semibold text-center text-[#0868CC] leading-[150%] tracking-[2%] text-xl md:text-2xl lg:text-3xl xl:text-4xl px-2">
            International Day of Persons <br />
            with Disabilities – 2025
          </h1>

          <img
            src={logo2}
            alt="Logo Right"
            className="w-16 h-16 md:w-20 md:h-20 lg:w-[89px] lg:h-[89px] shrink-0"
          />
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col items-center justify-center gap-6">
          <div className="flex items-center justify-center gap-8">
            <img
              src={logo}
              alt="Logo Left"
              className="w-16 h-16 shrink-0"
            />
            <img
              src={logo2}
              alt="Logo Right"
              className="w-16 h-16 shrink-0"
            />
          </div>
          
          <h1 className="font-semibold text-center text-[#0868CC] leading-[140%] tracking-[2%] text-lg sm:text-xl px-2">
            International Day of Persons <br />
            with Disabilities – 2025
          </h1>
        </div>
      </div>

      {/* LOGIN CARD */}
      <div className="bg-white shadow-[0_0_10px_0_#00000040] rounded-2xl text-center border border-gray-200 w-full max-w-[645px] px-6 sm:px-8 md:px-12 py-8 md:py-10">
        
        <h2 className="font-semibold text-xl md:text-2xl leading-[100%] tracking-[5%] text-center">
          Winner Selection Login
        </h2>

        <p className="font-normal text-sm md:text-base leading-[150%] tracking-[5%] text-center mt-4 md:mt-6">
          Access the winner selection panel to announce competition winners. <br /> 
          Authorized admins only.
        </p>

        <form onSubmit={handleLogin} className="mt-8 md:mt-10 flex flex-col items-center gap-4 md:gap-6 w-full">
          <input
            type="password"
            value={adminId}
            onChange={(e) => {
              setAdminId(e.target.value);
              setError("");
            }}
            placeholder="Enter Admin ID for Winner Selection"
            className="w-full max-w-[400px] md:max-w-[450px] h-12 md:h-14 border border-[#C6C6C6] rounded-2xl bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none text-center placeholder-[#C8CCC8] placeholder-semibold text-sm md:text-base"
          />

          {/* ERROR MESSAGE */}
          {error && (
            <p className="text-red-600 text-xs md:text-sm leading-[150%]">
              {error}
            </p>
          )}

          <p className="text-[#EF0303] text-xs md:text-sm px-4 text-center leading-[150%] md:leading-[200%]">
            For any access issues, please reach out to the administrator <br className="hidden sm:block" />
            <span className="font-semibold text-[#EF0303]">9876543210</span>
          </p>

          <button
            type="submit"
            className="w-full max-w-[180px] md:max-w-[200px] bg-[#0868CC] text-white py-2 md:py-3 rounded-2xl font-medium hover:bg-blue-700 transition text-sm md:text-base cursor-pointer"
          >
            Login to Winner Panel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminWinnerLogin;
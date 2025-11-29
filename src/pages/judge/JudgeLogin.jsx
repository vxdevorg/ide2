import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import logo2 from "../../assets/images/logo2.png";

const JudgeLogin = () => {
  const navigate = useNavigate();
  const [guestId, setGuestId] = useState("");
  const [error, setError] = useState("");

  const validJudgeIds = [
    "123451",
    "123452",
    "123453",
    "123454",
    "123455",
    "123456",
    "123457",
    "123458",
    "123459",
    "12345a"
  ];

  const handleLogin = (e) => {
    e.preventDefault();

    if (!validJudgeIds.includes(guestId)) {
      setError("Invalid Judge ID. Please contact the administrator.");
      return;
    }

    localStorage.setItem("judgeAuth", "true");
    localStorage.setItem("judgeId", guestId); 
    navigate("/judgedashboard");
  };

  return (
    <div className="min-h-screen w-full bg-[linear-gradient(296.82deg,#E9F4FF_0%,#FFFFFF_50%,#E9F4FF_100%)] flex flex-col items-center px-4 sm:px-6 md:px-10 py-10">
      
      {/* HEADER */}
      <div className="w-full max-w-[1440px] mb-10">
        
        {/* Desktop */}
        <div className="hidden md:flex items-center justify-center gap-6 lg:gap-10">
          <img src={logo} alt="Logo Left"
            className="w-16 h-16 md:w-20 md:h-20 lg:w-[89px] lg:h-[89px]" />

          <h1 className="font-semibold text-center text-[#0868CC] leading-[150%] tracking-[2%] text-xl md:text-2xl lg:text-3xl xl:text-4xl px-2">
            International Day of Persons <br /> with Disabilities – 2025
          </h1>

          <img src={logo2} alt="Logo Right"
            className="w-16 h-16 md:w-20 md:h-20 lg:w-[89px] lg:h-[89px]" />
        </div>

        {/* Mobile */}
        <div className="md:hidden flex flex-col items-center justify-center gap-6">
          <div className="flex items-center justify-center gap-8">
            <img src={logo} alt="Logo Left" className="w-16 h-16" />
            <img src={logo2} alt="Logo Right" className="w-16 h-16" />
          </div>
          <h1 className="font-semibold text-center text-[#0868CC] leading-[140%] tracking-[2%] text-lg sm:text-xl px-2">
            International Day of Persons <br /> with Disabilities – 2025
          </h1>
        </div>

      </div>

      {/* LOGIN CARD */}
      <div className="bg-white shadow-[0_0_10px_0_#00000040] rounded-2xl text-center border border-gray-200 w-full max-w-[645px] px-6 sm:px-8 md:px-12 py-8 md:py-10">
        
        <h2 className="font-semibold text-xl md:text-2xl">Judges Login</h2>

        <p className="font-normal text-sm md:text-base mt-4">
          Manage and evaluate participants with transparency.<br />
          Please log in to your judging panel.
        </p>

        <form onSubmit={handleLogin}
          className="mt-8 md:mt-10 flex flex-col items-center gap-4 md:gap-6 w-full">

          <input
            type="text"
            value={guestId}
            onChange={(e) => {
              setGuestId(e.target.value);
              setError("");
            }}
            placeholder="Enter Your Custom Password"
            className="w-full max-w-[400px] md:max-w-[450px] h-12 md:h-14 
                       border border-[#C6C6C6] rounded-2xl bg-gray-100 text-center 
                       focus:ring-2 focus:ring-blue-400 text-sm md:text-base"
          />

          {/* Error message */}
          {error && (
            <p className="text-red-600 text-xs md:text-sm mt-[-10px]">
              {error}
            </p>
          )}

          <p className="text-[#EF0303] text-xs md:text-sm px-4 text-center">
            For any access issues, please reach out to the administrator<br />
            <span className="font-semibold">9876543210</span>
          </p>

          <button
            type="submit"
            className="w-full max-w-[180px] md:max-w-[200px] 
                       bg-[#0868CC] text-white py-2 md:py-3 rounded-2xl 
                       font-medium hover:bg-blue-700 transition text-sm md:text-base">
            Login
          </button>

        </form>
      </div>

    </div>
  );
};

export default JudgeLogin;

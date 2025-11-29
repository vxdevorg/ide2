import React, { } from "react";
import logo from "../assets/images/logo.png";
import logo2 from "../assets/images/logo2.png";
import bg1 from "../assets/images/mainimg.png";
import bg2 from "../assets/images/mobmainbg.png";
import doodle from "../assets/images/Doodle.png";

export default function LandingPage({ language, themeColor }) {
  const text = {
    English: {
      headerTitle: "International Day of Persons with Disabilities – 2025",
      subTitle: "Online Talent Competition for Differently Abled Persons",
      department:
        "As part of the International Day of Persons with Disabilities 2025 celebrations, the Department for the Welfare of Differently Abled Persons, Government of Tamil Nadu, invites Differently Abled Persons from across the State to showcase their exceptional talents. Participants can upload videos of their performances through this dedicated web portal and be part of a State-wide celebration of creativity, confidence, and inclusion.",
      description: "Join us in recognizing and celebrating the limitless potential of every Differently Abled Persons!",
      registerBtn: "Register Now",
      marquee: "Last Date for Registration: 25/11/2025  \u00A0\u00A0\u00A0\u00A0 \u00A0\u00A0\u00A0\u00A0●",
    },

    Tamil: {
      headerTitle: "உலக மாற்றுத் திறனாளிகள் தினம் – 2025",
      subTitle: "மாற்றுத்திறனாளிகளுக்கான தனித்துவ திறமைகளை வெளிப்படுத்தும் இணையவழி போட்டி உலக மாற்றுத்திறனாளிகள் தினம் 2025 ",
      department: "மாற்றுத்திறனாளிகளுக்கான தனித்துவ திறமைகளை வெளிப்படுத்தும் இணையவழி போட்டி உலக மாற்றுத்திறனாளிகள் தினம் 2025 கொண்டாட்டத்தின் ஒரு பகுதியாக, தமிழ்நாடு அரசு – மாற்றுத் திறனாளிகள் நலத்துறை, மாநிலம் முழுவதும் உள்ள மாற்றுத்திறனாளிகளின் தனித்துவமான திறமைகளை வெளிப்படுத்த அன்புடன் அழைக்கிறோம்.பங்கேற்பாளர்கள் தங்கள் திறமைகளை வெளிப்படுத்தும் வீடியோ காட்சிகளை இணையதளம் (Portal) மூலம் பதிவேற்றலாம். இது  மாற்றுத்திறனாளிகள் படைப்பாற்றல் மற்றும் தன்னம்பிக்கை ஆகியவற்றை மாநிலம் முழுவதும் கொண்டாடும் ஒரு நிகழ்வாகும். ",

      description: "ஒவ்வொரு மாற்றுத்திறனாளியின் எல்லையற்ற திறனை பாராட்டி கொண்டாடும் இந்நிகழ்வில் நீங்களும் இணையுங்கள்!",
      registerBtn: "பதிவு செய்ய",
      marquee: "பதிவு செய்ய கடைசி தேதி: 25/11/2025 \u00A0\u00A0\u00A0\u00A0 \u00A0\u00A0\u00A0\u00A0●",

    },
  };

  const t = text[language];

  return (
    <section className="relative w-full overflow-hidden font-poppins bg-[#F8F6F6]">

      {/* ✅ DOODLE LEFT (FULL PAGE) */}
      <img
        src={doodle}
        alt="doodle left"
        className="
          absolute
          top-0 left-0
          w-[260px] md:w-[300px]
          pointer-events-none
          select-none
          z-[20]
        "
      />



      {/* ✅ DESKTOP HEADER */}
      <div
        className="
          relative z-[5]
          hidden lg:flex
          w-full
          flex-row items-center justify-between
          px-6 md:px-12 lg:px-[90px]
          py-6 md:py-5
          bg-[#F8F6F6]
          border-b-2 border-[#b7b7b7]
          shadow-[0px_1px_4px_0px_#00000040]
        "
      >
        {/* ✅ DOODLE RIGHT (FULL PAGE) */}
        <img
          src={doodle}
          alt="doodle right"
          className="
          absolute
          top-0 right-0
          w-[260px] md:w-[300px]
          pointer-events-none
          select-none
          z-[20] "/>

        <img
          className="relative z-[10] w-[80px] sm:w-[95px] md:w-[110px] lg:w-[130px]"
          src={logo}
          alt="Left Logo"
        />

        <h1
          className="
            relative z-[10]
            text-center font-semibold leading-[110%] tracking-[0.05em]
            text-[20px] sm:text-[26px] md:text-[34px] lg:text-[42px] xl:text-[50px]
            px-12
          "
          style={{ color: themeColor }}
        >
          {t.headerTitle.split("\n").map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </h1>

        <img
          className="relative z-[10] w-[80px] sm:w-[95px] md:w-[110px] lg:w-[130px]"
          src={logo2}
          alt="Right Logo"
        />
      </div>

      {/* ✅ MOBILE HEADER */}
      <div
        className="
          relative z-[5]
          flex lg:hidden
          w-full flex-col items-center justify-center gap-4
          px-6 md:px-12 py-6 md:py-10
          bg-[#F8F6F6] shadow-sm
        "
      >
        <div className="flex items-center justify-center gap-[22px] w-full max-w-[500px]">
          <img className="w-[80px] sm:w-[95px] md:w-[110px]" src={logo} alt="Left Logo" />
          <img className="w-[80px] sm:w-[95px] md:w-[110px]" src={logo2} alt="Right Logo" />
        </div>

        <h1
          className="
            text-center font-semibold leading-[110%] tracking-[0.05em]
             text-[24px]  min-[350px]:text-[20px] sm:text-[30px] md:text-[34px] mt-4
          "
          style={{ color: themeColor }}
        >
          {t.headerTitle.split("\n").map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </h1>
      </div>
      {/* ✅ FULL-WIDTH RESPONSIVE BLUE BAR */}
      <div
        className="w-full overflow-hidden relative z-[4]"
        style={{
          height: "clamp(30px, 4.5vw, 55px)", // 👈 decreased height range
          backgroundColor: themeColor,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
        }}
      >
        <div className="w-full overflow-hidden relative h-full flex items-center">
          <div
            className="flex text-white font-semibold whitespace-nowrap animate-scroll"
            style={{
              fontSize: "clamp(10px, 1.8vw, 16px)",
              lineHeight: "clamp(18px, 3vw, 26px)",
              animation: "scroll 35s linear infinite", // 👈 slower animation
            }}
          >
            {Array(15)
              .fill(t.marquee)
              .map((text, i) => (
                <span
                  key={i}
                  className="mx-[8px] sm:mx-[14px] md:mx-[20px] lg:mx-[26px]"
                >
                  {text}
                </span>
              ))}
          </div>

          <div
            className="flex text-white font-semibold whitespace-nowrap animate-scroll"
            aria-hidden="true"
            style={{
              fontSize: "clamp(10px, 1.8vw, 16px)",
              lineHeight: "clamp(18px, 3vw, 26px)",
              animation: "scroll 35s linear infinite", // 👈 slower animation for seamless loop
            }}
          >
            {Array(15)
              .fill(t.marquee)
              .map((text, i) => (
                <span
                  key={i}
                  className="mx-[8px] sm:mx-[14px] md:mx-[20px] lg:mx-[26px]"
                >
                  {text}
                </span>
              ))}
          </div>
        </div>

        <style>{`
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-scroll {
      animation: scroll 35s linear infinite; /* 👈 slower scroll */
      display: flex;
      flex-shrink: 0;
      min-width: 100%;
    }
  `}</style>
      </div>


      {/* ✅ MAIN CONTENT */}
      <div className="relative w-full flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT TEXT AREA */}
        <div className="flex flex-col justify-center lg:w-[55%] px-4 sm:px-8 md:px-12 lg:pl-[90px] py-8 sm:py-10 md:py-14 lg:py-16 space-y-5 text-center lg:text-left">
          <h2
            className="font-semibold text-[18px] sm:text-[22px] md:text-[28px] lg:text-[32px] xl:text-[34px] tracking-[0.04em]"
            style={{ color: themeColor }}
          >
            {t.subTitle}
          </h2>

          <p className="text-[#2C2C2C] font-medium text-[12px] sm:text-[15px] md:text-[16px] lg:text-[16px] leading-[24px] sm:leading-[28px] md:leading-[30px] lg:leading-[30px] tracking-[0.05em] px-2 sm:px-0">
            {t.department}
          </p>

          <p className="text-black font-medium text-[13px] sm:text-[15px] md:text-[16px] lg:text-[17px] leading-[28px] sm:leading-[32px] tracking-[0.05em] px-2 sm:px-0">
            {t.description}
          </p>

          <button
            onClick={() => {
              const formSection = document.getElementById("event-register");
              if (formSection) {
                formSection.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
            className="
              text-white font-semibold
              text-[13px] sm:text-[15px] md:text-[16px]
              px-[32px] sm:px-[38px] md:px-[42px] py-2.5 sm:py-3 rounded-md
              w-fit mx-auto lg:mx-0 shadow-md
              transition-transform duration-200 hover:scale-[1.05]
            "
            style={{ backgroundColor: themeColor }}
          >
            {t.registerBtn}
          </button>
        </div>

        {/* RIGHT IMAGE AREA */}
        <div className="relative w-full lg:w-[55%] h-[240px] sm:h-[300px] md:h-[360px] lg:h-auto">
          <img
            src={bg1}
            alt="Cultural Event"
            className="hidden lg:block w-full h-full object-center"
          />
          <img
            src={bg2}
            alt="Cultural Event"
            className="block lg:hidden w-full h-full object-center"
          />
        </div>
      </div>
    </section>
  );
}

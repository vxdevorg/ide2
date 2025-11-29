import React from "react";
import ConnectLeftImg from "../assets/images/ConnectLeftImg.png";
import { Email, Phone, WhatsAppIcon } from "../assets/icons/icons";
 
const Contact = ({ language, themeColor }) => {
  const text = {
    English: {
      title: "Contact & Support",
      gov: "Commissionerate for Welfare of the Differently Abled, Tamil Nadu",
      emailLabel: "Email :",
      emailValue: "dwda.support@tn.gov.in",
      tollLabel: "Toll-Free :",
      tollValue: "18004250111",
      whatsapp: "WhatsApp Video Call for Hearing Impaired :",
      whatsappValue: "9499933703",
      footer:
        "© Content Owned by Commissionerate for Welfare of the Differently Abled, Tamil Nadu.",
    },
    Tamil: {
      title: "தொடர்பு கொள்ள",
      gov: "மாற்றுத் திறனாளிகள் நல ஆணையரகம் , தமிழ்நாடு அரசு",
      emailLabel: "மின்னஞ்சல் :",
      emailValue: "dwda.support@tn.gov.in",
      tollLabel: "இலவச அழைப்பு எண்:",
      tollValue: "18004250111",
      whatsapp: "வாட்ஸ்அப் வீடியோ அழைப்பு (பேச்சுதிறன் மற்றும் செவித்திறன் குறைபாடுடைய மாற்றுத்திறனாளிகளுக்கு) :",
      whatsappValue: "9499933703",
      footer:
        "© மாற்றுத் திறனாளிகள் நல ஆணையரகம் சொந்தமான உள்ளடக்கம், தமிழ்நாடு அரசு",
    },
  };
 
  const t = text[language];
 
  return (
    <div className="w-full flex flex-col items-center justify-center pt-6 md:pt-10 bg-[#F8F6F6] relative overflow-hidden">
      {/* Main Card */}
      <div
        className="relative max-w-[1046px] w-full rounded-2xl
                   flex flex-col md:flex-row items-center justify-between
                   gap-8 md:gap-12 px-1 md:px-10 lg:px-12 py-8 md:py-10"
        style={{ backgroundColor: `${themeColor}1A` }}
      >
        {/* Left Section */}
        <div className="w-full flex flex-col justify-center text-center md:text-left space-y-5 sm:space-y-6 z-10">
          <h2 className="font-poppins font-semibold text-2xl sm:text-3xl md:text-4xl text-black leading-tight">
            {t.title}
          </h2>
 
          <p
            className="font-semibold w-full md:w-[70%] max-[525px]:mx-auto max-[525px]:text-center text-sm sm:text-base md:text-lg text-black leading-relaxed px-2 md:px-0"
          >
            {t.gov}
          </p>
 
 
          <div className="flex items-center gap-2 sm:gap-3 justify-center md:justify-start">
            <Email size={22} />
 
            <p className="font-semibold text-sm sm:text-base md:text-lg text-black whitespace-nowrap">
              {t.emailLabel}
            </p>
 
            <a
              href={`mailto:${t.emailValue}`}
              className="text-sm sm:text-base md:text-lg text-black underline break-all hover:opacity-80 transition"
            >
              {t.emailValue}
            </a>
          </div>
 
          <div className="flex items-center gap-2 sm:gap-3 justify-center md:justify-start">
            <Phone size={22} />
 
            <p className="font-semibold text-sm sm:text-base md:text-lg text-black whitespace-nowrap">
              {t.tollLabel}
            </p>
 
            <a
              href={`tel:${t.tollValue}`}
              className="text-sm sm:text-base md:text-lg text-black underline break-all hover:opacity-80 transition"
            >
              {t.tollValue}
            </a>
          </div>
 
          <div className="w-full flex justify-center md:justify-start">
            <p
              className="flex items-start gap-2 sm:gap-3
               text-black font-semibold
               text-sm sm:text-base md:text-lg
               leading-snug sm:leading-normal md:leading-relaxed
               text-center md:text-left
               flex-wrap break-words text-balance
               w-full md:w-[90%] lg:w-[72%]"
            >
              <span className="flex-shrink-0 flex items-start justify-center mt-[2px] hidden md:block">
                <WhatsAppIcon size={22} />
              </span>
 
              <span className="flex-1 md:text-left">
                {t.whatsapp}{" "}
                <a
                  href={`https://wa.me/${t.whatsappValue}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-normal whitespace-nowrap hover:opacity-80 transition"
                >
                  {t.whatsappValue}
                </a>
              </span>
            </p>
          </div>
        </div>
 
        {/* Right Section (Absolute Image) */}
        <div className="hidden md:block absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 z-0">
          <img
            src={ConnectLeftImg}
            alt="Contact"
            className="w-[260px] md:w-[250px] lg:w-[340px] h-auto object-contain opacity-90"
          />
        </div>
 
        {/* Mobile View Image (Centered Below Text) */}
        <div className="block md:hidden w-full flex justify-center mt-4 z-0">
          <img
            src={ConnectLeftImg}
            alt="Contact"
            className="w-50 sm:w-52 h-auto object-contain opacity-100"
          />
        </div>
      </div>
 
      {/* Footer */}
      <div
        className="w-full mt-6 md:mt-10 py-3 sm:py-4 text-center"
        style={{ backgroundColor: themeColor }}
      >
        <p className="font-poppins font-semibold text-xs sm:text-sm md:text-base lg:text-lg text-[#F8F6F6] px-4 leading-relaxed">
          {t.footer}
        </p>
      </div>
    </div>
  );
};
 
export default Contact;

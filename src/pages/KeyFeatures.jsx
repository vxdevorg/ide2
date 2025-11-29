import React from "react";

const KeyFeatures = ({ language, themeColor }) => {
  const text = {
    English: {
      aboutTitle: "About the Competition",
      aboutDesc: `The Department for the Welfare of Differently Abled Persons, Government of Tamil Nadu, invites talented individuals with disabilities from across the State to participate in the State-level Talent Competition as part of the celebrations for the International Day of Persons with Disabilities 2025.`,

      easyTitle: "Easy Registration",
      easyDesc: "Simple online registration using your mobile number",

      videoTitle: "Video Upload",
      videoDesc: "Upload your performance video up to 250MB (3 Minutes)",

      talentTitle: "Talent Performance",
      talentDesc:
        "Participate in singing, dancing, mime, mimicry, yoga, Music instruments playing, Creative Kavidhai and more",

      resultTitle: "Results Online",
      resultDesc: "View shortlisted participants and winners on this portal",

      certificate: "Participation Certificate",
      certificateDesc: "E-certificate will be provided to all participants",
    },

    Tamil: {
      aboutTitle: "போட்டிச் சுருக்கம்",
      aboutDesc: `தமிழ்நாடு அரசு மாற்றுத் திறனாளிகள் நலத்துறையின் சார்பில், மாநிலம் முழுவதும் உள்ள மாற்றுத் திறனாளிகள் தங்கள் திறமைகளை வெளிப்படுத்துவதற்கான மாநில அளவிலான திறமைப் போட்டியில் கலந்து கொள்ள அழைக்கப்படுகிறார்கள். இது மாற்றுத் திறனாளிகள் சர்வதேச நாள் 2025 கொண்டாட்டத்தின் ஒரு பகுதியாகும்.`,

      easyTitle: "எளிய பதிவு ",
      easyDesc:
        "உங்கள் கைபேசி எண்ணைப் பயன்படுத்தி எளிதான ஆன்லைன் பதிவு செய்யுங்கள்",

      videoTitle: "வீடியோ பதிவேற்றம்",
      videoDesc:
        "உங்கள் தனித்திறமைகளை வெளிப்படுத்தும் வீடியோவை (அதிகபட்சம் 250 MB வரை) பதிவேற்றலாம் (3 நிமிடங்கள்)",

      talentTitle: "திறமை செயல்திறன்",
      talentDesc:
        "பாடல், நடனம், மிமிக்ரி, இசைக்கருவி வாசித்தல், யோகா, கவிதை எழுதி வாசித்தல், கைவினை திறமை போன்ற பல நிகழ்வுகளில் பங்கேற்கலாம்",

      resultTitle: "முடிவுகள் ஆன்லைனில்",
      resultDesc:
        "போட்டியில் தேர்வு செய்யப்பட்ட மற்றும் வெற்றி பெற்ற போட்டியாளர்களின் பட்டியலை இத்தளத்தில் பார்க்கலாம்..",

      certificate: "பங்கேற்புச் சான்றிதழ்",
      certificateDesc:
        "பங்கேற்பாளர்கள் அனைவருக்கும் மின்னணு (E-) சான்றிதழ் வழங்கப்படும்.",
    },
  };

  const t = text[language] || text.English;

  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-8 md:px-10 lg:px-16 xl:px-24 py-8 md:py-12 lg:py-20 bg-[#F9FAFB]">
      {/* Title */}
      <h2
        style={{ color: themeColor }}
        className="text-[24px] sm:text-[28px] md:text-[32px] font-poppins font-bold leading-tight tracking-wide text-center mb-6 md:mb-10"
      >
        {t.aboutTitle}
      </h2>

      {/* About Paragraph */}
      <p className="font-poppins font-normal text-[14px] sm:text-[15px] md:text-[16px] leading-relaxed md:leading-[32px] tracking-[0.03em] text-center text-black max-w-[95%] sm:max-w-[700px] md:max-w-[850px] lg:max-w-[1000px]">
        {t.aboutDesc}
      </p>

      {/* Talent Card */}
      <div
        className="w-full sm:w-[80%] md:w-[80%] lg:w-[762px] flex flex-col items-center gap-2 md:gap-3 mt-10 rounded-[8px] shadow-md border border-gray-200 p-4 sm:p-6 md:p-8 bg-white 
      transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
      >
        <svg width="32" height="32" viewBox="0 0 24 24">
          <path
            d="M4 11H10C10.2652 11 10.5196 10.8946 10.7071 10.7071C10.8946 10.5196 11 10.2652 11 10V4C11 3.73478 10.8946 3.48043 10.7071 3.29289C10.5196 3.10536 10.2652 3 10 3H4C3.73478 3 3.48043 3.10536 3.29289 3.29289C3.10536 3.48043 3 3.73478 3 4V10C3 10.2652 3.10536 10.5196 3.29289 10.7071C3.48043 10.8946 3.73478 11 4 11ZM14 11H20C20.2652 11 20.5196 10.8946 20.7071 10.7071C20.8946 10.5196 21 10.2652 21 10V4C21 3.73478 20.8946 3.48043 20.7071 3.29289C20.5196 3.10536 20.2652 3 20 3H14C13.7348 3 13.4804 3.10536 13.2929 3.29289C13.1054 3.48043 13 3.73478 13 4V10C13 10.2652 13.1054 10.5196 13.2929 10.7071C13.4804 10.8946 13.7348 11 14 11ZM4 21H10C10.2652 21 10.5196 20.8946 10.7071 20.7071C10.8946 20.5196 11 20.2652 11 20V14C11 13.7348 10.8946 13.4804 10.7071 13.2929C10.5196 13.1054 10.2652 13 10 13H4C3.73478 13 3.48043 13.1054 3.29289 13.2929C3.10536 13.48043 3 13.7348 3 14V20C3 20.2652 3.10536 20.5196 3.29289 20.7071C3.48043 20.8946 3.73478 21 4 21ZM17 21C19.206 21 21 19.206 21 17C21 14.794 19.206 13 17 13C14.794 13 13 14.794 13 17C13 19.206 14.794 21 17 21Z"
            fill={themeColor}
          />
        </svg>

        <h3
          className="text-[16px] sm:text-[17px] md:text-[18px] font-semibold text-center"
          style={{ color: themeColor }}
        >
          {t.talentTitle}
        </h3>

        <p className="text-gray-600 text-[13px] sm:text-[14px] leading-snug text-center">
          {t.talentDesc}
        </p>

        <p
          className="font-poppins font-medium text-[14px] leading-[24px] tracking-[0.03em] text-center px-4 sm:px-8 md:px-20"
          style={{ color: themeColor }}
        >
          {t.talentDesc2}
        </p>
      </div>

      {/* Features Grid */}
      <div className="mt-10 md:mt-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6 md:gap-8 text-center justify-items-center">
          {/* Item 1 */}
          <div
            className="w-full sm:w-[80%] md:w-[250px] lg:w-[360px] flex flex-col items-center gap-2 md:gap-3 rounded-[8px] shadow-md border border-gray-200 p-4 sm:p-5 bg-white
          transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
          >
            <svg width="32" height="32" viewBox="0 0 24 24">
              <path
                d="M15 14C12.33 14 7 15.33 7 18V20H23V18C23 15.33 17.67 14 15 14ZM6 10V7H4V10H1V12H4V15H6V12H9V10M15 12C16.0609 12 17.0783 11.5786 17.8284 10.8284C18.5786 10.0783 19 9.06087 19 8C19 6.93913 18.5786 5.92172 17.8284 5.17157C17.0783 4.42143 16.0609 4 15 4C13.9391 4 12.9217 4.42143 12.1716 5.17157C11.4214 5.92172 11 6.93913 11 8C11 9.06087 11.4214 10.0783 12.1716 10.8284C12.9217 11.5786 13.9391 12 15 12Z"
                fill={themeColor}
              />
            </svg>
            <h3
              className="text-[16px] sm:text-[17px] md:text-[18px] font-semibold"
              style={{ color: themeColor }}
            >
              {t.easyTitle}
            </h3>
            <p className="text-gray-600 text-[13px] sm:text-[14px] leading-snug max-w-[220px]">
              {t.easyDesc}
            </p>
          </div>

          {/* Item 2 */}
          <div
            className="w-full sm:w-[80%] md:w-[250px] lg:w-[360px] flex flex-col items-center gap-2 md:gap-3 rounded-[8px] shadow-md border border-gray-200 p-4 sm:p-5 bg-white
          transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
          >
            <svg width="32" height="32" viewBox="0 0 24 24">
              <path
                d="M5 5.5C4.27065 5.5 3.57118 5.78973 3.05546 6.30546C2.53973 6.82118 2.25 7.52065 2.25 8.25V15.75C2.25 16.4793 2.53973 17.1788 3.05546 17.6945C3.57118 18.2103 4.27065 18.5 5 18.5H13.5C14.2293 18.5 14.9288 18.2103 15.4445 17.6945C15.9603 17.1788 16.25 16.4793 16.25 15.75V14.156L19.669 17.201C20.474 17.918 21.75 17.346 21.75 16.267V7.365C21.75 6.285 20.474 5.714 19.669 6.431L16.25 9.476V8.25C16.25 7.52065 15.9603 6.82118 15.4445 6.30546C14.9288 5.78973 14.2293 5.5 13.5 5.5H5Z"
                fill={themeColor}
              />
            </svg>
            <h3
              className="text-[16px] sm:text-[17px] md:text-[18px] font-semibold"
              style={{ color: themeColor }}
            >
              {t.videoTitle}
            </h3>
            <p className="text-gray-600 text-[13px] sm:text-[14px] leading-snug max-w-[220px]">
              {t.videoDesc}
            </p>
          </div>

          {/* Item 3 */}
          <div
            className="w-full sm:w-[80%] md:w-[250px] lg:w-[360px] flex flex-col items-center gap-2 md:gap-3 rounded-[8px] shadow-md border border-gray-200 p-4 sm:p-5 bg-white
          transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
          >
            <svg width="32" height="32" viewBox="0 0 24 24">
              <path
                d="M12 0C8.7 0 6 2.7 6 6C6 9.3 8.7 12 12 12C15.3 12 18 9.3 18 6C18 2.7 15.3 0 12 0ZM9 14.43V24L12 21L15 24V14.43C14.07 14.76 13.05 15 12 15C10.95 15 9.93 14.76 9 14.43Z"
                fill={themeColor}
              />
            </svg>
            <h3
              className="text-[16px] sm:text-[17px] md:text-[18px] font-semibold"
              style={{ color: themeColor }}
            >
              {t.resultTitle}
            </h3>
            <p className="text-gray-600 text-[13px] sm:text-[14px] leading-snug max-w-[220px]">
              {t.resultDesc}
            </p>
          </div>

          {/* Item 4 */}
          <div
            className="w-full sm:w-[80%] md:w-[250px] lg:w-[360px] flex flex-col items-center gap-2 md:gap-3 rounded-[8px] shadow-md border border-gray-200 p-4 sm:p-5 bg-white
          transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
          >
            <svg width="22" height="32" viewBox="0 0 22 18" fill="none">
              <path
                d="M0 2C0 0.89543 0.895431 0 2 0H20C21.1046 0 22 0.895431 22 2V16C22 17.1046 21.1046 18 20 18H2C0.89543 18 0 17.1046 0 16V2ZM4 8V10H10V8H4ZM4 12V14H18V12H4ZM15.502 5.688L18 7.75V2H13.004V7.75L15.502 5.688Z"
                fill={themeColor}
              />
            </svg>
            <h3
              className="text-[16px] sm:text-[17px] md:text-[18px] font-semibold"
              style={{ color: themeColor }}
            >
              {t.certificate}
            </h3>
            <p className="text-gray-600 text-[13px] sm:text-[14px] leading-snug max-w-[220px]">
              {t.certificateDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyFeatures;

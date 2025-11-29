import React from 'react';
import SearchIcon from '../../assets/icons/SearchIcon';
import ClockIcon from '../../assets/icons/ClockIcon';
import BadgeIcon from '../../assets/icons/BadgeIcon';

const EventResultPage = ({ language, themeColor }) => {

  const text = {
    English: {
      pageTitle: "Talent Competition Result",
      blueTitle: "Talent Competition Result",
      blueSub: "Celebrating Talent, Honouring Excellence!",

      searchPlaceholder: "Search by Registration ID / Name / District",

      card1Title: "Final List",
      comingSoon: "Result Coming Soon",
      comingSoon2: "Coming Soon",
      card1Desc:
        "Winners will be announced on this page after the evaluation process is complete. Participants will also be notified via email and SMS.",

      card2Title: "Download Your Participation Certificate",
      card2Desc:
        "You will be able to download your participation certificate after the publication of the final results. Please enter your Registration Number or Mobile Number to access your certificate once available.",
    },

    Tamil: {
      pageTitle: "தனித் திறமை போட்டி முடிவு",
      blueTitle: "தனித் திறமை போட்டி முடிவு",
      blueSub: "திறமையை கொண்டாடுவோம் – சிறப்பை கௌரவிப்போம்!",

      searchPlaceholder: "பதிவு எண் / பெயர் / மாவட்டம் மூலம் தேடவும்",

      card1Title: "இறுதி பட்டியல்",
      comingSoon: "முடிவு விரைவில் அறிவிக்கப்படும்",
      comingSoon2: "விரைவில் வருகிறது",
      card1Desc:
        "மதிப்பீட்டு செயல்முறை முடிந்தவுடன் வெற்றியாளர்கள் இப்பக்கத்தில் அறிவிக்கப்படுவர். பங்கேற்பாளர்களுக்கும் மின்னஞ்சல் மற்றும் குறுஞ்செய்தி மூலம் தகவல் தெரிவிக்கப்படும்.",

      card2Title: "பங்கேற்புச் சான்றிதழை பதிவிறக்கவும்",
      card2Desc:
        "இறுதி முடிவு வெளியிடப்பட்ட பிறகு பங்கேற்புச் சான்றிதழை பதிவிறக்கலாம். உங்கள் பதிவு எண் அல்லது கைபேசி எண்ணை உள்ளீடு செய்து சான்றிதழை பெறவும்.",
    }
  };

  const t = text[language];

  return (
    <div className="w-full flex flex-col items-center pt-[50px] sm:px-4 bg-[#F8F6F6]">

      {/* Page Title */}
      <h1
        className="font-poppins font-bold text-[32px] leading-[100%] tracking-[5%] text-center"
        style={{ color: themeColor }}
      >
        {t.pageTitle}
      </h1>

      {/* MAIN CONTAINER */}
      <div
        className="
          w-full max-w-[1046px]
          rounded-none sm:rounded-[10px]
          shadow-[0px_0px_6px_0px_rgba(0,0,0,0.25)]
          flex flex-col items-center
          mt-10 md:mt-[60px]  bg-white
        "
      >

        {/* BLUE BOX */}
        <div
          className="rounded-t-none sm:rounded-t-[10px] w-full p-4 sm:p-6 text-center sm:text-left"
          style={{ backgroundColor: themeColor + "80" }}
        >
          <h2 className="font-poppins font-medium text-[32px] leading-[100%] tracking-[5%] text-[#121212]">
            {t.blueTitle}
          </h2>

          <p className="font-poppins font-normal text-[16px] leading-[100%] tracking-[5%] text-[#121212] mt-4">
            {t.blueSub}
          </p>
        </div>

        <div className=' p-4 lg:p-0'>

          {/* SEARCH BAR */}
          <div
            className="
            mt-[30px]
            w-full max-w-[880px]
            h-14 sm:h-16
            rounded-[20px]
            border-[#ACACAC] border-[1.5px]
            flex items-center
            px-4 sm:px-5
            gap-4 sm:gap-10 
          "
          >
            <SearchIcon size={22} color={themeColor} />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              className="w-full font-poppins font-semibold text-[14px] md:text-[16px] leading-[100%] tracking-[5%] text-[#ACACAC] placeholder-[#ACACAC] outline-none text-center sm:text-left"
            />
          </div>

          {/* CARD 1 */}
          <div
            className="
            mt-[30px]
            w-full max-w-[880px]
            md:h-[366px] h-full
            rounded-none sm:rounded-[20px]
            shadow-[0px_0px_7px_0px_rgba(0,0,0,0.25)]
            flex flex-col justify-start
            p-4 sm:p-6
            text-center sm:text-left
          "
          >
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <BadgeIcon width={28} height={28} color={themeColor} />
              <p className="font-poppins font-semibold text-[16px] leading-[100%] tracking-[5%] text-[#121212]">
                {t.card1Title}
              </p>
            </div>

            <div className="flex flex-col items-center mt-8">
              <ClockIcon width={60} height={60} color={themeColor} />
            </div>

            <p className="mt-6 text-center font-poppins font-semibold text-[24px] leading-[100%] tracking-[5%] text-[#121212]">
              {t.comingSoon}
            </p>

            <p className="mt-4 text-center font-poppins font-normal text-[14px] leading-[25px] tracking-[8%] text-[#ACACAC] px-4 sm:px-8 md:px-[34px]">
              {t.card1Desc}
            </p>
          </div>

          {/* CARD 2 */}
          <div
            className="mb-4
            md:mb-16
            mt-[30px]
            w-full max-w-[880px]
            md:h-[366px] h-full
            rounded-none sm:rounded-[20px]
            shadow-[0px_0px_7px_0px_rgba(0,0,0,0.25)]
            flex flex-col justify-start
            p-4 sm:p-6
            text-center sm:text-left
          "
          >
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <BadgeIcon width={28} height={28} color={themeColor} />
              <p className="font-poppins font-semibold text-[16px] leading-[100%] tracking-[5%] text-[#121212]">
                {t.card2Title}
              </p>
            </div>

            <div className="flex flex-col items-center mt-8">
              <ClockIcon width={60} height={60} color={themeColor} />
            </div>

            <p className="mt-6 text-center font-poppins font-semibold text-[24px] leading-[100%] tracking-[5%] text-[#121212]">
              {t.comingSoon2}
            </p>

            <p className="mt-4 text-center font-poppins font-normal text-[14px] leading-[25px] tracking-[8%] text-[#ACACAC] px-4 sm:px-8 md:px-[34px]">
              {t.card2Desc}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventResultPage;

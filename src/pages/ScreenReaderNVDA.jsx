import React from "react";
import { useNavigate } from "react-router-dom";

const ScreenReaderNVDA = ({ language, themeColor }) => {
    const navigate = useNavigate();

    const text = {
        English: {
            title: "Screen Reader - NVDA",
            department: "DEPARTMENT FOR THE WELFARE OF DIFFERENTLY ABLED PERSONS",
            downloadTitle:
                "Download the Screen Reader Access software from the below link.",
            downloadLink: "https://www.nvaccess.org/download/",
            description:
                "Screen reader Access enables people with visual impairments to access the website using assistive technologies, such as screen readers.",
            stepsTitle: "Steps to enable the screen reader:",
            steps: [
                "Download the software from the link provided.",
                "Run the executable file.",
                "Screen reader will be enabled automatically.",
                "It can be configured to function on loading of Windows OS itself.",
                "Control Keys:",
            ],
            controls: [
                "'Ctrl' key will 'Stop' the audio.",
                "'Shift' key will 'Pause' the audio.",
                "'Insert' key will 'Restart' the audio again.",
            ],
            pdfText: "Click here to view pdf version",
            backText: "← Back",
        },
        Tamil: {
            title: "திரை வாசிப்பு - NVDA",
            department: "மாற்றுத் திறனாளிகள் நலத்துறை",
            downloadTitle: "திரை வாசிப்பு மென்பொருளை கீழே உள்ள இணைப்பில் பதிவிறக்கவும்.",
            downloadLink: "https://www.nvaccess.org/download/",
            description:
                "திரை வாசிப்பு அணுகல் பார்வை குறைபாடுள்ள நபர்கள் உதவித்தொழில்நுட்பங்களைப் பயன்படுத்தி வலைத்தளத்தை அணுக உதவுகிறது.",
            stepsTitle: "திரை வாசிப்பை இயலுமைப்படுத்தும் படிகள்:",
            steps: [
                "வழங்கப்பட்ட இணைப்பில் இருந்து மென்பொருளை பதிவிறக்கவும்.",
                "செயல்படுத்தக்கூடிய கோப்பை இயக்கவும்.",
                "திரை வாசிப்பு தானாகவே இயங்கும்.",
                "இது Windows இயக்க முறைமையை ஏற்றும் போது தானாக இயங்குமாறு அமைக்கலாம்.",
                "கட்டுப்பாட்டு விசைகள்:",
            ],
            controls: [
                "'Ctrl' விசை ஆடியோவை நிறுத்தும்.",
                "'Shift' விசை ஆடியோவை இடைநிறுத்தும்.",
                "'Insert' விசை ஆடியோவை மீண்டும் தொடங்கும்.",
            ],
            pdfText: "PDF பதிப்பைப் பார்க்க இங்கே கிளிக் செய்யவும்",
            backText: "← பின் செல்ல",
        },
    };

    const t = text[language] || text.English;

    return (
        <div className="flex justify-center px-4 md:px-10 lg:px-16 py-10 bg-[#F9FAFB]">
            <div
                className="
          w-full max-w-[1000px] bg-white rounded-[10px] shadow-md border border-gray-200
          flex flex-col items-center px-6 md:px-12 py-10
        "
            >
                {/* 🔙 Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="self-start mb-4 px-4 py-2 rounded-lg text-white font-medium shadow-md transition-transform transform hover:scale-105"
                    style={{ backgroundColor: themeColor }}
                >
                    {t.backText}
                </button>

                {/* Title Section */}
                <h1 className="text-3xl md:text-4xl font-semibold mb-3 text-center"
                    style={{ color: themeColor }}>
                    {t.title}
                </h1>

                <p className="text-center text-gray-700 font-medium mb-8">
                    {t.department}
                </p>

                {/* Download Section */}
                <div className="bg-[#F8F6F6] border border-gray-300 shadow-md rounded-xl p-6 w-full">
                    <p className="font-semibold mb-3">{t.downloadTitle}</p>

                    <a
                        href={t.downloadLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline mb-5 inline-block break-all"
                    >
                        {t.downloadLink}
                    </a>

                    <p className="text-gray-700 mb-4">{t.description}</p>

                    <h2 className="font-bold text-lg mb-2" style={{ color: themeColor }}>
                        {t.stepsTitle}
                    </h2>

                    <ul className="list-decimal list-inside text-gray-700 space-y-2">
                        {t.steps.slice(0, 4).map((step, i) => (
                            <li key={i}>{step}</li>
                        ))}
                    </ul>

                    <div className="mt-3">
                        <p className="font-semibold">{t.steps[4]}</p>
                        <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
                            {t.controls.map((ctrl, i) => (
                                <li key={i}>{ctrl}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* PDF Link */}
                <a
                    href="#"
                    className="underline mt-6 flex items-center gap-2"
                    style={{ color: themeColor }}
                >
                    📄 {t.pdfText}
                </a>
            </div>
        </div>
    );
};

export default ScreenReaderNVDA;

import { Link } from "react-router-dom";
import {
    WhiteDropIcon,
    GrayDropIcon,
    BlackDropIcon,
    TranslateIcon,
    FaceBookIcon,
    TwitterIcon,
    InstagramIcon,
    PhoneIcon,
    EmailIcon,
    LinkedInIcon,
} from "../../assets/icons/icons.jsx";


import { useEffect, useState } from "react";

const Navbar = ({ language, setLanguage, themeColor, setThemeColor }) => {

    // View mode for the 3 drop icons
    const [viewMode, setViewMode] = useState("normal");

    // ✅ GLOBAL FONT SCALE (100 = default)
    const [fontScale, setFontScale] = useState(100);

    const toggleLanguage = () => {
        setLanguage(prev => (prev === "English" ? "Tamil" : "English"));
    };

    // Theme Colors
    const colors = [
        "#0CD7B0",
        "#910101",
        "#4E5763",
        "#0E526E",
        "#0868CC",
    ];

    // ✅ Apply filter to the whole website when viewMode changes
    useEffect(() => {
        if (viewMode === "normal") {
            document.body.style.filter = "none";
        }
        else if (viewMode === "grayscale") {
            document.body.style.filter = "grayscale(100%)";
        }
        else if (viewMode === "highcontrast") {
            document.body.style.filter = "invert(100%) hue-rotate(180deg)";
        }
    }, [viewMode]);

    // ✅ Apply Global Font Scaling
    useEffect(() => {
        document.documentElement.style.fontSize = `${fontScale}%`;
    }, [fontScale]);

    // ✅ Font size handlers
    const increaseFont = () => {
        if (fontScale < 160) setFontScale(prev => prev + 50);
    };

    const defaultFont = () => {
        setFontScale(100);
    };

    const decreaseFont = () => {
        if (fontScale > 60) setFontScale(prev => prev - 40);
    };


    return (
        <nav
            className="relative w-full text-white bg-linear-to-b overflow-visible"
            style={{ background: `linear-gradient(to bottom, ${themeColor}, #C9CCD7)` }}
        >
            <div className="relative z-10 flex flex-wrap items-center justify-center xl:justify-between px-1 md:px-[60px] lg:px-[90px] py-4 md:py-5 gap-4">
                {/* LEFT: CONTACTS */}
                <div className="flex flex-wrap items-center gap-4 md:gap-[53px] text-center justify-center">
                    <div className="flex items-center gap-2.5 md:gap-[15px]">
                        <a
                            href="tel:18004250111"
                            className="flex items-center gap-2.5 md:gap-[15px] hover:opacity-80 transition"
                            aria-label="Call toll-free number 18004250111"
                        >
                            <PhoneIcon />
                            <span className="text-[14px] md:text-[16px] font-semibold whitespace-nowrap">
                                18004250111
                            </span>
                        </a>
                    </div>

                    <div className="flex items-center gap-2.5 md:gap-[15px]">
                        <a
                            href="mailto:dwda.support@tn.gov.in"
                            className="flex items-center gap-2.5 md:gap-[15px] hover:opacity-80 transition"
                            aria-label="Send an email to dwda.support@tn.gov.in"
                        >
                            <EmailIcon />
                            <span className="text-[14px] md:text-[16px] font-semibold whitespace-nowrap underline">
                                dwda.support@tn.gov.in
                            </span>
                        </a>

                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">

                    {/* SOCIAL ICONS */}
                    <div className="flex items-center gap-3">
                        <a
                            href="https://www.facebook.com/TNDifferentlyAbled"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="hover:opacity-80 transition"
                        >
                            <FaceBookIcon />
                        </a>

                        <a
                            href="https://twitter.com/Tn_Diff_abled"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Twitter"
                            className="hover:opacity-80 transition"
                        >
                            <TwitterIcon />
                        </a>

                        <a
                            href="https://www.instagram.com/tndiffabled"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="hover:opacity-80 transition"
                        >
                            <InstagramIcon />
                        </a>

                        <a
                            href="https://www.linkedin.com/company/TNDifferentlyAbled"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="hover:opacity-80 transition"
                        >
                            <LinkedInIcon />
                        </a>
                    </div>


                    {/* DIVIDER */}
                    <div className="h-[30px] md:h-[43px] border-2 md:border-[3px] rounded-[100px] border-[#253B80] mx-1" />

                    {/* THEME COLORS */}
                    <div className="flex items-center gap-2">
                        {colors.map(color => (
                            <div
                                key={color}
                                onClick={() => setThemeColor(color)}
                                className="w-[22px] h-[22px] md:w-[30px] md:h-[30px] rounded-full cursor-pointer border border-white/40"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>

                    {/* DIVIDER */}
                    <div className="h-[30px] md:h-[43px] border-2 md:border-[3px] rounded-[100px] border-[#253B80] mx-1" />

                    {/* ✅ FONT SIZE BUTTONS */}
                    <div className="flex items-center gap-1.5 md:gap-2.5">
                        <button
                            onClick={increaseFont}
                            className="px-2 md:px-4 py-1.5 md:py-2 border rounded-md border-white text-[13px] md:text-[16px]"
                        >
                            T+
                        </button>

                        <button
                            onClick={defaultFont}
                            className="px-2 md:px-4 py-1.5 md:py-2 border rounded-md border-white text-[13px] md:text-[16px]"
                        >
                            T
                        </button>

                        <button
                            onClick={decreaseFont}
                            className="px-2 md:px-4 py-1.5 md:py-2 border rounded-md border-white text-[13px] md:text-[16px]"
                        >
                            T-
                        </button>
                    </div>

                    {/* DIVIDER */}
                    <div className="h-[30px] md:h-[43px] border-2 md:border-[3px] rounded-[100px] border-[#253B80] mx-1" />

                    <Link to="/NVDA" className="text-[20px] p-1">SRA</Link>

                    <div className="h-[30px] md:h-[43px] border-2 md:border-[3px] rounded-[100px] border-[#253B80] mx-1" />

                    {/* ✅ DROP ICONS (VIEW MODES) */}
                    <div className="flex items-center gap-1">

                        {/* WHITE MODE */}
                        <button onClick={() => setViewMode("normal")}>
                            <WhiteDropIcon
                                className={viewMode === "normal" ? "opacity-100" : "opacity-50"}
                            />
                        </button>

                        {/* GRAYSCALE MODE */}
                        <button onClick={() => setViewMode("grayscale")}>
                            <GrayDropIcon
                                className={viewMode === "grayscale" ? "grayscale-0" : "grayscale"}
                            />
                        </button>

                        {/* HIGH CONTRAST MODE */}
                        <button onClick={() => setViewMode("highcontrast")}>
                            <BlackDropIcon
                                className={viewMode === "highcontrast" ? "opacity-100 invert" : "opacity-50"}
                            />
                        </button>

                    </div>

                    {/* DIVIDER */}
                    <div className="h-[30px] md:h-[43px] border-2 md:border-[3px] rounded-[100px] border-[#253B80] mx-1" />

                    {/* LANGUAGE TOGGLE */}
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center justify-center w-[90px] bg-white/20 hover:bg-white/30 text-white rounded-md transition px-[18px] md:px-[26px] py-1.5 md:py-2 text-[14px] md:text-[16px]"
                    >
                        {language === "English" ? "Tamil" : "English"}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
// AdminWinnerDashboard.jsx - CLEAN VERSION (NO LOGIN)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import logo2 from "../../assets/images/logo2.png";
import SearchIcon from "../../assets/icons/SearchIcon";
import EyeIcon from "../../assets/icons/EyeIcon";

const SHORTLISTED_CANDIDATES_URL = "https://yea77f665staodwkc7syfxvxqa0vvcjh.lambda-url.ap-south-1.on.aws/";
const UPDATE_WINNER_URL = "https://sgdezhak6cts4ufn7fy3mro7me0bmuib.lambda-url.ap-south-1.on.aws/";
const REJECTED_CANDIDATES_URL = "https://eshcuhzgnsc6fghew2r43gae6m0mxlxb.lambda-url.ap-south-1.on.aws/";


export default function AdminWinnerDashboard({ language = "English" }) {
    const navigate = useNavigate();
    
    const text = {
        English: { 
            headerTitle: "International Day of Persons with Disabilities – 2025",
            pageTitle: "Winner Selection Panel",
            shortlistedTab: "All Shortlisted Candidates",
            winnersTab: "Selected Winners",
            rejectedTab: "Rejected Candidates",
            searchPlaceholder: "Search Shortlisted Candidates...",
            searchRejectedPlaceholder: "Search Rejected Candidates...",
            announceWinner: "Announce as Winner",
            removeWinner: "Remove from Winners",
            totalShortlisted: "Total Shortlisted",
            totalWinners: "Total Winners",
            totalRejected: "Total Rejected",
            exportWinners: "Export Winners",
            exportShortlisted: "Export Shortlisted",
            exportRejected: "Export Rejected",
            backToLogin: "Back to Login",
            logout: "back",
            rejectReason: "Reject Reason",
            rejectedBy: "Rejected By",
            rejectedOn: "Rejected On"
        },
        Tamil: { 
            headerTitle: "உலக மாற்றுத் திறனாளிகள் தினம் – 2025",
            pageTitle: "வெற்றியாளர் தேர்வு பேனல்",
            shortlistedTab: "அனைத்து குறhortlisted வேட்பாளர்கள்",
            winnersTab: "தேர்ந்தெடுக்கப்பட்ட வெற்றியாளர்கள்",
            rejectedTab: "நிராகரிக்கப்பட்ட வேட்பாளர்கள்",
            searchPlaceholder: "குறhortlisted வேட்பாளர்களை தேடுங்கள்...",
            searchRejectedPlaceholder: "நிராகரிக்கப்பட்ட வேட்பாளர்களை தேடுங்கள்...",
            announceWinner: "வெற்றியாளராக அறிவிக்கவும்",
            removeWinner: "வெற்றியாளர்களிலிருந்து நீக்கு",
            totalShortlisted: "மொத்த குறhortlisted",
            totalWinners: "மொத்த வெற்றியாளர்கள்",
            totalRejected: "மொத்த நிராகரிக்கப்பட்ட",
            exportWinners: "வெற்றியாளர்களை ஏற்றுமதி செய்க",
            exportShortlisted: "குறhortlisted ஏற்றுமதி செய்க",
            exportRejected: "நிராகரிக்கப்பட்டவற்றை ஏற்றுமதி செய்க",
            backToLogin: "உள்நுழைவுக்குத் திரும்புக",
            logout: "வெளியேறு",
            rejectReason: "நிராகரிப்பு காரணம்",
            rejectedBy: "நிராகரித்தவர்",
            rejectedOn: "நிராகரிக்கப்பட்ட தேதி"
        },
    };
    
    const t = text[language];

    const [shortlistedData, setShortlistedData] = useState([]);
    const [winnersData, setWinnersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showVideo, setShowVideo] = useState(false);
    const [currentVideoUrl, setCurrentVideoUrl] = useState("");
    const [activeTab, setActiveTab] = useState("shortlisted");
    const [selectedJudge, setSelectedJudge] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [rejectedData, setRejectedData] = useState([]);
    

    // Fetch all shortlisted candidates on component mount
    useEffect(() => {
        fetchShortlistedCandidates();
    }, []);

    const fetchShortlistedCandidates = async () => {
        try {
            setLoading(true);
            console.log("📋 Fetching all data...");
            
            // Fetch all data in parallel
            const [shortlistedResponse, rejectedResponse] = await Promise.all([
                fetch(SHORTLISTED_CANDIDATES_URL),
                fetch(REJECTED_CANDIDATES_URL)
            ]);

            if (!shortlistedResponse.ok) throw new Error(`HTTP error! status: ${shortlistedResponse.status}`);
            
            const shortlistedData = await shortlistedResponse.json();
            const rejectedData = await rejectedResponse.json().catch(err => {
                console.warn("⚠️ Failed to fetch rejected candidates:", err);
                return [];
            });
            
            console.log("📊 All shortlisted candidates:", shortlistedData);
            console.log("📊 Rejected candidates:", rejectedData);
            
            // Separate winners from non-winners
            const winners = shortlistedData.filter(candidate => candidate.is_winner === true);
            const shortlisted = shortlistedData.filter(candidate => candidate.is_winner !== true);
            
            setShortlistedData(shortlisted);
            setWinnersData(winners);
            setRejectedData(rejectedData);
            
            console.log(`✅ Found ${shortlisted.length} shortlisted, ${winners.length} winners, ${rejectedData.length} rejected`);
            
        } catch (error) {
            console.error("❌ Error fetching data:", error);
            alert(`Failed to load data: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("adminWinnerAuth");
        navigate("/admindashboard");
    };

    // ANNOUNCE WINNER
    const handleAnnounceWinner = async (candidate) => {
        if (!window.confirm(`Announce ${candidate.name} as a WINNER?\n\nThis will mark them as a winner in the system.`)) {
            return;
        }

        try {
            console.log("🏆 Announcing winner:", candidate);
            
            const response = await fetch(UPDATE_WINNER_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    registrationId: candidate.registrationId,
                    is_winner: true
                })
            });

            const result = await response.json();
            console.log("📥 Announce winner response:", result);

            if (!response.ok) {
                throw new Error(result.message || `HTTP error! status: ${response.status}`);
            }

            if (result.success) {
                // Move candidate from shortlisted to winners
                setShortlistedData(prev => prev.filter(row => row.registrationId !== candidate.registrationId));
                setWinnersData(prev => [...prev, { ...candidate, is_winner: true }]);
                
                alert(`🎉 ${candidate.name} has been announced as a WINNER!`);
            } else {
                throw new Error(result.message || "Failed to announce winner");
            }

        } catch (error) {
            console.error('❌ Announce winner error:', error);
            alert(`❌ Failed to announce winner: ${error.message}`);
        }
    };

    // REMOVE FROM WINNERS
    const handleRemoveWinner = async (candidate) => {
        if (!window.confirm(`Remove ${candidate.name} from winners?\n\nThey will be moved back to the shortlisted pool.`)) {
            return;
        }

        try {
            console.log("🗑️ Removing from winners:", candidate);
            
            const response = await fetch(UPDATE_WINNER_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    registrationId: candidate.registrationId,
                    is_winner: false
                })
            });

            const result = await response.json();
            console.log("📥 Remove winner response:", result);

            if (!response.ok) {
                throw new Error(result.message || `HTTP error! status: ${response.status}`);
            }

            if (result.success) {
                // Move candidate from winners back to shortlisted
                setWinnersData(prev => prev.filter(row => row.registrationId !== candidate.registrationId));
                setShortlistedData(prev => [...prev, { ...candidate, is_winner: false }]);
                
                alert(`✅ ${candidate.name} has been removed from winners!`);
            } else {
                throw new Error(result.message || "Failed to remove from winners");
            }

        } catch (error) {
            console.error('❌ Remove winner error:', error);
            alert(`❌ Failed to remove from winners: ${error.message}`);
        }
    };

    // EXPORT FUNCTIONALITY
    const exportToCSV = (data, filename) => {
        if (data.length === 0) {
            alert("No data to export!");
            return;
        }

        let headers, csvContent;

        if (filename.includes('rejected')) {
            // Special format for rejected candidates
            headers = ["S.No", "Registration ID", "Name", "UDID", "Mobile", "Gender", "Age", "District", "Category", "Judge", "Reject Reason", "Rejected At"];
            
            csvContent = [
                headers.join(","),
                ...data.map((row, index) => [
                    index + 1,
                    `"${row.registrationId}"`,
                    `"${row.name}"`,
                    `"${row.udid}"`,
                    `"${row.mobile}"`,
                    `"${row.gender}"`,
                    `"${row.age}"`,
                    `"${row.district}"`,
                    `"${row.category || "Not Set"}"`,
                    `"${row.judgeName}"`,
                    `"${row.rejectReason}"`,
                    `"${new Date(row.rejectedAt).toLocaleDateString()}"`
                ].join(","))
            ].join("\n");
        } else {
            // Original format for shortlisted/winners
            headers = ["S.No", "Registration ID", "Name", "UDID", "Mobile", "Gender", "Age", "District", "Category", "Judge", "Status"];
            
            csvContent = [
                headers.join(","),
                ...data.map((row, index) => [
                    index + 1,
                    `"${row.registrationId}"`,
                    `"${row.name}"`,
                    `"${row.udid}"`,
                    `"${row.mobile}"`,
                    `"${row.gender}"`,
                    `"${row.age}"`,
                    `"${row.district}"`,
                    `"${row.category || "Not Set"}"`,
                    `"${row.judgeName}"`,
                    `"${row.is_winner ? 'WINNER 🏆' : 'Shortlisted'}"`
                ].join(","))
            ].join("\n");
        }

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        
        link.setAttribute("href", url);
        link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = "hidden";
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    // Get unique judges for filter
    const uniqueJudges = [...new Set([...shortlistedData, ...winnersData].map(candidate => candidate.judgeName).filter(Boolean))];
    
    // Filter data based on search and judge filter
    const filteredShortlisted = shortlistedData.filter((row) => {
        const matchesSearch = (
            (row.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (row.mobile || "").includes(searchQuery) ||
            (row.udid || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (row.district || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (row.judgeName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (row.category || "").toLowerCase().includes(searchQuery.toLowerCase())
        );
        const matchesJudge = selectedJudge === "all" || row.judgeName === selectedJudge;
        const matchesCategory = selectedCategory === "all" || 
                            (selectedCategory === "Not Set" ? !row.category : row.category === selectedCategory);
        return matchesSearch && matchesJudge && matchesCategory;
    });

    // Do the same for filteredWinners
    const filteredWinners = winnersData.filter((row) => {
        const matchesSearch = (
            (row.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (row.mobile || "").includes(searchQuery) ||
            (row.udid || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (row.district || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (row.judgeName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (row.category || "").toLowerCase().includes(searchQuery.toLowerCase())
        );
        const matchesJudge = selectedJudge === "all" || row.judgeName === selectedJudge;
        const matchesCategory = selectedCategory === "all" || 
                            (selectedCategory === "Not Set" ? !row.category : row.category === selectedCategory);
        return matchesSearch && matchesJudge && matchesCategory;
    });

    const filteredRejected = rejectedData.filter((row) => {
        const matchesSearch = (
            (row.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (row.mobile || "").includes(searchQuery) ||
            (row.udid || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (row.district || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (row.judgeName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (row.rejectReason || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (row.category || "").toLowerCase().includes(searchQuery.toLowerCase())
        );
        const matchesJudge = selectedJudge === "all" || row.judgeName === selectedJudge;
        const matchesCategory = selectedCategory === "all" || 
                            (selectedCategory === "Not Set" ? !row.category : row.category === selectedCategory);
        return matchesSearch && matchesJudge && matchesCategory;
    });

    const handleVideoOpen = (videoUrl) => {
        setCurrentVideoUrl(videoUrl);
        setShowVideo(true);
    };

    // LOADING STATE
    if (loading) {
        return (
            <div className="w-full bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0868CC] mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-600">Loading winner selection panel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white min-h-screen">
            {/* HEADER */}
            <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-10 px-15 py-6">
                <img src={logo} className="w-[150px] h-[130px]" alt="Logo 1" />
                <div className="text-center">
                    <h1 className="font-poppins font-semibold text-[50px] leading-[100%] tracking-[0.05em] text-[#0868CC]">
                        {t.headerTitle}
                    </h1>
                    <h2 className="font-poppins font-bold text-[28px] text-[#FF6B00] mt-2">
                        {t.pageTitle}
                    </h2>
                </div>
                <img src={logo2} className="w-[150px] h-[130px]" alt="Logo 2" />
            </div>

            {/* ADMIN INFO & STATS */}
            <div className="w-full px-4 md:px-12 mb-6">
                <div className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100 p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        {/* LEFT SECTION */}
                        <div>
                            <h2 className="text-2xl font-extrabold text-purple-800 tracking-wide">
                                Winner Selection Panel
                            </h2>

                            {/* STAT CARDS */}
                            <div className="flex gap-5 mt-4 flex-wrap">
                                <div className="bg-white rounded-xl border border-purple-200 px-5 py-3 shadow-sm min-w-[140px]">
                                    <p className="text-xs text-gray-500">{t.totalShortlisted}</p>
                                    <p className="text-3xl font-bold text-purple-700">{shortlistedData.length}</p>
                                </div>

                                <div className="bg-white rounded-xl border border-green-200 px-5 py-3 shadow-sm min-w-[140px]">
                                    <p className="text-xs text-gray-500">{t.totalWinners}</p>
                                    <p className="text-3xl font-bold text-green-700">{winnersData.length}</p>
                                </div>
                                
                                {/* NEW: Rejected Count Card */}
                                <div className="bg-white rounded-xl border border-red-200 px-5 py-3 shadow-sm min-w-[140px]">
                                    <p className="text-xs text-gray-500">{t.totalRejected}</p>
                                    <p className="text-3xl font-bold text-red-700">{rejectedData.length}</p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SECTION - BUTTONS */}
                        <div className="flex gap-3 flex-wrap">
                            <button
                                onClick={fetchShortlistedCandidates}
                                className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold shadow hover:bg-purple-700 transition"
                            >
                                Refresh Data
                            </button>

                            <button
                                onClick={() => exportToCSV(shortlistedData, 'shortlisted_candidates')}
                                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700 transition"
                            >
                                {t.exportShortlisted} (CSV)
                            </button>

                            <button
                                onClick={() => exportToCSV(winnersData, 'winners')}
                                className="px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold shadow hover:bg-green-700 transition"
                            >
                                {t.exportWinners} (CSV)
                            </button>

                            <button
                                onClick={() => exportToCSV(rejectedData, 'rejected_candidates')}
                                className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold shadow hover:bg-red-700 transition"
                            >
                                {t.exportRejected} (CSV)
                            </button>

                            <button
                                onClick={handleLogout}
                                className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold shadow hover:bg-red-700 transition"
                            >
                                {t.logout}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABS */}
            <div className="w-full px-4 md:px-12 mb-6">
                <div className="flex border-b border-gray-200">
                    <button
                        className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                            activeTab === "shortlisted" 
                                ? "border-purple-600 text-purple-600" 
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setActiveTab("shortlisted")}
                    >
                        {t.shortlistedTab} ({shortlistedData.length})
                    </button>
                    <button
                        className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                            activeTab === "winners" 
                                ? "border-green-600 text-green-600" 
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setActiveTab("winners")}
                    >
                        {t.winnersTab} ({winnersData.length})
                    </button>
                    
                    {/* NEW: Rejected Tab */}
                    <button
                        className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                            activeTab === "rejected" 
                                ? "border-red-600 text-red-600" 
                                : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setActiveTab("rejected")}
                    >
                        {t.rejectedTab} ({rejectedData.length})
                    </button>
                </div>
            </div>

            {/* SEARCH AND FILTERS */}
            <div className="w-full px-4 md:px-12">
                <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-6">
                    <div className="flex items-center gap-3 px-4 w-full md:w-[413px] h-[50px] bg-[#F8F6F6] border border-[#C6C6C6] rounded-[16px]">
                        <SearchIcon />
                        <input
                            type="text"
                            placeholder={
                                activeTab === "rejected" ? t.searchRejectedPlaceholder : t.searchPlaceholder
                            }
                            className="flex-1 bg-transparent outline-none text-[16px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">Filter by Judge:</span>
                            <select 
                                value={selectedJudge}
                                onChange={(e) => setSelectedJudge(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                                <option value="all">All Judges</option>
                                {uniqueJudges.map(judge => (
                                    <option key={judge} value={judge}>{judge}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">Filter by Category:</span>
                            <select 
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            >
                                <option value="all">All Categories</option>
                                <option value="Singing">Singing</option>
                                <option value="Dance">Dance</option>
                                <option value="Mime">Mime</option>
                                <option value="Instrumental Performance">Instrumental Performance</option>
                                <option value="Painting">Painting</option>
                                <option value="Drawing">Drawing</option>
                                <option value="Craft">Craft</option>
                                <option value="Mimicry">Mimicry</option>
                                <option value="Creative Kavidhai">Creative Kavidhai</option>
                                <option value="Yoga">Yoga</option>
                                <option value="Others">Others</option>
                                <option value="Not Set">Not Set</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABLE HEADER */}
            <div className={`min-w-[1000px] ${
                activeTab === "shortlisted" ? "bg-purple-600" : 
                activeTab === "winners" ? "bg-green-600" : 
                "bg-red-600"
            }`}>
                <div className={`grid gap-2 py-4 px-4 text-white font-semibold ${
                    activeTab === "rejected" ? "grid-cols-12" : "grid-cols-11"
                }`}>
                    <div className="text-center">S.no</div>
                    <div className="text-center">UDID</div>
                    <div className="text-center">Name</div>
                    <div className="text-center">Mobile no</div>
                    <div className="text-center">Gender</div>
                    <div className="text-center">Age</div>
                    <div className="text-center">District</div>
                    <div className="text-center">Category</div>
                    <div className="text-center">Judge</div>
                    {activeTab === "rejected" && <div className="text-center">Reject Reason</div>}
                    <div className="text-center">Video Preview</div>
                    {activeTab !== "rejected" && <div className="text-center">Action</div>}
                </div>
            </div>

            {/* TABLE BODY */}
            <div className="min-w-[1000px]">
                {/* SHORTLISTED CANDIDATES TABLE */}
                {activeTab === "shortlisted" && (
                    <>
                        {filteredShortlisted.map((row, index) => (
                            <div
                                key={row.registrationId}
                                className={`grid grid-cols-11 gap-2 py-4 px-4 items-center text-center bg-purple-50 ${index === filteredShortlisted.length - 1 ? "" : "border-b border-gray-300"}`}
                            >
                                <div className="text-sm">{index + 1}</div>
                                <div className="text-xs">{row.udid}</div>
                                <div className="font-medium">{row.name}</div>
                                <div>{row.mobile}</div>
                                <div>{row.gender}</div>
                                <div>{row.age}</div>
                                <div className="text-sm">{row.district}</div>
                                <div className="text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        row.category ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {row.category || "Not Set"}
                                    </span>
                                </div>
                                <div className="text-sm text-purple-600 font-medium">{row.judgeName}</div>

                                <div className="group flex items-center justify-center gap-2 px-2 py-1 rounded-lg cursor-pointer hover:bg-purple-600 hover:text-white transition-all"
                                    onClick={() => handleVideoOpen(row.videoUrl)}
                                >
                                    <EyeIcon className="group-hover:text-white" />
                                    <span className="text-[14px]">View</span>
                                </div>

                                <div>
                                    <button
                                        onClick={() => handleAnnounceWinner(row)}
                                        className="text-[14px] px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 border border-transparent transition-all"
                                    >
                                        {t.announceWinner}
                                    </button>
                                </div>
                            </div>
                        ))}

                        {filteredShortlisted.length === 0 && (
                            <div className="py-8 text-center bg-purple-50">
                                <p className="text-gray-500 text-lg">
                                    {shortlistedData.length === 0
                                        ? "No shortlisted candidates found."
                                        : "No candidates match your search criteria."
                                    }
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* WINNERS TABLE */}
                {activeTab === "winners" && (
                    <>
                        {filteredWinners.map((row, index) => (
                            <div
                                key={row.registrationId}
                                className={`grid grid-cols-11 gap-2 py-4 px-4 items-center text-center bg-green-50 ${index === filteredWinners.length - 1 ? "" : "border-b border-gray-300"}`}
                            >
                                <div className="text-sm">{index + 1}</div>
                                <div className="text-xs">{row.udid}</div>
                                <div className="font-medium text-green-800">{row.name} 🏆</div>
                                <div>{row.mobile}</div>
                                <div>{row.gender}</div>
                                <div>{row.age}</div>
                                <div className="text-sm">{row.district}</div>
                                <div className="text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        row.category ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {row.category || "Not Set"}
                                    </span>
                                </div>
                                <div className="text-sm text-green-600 font-medium">{row.judgeName}</div>

                                <div className="group flex items-center justify-center gap-2 px-2 py-1 rounded-lg cursor-pointer hover:bg-green-600 hover:text-white transition-all"
                                    onClick={() => handleVideoOpen(row.videoUrl)}
                                >
                                    <EyeIcon className="group-hover:text-white" />
                                    <span className="text-[14px]">View</span>
                                </div>

                                <div>
                                    <button
                                        onClick={() => handleRemoveWinner(row)}
                                        className="text-[14px] px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 border border-transparent transition-all"
                                    >
                                        {t.removeWinner}
                                    </button>
                                </div>
                            </div>
                        ))}

                        {filteredWinners.length === 0 && (
                            <div className="py-8 text-center bg-green-50">
                                <p className="text-gray-500 text-lg">
                                    {winnersData.length === 0
                                        ? "No winners announced yet."
                                        : "No winners match your search criteria."
                                    }
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* REJECTED CANDIDATES TABLE */}
                {activeTab === "rejected" && (
                    <>
                        {filteredRejected.map((row, index) => (
                            <div
                                key={row.registrationId}
                                className={`grid grid-cols-12 gap-2 py-4 px-4 items-center text-center bg-red-50 ${index === filteredRejected.length - 1 ? "" : "border-b border-gray-300"}`}
                            >
                                <div className="text-sm">{index + 1}</div>
                                <div className="text-xs">{row.udid}</div>
                                <div className="font-medium text-red-800">{row.name}</div>
                                <div>{row.mobile}</div>
                                <div>{row.gender}</div>
                                <div>{row.age}</div>
                                <div className="text-sm">{row.district}</div>
                                <div className="text-sm">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        {row.category || "Not Set"}
                                    </span>
                                </div>
                                <div className="text-sm text-red-600 font-medium">{row.judgeName}</div>

                                {/* Reject Reason with Tooltip */}
                                <div className="group relative">
                                    <div className="px-2 py-1 rounded-lg bg-red-100 text-red-800 text-xs cursor-help truncate max-w-[120px] mx-auto">
                                        {row.rejectReason.length > 20 ? 
                                            `${row.rejectReason.substring(0, 20)}...` : 
                                            row.rejectReason
                                        }
                                    </div>
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-sm rounded-lg z-10">
                                        <strong>{t.rejectReason}:</strong> {row.rejectReason}
                                        <br />
                                        <strong>{t.rejectedOn}:</strong> {new Date(row.rejectedAt).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="group flex items-center justify-center gap-2 px-2 py-1 rounded-lg cursor-pointer hover:bg-red-600 hover:text-white transition-all"
                                    onClick={() => handleVideoOpen(row.videoUrl)}
                                >
                                    <EyeIcon className="group-hover:text-white" />
                                    <span className="text-[14px]">View</span>
                                </div>
                            </div>
                        ))}

                        {filteredRejected.length === 0 && (
                            <div className="py-8 text-center bg-red-50">
                                <p className="text-gray-500 text-lg">
                                    {rejectedData.length === 0
                                        ? "No rejected candidates found."
                                        : "No rejected candidates match your search criteria."
                                    }
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Video Modal */}
            {showVideo && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-[20px] p-6 w-full max-w-[800px] relative">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-[22px] font-semibold text-[#0868CC]">Performance Video</h2>
                            <button
                                onClick={() => setShowVideo(false)}
                                className="text-[28px] font-bold text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="w-full h-[350px] rounded-[20px] overflow-hidden bg-black flex items-center justify-center">
                            {currentVideoUrl ? (
                                <div className="w-full h-full">
                                    <video
                                        src={`https://scd-event-registrations-videos.s3.ap-south-1.amazonaws.com/${currentVideoUrl}`}
                                        controls
                                        autoPlay
                                        className="w-full h-full object-contain"
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            ) : (
                                <p className="text-white">No Video Available</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
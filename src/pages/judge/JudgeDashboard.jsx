// JudgeDashboard.jsx - UPDATED WITH STATUS FILTER & TOAST POPUP
import React, { useState, useEffect } from "react";
import logo from "../../assets/images/logo.png";
import logo2 from "../../assets/images/logo2.png";
import SearchIcon from "../../assets/icons/SearchIcon";
import EyeIcon from "../../assets/icons/EyeIcon";

const LIST_URL = "https://aszvudwtu6.execute-api.ap-south-1.amazonaws.com/prod";
const SHORTLIST_URL = "https://bdkaknnaf63q6spm2nmqagqtra0nrhhx.lambda-url.ap-south-1.on.aws/";
const SHORTLISTED_IDS_URL = "https://hmmwt67aq7enytmdtxebdvxesm0aqufv.lambda-url.ap-south-1.on.aws/";
const REJECT_URL = "https://enwzxhfokiw5randtxzf6eheoq0pcsnd.lambda-url.ap-south-1.on.aws/"; // reject Lambda URL

export default function JudgeDashboard({ language = "English" }) {
    const text = {
        English: {
            headerTitle: "International Day of Persons with Disabilities – 2025",
            assignedTab: "Assigned Candidates"
        },
        Tamil: {
            headerTitle: "உலக மாற்றுத் திறனாளிகள் தினம் – 2025",
            assignedTab: "ஒப்படைக்கப்பட்ட வேட்பாளர்கள்"
        },
    };

    const t = text[language];
    const judgeId = localStorage.getItem("judgeId") || "123451";
    const judgeName = `Judge ${judgeId ? parseInt(judgeId) - 123450 : "1"}`;
    const LOCAL_ACTIONS_KEY = `judgeActions_${judgeId}`;

    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showVideo, setShowVideo] = useState(false);
    const [currentVideoUrl, setCurrentVideoUrl] = useState("");
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    // 🔹 status per registrationId: "pending" | "shortlisted" | "rejected"
    const [judgeActions, setJudgeActions] = useState({});

    // 🔹 status filter: all | pending | shortlisted | rejected
    const [statusFilter, setStatusFilter] = useState("all");

    // 🔹 toast popup: success / error messages
    const [toast, setToast] = useState({
        open: false,
        type: "success", // "success" | "error"
        message: ""
    });

    const categories = [
        "Singing",
        "Dance",
        "Mime",
        "Instrumental Performance",
        "Painting",
        "Drawing",
        "Craft",
        "Mimicry",
        "Creative Kavidhai",
        "Yoga",
        "Others"
    ];

    // 🔹 Helper to show toast
    const showToast = (type, message) => {
        setToast({ open: true, type, message });
    };

    // 🔹 Auto-hide toast after 4 seconds
    useEffect(() => {
        if (!toast.open) return;
        const t = setTimeout(() => {
            setToast(prev => ({ ...prev, open: false }));
        }, 4000);
        return () => clearTimeout(t);
    }, [toast.open]);

    // 🔹 Load persisted actions from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(LOCAL_ACTIONS_KEY);
            if (stored) {
                setJudgeActions(JSON.parse(stored));
            }
        } catch (err) {
            console.error("Error reading judgeActions from localStorage:", err);
        }
    }, [LOCAL_ACTIONS_KEY]);

    // Helper to update status + persist
    const updateJudgeAction = (registrationId, status) => {
        setJudgeActions(prev => {
            const updated = { ...prev, [registrationId]: status };
            try {
                localStorage.setItem(LOCAL_ACTIONS_KEY, JSON.stringify(updated));
            } catch (err) {
                console.error("Error saving judgeActions to localStorage:", err);
            }
            return updated;
        });
    };

    // Fetch assigned candidates
    useEffect(() => {
        fetchAssignedCandidates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [judgeName]);

    const fetchAssignedCandidates = async () => {
        try {
            setLoading(true);
            console.log("🔄 Fetching assigned candidates...");

            const assignedResponse = await fetch(LIST_URL);
            if (!assignedResponse.ok) {
                throw new Error(`HTTP error! status: ${assignedResponse.status}`);
            }

            const data = await assignedResponse.json();

            let candidates = [];
            if (Array.isArray(data)) {
                candidates = data;
            } else {
                console.error("❌ Invalid data format:", data);
                setTableData([]);
                return;
            }

            const assigned = candidates
                .filter(candidate => candidate.assignedto === judgeName)
                .map((candidate, index) => ({
                    sno: (index + 1).toString().padStart(2, "0"),
                    registrationId: candidate.registrationId || "",
                    udid: candidate.udid || candidate.uidCardNumber || "",
                    name: candidate.name || candidate.fullName || "N/A",
                    mobile: candidate.mobile || candidate.mobileNumber || "N/A",
                    gender: candidate.gender || "N/A",
                    age: candidate.age || "N/A",
                    district: candidate.district || "N/A",
                    videoUrl: candidate.videoUrl || candidate.videoS3Key || "",
                    category: candidate.category || "Not Set",
                }));

            console.log(`✅ Found ${assigned.length} assigned candidates for ${judgeName}`);
            setTableData(assigned);

        } catch (err) {
            console.error("❌ Error fetching assigned candidates:", err);
            showToast("error", "Failed to load candidates. Please try again.");
            setTableData([]);
        } finally {
            setLoading(false);
        }
    };

    // OPEN CATEGORY SELECTION MODAL
    const handleShortlistClick = (candidate) => {
        setSelectedCandidate(candidate);
        setSelectedCategory(candidate.category || "Not Set");
        setShowCategoryModal(true);
    };

    // OPEN REJECT MODAL
    const handleRejectClick = (candidate) => {
        setSelectedCandidate(candidate);
        setRejectReason("");
        setShowRejectModal(true);
    };

    // SHORTLIST WITH CATEGORY
    const handleShortlistWithCategory = async () => {
        if (!selectedCategory) {
            showToast("error", "Please select a category before shortlisting.");
            return;
        }

        // No confirm box: clicking "Shortlist" in this modal is already the confirmation
        try {
            console.log("📤 Sending shortlist request for:", selectedCandidate);

            const payload = {
                judgeId: judgeId,
                judgeName: judgeName,
                registrationId: selectedCandidate.registrationId,
                name: selectedCandidate.name,
                udid: selectedCandidate.udid,
                district: selectedCandidate.district,
                mobile: selectedCandidate.mobile,
                gender: selectedCandidate.gender,
                age: selectedCandidate.age,
                videoUrl: selectedCandidate.videoUrl,
                category: selectedCategory
            };

            console.log("📦 Payload:", payload);

            const response = await fetch(SHORTLIST_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            console.log("📥 Response status:", response.status);
            console.log("📥 Response ok:", response.ok);

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    errorMessage = response.statusText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log("✅ Shortlist response:", result);

            if (result.success) {
                updateJudgeAction(selectedCandidate.registrationId, "shortlisted");
                setShowCategoryModal(false);
                setSelectedCandidate(null);
                setSelectedCategory("");
                showToast(
                    "success",
                    `${payload.name} has been shortlisted in ${selectedCategory} category.`
                );
            } else {
                throw new Error(result.message || "Shortlist failed");
            }

        } catch (error) {
            console.error('❌ Shortlist error:', error);
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                showToast("error", "Network error: Cannot connect to server. Please try again.");
            } else {
                showToast("error", `Failed to shortlist: ${error.message}`);
            }
        }
    };

    // REJECT CANDIDATE
    const handleRejectCandidate = async () => {
        if (!rejectReason.trim()) {
            showToast("error", "Please provide a reason for rejection.");
            return;
        }

        // No confirm box: clicking "Reject" in this modal is already the confirmation
        try {
            console.log("❌ Sending reject request for:", selectedCandidate);

            const response = await fetch(REJECT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    judgeId: judgeId,
                    judgeName: judgeName,
                    registrationId: selectedCandidate.registrationId,
                    name: selectedCandidate.name,
                    udid: selectedCandidate.udid,
                    district: selectedCandidate.district,
                    mobile: selectedCandidate.mobile,
                    gender: selectedCandidate.gender,
                    age: selectedCandidate.age,
                    videoUrl: selectedCandidate.videoUrl,
                    rejectReason: rejectReason,
                    rejectedAt: new Date().toISOString()
                })
            });

            const result = await response.json();
            console.log("✅ Reject response:", result);

            if (result.success) {
                updateJudgeAction(selectedCandidate.registrationId, "rejected");
                setShowRejectModal(false);
                setSelectedCandidate(null);
                setRejectReason("");
                showToast(
                    "success",
                    `${selectedCandidate.name} has been rejected and moved to admin review.`
                );
            } else {
                throw new Error(result.message || "Rejection failed");
            }

        } catch (error) {
            console.error('❌ Reject error:', error);
            showToast("error", `Failed to reject candidate: ${error.message}`);
        }
    };

    // 🔍 Apply search + status filter
    const filteredRows = tableData.filter((row) => {
        const s = (searchQuery || "").toLowerCase();
        const matchesSearch =
            (row.name || "").toLowerCase().includes(s) ||
            (row.mobile || "").includes(s) ||
            (row.udid || "").toLowerCase().includes(s) ||
            (row.district || "").toLowerCase().includes(s);

        const status = judgeActions[row.registrationId] || "pending";
        const matchesStatus =
            statusFilter === "all" || status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleVideoOpen = (videoUrl) => {
        setCurrentVideoUrl(videoUrl);
        setShowVideo(true);
    };

    if (loading) {
        return (
            <div className="w-full bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0868CC] mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-600">Loading your assigned candidates...</p>
                    <p className="text-sm text-gray-500">Judge: {judgeName}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white">
            {/* HEADER */}
            <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-10 px-15 py-6">
                <img src={logo} className="w-[150px] h-[130px]" alt="Logo 1" />
                <h1 className="text-center font-poppins font-semibold text-[50px] leading-[100%] tracking-[0.05em] text-[#0868CC]">
                    {t.headerTitle}
                </h1>
                <img src={logo2} className="w-[150px] h-[130px]" alt="Logo 2" />
            </div>

            {/* JUDGE INFO */}
            <div className="w-full px-4 md:px-12 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold text-[#0868CC]">Welcome, {judgeName}</h2>
                            <p className="text-gray-600">You have {tableData.length} candidates to review</p>
                            <div className="mt-2 p-4 bg-green-50 border border-green-200 rounded text-sm">
                                <p><strong>Instructions:</strong> </p>
                                <p>• Click "Shortlist" to add candidates to final pool with category selection.</p>
                                <p>• Click "Reject" to move candidates to admin review with reason.</p>
                                <p>• After action, the candidate will stay in your list but buttons will change to a status tag.</p>
                                <p className="mt-1 text-blue-600">
                                    <strong>Note:</strong> Status tags are stored locally, so they stay even after refresh on this device.
                                </p>
                            </div>
                        </div>
                        <div className="mt-2 md:mt-0 flex gap-2 flex-wrap">
                            <span className="bg-[#0868CC] text-white px-4 py-2 rounded-lg text-sm font-medium">
                                Judge ID: {judgeId}
                            </span>
                            <button
                                onClick={fetchAssignedCandidates}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                                Refresh List
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEARCH + FILTERS */}
            <div className="w-full px-4 md:px-12">
                <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-4 md:gap-6">
                    <div className="flex items-center gap-3 px-4 w-full md:w-[413px] h-[50px] bg-[#F8F6F6] border border-[#C6C6C6] rounded-[16px]">
                        <SearchIcon />
                        <input
                            type="text"
                            placeholder="Search Candidate..."
                            className="flex-1 bg-transparent outline-none text-[16px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Status Filter Buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {[
                            { key: "all", label: "All" },
                            { key: "pending", label: "Pending" },
                            { key: "shortlisted", label: "Shortlisted" },
                            { key: "rejected", label: "Rejected" },
                        ].map(opt => (
                            <button
                                key={opt.key}
                                onClick={() => setStatusFilter(opt.key)}
                                className={
                                    "px-3 py-1.5 rounded-full text-sm border transition-all " +
                                    (statusFilter === opt.key
                                        ? "bg-[#0868CC] text-white border-[#0868CC]"
                                        : "bg-white text-gray-700 border-gray-300 hover:border-[#0868CC]")
                                }
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <div className="w-full px-4 md:px-12 mb-8">
                <div className="overflow-x-auto rounded-[10px] border border-gray-200">
                    <div className="bg-[#0868CC80] min-w-[1000px]">
                        <div className="grid grid-cols-[50px_1.5fr_1.5fr_1.2fr_0.8fr_0.6fr_1.2fr_1.2fr_1fr_1fr_1fr] gap-2 py-4 px-4 text-white font-semibold">
                            <div className="text-center">S.no</div>
                            <div className="text-center">UDID</div>
                            <div className="text-center">Name</div>
                            <div className="text-center">Mobile no</div>
                            <div className="text-center">Gender</div>
                            <div className="text-center">Age</div>
                            <div className="text-center">District</div>
                            <div className="text-center">Category</div>
                            <div className="text-center">Video Preview</div>
                            <div className="text-center">Shortlist</div>
                            <div className="text-center">Reject</div>
                        </div>
                    </div>

                    <div className="min-w-[1000px]">
                        {filteredRows.map((row, index) => {
                            const status = judgeActions[row.registrationId] || "pending";

                            return (
                                <div
                                    key={row.registrationId}
                                    className={`grid grid-cols-[50px_1.5fr_1.5fr_1.2fr_0.8fr_0.6fr_1.2fr_1.2fr_1fr_1fr_1fr] gap-2 py-4 px-4 items-center text-center bg-[#F8F6F6] ${index === filteredRows.length - 1 ? "" : "border-b border-gray-300"
                                        }`}
                                >
                                    <div className="text-sm">{row.sno}</div>
                                    <div className="text-xs">{row.udid}</div>
                                    <div className="font-medium">{row.name}</div>
                                    <div>{row.mobile}</div>
                                    <div>{row.gender}</div>
                                    <div>{row.age}</div>
                                    <div className="text-sm">{row.district}</div>
                                    <div className="text-sm font-medium text-purple-600">{row.category}</div>

                                    <div
                                        className="group flex items-center justify-center gap-2 px-2 py-1 rounded-lg cursor-pointer hover:bg-[#0868CC] hover:text-white transition-all"
                                        onClick={() => handleVideoOpen(row.videoUrl)}
                                    >
                                        <EyeIcon className="group-hover:text-white" />
                                        <span className="text-[14px]">View</span>
                                    </div>

                                    {/* Shortlist column */}
                                    <div>
                                        {status === "pending" && (
                                            <button
                                                onClick={() => handleShortlistClick(row)}
                                                className="text-[14px] px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 border border-transparent transition-all"
                                            >
                                                Shortlist
                                            </button>
                                        )}
                                        {status === "shortlisted" && (
                                            <span className="inline-block px-3 py-1 rounded-md bg-green-100 text-green-700 text-xs font-semibold">
                                                Shortlisted
                                            </span>
                                        )}
                                        {status === "rejected" && (
                                            <span className="inline-block px-3 py-1 rounded-md bg-gray-200 text-gray-600 text-xs">
                                                —
                                            </span>
                                        )}
                                    </div>

                                    {/* Reject column */}
                                    <div>
                                        {status === "pending" && (
                                            <button
                                                onClick={() => handleRejectClick(row)}
                                                className="text-[14px] px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 border border-transparent transition-all"
                                            >
                                                Reject
                                            </button>
                                        )}
                                        {status === "rejected" && (
                                            <span className="inline-block px-3 py-1 rounded-md bg-red-100 text-red-700 text-xs font-semibold">
                                                Rejected
                                            </span>
                                        )}
                                        {status === "shortlisted" && (
                                            <span className="inline-block px-3 py-1 rounded-md bg-gray-200 text-gray-600 text-xs">
                                                —
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {filteredRows.length === 0 && (
                            <div className="py-8 text-center bg-[#F8F6F6]">
                                <p className="text-gray-500 text-lg">
                                    {tableData.length === 0
                                        ? `No candidates assigned to ${judgeName} yet. Please contact administrator.`
                                        : "No candidates match your search / filter."}
                                </p>
                                {tableData.length === 0 && (
                                    <button
                                        onClick={fetchAssignedCandidates}
                                        className="mt-4 bg-[#0868CC] text-white px-4 py-2 rounded-lg hover:bg-[#075bb4] transition-colors"
                                    >
                                        Check Again
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Category Selection Modal */}
            {showCategoryModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-[20px] p-6 w-full max-w-[500px] relative">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-[22px] font-semibold text-[#0868CC]">Confirm Shortlist</h2>
                            <button
                                onClick={() => setShowCategoryModal(false)}
                                className="text-[28px] font-bold text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-700 mb-4">
                                Are you sure you want to shortlist <strong>{selectedCandidate?.name}</strong>?
                            </p>
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <p className="text-sm text-gray-600 mb-1">Category:</p>
                                <p className="text-lg font-bold text-[#0868CC]">{selectedCategory}</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowCategoryModal(false)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleShortlistWithCategory}
                                className="px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700"
                            >
                                Confirm Shortlist
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Reason Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-[20px] p-6 w-full max-w-[500px] relative">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-[22px] font-semibold text-red-600">Reject Candidate</h2>
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="text-[28px] font-bold text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-700 mb-4">
                                Provide reason for rejecting <strong>{selectedCandidate?.name}</strong>:
                            </p>

                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Enter rejection reason..."
                                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRejectCandidate}
                                disabled={!rejectReason.trim()}
                                className={`px-4 py-2 rounded-lg text-white ${rejectReason.trim()
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                                        src={currentVideoUrl.startsWith('http')
                                            ? currentVideoUrl
                                            : `https://scd-event-registrations-videos.s3.ap-south-1.amazonaws.com/${encodeURIComponent(currentVideoUrl)}`}
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

            {/* Toast Popup */}
            {toast.open && (
                <div className="fixed bottom-4 right-4 z-[60]">
                    <div
                        className={
                            "max-w-sm rounded-lg shadow-lg px-4 py-3 flex items-start gap-3 " +
                            (toast.type === "success"
                                ? "bg-green-600 text-white"
                                : "bg-red-600 text-white")
                        }
                    >
                        <div className="mt-0.5">
                            {toast.type === "success" ? "✅" : "⚠️"}
                        </div>
                        <div className="flex-1 text-sm">
                            {toast.message}
                        </div>
                        <button
                            onClick={() => setToast(prev => ({ ...prev, open: false }))}
                            className="ml-2 text-white/80 hover:text-white text-lg leading-none"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

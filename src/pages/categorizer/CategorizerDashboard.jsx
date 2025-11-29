import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import logo2 from '../../assets/images/logo2.png';
import EyeIcon from '../../assets/icons/EyeIcon';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Lambda Function URLs
const GET_ASSIGNED_URL = "https://7dlbphmvgv4ntjbeykilghonoa0aoeao.lambda-url.ap-south-1.on.aws/";
const UPDATE_CATEGORY_URL = "https://a3kb4yblsbwgmtfo6y3p7q4rr40zkcww.lambda-url.ap-south-1.on.aws/";

const categories = [
    "None (Reset)",
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
    "Silambam",
    "Speech",
    "Sports",
    "Others"
];

export default function CategorizerDashboard() {
    const navigate = useNavigate();

    const [candidates, setCandidates] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showVideo, setShowVideo] = useState(false);
    const [toast, setToast] = useState({ open: false, type: "success", message: "" });

    // Get categorizer info from localStorage
    const categorizerId = localStorage.getItem('categorizerId');
    const categorizerName = localStorage.getItem('categorizerName');
    const categorizerAuth = localStorage.getItem('categorizerAuth');

    // Check authentication
    useEffect(() => {
        if (!categorizerAuth || !categorizerId) {
            navigate('/categorizer');
        }
    }, [categorizerAuth, categorizerId, navigate]);

    // Fetch assigned candidates
    useEffect(() => {
        if (categorizerId) {
            fetchAssignedCandidates();
        }
    }, [categorizerId]);

    const fetchAssignedCandidates = async () => {
        try {
            setLoading(true);
            console.log(`🔄 Fetching candidates for ${categorizerId}...`);

            const response = await fetch(`${GET_ASSIGNED_URL}?categorizerId=${categorizerId}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('📦 Received data:', data);

            // Transform data to match expected format
            const transformedData = Array.isArray(data) ? data.map((item, index) => ({
                sno: (index + 1).toString().padStart(2, "0"),
                registrationId: item.registrationId || "",
                udid: item.uidCardNumber || item.udid || "",
                name: item.fullName || item.name || "N/A",
                mobile: item.mobileNumber || item.mobile || "N/A",
                gender: item.gender || "N/A",
                age: item.age || "N/A",
                district: item.district || "N/A",
                videoUrl: item.videoS3Key || item.videoUrl || "",
                description: item.description || item.performanceDescription || "N/A",
                category: item.category || "",
                pk: item.pk || null,
                sk: item.sk || null
            })) : [];

            setCandidates(transformedData);

            // Set category if already assigned
            if (transformedData.length > 0 && transformedData[0].category) {
                setSelectedCategory(transformedData[0].category);
            }

            console.log(`✅ Loaded ${transformedData.length} candidates`);
        } catch (error) {
            console.error('❌ Error fetching candidates:', error);
            showToast('error', 'Failed to load candidates. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (type, message) => {
        setToast({ open: true, type, message });
        setTimeout(() => setToast({ open: false, type, message: "" }), 4000);
    };
    const handleUpdateCategory = async () => {
        if (!selectedCategory) {
            showToast('error', 'Please select a category first!');
            return;
        }

        const currentCandidate = candidates[currentIndex];
        if (!currentCandidate) return;

        try {
            setUpdating(true);
            console.log(`📤 Updating category for ${currentCandidate.registrationId}...`);

            // If "None (Reset)" is selected, send empty string to clear category
            const categoryValue = selectedCategory === "None (Reset)" ? "" : selectedCategory;

            const response = await fetch(UPDATE_CATEGORY_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    registrationId: currentCandidate.registrationId,
                    category: categoryValue,
                    assignedCategorizer: categorizerId,
                    pk: currentCandidate.pk,
                    sk: currentCandidate.sk
                })
            });

            const result = await response.json();

            if (result.success) {
                // Update local state
                const updatedCandidates = [...candidates];
                updatedCandidates[currentIndex].category = categoryValue;
                setCandidates(updatedCandidates);

                const message = selectedCategory === "None (Reset)"
                    ? "Category reset successfully!"
                    : `Category "${selectedCategory}" assigned successfully!`;
                showToast('success', message);

                // Auto-move to next candidate after 1 second
                setTimeout(() => {
                    handleNext();
                }, 1000);
            } else {
                throw new Error(result.message || 'Update failed');
            }
        } catch (error) {
            console.error('❌ Error updating category:', error);
            showToast('error', `Failed to update: ${error.message}`);
        } finally {
            setUpdating(false);
        }
    };

    const handleNext = () => {
        if (currentIndex < candidates.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            setSelectedCategory(candidates[nextIndex].category || "");
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            setCurrentIndex(prevIndex);
            setSelectedCategory(candidates[prevIndex].category || "");
        }
    };

    const handleExport = () => {
        try {
            const exportData = candidates.map((c, index) => ({
                "S.No": index + 1,
                "Registration ID": c.registrationId,
                "UDID": c.udid,
                "Name": c.name,
                "Mobile": c.mobile,
                "District": c.district,
                "Category": c.category || "Not Set",
                "Status": c.category ? "Categorized" : "Pending"
            }));

            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Categorized Candidates");
            const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
            const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            saveAs(data, `Categorizer_Report_${categorizerName}.xlsx`);
            showToast('success', 'Report downloaded successfully!');
        } catch (error) {
            console.error("Export error:", error);
            showToast('error', 'Failed to export report.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('categorizerId');
        localStorage.removeItem('categorizerName');
        localStorage.removeItem('categorizerAuth');
        navigate('/categorizer');
    };

    const categorizedCount = candidates.filter(c => c.category).length;
    const currentCandidate = candidates[currentIndex];

    if (loading) {
        return (
            <div className="w-full bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0868CC] mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-600">Loading your assigned candidates...</p>
                </div>
            </div>
        );
    }

    if (candidates.length === 0) {
        return (
            <div className="w-full bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">No Candidates Assigned</h2>
                    <p className="text-gray-600 mb-6">You don't have any candidates assigned yet.</p>
                    <button
                        onClick={handleLogout}
                        className="bg-[#0868CC] text-white px-6 py-3 rounded-lg hover:bg-[#075bb4]"
                    >
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gray-50 font-poppins">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 md:px-12 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <img src={logo} className="h-12 w-auto" alt="Logo" />
                            <div>
                                <h1 className="text-xl font-bold text-[#0868CC]">Categorizer Dashboard</h1>
                                <p className="text-sm text-gray-600">Welcome, {categorizerName} ({categorizerId})</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                                <span className="text-sm text-gray-600">Progress: </span>
                                <span className="font-bold text-[#0868CC]">{categorizedCount} / {candidates.length}</span>
                            </div>
                            <button
                                onClick={handleExport}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                            >
                                Export Report
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full px-4 md:px-12 py-8">
                <div className="max-w-5xl mx-auto">
                    {/* Progress Indicator */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">
                                Candidate {currentIndex + 1} of {candidates.length}
                            </span>
                            <span className="text-sm text-gray-500">
                                {currentCandidate.category ? '✅ Categorized' : '⏳ Pending'}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-[#0868CC] h-2 rounded-full transition-all"
                                style={{ width: `${((currentIndex + 1) / candidates.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Candidate Info Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="text-lg font-semibold text-gray-800">{currentCandidate.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Registration ID</p>
                                <p className="text-lg font-semibold text-gray-800">{currentCandidate.registrationId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">UDID</p>
                                <p className="text-lg font-semibold text-gray-800">{currentCandidate.udid}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">District</p>
                                <p className="text-lg font-semibold text-gray-800">{currentCandidate.district}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Gender</p>
                                <p className="text-lg font-semibold text-gray-800">{currentCandidate.gender}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Age</p>
                                <p className="text-lg font-semibold text-gray-800">{currentCandidate.age}</p>
                            </div>
                        </div>

                        {/* Description - Full Width */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500 mb-2">Performance Description</p>
                            <p className="text-base text-gray-800 leading-relaxed">{currentCandidate.description}</p>
                        </div>
                    </div>

                    {/* Video Preview */}
                    <div className="bg-gray-900 rounded-xl overflow-hidden mb-6">
                        {currentCandidate.videoUrl ? (
                            <video
                                key={currentCandidate.registrationId}
                                src={currentCandidate.videoUrl.startsWith('http')
                                    ? currentCandidate.videoUrl
                                    : `https://scd-event-registrations-videos.s3.ap-south-1.amazonaws.com/${encodeURIComponent(currentCandidate.videoUrl)}`}
                                controls
                                className="w-full h-[400px] object-contain"
                                onError={(e) => {
                                    console.error('Video load error:', e);
                                    console.log('Video URL:', currentCandidate.videoUrl);
                                }}
                            >
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <div className="w-full h-[400px] flex items-center justify-center text-white">
                                <p>No video available</p>
                            </div>
                        )}
                    </div>

                    {/* Category Selection */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Category</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${selectedCategory === category
                                        ? 'bg-[#0868CC] text-white border-[#0868CC]'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#0868CC]'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center gap-4">
                        <button
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                            className={`px-6 py-3 rounded-lg font-semibold ${currentIndex === 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gray-600 text-white hover:bg-gray-700'
                                }`}
                        >
                            ← Previous
                        </button>

                        <button
                            onClick={handleUpdateCategory}
                            disabled={!selectedCategory || updating}
                            className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white ${!selectedCategory || updating
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700'
                                }`}
                        >
                            {updating ? 'Updating...' : 'Update Category & Next →'}
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={currentIndex === candidates.length - 1}
                            className={`px-6 py-3 rounded-lg font-semibold ${currentIndex === candidates.length - 1
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-[#0868CC] text-white hover:bg-[#075bb4]'
                                }`}
                        >
                            Skip →
                        </button>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {
                toast.open && (
                    <div className="fixed bottom-4 right-4 z-50">
                        <div
                            className={`max-w-sm rounded-lg shadow-lg px-4 py-3 flex items-start gap-3 ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                                }`}
                        >
                            <div className="mt-0.5">{toast.type === 'success' ? '✅' : '⚠️'}</div>
                            <div className="flex-1 text-sm">{toast.message}</div>
                            <button
                                onClick={() => setToast({ ...toast, open: false })}
                                className="ml-2 text-white/80 hover:text-white text-lg leading-none"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

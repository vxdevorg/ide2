// AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import logo from "../../assets/images/logo.png";
import logo2 from "../../assets/images/logo2.png";
import SearchIcon from "../../assets/icons/SearchIcon";
import FilterIcon from "../../assets/icons/FilterIcon";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard({ language = "English" }) {
  const navigate = useNavigate();
  const text = {
    English: { headerTitle: "International Day of Persons with Disabilities – 2025" },
    Tamil: { headerTitle: "உலக மாற்றுத் திறனாளிகள் தினம் – 2025" }
  };

  // Removed unused inner AdminDashboard function and navigate variable
  const handleNavigateToWinnerSelection = () => {
    console.log("🔄 Navigating to winner selection panel...");
    // Set the auth flag and navigate
    localStorage.setItem("adminWinnerAuth", "true");
    console.log("🔐 Admin auth set in localStorage");
    navigate("/adminwinner");
    console.log("✅ Navigation triggered");

  };
  const t = text[language];

  const LIST_URL = "https://aszvudwtu6.execute-api.ap-south-1.amazonaws.com/prod";
  const ASSIGN_URL = "https://aszvudwtu6.execute-api.ap-south-1.amazonaws.com/prod/assign";

  // Categorizer Lambda URLs
  const ASSIGN_CATEGORIZER_URL = "https://ihazg24l2txm7tfcmoqvrbcwaa0onjlo.lambda-url.ap-south-1.on.aws/";

  const judges = ["Judge 1", "Judge 2", "Judge 3", "Judge 4", "Judge 5", "Judge 6", "Judge 7", "Judge 8", "Judge 9", "Judge a"];
  const categorizers = ["CAT001", "CAT002", "CAT003", "CAT004", "CAT005", "CAT006", "CAT007", "CAT008", "CAT009", "CAT010", "CAT011"];

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignLoading, setAssignLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAssignPopup, setShowAssignPopup] = useState(false);
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [selectedJudge, setSelectedJudge] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 25;

  // Categorizer assignment states
  const [showCategorizerPopup, setShowCategorizerPopup] = useState(false);
  const [selectedCategorizer, setSelectedCategorizer] = useState("");
  const [categorizerAssignLoading, setCategorizerAssignLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Fetch all data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(LIST_URL);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      console.log("Raw API data received:", data);

      const transformedData = Array.isArray(data)
        ? data.map((item, index) => ({
          sno: (index + 1).toString().padStart(2, "0"),
          registrationId: item.registrationId || item.pk || item.sk,
          udid: item.udid || item.uidCardNumber || "N/A",
          name: item.name || item.fullName || "N/A",
          mobile: item.mobile || item.phone || item.mobileNumber || "N/A",
          gender: item.gender || "N/A",
          age: item.age || "N/A",
          district: item.district || "N/A",
          assignedto: item.assignedto || "Not Assigned",
          category: item.category || "",
          assignedCategorizer: item.assignedCategorizer || "",
          is_shortlisted: !!item.is_shortlisted,
          is_winner: !!item.is_winner,
          pk: item.pk || null,
          sk: item.sk || null,
          videoUrl: item.videoUrl || item.video || ""
        }))
        : [];

      console.log("Shortlisted candidates in data:", transformedData.filter(item => item.is_shortlisted));
      console.log("Assigned candidates in data:", transformedData.filter(item => item.assignedto !== "Not Assigned"));

      setTableData(transformedData);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again later.");
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced debugging effect
  useEffect(() => {
    if (tableData.length > 0) {
      console.log("🔍 ADMIN DEBUG - First 5 rows with shortlist status:");
      tableData.slice(0, 5).forEach(row => {
        console.log(`ID: ${row.registrationId}, Shortlisted: ${row.is_shortlisted}, Type: ${typeof row.is_shortlisted}`);
      });

      const shortlistedOnes = tableData.filter(row => row.is_shortlisted);
      console.log("📊 ADMIN DEBUG - All shortlisted candidates:", shortlistedOnes);
      console.log(`📈 ADMIN DEBUG - Total: ${tableData.length}, Shortlisted: ${shortlistedOnes.length}`);
    }
  }, [tableData]);

  // Save assignments to judge
  const saveAssignments = async (selectedJudgeParam, selectedRowsParam, uidCardNumbers = []) => {
    try {
      const videoUrls = selectedRowsParam.map(id => {
        const row = tableData.find(r => r.registrationId === id);
        return row ? row.videoUrl : "";
      });
      const payload = {
        action: "assignReviewer",
        judge: selectedJudgeParam,
        registrationIds: selectedRowsParam,
        uidCardNumbers: uidCardNumbers,
         videoUrls: videoUrls
      };

      console.log("Saving assignments payload:", payload);

      const response = await fetch(ASSIGN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save assignments (${response.status}) ${errorText}`);
      }

      const result = await response.json();
      console.log("Assignment response:", result);

      return result;
    } catch (error) {
      console.error("Error saving assignments:", error);
      throw error;
    }
  };

  // Remove assignments from judge
  const removeAssignments = async (selectedRowsParam, uidCardNumbers = []) => {
    try {
      const videoUrls = selectedRowsParam.map(id => {
        const row = tableData.find(r => r.registrationId === id);
        return row ? row.videoUrl : "";
      });
      const payload = {
        action: "assignReviewer",
        judge: "Not Assigned",
        registrationIds: selectedRowsParam,
        uidCardNumbers: uidCardNumbers,
        videoUrls: videoUrls
      };

      console.log("Removing assignments payload:", payload);

      const response = await fetch(ASSIGN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to remove assignments (${response.status}) ${errorText}`);
      }

      const result = await response.json();
      console.log("Remove assignment response:", result);

      return result;
    } catch (error) {
      console.error("Error removing assignments:", error);
      throw error;
    }
  };

  const filteredRows = tableData.filter(row => {
    const isAssigned = row.assignedto !== "Not Assigned";
    const isShortlisted = !!row.is_shortlisted;

    // Filter logic
    if (filterType === "Assigned" && !isAssigned) return false;
    if (filterType === "Not Assigned" && isAssigned) return false;
    if (filterType === "Shortlisted" && !isShortlisted) return false;
    if (filterType === "Not Shortlisted" && isShortlisted) return false;

    // Category filter
    if (categoryFilter !== "All") {
      if (categoryFilter === "Not Set" && row.category) return false;
      if (categoryFilter !== "Not Set" && row.category !== categoryFilter) return false;
    }

    const search = (searchQuery || "").toLowerCase();
    return (row.name || "").toLowerCase().includes(search) ||
      String(row.udid || "").includes(search) ||
      (row.district || "").toLowerCase().includes(search) ||
      (row.category || "").toLowerCase().includes(search) ||
      (row.assignedto || "").toLowerCase().includes(search);
  });

  const sortedRows = [...filteredRows].sort((a, b) => {
    const aAssigned = a.assignedto !== "Not Assigned" ? 1 : 0;
    const bAssigned = b.assignedto !== "Not Assigned" ? 1 : 0;
    return aAssigned - bAssigned;
  });

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / rowsPerPage));
  const currentRows = sortedRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const currentPageIds = currentRows.map(r => r.registrationId);
  const selectAllCurrentPage = currentPageIds.length > 0 && currentPageIds.every(id => selectedRows.includes(id));

  // Check if selected rows are assigned
  const getSelectedRowsAssignmentStatus = () => {
    if (selectedRows.length === 0) return { allAssigned: false, allUnassigned: false, mixed: false };

    const assignedCount = selectedRows.filter(id => {
      const row = tableData.find(r => r.registrationId === id);
      return row && row.assignedto !== "Not Assigned";
    }).length;

    return {
      allAssigned: assignedCount === selectedRows.length,
      allUnassigned: assignedCount === 0,
      mixed: assignedCount > 0 && assignedCount < selectedRows.length
    };
  };

  const assignmentStatus = getSelectedRowsAssignmentStatus();

  const handleSelectAll = () => {
    const allSelected = currentPageIds.every(id => selectedRows.includes(id));
    if (allSelected) setSelectedRows(prev => prev.filter(id => !currentPageIds.includes(id)));
    else setSelectedRows(prev => [...new Set([...prev, ...currentPageIds])]);
  };

  const exportToExcel = async () => {
    setExportLoading(true);
    try {
      const excelData = sortedRows.map(row => ({
        SNO: row.sno,
        REGISTRATION_ID: row.registrationId,
        UDID: row.udid,
        Name: row.name,
        Mobile: row.mobile,
        Gender: row.gender,
        Age: row.age,
        District: row.district,
        Category: row.category || "Not Set",
        Assigned_Categorizer: row.assignedCategorizer || "Not Assigned",
        Reviewer: row.assignedto,
        Shortlisted: row.is_shortlisted ? "Yes" : "No",
        Winner: row.is_winner ? "Yes" : "No"
      }));
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Candidates");
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const file = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(file, "IDD_Candidates.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Failed to export data. Please try again.");
    } finally {
      setExportLoading(false);
    }
  };

  const handleAssignJudge = async () => {
    if (!selectedJudge) return;
    setAssignLoading(true);
    try {
      const uidCardNumbers = selectedRows.map(id => {
        const row = tableData.find(r => r.registrationId === id);
        return row ? row.udid : null;
      }).filter(Boolean);

      const result = await saveAssignments(selectedJudge, selectedRows, uidCardNumbers);
      console.log("assignment result:", result);

      const successful = Array.isArray(result.updated) ? result.updated : [];
      const failed = Array.isArray(result.failed) ? result.failed : [];

      if (failed.length) {
        alert(`Some assignments failed: ${failed.map(f => f.registrationId || f).join(", ")}`);
      }

      // Update local state
      const updatedTableData = tableData.map(row =>
        successful.includes(row.registrationId)
          ? { ...row, assignedto: selectedJudge }
          : row
      );
      setTableData(updatedTableData);

      setSelectedRows([]);
      setShowAssignPopup(false);
      setSelectedJudge("");
      setFilterType("Not Assigned");
      setCurrentPage(1);

      // Refresh data to get latest state
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to save assignments. Check console for details.");
    } finally {
      setAssignLoading(false);
    }
  };

  const handleRemoveAssignment = async () => {
    setRemoveLoading(true);
    try {
      const uidCardNumbers = selectedRows.map(id => {
        const row = tableData.find(r => r.registrationId === id);
        return row ? row.udid : null;
      }).filter(Boolean);

      const result = await removeAssignments(selectedRows, uidCardNumbers);
      console.log("remove assignment result:", result);

      const successful = Array.isArray(result.updated) ? result.updated : [];
      const failed = Array.isArray(result.failed) ? result.failed : [];

      if (failed.length) {
        alert(`Some removals failed: ${failed.map(f => f.registrationId || f).join(", ")}`);
      }

      // Update local state
      const updatedTableData = tableData.map(row =>
        successful.includes(row.registrationId)
          ? { ...row, assignedto: "Not Assigned" }
          : row
      );
      setTableData(updatedTableData);

      setSelectedRows([]);
      setShowRemovePopup(false);
      setFilterType("Not Assigned");
      setCurrentPage(1);

      // Refresh data to get latest state
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to remove assignments. Check console for details.");
    } finally {
      setRemoveLoading(false);
    }
  };

  // Assign candidates to categorizer
  const handleAssignCategorizer = async () => {
    if (!selectedCategorizer) return;

    // Check if any selected candidates already have a categorizer assigned
    const alreadyAssigned = selectedRows.filter(id => {
      const row = tableData.find(r => r.registrationId === id);
      return row && row.assignedCategorizer && row.assignedCategorizer !== "";
    });

    if (alreadyAssigned.length > 0) {
      const assignedDetails = alreadyAssigned.map(id => {
        const row = tableData.find(r => r.registrationId === id);
        return `${row.name} (${row.assignedCategorizer})`;
      }).join('\n');

      const confirmMessage = `⚠️ Warning: ${alreadyAssigned.length} candidate(s) are already assigned to a categorizer:\n\n${assignedDetails}\n\nDo you want to reassign them to ${selectedCategorizer}?`;

      if (!window.confirm(confirmMessage)) {
        return;
      }
    }

    setCategorizerAssignLoading(true);

    try {
      console.log(`📤 Assigning ${selectedRows.length} candidates to ${selectedCategorizer}`);

      // Map selected IDs to full candidate objects with pk/sk
      const candidatesToAssign = selectedRows.map(id => {
        const row = tableData.find(r => r.registrationId === id);
        return {
          registrationId: row.registrationId,
          pk: row.pk,
          sk: row.sk
        };
      });

      console.log("📦 Payload to be sent:", candidatesToAssign);

      const response = await fetch(ASSIGN_CATEGORIZER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidates: candidatesToAssign, // Send full objects instead of just IDs
          categorizerId: selectedCategorizer,
          categorizerName: `categorizer${selectedCategorizer.slice(-1)}`
        })
      });

      const result = await response.json();
      console.log('✅ Categorizer assignment result:', result);

      if (result.success) {
        alert(`Successfully assigned ${result.updated.length} candidates to ${selectedCategorizer}`);

        if (result.failed && result.failed.length > 0) {
          console.warn('Some assignments failed:', result.failed);
        }

        setSelectedRows([]);
        setShowCategorizerPopup(false);
        setSelectedCategorizer("");

        // Refresh data to get latest state
        fetchData();
      } else {
        throw new Error(result.message || 'Assignment failed');
      }
    } catch (error) {
      console.error('❌ Error assigning to categorizer:', error);
      alert(`Failed to assign candidates: ${error.message}`);
    } finally {
      setCategorizerAssignLoading(false);
    }
  };

  const handleRowSelect = (registrationId) => {
    const id = registrationId || "";
    const row = tableData.find(r => r.registrationId === id);
    const isAssigned = row?.assignedto !== "Not Assigned";
    if (isAssigned && filterType === "Not Assigned") return;
    setSelectedRows(prev => prev.includes(id) ? prev.filter(prevId => prevId !== id) : [...prev, id]);
  };

  const handleFilterChange = (option) => {
    setFilterType(option);
    setFilterOpen(false);
    setCurrentPage(1);
    setSelectedRows([]);
  };

  // eslint-disable-next-line no-unused-vars
  const forceRefresh = async () => {
    setLoading(true);
    await fetchData();
    setTimeout(() => setLoading(false), 1000);
  };

  if (loading) {
    return (
      <div className="w-full bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0868CC] mx-auto" />
          <p className="mt-4 text-lg text-gray-600">Loading candidates data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      {/* HEADER */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-10 px-15 py-6">
        <img src={logo} className="w-[150px] h-[130px]" alt="Logo 1" />
        <h1 className="text-center font-poppins font-semibold text-[50px] leading-[100%] tracking-[0.05em] text-[#0868CC]">{t.headerTitle}</h1>
        <img src={logo2} className="w-[150px] h-[130px]" alt="Logo 2" />
      </div>

      {/* ENHANCED DEBUG INFO */}
      <div className="w-full px-4 md:px-12 mt-6 mb-6">

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 shadow-sm">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* LEFT - Data Status Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-blue-700 mb-3">
                📊 Data Summary
              </h3>

              <p className="text-sm text-gray-700 leading-relaxed">
                <strong className="font-semibold">Data Status: </strong>
                Total: {tableData.length} |
                Shortlisted: {tableData.filter(item => item.is_shortlisted).length} |
                Assigned: {tableData.filter(item => item.assignedto !== "Not Assigned").length} |
                Filtered: {filteredRows.length}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                Current Filter: <span className="font-medium">{filterType}</span>
                <br />
                Showing: {((currentPage - 1) * rowsPerPage) + 1}–
                {Math.min(currentPage * rowsPerPage, sortedRows.length)} of {sortedRows.length}
              </p>
            </div>

            {/* RIGHT - Winner Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-purple-700 mb-2">
                  🏆 Winner Selection
                </h3>
                <p className="text-gray-600 text-md mb-4 leading-relaxed">
                  Access the winner selection panel to announce the competition winners.
                </p>
              </div>

              <button
                onClick={handleNavigateToWinnerSelection}
                className="bg-purple-600 w-fit text-white px-6 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-all shadow-sm"
              >
                Go to Winner Selection Panel
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* SEARCH + FILTER */}
      <div className="w-full px-4 sm:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-10">
          <div className="flex items-center gap-3 px-4 w-full md:w-[413px] h-[50px] bg-[#F8F6F6] border border-[#C6C6C6] rounded-[16px]">
            <SearchIcon />
            <input type="text" placeholder="Search Candidate..." className="flex-1 bg-transparent outline-none text-[16px]" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex items-center gap-2">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setFilterOpen(!filterOpen)}>
                <span className="font-semibold text-[16px] text-[#0868CC]">{filterType}</span>
                <FilterIcon />
              </div>

              {filterOpen && (
                <div className="absolute top-full right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-20">
                  {["All", "Assigned", "Not Assigned"].map(option => (
                    <div key={option} className="px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => handleFilterChange(option)}>{option}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Dynamic buttons based on selection */}
            {assignmentStatus.allAssigned && (
              <button
                onClick={() => setShowRemovePopup(true)}
                disabled={selectedRows.length === 0}
                className={`w-[200px] h-[50px] rounded-2xl text-[14px] border font-semibold ${selectedRows.length === 0
                  ? "bg-[#F8F6F6] text-[#8F8F8F] border-[#C6C6C6] cursor-not-allowed"
                  : "bg-red-600 text-white border-red-600 hover:bg-red-700"
                  }`}
              >
                Remove Assignment ({selectedRows.length})
              </button>
            )}

            {assignmentStatus.allUnassigned && (
              <button
                onClick={() => setShowAssignPopup(true)}
                disabled={selectedRows.length === 0}
                className={`w-[180px] h-[50px] rounded-2xl text-[16px] border border-[#C6C6C6] font-semibold ${selectedRows.length === 0
                  ? "bg-[#F8F6F6] text-[#8F8F8F] cursor-not-allowed"
                  : "bg-[#0868CC] text-white hover:bg-[#075bb4]"
                  }`}
              >
                Assign ({selectedRows.length})
              </button>
            )}

            {assignmentStatus.mixed && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAssignPopup(true)}
                  className="w-[120px] h-[50px] rounded-2xl text-[16px] border border-[#0868CC] font-semibold bg-[#0868CC] text-white hover:bg-[#075bb4]"
                >
                  Assign
                </button>
                <button
                  onClick={() => setShowRemovePopup(true)}
                  className="w-[120px] h-[50px] rounded-2xl text-[16px] border border-red-600 font-semibold bg-red-600 text-white hover:bg-red-700"
                >
                  Remove
                </button>
                <span className="text-xs text-gray-500 self-center">({selectedRows.length} selected)</span>
              </div>
            )}

            {!assignmentStatus.allAssigned && !assignmentStatus.allUnassigned && !assignmentStatus.mixed && (
              <button disabled className="w-[180px] h-[50px] rounded-2xl text-[16px] border border-[#C6C6C6] font-semibold bg-[#F8F6F6] text-[#8F8F8F] cursor-not-allowed">
                Assign (0)
              </button>
            )}

            {/* Category Filter Dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-[50px] px-4 border border-[#C6C6C6] rounded-2xl text-[14px] font-semibold bg-white text-gray-700 hover:border-[#0868CC] focus:outline-none focus:ring-2 focus:ring-[#0868CC]"
            >
              <option value="All">All Categories</option>
              <option value="Not Set">Not Categorized</option>
              <option value="Singing">Singing</option>
              <option value="Dance">Dance</option>
              <option value="Mime">Mime</option>
              <option value="Instrumental Performance">Instrumental</option>
              <option value="Painting">Painting</option>
              <option value="Drawing">Drawing</option>
              <option value="Craft">Craft</option>
              <option value="Mimicry">Mimicry</option>
              <option value="Creative Kavidhai">Creative Kavidhai</option>
              <option value="Yoga">Yoga</option>
              <option value="Silambam">Silambam</option>
              <option value="Speech">Speech</option>
              <option value="Sports">Sports</option>
              <option value="Others">Others</option>
            </select>

            {/* Assign to Categorizer Button */}
            <button
              onClick={() => setShowCategorizerPopup(true)}
              disabled={selectedRows.length === 0}
              className={`w-[200px] h-[50px] rounded-2xl text-[14px] border font-semibold ${selectedRows.length === 0
                ? "bg-[#F8F6F6] text-[#8F8F8F] border-[#C6C6C6] cursor-not-allowed"
                : "bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
                }`}
            >
              Assign to Categorizer ({selectedRows.length})
            </button>

            <button
              onClick={exportToExcel}
              disabled={exportLoading}
              className={`w-[180px] h-[50px] rounded-2xl text-white font-semibold text-[16px] flex items-center justify-center gap-2 ${exportLoading ? 'bg-[#075bb4] cursor-not-allowed' : 'bg-[#0868CC] hover:bg-[#075bb4]'}`}
            >
              {exportLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Exporting...
                </>
              ) : (
                'Export to Excel'
              )}
            </button>

            <button onClick={fetchData} className="w-[120px] h-[50px] bg-green-600 rounded-2xl text-white font-semibold text-[16px] hover:bg-green-700">
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="w-full px-4 sm:px-12">
        <div className="overflow-x-auto rounded-[10px] border border-gray-200">
          <div className="bg-[#0868CC80] min-w-[1000px]">
            <div className="grid grid-cols-13 gap-2 py-4 px-4 text-white font-semibold">
              <div className="w-[30px] text-center">
                <input type="checkbox" checked={selectAllCurrentPage} onChange={handleSelectAll} className="w-4 h-4 cursor-pointer" />
              </div>
              <div className="w-[20px] text-center">S.no</div>
              <div className="col-span-2 text-center">UDID</div>
              <div className="col-span-2 text-center">Name</div>
              <div className="col-span-2 text-center">Mobile no</div>
              <div className="col-span-1 text-center">Gender</div>
              <div className="col-span-1 text-center">Age</div>
              <div className="col-span-1.5 text-center">District</div>
              <div className="col-span-1 text-center">Category</div>
              <div className="col-span-1 text-center">Reviewer</div>
            </div>
          </div>

          <div className="min-w-[1000px]">
            {currentRows.map((row, index) => {
              const isLast = index === currentRows.length - 1;
              const isSelected = selectedRows.includes(row.registrationId);
              const isAssigned = row.assignedto !== "Not Assigned";
              const isShortlisted = row.is_shortlisted;

              return (
                <div key={row.registrationId} className={`grid grid-cols-13 gap-2 py-4 px-4 items-center text-center ${isSelected ? "bg-blue-50" : "bg-[#F8F6F6]"} ${isLast ? "" : "border-b border-gray-300"}`}>
                  <div className="w-[30px] flex justify-center items-center">
                    <input type="checkbox" checked={isSelected} onChange={() => handleRowSelect(row.registrationId)} disabled={isAssigned && filterType === "Not Assigned"} className={`w-4 h-4 cursor-pointer ${isAssigned && filterType === "Not Assigned" ? "opacity-50" : ""}`} />
                  </div>
                  <div className="w-5 flex justify-center items-center text-md">{row.sno}</div>
                  <div className="col-span-2 flex justify-center items-center text-md">
                    <div className="flex flex-col items-center">
                      <span>{row.udid}</span>
                    </div>
                  </div>
                  <div className="col-span-2 flex justify-center items-center">
                    {(row.name || "").replace(/\.trim\(\)/gi, "").trim()}
                  </div>
                  <div className="col-span-2 flex justify-center items-center">{row.mobile}</div>
                  <div className="col-span-1 flex justify-center items-center">{row.gender}</div>
                  <div className="col-span-1 flex justify-center items-center">{row.age}</div>
                  <div className="col-span-1.5 flex justify-center items-center text-md">{row.district}</div>

                  {/* Category Column */}
                  <div className="col-span-1 flex justify-center items-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${row.category
                      ? "bg-purple-100 text-purple-800 border border-purple-300"
                      : "bg-gray-100 text-gray-600 border border-gray-300"
                      }`}>
                      {row.category || "Not Set"}
                    </span>
                  </div>

                  <div className="col-span-1 flex justify-center items-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${isAssigned ? "bg-green-100 text-green-800 border border-green-300" : "bg-gray-100 text-gray-600 border border-gray-300"}`}>
                      {row.assignedto}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PAGINATION */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 mb-10 gap-4">
          <div className="text-sm text-gray-600">Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, sortedRows.length)} of {sortedRows.length} entries{filterType !== "All" && ` (Filtered: ${filterType})`}</div>

          <div className="flex gap-2 flex-wrap justify-center">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`px-4 py-2 rounded-lg border ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-[#0868CC] border-[#0868CC] hover:bg-[#0868CC] hover:text-white"}`}>Previous</button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`px-4 py-2 rounded-lg border ${currentPage === page ? "bg-[#0868CC] text-white border-[#0868CC]" : "bg-white text-[#0868CC] border-[#0868CC] hover:bg-[#0868CC] hover:text-white"}`}>{page}</button>
            ))}

            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`px-4 py-2 rounded-lg border ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-[#0868CC] border-[#0868CC] hover:bg-[#0868CC] hover:text-white"}`}>Next</button>
          </div>
        </div>
      </div>

      {/* ASSIGN REVIEWER POPUP */}
      {showAssignPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[20px] p-8 w-[90%] max-w-[500px]">
            <h3 className="text-[20px] font-semibold text-[#0868CC] mb-6 text-center">Assign Reviewer</h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Judge</label>
              <select value={selectedJudge} onChange={(e) => setSelectedJudge(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0868CC] focus:border-transparent">
                <option value="">Select a judge</option>
                {judges.map(j => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>

            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">Assigning <strong>{selectedRows.length}</strong> candidate(s) to <strong>{selectedJudge || "selected judge"}</strong></p>
              <p className="text-xs text-blue-600 mt-1">This will update the <strong>assignedto</strong> column in the database.</p>
            </div>

            <div className="flex justify-center gap-6">
              <button
                onClick={() => { setShowAssignPopup(false); setSelectedJudge(""); }}
                disabled={assignLoading}
                className="w-[150px] h-[50px] border border-[#0868CC] rounded-[10px] text-[16px] font-semibold text-[#0868CC] hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignJudge}
                disabled={!selectedJudge || assignLoading}
                className={`w-[150px] h-[50px] rounded-[10px] text-[16px] font-semibold flex items-center justify-center gap-2 ${!selectedJudge || assignLoading ? "bg-gray-400 cursor-not-allowed text-white" : "bg-[#0868CC] text-white hover:bg-[#075bb4]"}`}
              >
                {assignLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Assigning...
                  </>
                ) : (
                  'Assign'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REMOVE ASSIGNMENT POPUP */}
      {showRemovePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[20px] p-8 w-[90%] max-w-[500px]">
            <h3 className="text-[20px] font-semibold text-red-600 mb-6 text-center">Remove Assignment</h3>

            <div className="mb-6">
              <p className="text-center text-gray-700">
                Are you sure you want to remove assignment from <strong>{selectedRows.length}</strong> candidate(s)?
              </p>
            </div>

            <div className="flex justify-center gap-6">
              <button
                onClick={() => setShowRemovePopup(false)}
                disabled={removeLoading}
                className="w-[150px] h-[50px] border border-gray-400 rounded-[10px] text-[16px] font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveAssignment}
                disabled={removeLoading}
                className="w-[150px] h-[50px] rounded-[10px] text-[16px] font-semibold bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {removeLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Removing...
                  </>
                ) : (
                  'Remove'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-800 font-bold">×</button>
          </div>
        </div>
      )}

      {/* ASSIGN CATEGORIZER POPUP */}
      {showCategorizerPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[20px] p-8 w-[90%] max-w-[500px]">
            <h3 className="text-[20px] font-semibold text-purple-600 mb-6 text-center">
              Assign to Categorizer
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Categorizer
              </label>
              <select
                value={selectedCategorizer}
                onChange={(e) => setSelectedCategorizer(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select a categorizer</option>
                {categorizers.map(c => (
                  <option key={c} value={c}>{c} - categorizer{parseInt(c.replace("CAT", ""), 10)}</option>
                ))}
              </select>
            </div>

            <div className="mb-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-800">
                Assigning <strong>{selectedRows.length}</strong> candidate(s) to categorizer
              </p>
            </div>

            <div className="flex justify-center gap-6">
              <button
                onClick={() => {
                  setShowCategorizerPopup(false);
                  setSelectedCategorizer("");
                }}
                disabled={categorizerAssignLoading}
                className="w-[150px] h-[50px] border border-purple-600 rounded-[10px] text-purple-600 hover:bg-purple-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignCategorizer}
                disabled={!selectedCategorizer || categorizerAssignLoading}
                className={`w-[150px] h-[50px] rounded-[10px] text-white ${!selectedCategorizer || categorizerAssignLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
                  }`}
              >
                {categorizerAssignLoading ? 'Assigning...' : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
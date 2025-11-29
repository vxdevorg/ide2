import { Routes, Route } from "react-router-dom";
import JudgeLogin from "../pages/judge/JudgeLogin";
import JudgeDashboard from "../pages/judge/JudgeDashboard";

export default function JudgeRoutes() {
    return (
        <Routes>
            <Route path="/judge" element={<JudgeLogin />} />

            <Route path="/judge/dashboard" element={<JudgeDashboard />} />
        </Routes>
    );
}

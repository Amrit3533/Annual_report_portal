import "./App.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Reports from "./pages/Report";
import CreateReport from "./pages/CreateReport";
import ReportDetails from "./pages/ReportDetails";
import Register from "./pages/Register";
import Approvals from "./pages/Approvals";
import Layout from "./components/Layout";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="reports" element={<Reports />} />
          <Route path="reports/create" element={<CreateReport />} />
          <Route path="reports/:id" element={<ReportDetails />} />
          <Route path="approvals" element={<Approvals />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
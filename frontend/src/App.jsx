import "./App.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Reports from "./pages/Reports";
import CreateReport from "./pages/CreateReport";
import ReportDetails from "./pages/ReportDetails";
import Register from "./pages/Register";
import Approvals from "./pages/Approvals";
import Layout from "./components/Layout";

import Users from "./pages/Users";
import Departments from "./pages/Departments";
import AcademicData from "./pages/AcademicData";
import Research from "./pages/Research";
import FinancialForm from "./pages/FinancialForm";
import StudentAchievement from "./pages/StudentAchievement";
import FacultyAchievement from "./pages/FacultyAchievement";
import ExtracurricularActivities from "./pages/ExtracurricularActivities";
import AcademicForm from "./pages/AcademicForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Infrastructure from "./pages/Infrastructure";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
       
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="departments" element={<Departments />} />
          <Route path="academic-data" element={<AcademicData />} />
          <Route path="research" element={<Research />} />
          <Route path="financial-form" element={<FinancialForm />} />
          <Route path="student-achievement" element={<StudentAchievement />} />
          <Route path="faculty-achievement" element={<FacultyAchievement />} />
          <Route path="extracurricular-activities" element={<ExtracurricularActivities />} />
          <Route path="reports" element={<Reports />} />
          <Route path="reports/create" element={<CreateReport />} />
          <Route path="reports/:id" element={<ReportDetails />} />
          <Route path="approvals" element={<Approvals />} /> 
          <Route path="academicForm" element={<AcademicForm/>}></Route>
          <Route path="infrastructure" element={<Infrastructure/>}></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

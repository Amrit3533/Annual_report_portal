import { useEffect, useState } from "react";
import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const API = import.meta.env.VITE_API_URL;

function Dashboard() {
  const [stats, setStats] = useState({});
  const [deptData, setDeptData] = useState([]);
  const [researchData, setResearchData] = useState([]);
  const [achievementData, setAchievementData] = useState([]);

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      const statsRes = await axios.get(`${API}/api/dashboard/stats`, config);
      setStats(statsRes.data);

      const deptRes = await axios.get(
        `${API}/api/dashboard/department-stats`,
        config,
      );
      setDeptData(deptRes.data);

      const researchRes = await axios.get(
        `${API}/api/dashboard/research-trend`,
        config,
      );
      setResearchData(researchRes.data);

      const achievementRes = await axios.get(
        `${API}/api/dashboard/achievement-distribution`,
        config,
      );
      setAchievementData(achievementRes.data);
    };

    fetchDashboard();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h2>University Analytics Dashboard</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <div>
          <h4>Total Students</h4>
          <h2>{stats.total_students}</h2>
        </div>

        <div>
          <h4>Research Publications</h4>
          <h2>{stats.research_count}</h2>
        </div>

        <div>
          <h4>Student Achievements</h4>
          <h2>{stats.student_achievements}</h2>
        </div>

        <div>
          <h4>Faculty Awards</h4>
          <h2>{stats.faculty_awards}</h2>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={deptData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="department" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="students" />
        </BarChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={researchData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="publications" />
        </LineChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={achievementData}
            dataKey="count"
            nameKey="level"
            outerRadius={120}
            label
          >
            {achievementData.map((entry, index) => (
              <Cell key={index} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Dashboard;

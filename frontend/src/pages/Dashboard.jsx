
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie
} from "recharts";

import { FaUsers as Users, FaBuilding as Building2, FaBookOpen as BookOpen, FaDollarSign as DollarSign, FaTrophy as Trophy } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";


function Dashboard() {
  // API integration with fallback static data for visualization
  const [stats, setStats] = useState({});
  const [deptData, setDeptData] = useState([]);
  const [researchData, setResearchData] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  // Fallback static data
  const fallbackStats = {
    total_users: 1200,
    total_departments: 18,
    research_count: 430,
    annual_budget: "₹12M",
    student_achievements: 250,
  };
  const fallbackResearch = [
    { year: "2020", research: 40 },
    { year: "2021", research: 60 },
    { year: "2022", research: 90 },
    { year: "2023", research: 120 },
    { year: "2024", research: 160 }
  ];
  const fallbackDept = [
    { name: "Computer Science", value: 50 },
    { name: "Civil", value: 20 },
    { name: "Mechanical", value: 10 },
    { name: "Electrical", value: 10 }
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const statsRes = await axios.get(`${API}/api/dashboard/stats`, config);
        // If all stats are 0 or missing, use fallback
        const statsData = statsRes.data;
        const isStatsEmpty = !statsData || Object.values(statsData).every(v => v === 0 || v === null || v === undefined || v === "");
        setStats(isStatsEmpty ? fallbackStats : statsData);
      } catch {
        setStats(fallbackStats);
      }
      try {
        const deptRes = await axios.get(`${API}/api/dashboard/department-stats`, config);
        const mappedDept = deptRes.data.map(d => ({ name: d.department, value: d.students }));
        // If all values are 0 or array is empty, use fallback
        const isDeptEmpty = !Array.isArray(mappedDept) || mappedDept.length === 0 || mappedDept.every(d => !d.value || d.value === 0);
        setDeptData(isDeptEmpty ? fallbackDept : mappedDept);
      } catch {
        setDeptData(fallbackDept);
      }
      try {
        const researchRes = await axios.get(`${API}/api/dashboard/research-trend`, config);
        const mappedResearch = researchRes.data.map(d => ({ year: d.year, research: d.publications }));
        // If all values are 0 or array is empty, use fallback
        const isResearchEmpty = !Array.isArray(mappedResearch) || mappedResearch.length === 0 || mappedResearch.every(d => !d.research || d.research === 0);
        setResearchData(isResearchEmpty ? fallbackResearch : mappedResearch);
      } catch {
        setResearchData(fallbackResearch);
      }
      setLoading(false);
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  // Helper to check for valid stat value (not null, undefined, or empty string, or 0)
  const validStat = (val, fallback) => {
    if (val === null || val === undefined || val === "" || (typeof val === "number" && (isNaN(val) || val === 0))) return fallback;
    return val;
  };

  // If all stats are 0 or missing, use fallback
  const isStatsEmpty = !stats || Object.values(stats).every(v => v === 0 || v === null || v === undefined || v === "");
  const kpiData = [
    { title: "Total Users", value: validStat(isStatsEmpty ? undefined : stats.total_users, fallbackStats.total_users), icon: Users },
    { title: "Total Departments", value: validStat(isStatsEmpty ? undefined : stats.total_departments, fallbackStats.total_departments), icon: Building2 },
    { title: "Research Publications", value: validStat(isStatsEmpty ? undefined : stats.research_count, fallbackStats.research_count), icon: BookOpen },
    { title: "Annual Budget", value: validStat(isStatsEmpty ? undefined : stats.annual_budget, fallbackStats.annual_budget), icon: DollarSign },
    { title: "Student Achievements", value: validStat(isStatsEmpty ? undefined : stats.student_achievements, fallbackStats.student_achievements), icon: Trophy }
  ];

  const styles = {
    kpiContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 24,
      marginBottom: 24,
    },
    card: {
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 2px 12px 0 rgba(0,0,0,0.07)",
      padding: "1.5rem 2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: 100,
      fontWeight: 600,
    },
    charts: {
      display: "flex",
      flexDirection: "row",
      gap: 32,
      alignItems: "stretch",
      justifyContent: "center",
      width: "100%",
      margin: 0,
    },
    chartCard: {
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 2px 12px 0 rgba(0,0,0,0.07)",
      padding: "0.5rem 0.5rem 0 0.5rem",
      minHeight: 400,
      minWidth: 420,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
    },
  };

  return (
    <div style={{ padding: "2.5rem 3.5rem", maxWidth: 1280, margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.2rem", fontWeight: 700, marginBottom: "2rem", letterSpacing: "0.02em" }}>University Analytics Dashboard</h1>

      {/* KPI Cards */}
      <div style={styles.kpiContainer}>
        {kpiData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} style={styles.card}>
              <div>
                <p style={{ color: "gray", fontSize: "14px", margin: 0 }}>{item.title}</p>
                <h3 style={{ margin: 0, fontSize: 28 }}>{item.value}</h3>
              </div>
              <Icon size={32} color="#222" />
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div style={styles.charts}>
        {/* Bar Chart */}
        <div style={styles.chartCard}>
          <h3 style={{ textAlign: "left", fontSize: 28, fontWeight: 800, marginBottom: 12, letterSpacing: 0.5, width: "100%" }}>Research Growth by Year</h3>
          <div style={{ width: 380, height: 320, margin: "0 auto" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={Array.isArray(researchData) && researchData.length > 0 && researchData.some(d => d.research > 0) ? researchData : fallbackResearch}
                barSize={60}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                <XAxis dataKey="year" tick={{ fontSize: 20, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 20, fontWeight: 600 }} axisLine={false} tickLine={false} domain={[0, 160]} />
                <Tooltip />
                <Bar dataKey="research" fill="#5b5bf7" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Pie Chart */}
        <div style={styles.chartCard}>
          <h3 style={{ textAlign: "left", fontSize: 28, fontWeight: 800, marginBottom: 12, letterSpacing: 0.5, width: "100%" }}>Department Contribution</h3>
          <div style={{ width: 380, height: 320, margin: "0 auto" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Array.isArray(deptData) && deptData.length > 0 && deptData.some(d => d.value > 0) ? deptData : fallbackDept}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  fill="#00c49a"
                  label={({ cx, cy, midAngle, outerRadius, value }) => {
                    // Place label outside the pie for visibility
                    const RADIAN = Math.PI / 180;
                    const radius = outerRadius + 24;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#00c49a"
                        textAnchor={x > cx ? "start" : "end"}
                        dominantBaseline="central"
                        fontSize={22}
                        fontWeight={700}
                      >
                        {value}
                      </text>
                    );
                  }}
                  stroke="#fff"
                  strokeWidth={2}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;


import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";

import {
  FaUsers as Users,
  FaBuilding as Building2,
  FaBookOpen as BookOpen,
  FaChalkboardTeacher as Teacher,
  FaTrophy as Trophy,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  // API integration with fallback static data for visualization
  const [stats, setStats] = useState({});
  const [deptData, setDeptData] = useState([]);
  const [placementData, setPlacementData] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_API_URL;
  const [token, setToken] = useState(localStorage.getItem("token"));
  // If all stats are 0 or missing, use fallback
  const kpiData = [
    {
      title: "Total Users",
      value: stats.total_users || 0,
      icon: Users,
    },
    {
      title: "Total Departments",
      value: stats.total_departments || 0,
      icon: Building2,
    },
    {
      title: "Research Publications",
      value: stats.research_count || 0,
      icon: BookOpen,
    },
    {
      title: "Faculty Achievements",
      value: stats.faculty_achievements || 0,
      icon: Teacher,
    },
    {
      title: "Student Achievements",
      value: stats.student_achievements || 0,
      icon: Trophy,
    },
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

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const fetchData = async () => {
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};
    try {
      const [statsRes, deptRes, placementRes] = await Promise.all([
        axios.get(`${API}/api/dashboard/stats`, config),
        axios.get(`${API}/api/dashboard/getDepartmentStats`, config),
        axios.get(`${API}/api/dashboard/getPlacementTrend`, config),
      ]);

      setStats(statsRes.data);

      setDeptData(
        deptRes.data.map((d) => ({
          name: d.department,
          value: Number(d.students || 0),
        })),
      );

      setPlacementData(
        placementRes.data.map((d) => ({
          year: String(d.year),
          placement: Number(d.placed_students || 0),
        })),
      );
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  if (loading) {
    return <h2>Loading Dashboard...</h2>;
  }

  return (
    <div style={{ padding: "2.5rem 3.5rem", maxWidth: 1280, margin: "0 auto" }}>
      <h1
        style={{
          fontSize: "2.2rem",
          fontWeight: 700,
          marginBottom: "2rem",
          letterSpacing: "0.02em",
        }}
      >
        University Analytics Dashboard
      </h1>

      {/* KPI Cards */}
      <div style={styles.kpiContainer}>
        {kpiData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} style={styles.card}>
              <div>
                <p style={{ color: "gray", fontSize: "14px", margin: 0 }}>
                  {item.title}
                </p>
                <h3 style={{ margin: 0, fontSize: 28 }}>{item.value}</h3>
              </div>
              <Icon size={32} color="#222" />
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div style={styles.charts}>
        {placementData.length === 0 && <p>No placement data</p>}
        {deptData.length === 0 && <p>No department data</p>}
        {/* Bar Chart */}
        <div style={styles.chartCard}>
          <h3
            style={{
              textAlign: "left",
              fontSize: 28,
              fontWeight: 800,
              marginBottom: 12,
              letterSpacing: 0.5,
              width: "100%",
            }}
          >
            Placement per Year
          </h3>
          <div style={{ width: 380, height: 320, margin: "0 auto" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={placementData}
                barSize={60}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 20, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 20, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, "auto"]}
                />
                <Tooltip />
                <Bar
                  dataKey="placement"
                  fill="#5b5bf7"
                  radius={[12, 12, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Pie Chart */}
        <div style={styles.chartCard}>
          <h3
            style={{
              textAlign: "left",
              fontSize: 28,
              fontWeight: 800,
              marginBottom: 12,
              letterSpacing: 0.5,
              width: "100%",
            }}
          >
            Department Contribution
          </h3>
          <div style={{ width: 380, height: 320, margin: "0 auto" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptData}
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

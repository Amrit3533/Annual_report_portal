require("dotenv").config();
const express = require("express");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const app = express();
const departmentRoutes = require("./routes/departmentRoutes");
const userRoutes = require("./routes/userRoutes");
const academicRoutes = require("./routes/academicRoutes");
const dataRoutes = require("./routes/dataRoutes");
const reportRoutes = require("./routes/reportRoutes");

const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", dashboardRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/academic", academicRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/report-generator", require("./routes/reportRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

app.get("/", (req, res) => {
  res.send("Annual Report Portal Backend Running...");
});

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    const connection = await db.getConnection();
    console.log("Connected to MySQL Database");
    connection.release();
  } catch (error) {
    console.error("Database connection failed:", error);
  }
})();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

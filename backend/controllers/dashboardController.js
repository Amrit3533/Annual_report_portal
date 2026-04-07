const db = require("../config/db");

exports.getDashboardStats = async (req, res) => {
  try {
    const [users] = await db.query("SELECT COUNT(*) AS total FROM users");
    const [departments] = await db.query(
      "SELECT COUNT(*) AS total FROM departments",
    );
    const [research] = await db.query("SELECT COUNT(*) AS total FROM research");
    const [facultyAchievements] = await db.query(
      "SELECT COUNT(*) AS total FROM faculty_achievement",
    );
    const [studentAchievements] = await db.query(
      "SELECT COUNT(*) AS total FROM student_achievement",
    );

    res.json({
      total_users: users[0].total,
      total_departments: departments[0].total,
      research_count: research[0].total,
      faculty_achievements: facultyAchievements[0].total,
      student_achievements: studentAchievements[0].total,
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getDepartmentStats = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
  d.name AS department,
  COALESCE(COUNT(CASE WHEN u.role = 'student' THEN 1 END), 0) AS students
FROM departments d
LEFT JOIN users u ON u.department_id = d.id
GROUP BY d.id, d.name;
    `);

    res.json(rows);
  } catch (error) {
    console.error("Department Stats Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getPlacementTrend = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        academic_year AS year,
        COALESCE(
          SUM(
            CAST(total_students AS UNSIGNED) * 
            CAST(pass_percentage AS DECIMAL(5,2)) / 100
          ), 0
        ) AS placed_students
      FROM academic_data
      GROUP BY academic_year
      ORDER BY academic_year
    `);

    res.json(rows);
  } catch (error) {
    console.error("Placement Trend Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.researchTrend = async (req, res) => {
  try {
    const [data] = await db.query(`
      SELECT publication_year AS year,
             COUNT(*) AS publications
      FROM research
      GROUP BY publication_year
      ORDER BY publication_year
    `);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Research trend error" });
  }
};

exports.achievementDistribution = async (req, res) => {
  try {
    const [data] = await db.query(`
      SELECT level,
             COUNT(*) AS count
      FROM student_achievement
      GROUP BY level
      ORDER BY 
  FIELD(level, 'college', 'state', 'national', 'international')
    `);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Achievement distribution error" });
  }
};

const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {

    const [[students]] = await db.query(
      "SELECT SUM(total_students) AS total_students FROM academic_data"
    );

    const [[research]] = await db.query(
      "SELECT COUNT(*) AS research_count FROM research"
    );

    const [[achievements]] = await db.query(
      "SELECT COUNT(*) AS student_achievements FROM student_achievement"
    );

    const [[facultyAwards]] = await db.query(
      "SELECT COUNT(*) AS faculty_awards FROM faculty_achievement"
    );

    res.json({
      total_students: students.total_students || 0,
      research_count: research.research_count,
      student_achievements: achievements.student_achievements,
      faculty_awards: facultyAwards.faculty_awards
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Dashboard error" });
  }
};

exports.departmentStats = async (req, res) => {
  try {

    const [data] = await db.query(`
      SELECT d.name AS department,
             SUM(a.total_students) AS students
      FROM academic_data a
      JOIN reports r ON a.report_id = r.id
      JOIN departments d ON r.department_id = d.id
      GROUP BY d.name
    `);

    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Department stats error" });
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
    `);

    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Achievement distribution error" });
  }
};
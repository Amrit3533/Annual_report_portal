const db = require("../config/db");

// GET all records
const getAcademicData = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM academic_data");
    res.json(rows);
  } catch (error) {
    console.error("Fetch academic data error:", error);
    res.status(500).json({ error: error.message });
  }
};

// POST new record
const createAcademicData = async (req, res) => {
  try {
    const {
      report_id,
      total_students,
      pass_percentage,
      toppers_count,
      academic_year,
      description,
    } = req.body;

    const sql = `
      INSERT INTO academic_data
      (report_id, total_students, pass_percentage, toppers_count, academic_year, description)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      report_id,
      total_students,
      pass_percentage,
      toppers_count,
      academic_year,
      description,
    ]);

    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error("Insert academic data error:", error);
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
const updateAcademicData = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      report_id,
      total_students,
      pass_percentage,
      toppers_count,
      academic_year,
      description,
    } = req.body;

    const sql = `
      UPDATE academic_data
      SET report_id=?, total_students=?, pass_percentage=?, toppers_count=?, academic_year=?, description=?
      WHERE id=?
    `;

    const [result] = await db.query(sql, [
      report_id,
      total_students,
      pass_percentage,
      toppers_count,
      academic_year,
      description,
      id,
    ]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Record not found" });

    res.json({ id, ...req.body });
  } catch (error) {
    console.error("Update academic data error:", error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE
const deleteAcademicData = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM academic_data WHERE id=?",
      [id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Record not found" });

    res.json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error("Delete academic data error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAcademicData,
  createAcademicData,
  updateAcademicData,
  deleteAcademicData,
};
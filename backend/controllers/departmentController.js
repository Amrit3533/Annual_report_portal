const db = require("../config/db");

exports.createDepartment = async (req, res) => {
  try {
    const {
      name,
      description,
      hod_name,
      email,
      total_faculty,
      publications_count,
    } = req.body;

    // 🔴 Basic validation
    if (!name || !hod_name || !email) {
      return res.status(400).json({
        message: "Name, HOD, and Email are required",
      });
    }

    // 🔴 Prevent duplicate department
    const [existing] = await db.execute(
      "SELECT id FROM departments WHERE name = ?",
      [name],
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Department already exists",
      });
    }

    // ✅ Insert full data
    const [result] = await db.execute(
      `INSERT INTO departments 
      (name, description, hod_name, email, total_faculty, publications_count) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name,
        description || null,
        hod_name,
        email,
        total_faculty || 0,
        publications_count || 0,
      ],
    );

    res.status(201).json({
      message: "Department created successfully",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getDepartments = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM departments");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

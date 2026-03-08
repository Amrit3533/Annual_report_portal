const db = require("../config/db");

exports.createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    const [result] = await db.execute(
      "INSERT INTO departments (name, description) VALUES (?,?)",
      [name, description],
    );

    res.status(201).json({
      message: "Department created",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

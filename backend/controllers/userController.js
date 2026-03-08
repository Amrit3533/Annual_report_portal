const db = require("../config/db");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, department_id } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const id = uuidv4();

    await db.execute(
      `INSERT INTO users 
      (id, name, email, password, role, department_id) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [id, name, email, hashedPassword, role, department_id],
    );

    res.status(201).json({
      message: "User created Successfully",
      userId: id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT users.id, users.name, users.email, users.role,
      departments.name AS department
      FROM users
      LEFT JOIN departments
      ON users.department_id = departments.id
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateReportStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;
    const userRole = req.user.role;

    // Role based status change validation

    if (userRole === "faculty" && status !== "submitted") {
      return res.status(403).json({
        message: "Faculty can only submit reports"
      });
    }

    if (userRole === "department" && status !== "approved") {
      return res.status(403).json({
        message: "Department can only approve reports"
      });
    }

    if (!["submitted", "approved"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status update"
      });
    }

    await db.execute(
      "UPDATE reports SET status = ? WHERE id = ?",
      [status, id]
    );

    res.status(200).json({
      message: "Report status updated successfully"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};
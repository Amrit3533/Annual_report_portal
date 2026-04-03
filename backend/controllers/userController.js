const db = require("../config/db");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, department_id } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    const [existing] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    const allowedRoles = ["admin", "faculty", "department", "student"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const id = uuidv4();

    await db.execute(
      `INSERT INTO users 
      (id, name, email, password, role, department_id) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [id, name, email, hashedPassword, role, department_id || null],
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
    const role = req.user.role;

    let query = `
      SELECT users.id, users.name, users.email, users.role,
      departments.name AS department
      FROM users
      LEFT JOIN departments
      ON users.department_id = departments.id
    `;

    // ROLE BASED FILTERING

    if (role === "admin") {
      // Admin sees everything
      query += " ORDER BY users.created_at DESC";
    } else if (role === "department") {
      // Department sees faculty + students
      query += `
        WHERE users.role IN ('faculty','student')
        ORDER BY users.created_at DESC
      `;
    } else if (role === "faculty") {
      // Faculty sees students only
      query += `
        WHERE users.role = 'student'
        ORDER BY users.created_at DESC
      `;
    } else if (role === "student") {
      return res.status(403).json({
        message: "Students cannot access users list",
      });
    }

    const [rows] = await db.execute(query);

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

exports.disableUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      "UPDATE users SET is_active = FALSE WHERE id = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User disabled successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const [result] = await db.execute(
      `UPDATE users
       SET name = ?, email = ?, role = ?
       WHERE id = ?`,
      [name, email, role, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      "UPDATE users SET is_active = FALSE WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      message: "User disabled successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }
};

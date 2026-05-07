const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const { getFullReportData } = require("../services/reportService");

exports.createReport = async (req, res) => {
  try {
    const { title, year, department_id, description, status } = req.body;
    const id = uuidv4();
    const created_by = req.user.id;

    const query = `
  INSERT INTO reports
  (id, title, year, department_id, created_by, description, status)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`;

    await db.execute(query, [
      id,
      title,
      year,
      department_id,
      created_by,
      description,
      status || "draft",
    ]);

    res.status(201).json({
      message: "Report created successfully",
      id: id,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.fetchReport = async (req, res) => {
  try {
    const query = `
       SELECT * FROM reports;
        `;

    const [rows] = await db.execute(query);

    res.status(200).json({
      message: "Reports fetched successfully",
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
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
        message: "Faculty can only submit reports",
      });
    }

    if (userRole === "department" && status !== "approved") {
      return res.status(403).json({
        message: "Department can only approve reports",
      });
    }

    if (!["submitted", "approved"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status update",
      });
    }

    await db.execute("UPDATE reports SET status = ? WHERE id = ?", [
      status,
      id,
    ]);

    res.status(200).json({
      message: "Report status updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getSingleReport = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute("SELECT * FROM reports WHERE id = ?", [id]);

    if (!rows.length) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFullReport = async (req, res) => {
  try {
    const data = await getFullReportData(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, year, department_id, description } = req.body;

    const [result] = await db.execute(
      `UPDATE reports
       SET title = ?, year = ?, department_id = ?, description = ?
       WHERE id = ?`,
      [title, year, department_id, description, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json({
      message: "Report updated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute("DELETE FROM reports WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    res.json({
      message: "Report deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

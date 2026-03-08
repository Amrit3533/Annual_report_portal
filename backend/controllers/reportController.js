const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

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

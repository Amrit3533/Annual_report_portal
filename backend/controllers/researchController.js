exports.getResearch = async (req, res) => {
  try {
    const { year } = req.query;

    let query = `
      SELECT r.*, u.name AS faculty_name, d.name AS department_name
      FROM research r
      JOIN users u ON r.faculty_id = u.id
      JOIN departments d ON u.department_id = d.id
    `;

    const params = [];

    if (year) {
      query += " WHERE r.publication_year = ?";
      params.push(year);
    }

    query += " ORDER BY r.publication_year DESC";

    const [rows] = await db.execute(query, params);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");

exports.createResearch = async (req, res) => {
  try {
    const {
      report_id,
      paper_title,
      journal_name,
      publication_year,
      indexed,
      description,
      authors,
      doi_url,
      pdf_url
    } = req.body;

    const faculty_id = req.user.id; // from JWT

    const id = uuidv4();

    await db.execute(
      `INSERT INTO research 
      (id, report_id, faculty_id, paper_title, journal_name, publication_year, indexed, description, authors, doi_url, pdf_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        report_id,
        faculty_id,
        paper_title,
        journal_name,
        publication_year,
        indexed,
        description,
        authors,
        doi_url,
        pdf_url
      ]
    );

    res.status(201).json({ message: "Research added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding research" });
  }
};

exports.deleteResearch = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute("DELETE FROM research WHERE id = ?", [id]);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting" });
  }
};
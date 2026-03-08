const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

exports.addAcademicData = async (req, res) => {

    try {

        const {
            report_id,
            total_students,
            pass_percentage,
            toppers_count,
            academic_year,
            description
        } = req.body;

        const id = uuidv4();

        const query = `
        INSERT INTO academic_data
        (id, report_id, total_students, pass_percentage, toppers_count, academic_year, description)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        await db.execute(query, [
            id,
            report_id,
            total_students,
            pass_percentage,
            toppers_count,
            academic_year,
            description
        ]);

        res.status(201).json({
            message: "Academic data added successfully"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};
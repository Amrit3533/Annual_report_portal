const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

exports.insertData = async (req, res) => {
  try {
    const table = req.params.table;

    const data = req.body;

    const id = uuidv4();

    const fields = Object.keys(data);
    const values = Object.values(data);

    const placeholders = fields.map(() => "?").join(",");

    const query = `
        INSERT INTO ${table}
        (id, ${fields.join(",")})
        VALUES (?, ${placeholders})
        `;

    await db.execute(query, [id, ...values]);

    res.status(201).json({
      message: `${table} data inserted successfully`,
      id,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const db = require("../config/db");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

exports.generateReport = async (req, res) => {
  try {
    const reportId = req.params.id;

    // FETCH DATA

    const [report] = await db.execute("SELECT * FROM reports WHERE id = ?", [
      reportId,
    ]);

    if (!report.length) {
      return res.status(404).json({ message: "Report not found" });
    }

    const [academic] = await db.execute(
      "SELECT * FROM academic_data WHERE report_id = ?",
      [reportId],
    );

    const [research] = await db.execute(
      "SELECT * FROM research WHERE report_id = ?",
      [reportId],
    );

    const [financial] = await db.execute(
      "SELECT * FROM financial WHERE report_id = ?",
      [reportId],
    );

    const [infrastructure] = await db.execute(
      "SELECT * FROM infrastructure WHERE report_id = ?",
      [reportId],
    );

    const [studentAchievement] = await db.execute(
      "SELECT * FROM student_achievement WHERE report_id = ?",
      [reportId],
    );

    const [facultyAchievement] = await db.execute(
      "SELECT * FROM faculty_achievement WHERE report_id = ?",
      [reportId],
    );

    const [activities] = await db.execute(
      "SELECT * FROM extracurricular_activities WHERE report_id = ?",
      [reportId],
    );

    // GENERATE PDF
    const filePath = `report-${reportId}.pdf`;

    await new Promise((resolve) => {
      const stream = fs.createWriteStream(filePath);
      const doc = new PDFDocument();
      doc.pipe(stream);

      doc.fontSize(22).text("Annual Report", { align: "center" });
      doc.moveDown();

      doc.fontSize(16).text(`Report Title: ${report[0].title}`);
      doc.text(`Year: ${report[0].year}`);

      doc.moveDown();

      // Academic
      if (academic.length > 0) {
        doc.fontSize(18).text("Academic Data");
        doc
          .fontSize(12)
          .text(`Total Students: ${academic[0].total_students}`)
          .text(`Pass Percentage: ${academic[0].pass_percentage}`);
      }

      doc.moveDown();

      // Research
      doc.fontSize(18).text("Research Publications");
      research.forEach((r) => {
        doc.fontSize(12).text(`${r.paper_title} (${r.journal_name})`);
      });

      doc.moveDown();

      // Financial
      if (financial.length > 0) {
        doc.fontSize(18).text("Financial Data");
        doc
          .fontSize(12)
          .text(`Budget: ${financial[0].total_budget}`)
          .text(`Expenditure: ${financial[0].expenditure}`);
      }

      doc.moveDown();

      // Student Achievements
      doc.fontSize(18).text("Student Achievements");
      studentAchievement.forEach((s) => {
        doc.fontSize(12).text(`${s.student_name} - ${s.achievement_title}`);
      });

      doc.moveDown();

      // Faculty Achievements
      doc.fontSize(18).text("Faculty Achievements");
      facultyAchievement.forEach((f) => {
        doc.fontSize(12).text(`${f.achievement_title}`);
      });

      doc.end();
      stream.on("finish", resolve);
    });
    const fileContent = fs.readFileSync(filePath);
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `reports/${filePath}`,
      Body: fileContent,
      ContentType: "application/pdf",
    };

    const uploadResult = await s3.upload(params).promise();

    const fileUrl = uploadResult.Location;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    const url = s3.getSignedUrl("getObject", {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `reports/${filePath}`,
      Expires: 60 * 60, // 1 hour
    });
    await db.execute("UPDATE reports SET s3_url = ? WHERE id = ?", [
      fileUrl,
      reportId,
    ]);
    res.json({
      message: "Report generated and uploaded",
      url: fileUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating report" });
  }
};

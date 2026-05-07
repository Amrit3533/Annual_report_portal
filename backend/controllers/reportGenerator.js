const db = require("../config/db");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const AWS = require("aws-sdk");
const { getFullReportData } = require("../services/reportService");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

exports.generateReport = async (req, res) => {
  try {
    const reportId = req.params.id;

    const data = await getFullReportData(reportId);

    const {
      report,
      academic,
      research,
      financial,
      infrastructure,
      studentAchievement,
      facultyAchievement,
      activities,
    } = data;

    // GENERATE PDF
    const filePath = `report-${reportId}.pdf`;

    await new Promise((resolve) => {
      const stream = fs.createWriteStream(filePath);
      const doc = new PDFDocument();
      doc.pipe(stream);

      doc
        .fontSize(26)
        .fillColor("#2c3e50")
        .text("ANNUAL REPORT", { align: "center" });

      doc.moveDown();

      doc
        .fontSize(14)
        .fillColor("black")
        .text(`Title: ${report.title}`)
        .text(`Year: ${report.year}`);
      doc.moveDown();

      // Academic
      if (academic.length > 0) {
        doc.fontSize(18).text("Academic Data");

        academic.forEach((a) => {
          doc
            .fontSize(12)
            .text(`Year: ${a.academic_year}`)
            .text(`Students: ${a.total_students}`)
            .text(`Pass %: ${a.pass_percentage}`)
            .moveDown();
        });
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

        financial.forEach((f) => {
          doc
            .fontSize(12)
            .text(`Budget: ${f.total_budget}`)
            .text(`Expenditure: ${f.expenditure}`)
            .moveDown();
        });
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

      // Infrastructure
      if (infrastructure.length > 0) {
        doc.fontSize(18).text("Infrastructure");

        infrastructure.forEach((i) => {
          doc
            .fontSize(12)
            .text(`Labs: ${i.labs_count}`)
            .text(`Classrooms: ${i.classrooms_count}`)
            .moveDown();
        });
      }

      // Activities
      if (activities.length > 0) {
        doc.fontSize(18).text("Extracurricular Activities");

        activities.forEach((a) => {
          doc.fontSize(12).text(`${a.activity_name} (${a.event_date})`);
        });
      }

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
    await db.execute("UPDATE reports SET s3 = ? WHERE id = ?", [
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

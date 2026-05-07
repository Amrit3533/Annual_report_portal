const db = require("../config/db");

exports.getFullReportData = async (reportId) => {

  const [report] = await db.execute(
    "SELECT * FROM reports WHERE id = ?",
    [reportId]
  );

  if (!report.length) {
    throw new Error("Report not found");
  }

  const [academic] = await db.execute(
    "SELECT * FROM academic_data WHERE report_id = ?",
    [reportId]
  );

  const [research] = await db.execute(
    "SELECT * FROM research WHERE report_id = ?",
    [reportId]
  );

  const [financial] = await db.execute(
    "SELECT * FROM financial WHERE report_id = ?",
    [reportId]
  );

  const [infrastructure] = await db.execute(
    "SELECT * FROM infrastructure WHERE report_id = ?",
    [reportId]
  );

  const [studentAchievement] = await db.execute(
    "SELECT * FROM student_achievement WHERE report_id = ?",
    [reportId]
  );

  const [facultyAchievement] = await db.execute(
    "SELECT * FROM faculty_achievement WHERE report_id = ?",
    [reportId]
  );

  const [activities] = await db.execute(
    "SELECT * FROM extracurricular_activities WHERE report_id = ?",
    [reportId]
  );

  return {
    report: report[0],
    academic,
    research,
    financial,
    infrastructure,
    studentAchievement,
    facultyAchievement,
    activities
  };
};
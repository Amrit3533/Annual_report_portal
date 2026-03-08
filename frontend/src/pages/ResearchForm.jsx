import axios from "axios";
import { useState } from "react";

const initialFormData = {
  researcherName: "",
  studentId: "",
  email: "",
  phone: "",
  department: "",
  program: "",
  researchTitle: "",
  researchType: "",
  researchArea: "",
  supervisorName: "",
  supervisorEmail: "",
  startDate: "",
  expectedEndDate: "",
  fundingRequired: "",
  fundingAmount: "",
  fundingSource: "",
  objectives: "",
  methodology: "",
  expectedOutcomes: "",
};

export default function ResearchForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const API = process.env.VITE_API_URL;
    
    await axios.post(`${API}/api/research`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setSubmitStatus("success");
    setFormData(initialFormData);
    setIsSubmitting(false);
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        :root {
          --ink: #0f2347;
          --mid: #1d4ed8;
          --mid-dark: #1e40af;
          --sky: #eff6ff;
          --line: #d6e3ff;
          --muted: #516487;
          --card: #ffffff;
        }

        .research-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 8% 12%, rgba(59, 130, 246, 0.2), transparent 35%),
            radial-gradient(circle at 88% 2%, rgba(29, 78, 216, 0.22), transparent 32%),
            linear-gradient(180deg, #eaf1ff 0%, #dfeafe 100%);
          color: var(--ink);
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          padding: 28px 14px;
          overflow-y: auto;
        }

        .research-shell {
          max-width: 980px;
          margin: 0 auto;
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: 18px;
          box-shadow: 0 14px 28px rgba(20, 40, 80, 0.12);
          overflow: hidden;
        }

        .research-header {
          background: linear-gradient(140deg, #0f2347 0%, #1d4ed8 100%);
          color: #ffffff;
          padding: 28px 24px;
        }

        .research-header h1 {
          margin: 0;
          font-size: 32px;
          line-height: 1.06;
          letter-spacing: -0.01em;
        }

        .research-header p {
          margin: 8px 0 0;
          opacity: 0.95;
          font-size: 15px;
        }

        .research-body {
          padding: 24px;
          display: grid;
          gap: 22px;
        }

        .section {
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 16px;
          background: #f8fbff;
          box-shadow: 0 6px 16px rgba(16, 38, 84, 0.06);
        }

        .section h2 {
          margin: 0 0 14px;
          font-size: 20px;
          color: #16356e;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .field {
          display: grid;
          gap: 6px;
        }

        .field.full {
          grid-column: 1 / -1;
        }

        label {
          font-size: 13px;
          font-weight: 600;
          color: #2f4671;
        }

        input, select, textarea {
          width: 100%;
          border: 1px solid #b9cfff;
          border-radius: 10px;
          padding: 11px 12px;
          font-size: 14px;
          color: #132e62;
          background: #ffffff;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: var(--mid);
          box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.15);
        }

        textarea {
          resize: vertical;
          min-height: 110px;
        }

        .status {
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 14px;
        }

        .status.success {
          background: #e8f1ff;
          border: 1px solid #b8d1ff;
          color: #16356e;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          padding-top: 6px;
        }

        button {
          border: none;
          background: var(--mid);
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          border-radius: 10px;
          padding: 11px 20px;
          cursor: pointer;
          transition: transform 0.15s ease, background 0.2s ease;
        }

        button:hover:not(:disabled) {
          background: var(--mid-dark);
          transform: translateY(-1px);
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 760px) {
          .research-page { padding: 10px; }
          .research-header { padding: 20px 16px; }
          .research-header h1 { font-size: 24px; }
          .research-body { padding: 14px; }
          .grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <main className="research-page">
        <div className="research-shell">
          <header className="research-header">
            <h1>Research Proposal Form</h1>
            <p>Submit your research project or thesis proposal</p>
          </header>

          <form className="research-body" onSubmit={handleSubmit}>
            <section className="section">
              <h2>Researcher Information</h2>
              <div className="grid">
                <div className="field">
                  <label htmlFor="researcherName">Full Name</label>
                  <input
                    id="researcherName"
                    name="researcherName"
                    value={formData.researcherName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="studentId">Student/Staff ID</label>
                  <input
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="department">Department</label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electrical Engineering">
                      Electrical Engineering
                    </option>
                    <option value="Mechanical Engineering">
                      Mechanical Engineering
                    </option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Business Administration">
                      Business Administration
                    </option>
                    <option value="Biotechnology">Biotechnology</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="program">Program</label>
                  <select
                    id="program"
                    name="program"
                    value={formData.program}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select program</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="PhD">PhD</option>
                    <option value="Research Fellow">Research Fellow</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="section">
              <h2>Research Details</h2>
              <div className="grid">
                <div className="field full">
                  <label htmlFor="researchTitle">Research Title</label>
                  <input
                    id="researchTitle"
                    name="researchTitle"
                    value={formData.researchTitle}
                    onChange={handleChange}
                    placeholder="Enter your research title"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="researchType">Research Type</label>
                  <select
                    id="researchType"
                    name="researchType"
                    value={formData.researchType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="Thesis">Thesis</option>
                    <option value="Dissertation">Dissertation</option>
                    <option value="Project">Project</option>
                    <option value="Paper">Research Paper</option>
                    <option value="Innovation">Innovation/Patent</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="researchArea">Research Area</label>
                  <select
                    id="researchArea"
                    name="researchArea"
                    value={formData.researchArea}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select area</option>
                    <option value="Artificial Intelligence">
                      Artificial Intelligence
                    </option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Data Science">Data Science</option>
                    <option value="IoT">Internet of Things</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Robotics">Robotics</option>
                    <option value="Cloud Computing">Cloud Computing</option>
                    <option value="Blockchain">Blockchain</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="expectedEndDate">Expected End Date</label>
                  <input
                    id="expectedEndDate"
                    name="expectedEndDate"
                    type="date"
                    value={formData.expectedEndDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </section>

            <section className="section">
              <h2>Supervisor Information</h2>
              <div className="grid">
                <div className="field">
                  <label htmlFor="supervisorName">Supervisor Name</label>
                  <input
                    id="supervisorName"
                    name="supervisorName"
                    value={formData.supervisorName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="supervisorEmail">Supervisor Email</label>
                  <input
                    id="supervisorEmail"
                    name="supervisorEmail"
                    type="email"
                    value={formData.supervisorEmail}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </section>

            <section className="section">
              <h2>Funding Details</h2>
              <div className="grid">
                <div className="field">
                  <label htmlFor="fundingRequired">Funding Required?</label>
                  <select
                    id="fundingRequired"
                    name="fundingRequired"
                    value={formData.fundingRequired}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="fundingAmount">
                    Funding Amount (if applicable)
                  </label>
                  <input
                    id="fundingAmount"
                    name="fundingAmount"
                    type="number"
                    value={formData.fundingAmount}
                    onChange={handleChange}
                    placeholder="Enter amount in ₹"
                  />
                </div>
                <div className="field full">
                  <label htmlFor="fundingSource">Funding Source</label>
                  <input
                    id="fundingSource"
                    name="fundingSource"
                    value={formData.fundingSource}
                    onChange={handleChange}
                    placeholder="e.g., University Grant, External Sponsor, Self-funded"
                  />
                </div>
              </div>
            </section>

            <section className="section">
              <h2>Research Proposal</h2>
              <div className="grid">
                <div className="field full">
                  <label htmlFor="objectives">Research Objectives</label>
                  <textarea
                    id="objectives"
                    name="objectives"
                    value={formData.objectives}
                    onChange={handleChange}
                    placeholder="Describe the main objectives of your research"
                    required
                  />
                </div>
                <div className="field full">
                  <label htmlFor="methodology">Methodology</label>
                  <textarea
                    id="methodology"
                    name="methodology"
                    value={formData.methodology}
                    onChange={handleChange}
                    placeholder="Describe your research methodology and approach"
                    required
                  />
                </div>
                <div className="field full">
                  <label htmlFor="expectedOutcomes">Expected Outcomes</label>
                  <textarea
                    id="expectedOutcomes"
                    name="expectedOutcomes"
                    value={formData.expectedOutcomes}
                    onChange={handleChange}
                    placeholder="Describe the expected results and impact"
                    required
                  />
                </div>
              </div>
            </section>

            {submitStatus === "success" && (
              <div className="status success">
                Research proposal submitted successfully! You will receive a
                confirmation email shortly.
              </div>
            )}

            <div className="actions">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Proposal"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

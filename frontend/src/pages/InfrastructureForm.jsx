import { useState } from "react";

const initialFormData = {
  projectName: "",
  projectType: "",
  department: "",
  location: "",
  startDate: "",
  endDate: "",
  estimatedBudget: "",
  fundingSource: "",
  projectManager: "",
  contactEmail: "",
  contactPhone: "",
  description: "",
  objectives: "",
  resources: "",
  contractors: "",
};

export default function InfrastructureForm() {
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

    await new Promise((resolve) => setTimeout(resolve, 800));

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

        .infra-page {
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

        .infra-shell {
          max-width: 980px;
          margin: 0 auto;
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: 18px;
          box-shadow: 0 14px 28px rgba(20, 40, 80, 0.12);
          overflow: hidden;
        }

        .infra-header {
          background: linear-gradient(140deg, #0f2347 0%, #1d4ed8 100%);
          color: #ffffff;
          padding: 28px 24px;
        }

        .infra-header h1 {
          margin: 0;
          font-size: 32px;
          line-height: 1.06;
          letter-spacing: -0.01em;
        }

        .infra-header p {
          margin: 8px 0 0;
          opacity: 0.95;
          font-size: 15px;
        }

        .infra-body {
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
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field.full-width {
          grid-column: 1 / -1;
        }

        label {
          font-size: 13px;
          font-weight: 700;
          color: #16356e;
        }

        input,
        select,
        textarea {
          border: 1px solid #b9cfff;
          border-radius: 8px;
          padding: 9px 12px;
          font-size: 14px;
          font-family: inherit;
          background: #ffffff;
          color: var(--ink);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        input:focus,
        select:focus,
        textarea:focus {
          outline: none;
          border-color: var(--mid);
          box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.1);
        }

        textarea {
          min-height: 90px;
          resize: vertical;
        }

        .success-msg {
          background: #d1fae5;
          border: 1px solid #6ee7b7;
          color: #065f46;
          padding: 12px 16px;
          border-radius: 10px;
          margin-bottom: 14px;
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
          .infra-page { padding: 10px; }
          .infra-header { padding: 20px 16px; }
          .infra-header h1 { font-size: 24px; }
          .infra-body { padding: 14px; }
          .grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <main className="infra-page">
        <div className="infra-shell">
          <header className="infra-header">
            <h1>Infrastructure Project Form</h1>
            <p>Submit infrastructure development and maintenance projects</p>
          </header>

          <form className="infra-body" onSubmit={handleSubmit}>
            {submitStatus === "success" && (
              <div className="success-msg">
                Infrastructure project submitted successfully!
              </div>
            )}

            <section className="section">
              <h2>Project Information</h2>
              <div className="grid">
                <div className="field">
                  <label htmlFor="projectName">Project Name</label>
                  <input
                    id="projectName"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="projectType">Project Type</label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="new-construction">New Construction</option>
                    <option value="renovation">Renovation</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="equipment">Equipment Purchase</option>
                    <option value="technology">Technology Upgrade</option>
                    <option value="other">Other</option>
                  </select>
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
                    <option value="">Select Department</option>
                    <option value="computer-science">Computer Science</option>
                    <option value="electrical">Electrical Engineering</option>
                    <option value="mechanical">Mechanical Engineering</option>
                    <option value="civil">Civil Engineering</option>
                    <option value="administration">Administration</option>
                    <option value="facilities">Facilities Management</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="location">Location</label>
                  <input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Building/Campus area"
                    required
                  />
                </div>
                <div className="field full-width">
                  <label htmlFor="description">Project Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Detailed description of the infrastructure project"
                    required
                  ></textarea>
                </div>
              </div>
            </section>

            <section className="section">
              <h2>Timeline & Budget</h2>
              <div className="grid">
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
                  <label htmlFor="endDate">Expected Completion Date</label>
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="estimatedBudget">Estimated Budget (₹)</label>
                  <input
                    id="estimatedBudget"
                    name="estimatedBudget"
                    type="number"
                    value={formData.estimatedBudget}
                    onChange={handleChange}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="fundingSource">Funding Source</label>
                  <select
                    id="fundingSource"
                    name="fundingSource"
                    value={formData.fundingSource}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Source</option>
                    <option value="institute-budget">Institute Budget</option>
                    <option value="government-grant">Government Grant</option>
                    <option value="private-funding">Private Funding</option>
                    <option value="donation">Donation</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="section">
              <h2>Project Details</h2>
              <div className="grid">
                <div className="field full-width">
                  <label htmlFor="objectives">Project Objectives</label>
                  <textarea
                    id="objectives"
                    name="objectives"
                    value={formData.objectives}
                    onChange={handleChange}
                    placeholder="Key objectives and expected outcomes"
                  ></textarea>
                </div>
                <div className="field full-width">
                  <label htmlFor="resources">Required Resources</label>
                  <textarea
                    id="resources"
                    name="resources"
                    value={formData.resources}
                    onChange={handleChange}
                    placeholder="Materials, equipment, manpower needed"
                  ></textarea>
                </div>
                <div className="field">
                  <label htmlFor="contractors">Contractors/Vendors</label>
                  <input
                    id="contractors"
                    name="contractors"
                    value={formData.contractors}
                    onChange={handleChange}
                    placeholder="Name of contractors"
                  />
                </div>
              </div>
            </section>

            <section className="section">
              <h2>Contact Information</h2>
              <div className="grid">
                <div className="field">
                  <label htmlFor="projectManager">Project Manager</label>
                  <input
                    id="projectManager"
                    name="projectManager"
                    value={formData.projectManager}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="contactEmail">Email</label>
                  <input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="contactPhone">Phone Number</label>
                  <input
                    id="contactPhone"
                    name="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </section>

            <div className="actions">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Project"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

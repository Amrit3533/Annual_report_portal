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
          --ink: #0f0f0f;
          --paper: #f5f2ec;
          --cream: #ede8de;
          --accent: #c8522a;
          --accent-dark: #a0401e;
          --muted: #8a8178;
          --border: #e0e0e0;
          --card: #fff;
        }

        .infra-page {
          min-height: 100vh;
          width: 100vw;
          background:
            radial-gradient(circle at 8% 12%, rgba(200, 82, 42, 0.08), transparent 35%),
            radial-gradient(circle at 88% 2%, rgba(160, 64, 30, 0.10), transparent 32%),
            linear-gradient(180deg, #f5f2ec 0%, #ede8de 100%);
          color: var(--ink);
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          padding: 0;
          overflow-y: auto;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
        }

        .infra-shell {
          width: 100%;
          max-width: 980px;
          min-height: 100vh;
          margin: 0 auto;
          background: var(--card);
          border: 1.5px solid var(--border);
          border-radius: 20px;
          box-shadow: 0 14px 28px rgba(200, 82, 42, 0.08);
          overflow: visible;
          display: flex;
          flex-direction: column;
        }

        .infra-header {
          background: linear-gradient(90deg, #5b5bf7 0%, #a0401e 100%);
          color: #fff;
          padding: 32px 28px;
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
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .section {
          border: 1.5px solid var(--border);
          border-radius: 16px;
          padding: 24px 18px 18px 18px;
          background: #fff;
          box-shadow: 0 6px 16px rgba(200, 82, 42, 0.06);
          margin-bottom: 0;
        }

        .section h2 {
          margin: 0 0 18px 0;
          font-size: 22px;
          color: #a0401e;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px 18px;
          align-items: start;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          justify-content: flex-start;
        }

        .field.full-width {
          grid-column: 1 / -1;
        }

        label {
          font-size: 13px;
          font-weight: 700;
          color: #a0401e;
        }

        input,
        select,
        textarea {
          border: 1.5px solid var(--border);
          border-radius: 8px;
          padding: 10px 13px;
          font-size: 15px;
          font-family: inherit;
          background: #fafbfc;
          color: var(--ink);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        input:focus,
        select:focus,
        textarea:focus {
          outline: none;
          border-color: #a0401e;
          box-shadow: 0 0 0 3px rgba(200, 82, 42, 0.08);
        }

        textarea {
          min-height: 90px;
          resize: vertical;
        }

        .success-msg {
          background: #d1fae5;
          border: 1.5px solid #6ee7b7;
          color: #065f46;
          padding: 12px 16px;
          border-radius: 10px;
          margin-bottom: 14px;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          padding-top: 16px;
        }

        button {
          border: none;
          background: linear-gradient(90deg, #5b5bf7 0%, #a0401e 100%);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          border-radius: 12px;
          padding: 12px 26px;
          cursor: pointer;
          transition: transform 0.15s ease, background 0.2s ease;
          min-width: 180px;
        }

        button:hover:not(:disabled) {
          background: linear-gradient(90deg, #a0401e 0%, #5b5bf7 100%);
          transform: translateY(-1px);
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 900px) {
          .infra-shell { max-width: 100%; width: 100%; }
          .infra-header { padding: 24px 12px; }
          .infra-body { padding: 12px; }
        }

        @media (max-width: 760px) {
          .infra-page { padding: 0; width: 100vw; overflow-y: auto; }
          .infra-shell { border-radius: 0; min-height: 100vh; }
          .infra-header { padding: 16px 6px; }
          .infra-header h1 { font-size: 22px; }
          .infra-body { padding: 6px; }
          .section { padding: 8px; }
          .grid { grid-template-columns: 1fr; gap: 18px; }
          .actions { justify-content: stretch; }
          button { width: 100%; min-width: unset; }
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

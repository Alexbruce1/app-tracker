import { useState, useEffect } from "react";
import "./App.css";
import "./JobList";
import JobList from "./JobList";
import { supabase } from "./supabaseClient";

function App() {
  const [formData, setFormData] = useState({
    company: "",
    date: "",
    jobBoard: "",
    notes: ""
  });

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFormData((prev) => ({
      ...prev,
      date: today
    }));
  }, []);

  const saveJob = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from('applications')
        .insert([
          {
            company_name: formData.company,
            applied_date: formData.date,
            job_board: formData.jobBoard,
            notes: formData.notes || "",
          },
        ])
        .select();

      if (error) {
        console.error('Error adding application:', error);
        alert('Failed to save job application. Please try again.');
      } else {
        setFormData({
          company: "",
          date: new Date().toISOString().split("T")[0],
          jobBoard: "",
          notes: "",
        });
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="App">
      <div className="header">
        <h1>App-Tracker</h1>
      </div>
      <div className="application-form-outline app-content">
        <form className="application-submit-form" onSubmit={saveJob}>
          <input
            type="text"
            placeholder="Company Applied To"
            className="form-element company-field"
            autoComplete="off"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            placeholder="Date Applied"
            className="form-element date-applied-field"
            defaultValue={formData.date}
            name="date"
            onChange={handleChange}
            required
          />
          <select
            className="form-element job-board-field"
            name="jobBoard"
            value={formData.jobBoard}
            onChange={handleChange}
          >
            <option>Choose</option>
            <option>LinkedIn</option>
            <option>GlassDoor</option>
            <option>BuiltIn</option>
            <option>Indeed</option>
            <option>Zip Recruiter</option>
            <option>Other</option>
          </select>
          <input
            type="submit"
            value="Save Job"
            className="form-element form-submit button-element"
          />
        </form>
      </div>

      <JobList />

      <div className="app-header-background"></div>
      <div className="app-header-fade"></div>
    </div>
  );
}

export default App;
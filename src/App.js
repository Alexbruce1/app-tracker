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
  const [jobList, setJobList] = useState([]);

  useEffect(() => {
    const isLocalhost = window.location.hostname === 'localhost';
    document.title = isLocalhost ? 'App Tracker - local' : 'App Tracker';
  }, []);  

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFormData((prev) => ({
      ...prev,
      date: today
    }));

    getJobList();
  }, []);

  const getJobList = async () => {
    const { data, error } = await supabase
      .from('applications')
      .select('*');
    if (error) {
      console.error('Error fetching applications:', error);
      return [];
    }
    setJobList(data);
    console.log(jobList);
  };
  
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
          notes: "",
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }

    getJobList();
  };

  const deleteApplication = async (id) => {
    const { data, error } = await supabase.from('applications').delete().eq('id', id);
    if (error) {
      console.error('Error deleting application:', error);
      return null;
    }

    getJobList();
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
            placeholder="Company"
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
            <option>Job Board</option>
            <option>LinkedIn</option>
            <option>GlassDoor</option>
            <option>BuiltIn</option>
            <option>Indeed</option>
            <option>Zip Recruiter</option>
            <option>Other</option>
          </select>
          <input
            type="submit"
            value="Save"
            className="form-element form-submit button-element"
          />
        </form>
      </div>

      {jobList.length > 0 && (
        <JobList 
          jobList={jobList} 
          getJobList={getJobList} 
          deleteApplication={deleteApplication}/>
      )}

      <div className="app-header-background"></div>
      <div className="app-header-fade"></div>
    </div>
  );
}

export default App;
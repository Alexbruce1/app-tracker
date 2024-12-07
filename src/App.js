import { useState, useEffect } from "react";
import "./App.css";
import "./JobList";
import JobList from "./JobList";
import { supabase } from './supabaseClient';

function App() {
  const [formData, setFormData] = useState({
    company: "",
    date: "",
    jobBoard: "",
    notes: ""
  });
  
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFormData(prev => ({
      ...prev,
      date: today
    }));
  }, []);

  const saveJob = e => {
    e.preventDefault();
    console.log(formData)
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    console.log(formData)
  }

  return (
    <div className="App">
      <div className="header">
        <h1>
          App-Tracker
        </h1>
      </div>
      <div className="application-form-outline app-content">
        <form className="application-submit-form" onSubmit={saveJob}>
          <input 
            type="text" 
            placeholder="Company Applied To" 
            className="form-element company-field"
            autoComplete="off"
            name="company"
            onChange={handleChange}
            required/>
          <input 
            type="date" 
            placeholder="Date Applied" 
            className="form-element date-applied-field"
            defaultValue={formData.date}
            name="date"
            onChange={handleChange}
            required/>
          <select 
            className="form-element job-board-field"
            name="jobBoard"
            onChange={handleChange}>
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
            onClick={saveJob}/>
        </form>
      </div>

      <JobList />

      {/* background color gradient */}
      <div className="app-header-background"></div>
      <div className="app-header-fade"></div>
    </div>
  );
}

export default App;

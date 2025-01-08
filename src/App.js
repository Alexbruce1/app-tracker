import { useState, useEffect } from "react";
import "./App.css";
import Stats from "./Stats";
import JobList from "./JobList";
import { supabase } from "./supabaseClient";
import caret from "./assets/caret.svg";

function App() {
  const [formData, setFormData] = useState({
    company: "",
    date: "",
    jobBoard: "",
    notes: "",
    customCoverLetter: false,
    heardBack: false,
  });

  const applicationStatusOptions = [
    "Application Status",
    "Haven't heard back",
    "Potentially Interviewing",
    "Interviewing",
    "Offer",
    "Declined"
  ];
  const [jobList, setJobList] = useState([]);
  const [FormExpanded, setFormExpanded] = useState(false);

  useEffect(() => {
    const isLocalhost = window.location.hostname === "localhost";
    document.title = isLocalhost ? "App Tracker - local" : "App Tracker";
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
      .from("applications")
      .select("*");
    if (error) {
      console.error("Error fetching applications:", error);
      return [];
    }

    const sortedData = data.sort((a, b) => {
      return new Date(b.applied_date) - new Date(a.applied_date);
    });
    
    setJobList(sortedData);
  };
  
  const saveJob = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from("applications")
        .insert([
          {
            company_name: formData.company,
            applied_date: formData.date,
            job_board: formData.jobBoard,
            notes: formData.notes || "",
            custom_cover_letter: formData.customCoverLetter,
            heard_back: false,
          },
        ])
        .select();

      if (error) {
        console.error("Error adding application:", error);
        alert("Failed to save job application. Please try again.");
      } else {
        setFormData({
          company: "",
          date: new Date().toISOString().split("T")[0],
          jobBoard: formData.jobBoard,
          notes: "",
          customCoverLetter: false,
          heardBack: false,
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }

    getJobList();
  };

  const deleteApplication = async (id) => {
    const { data, error } = await supabase.from("applications").delete().eq("id", id);
    if (error) {
      console.error("Error deleting application:", error);
      return null;
    }

    getJobList();
  };

  const filterResultsByCompanyName = async (query) => {

    let { data, error } = await supabase
      .from("applications")
      .select("*")
      .gt("company_name", query)
      
    setJobList(data);
  }

  const updateApplication = async (id, element, updates) => {
    const { data, error } = await supabase
      .from("applications")
      .update({[element]: `${updates}`})
      .eq("id", id);
    if (error) {
      console.error("Error updating application:", error);
      return null;
    }
    return data;

    getJobList();
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      customCoverLetter: e.target.checked
    }));
  };

  const handleFormExpansion = () => {
    setFormExpanded(!FormExpanded);
  }

  return (
    <div className="App">
      <div className="header">
        <h1>App-Tracker</h1>
      </div>
      <div className="application-form-outline app-content">
        <form className="application-submit-form" onSubmit={saveJob}>
          <div className="application-submit-form-first-line">
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
          </div>
          {FormExpanded && (
            <div className="application-submit-form-second-line">
              <div className="custom-letter-checkbox-container">
                <label className="custom-checkbox">
                  <input 
                    type="checkbox" 
                    name="customCoverLetter"
                    onChange={handleCheckboxChange}
                    checked={formData.customCoverLetter}/>
                  <span className="checkbox"></span>
                </label>
                <p className="custom-cover-letter-text">Custom Cover Letter</p>
              </div>
              <input 
                type="text" 
                placeholder="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="form-notes-field"/>
            </div>
          )}
        </form>
        <button className="expand-form-button" onClick={handleFormExpansion}>
          <img src={caret} className={FormExpanded ? "form-caret-img form-caret-img-expanded" : "form-caret-img"} />
        </button>
      </div>
      {jobList.length > 0 && (
        <JobList 
        jobList={jobList} 
        getJobList={getJobList} 
        deleteApplication={deleteApplication}
        updateApplication={updateApplication}
        filterResultsByCompanyName={filterResultsByCompanyName}
        applicationStatusOptions={applicationStatusOptions}/>
      )}
      <Stats jobList={jobList}/>
      <div className="app-header-background"></div>
      <div className="app-header-fade"></div>
    </div>
  );
}

export default App;
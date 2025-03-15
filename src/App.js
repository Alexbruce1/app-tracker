import { useState, useEffect } from "react";
import "./App.css";
import Stats from "./Stats";
import JobList from "./JobList";
import { supabase } from "./supabaseClient";
import caret from "./assets/caret.svg";

function App() {
  const [formData, setFormData] = useState({
    company_name: "",
    applied_date: "",
    job_Board: "",
    notes: "",
    customCoverLetter: false,
    heardBack: false,
  });
  const [jobList, setJobList] = useState([]);
  const [filterableJobList, setFilterableJobList] = useState([]);
  const [filteredByJobBoard, setFilteredByJobBoard] = useState(false);
  const [filteredByStatus, setFilteredByStatus] = useState(false);
  const [FormExpanded, setFormExpanded] = useState(false);
  const [waitingOnFetch, setWaitingOnFetch] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  const jobBoards = [
  "Job Board",
  "LinkedIn",
  "WellFound",
  "Welcome To The Jungle",
  "Robert Half",
  "GlassDoor",
  "BuiltIn",
  "Indeed",
  "Zip Recruiter",
  "Other",
  ]

  const applicationStatusOptions = [
    "Application Status",
    "Haven't heard back",
    "Potentially Interviewing",
    "Interviewing",
    "Offer",
    "Declined"
  ];

  useEffect(() => {
    const isLocalhost = window.location.hostname === "localhost";
    document.title = isLocalhost ? "App Tracker - local" : "App Tracker";
  }, []);  

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFormData((prev) => ({
      ...prev,
      applied_date: today
    }));

    getJobList();
  }, []);

  useEffect(() => {
    filterJobsByStatus(statusFilter);
  }, [statusFilter]);

  const getJobList = async () => {
    setWaitingOnFetch(true);

    const { data, error } = await supabase
      .from("applications")
      .select("*");
    if (error) {
      console.error("Error fetching applications:", error);
      return [];
    }

    const sortedData = sortJobList(data);
    
    setJobList(sortedData);
    setFilterableJobList(sortedData);
    setWaitingOnFetch(false);
  };

  const sortJobList = (data) => {
    return data.sort((a, b) => {
      if (new Date(a.applied_date) !== new Date(b.applied_date)) {
        return new Date(b.applied_date) - new Date(a.applied_date);
      } else {
        return new Date(b.created_at) - new Date(a.created_at);
      }
    });
  }
  
  const saveJob = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from("applications")
        .insert([
          {
            company_name: formData.company_name,
            applied_date: formData.applied_date,
            job_board: formData.job_Board,
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
          company_name: "",
          applied_date: new Date().toISOString().split("T")[0],
          job_Board: formData.job_Board,
          notes: "",
          customCoverLetter: false,
          heardBack: false,
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }

    setTimeout(getJobList, 500);
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
    if (!query) {
      getJobList();
      return;
    }

    let { data, error } = await supabase
      .from("applications")
      .select("*")
      .gte("company_name", query)

    const sortedData = sortJobList(data);
      
    setFilterableJobList(sortedData);
  };

  const filterExistingResults = (query) => {
    const filteredData = jobList.filter((job) => {
      return job.company_name.toLowerCase().includes(query);
    });

    const sortedData = sortJobList(filteredData);

    setFilterableJobList(sortedData);
  };

  const clearResultsSearch = () => {
    setFilterableJobList([]);
    setFilteredByJobBoard(false);
    setStatusFilter("All");
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

  const filterJobsByJobBoard = (jobBoard) => {
    if (jobBoard === "Job Board") {
      setFilterableJobList(jobList);
      setFilteredByJobBoard(false);
    } else {
      if (!filteredByJobBoard) {
        const filteredData = filterableJobList.filter((job) => {
          return job.job_board === jobBoard;
        });

        setFilterableJobList(filteredData);
        setFilteredByJobBoard(true);
      } else {
        const filteredData = jobList.filter((job) => {
          return job.job_board === jobBoard;
        });
    
        setFilteredByJobBoard(true);
        setFilterableJobList(filteredData);
      }
    }
  }

  const filterJobsByStatus = (status) => {
    let filteredData;
    if (status === "All") {
      setFilteredByStatus(false);
      setFilterableJobList(jobList);
      return;
    }
    
    if (!filteredByStatus) {
      if (status === "Haven't heard back") {
        filteredData = filterableJobList.filter((job) => {
          return job.heard_back !== true;
        });
      } else if (status === "In Progress") {
        filteredData = filterableJobList.filter((job) => {
          return job.status === "Potentially Interviewing" || job.status === "Interviewing" || job.status === "Offer";
        });
      } else {
        // This only gets triggered when selecting "Declined"
        filteredData = filterableJobList.filter((job) => {
          return job.status === "Declined";
        });
      }
    } else {
      if (status === "Haven't heard back") {
        filteredData = jobList.filter((job) => {
          return job.heard_back !== true;
        });
      } else if (status === "In Progress") {
        filteredData = jobList.filter((job) => {
          return job.status === "Potentially Interviewing" || job.status === "Interviewing" || job.status === "Offer";
        });
      } else {
        // This only gets triggered when selecting "Declined"
        filteredData = jobList.filter((job) => {
          return job.status === "Declined";
        });
      }
  
    }

    setFilteredByStatus(true);
    setFilterableJobList(filteredData);
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
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              placeholder="Date Applied"
              className="form-element date-applied-field"
              defaultValue={formData.applied_date}
              name="date"
              onChange={handleChange}
              required
            />
            <select
              className="form-element job-board-field"
              name="job_Board"
              value={formData.job_Board}
              onChange={handleChange}>
              {jobBoards.map((jobBoard, index) => (
                  <option key={index}>{jobBoard}</option>
                ))}
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
      {filterableJobList && (
        <JobList 
          jobList={ filterableJobList } 
          getJobList={getJobList} 
          jobBoards={jobBoards}
          deleteApplication={deleteApplication}
          updateApplication={updateApplication}
          filterResultsByCompanyName={filterResultsByCompanyName}
          filterExistingResults={filterExistingResults}
          applicationStatusOptions={applicationStatusOptions}
          clearResultsSearch={clearResultsSearch}
          filterJobsByJobBoard={filterJobsByJobBoard}
          waitingOnFetch={waitingOnFetch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          />
      )}
      <Stats jobList={jobList}/>
      <div className="app-header-background"></div>
      <div className="app-header-fade"></div>
    </div>
  );
}

export default App;
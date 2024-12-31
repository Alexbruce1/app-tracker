import React, { useState } from "react";
import "./JobList.css";
import JobItem from "./JobItem";
import search from "./assets/search.svg";
import filter from "./assets/filter.svg";
import clear from "./assets/clear.svg";
import refresh from "./assets/refresh.svg";

function JobList({ jobList, getJobList, deleteApplication, updateApplication, applicationStatusOptions }) {
  const [searchFieldText, setSearchFieldText] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const groupedJobs = jobList.reduce((weeks, job) => {
    const appliedDate = new Date(job.applied_date || job.created_at);
    const weekStart = new Date(appliedDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekKey = weekStart.toISOString().slice(0, 10);

    if (!weeks[weekKey]) weeks[weekKey] = [];
    weeks[weekKey].push(job);

    return weeks;
  }, {});

  const handleTextInput = (e) => {
    e.preventDefault();
    setSearchFieldText(e.target.value);
  };

  const clearSearchField = () => {
    setSearchFieldText("");
  };

  const toggleFiltersOpen = () => {
    setFiltersOpen(!filtersOpen);
  };

  return (
    <div className="app-content body-app-content">
      <div className="job-search job-list-child">
        <div className="job-search-top-row">
          <button className="button-element job-search-refresh" onClick={getJobList}>
            <img className="job-search-icon refresh-button-icon" src={refresh} />
          </button>
          <input
            type="text" 
            className="job-search-field" 
            placeholder="Search for a Company"
            value={searchFieldText}
            onChange={handleTextInput}
          />
          {searchFieldText && (
            <button className="job-search-clear-text" onClick={clearSearchField}>
              <img className="job-search-icon clear-text-icon" src={clear} />
            </button>
          )}
          <button 
            className={filtersOpen ? "job-search-filter button-element job-search-filter-open" : "job-search-filter button-element"} 
            onClick={toggleFiltersOpen}>
            <img src={filter} className="job-search-icon filter-button-icon" />
          </button>
          <button className="job-search-submit button-element">
            <img src={search} className="job-search-icon filter-button-icon" />
          </button>
        </div>
        {filtersOpen && (
          <div className="job-item-filter-list job-list-child">
            {/* Add filters here */}
          </div>
        )}
      </div>
      <div className="job-item-container job-list-child">
      <div className="job-item-main-legend">
        <p>Company Name</p>
        <p>Job Board</p>
        <p>Status</p>
        <p>Date Applied</p>
      </div>
        {Object.entries(groupedJobs).map(([weekStart, jobs]) => (
          <div key={weekStart} className="week-section">
            <p className="week-divider">{weekStart}</p>
            <div className="job-item-legend">
            </div>
            {jobs.map((item) => {
              const formattedDate = item.applied_date 
                ? new Date(item.applied_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })
                : "N/A";

              return (
                <JobItem 
                  key={item.id}
                  id={item.id}
                  companyName={item.company_name}
                  jobBoard={item.job_board}
                  notes={item.notes}
                  createdAt={item.created_at}
                  appliedDate={formattedDate}
                  deleteApplication={deleteApplication} 
                  updateApplication={updateApplication}
                  heardBack={item.heard_back}
                  customLetter={item.custom_cover_letter}
                  applicationStatus={item.status}
                  applicationStatusOptions={applicationStatusOptions}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobList;
import React, { useState, useEffect } from "react";
import "./JobList.css";
import JobItem from "./JobItem";
import search from "./assets/search.svg";
import filter from "./assets/filter.svg";
import clear from "./assets/clear.svg";
import refresh from "./assets/refresh.svg";

function JobList({ jobList, getJobList, deleteApplication, updateApplication }) {
  const [searchFieldText, setSearchFieldText] = useState("");

  const handleTextInput = (e) => {
    e.preventDefault();

    setSearchFieldText(e.target.value);
  }

  const clearSearchField = () => {
    setSearchFieldText("");
  }

  return(
    <div className="app-content job-list">
      <div className="job-search">
        <button className="button-element job-search-refresh" onClick={getJobList}>
          <img className="job-search-icon refresh-button-icon" src={refresh} />
        </button>
        <input
          ype="text" 
          className="job-search-field" 
          placeholder="Search"
          value={searchFieldText}
          onChange={handleTextInput}/>
        {searchFieldText && searchFieldText.length && (
          <button className="job-search-clear-text">
            <img 
              className="job-search-icon clear-text-icon" 
              src={clear}
              onClick={clearSearchField}/>
          </button>
        )}
        <button className="job-search-submit button-element">
          <img src={search} className="job-search-icon filter-button-icon" />
        </button>
      </div>
      <div className="job-item-container">
        <div className="job-item-legend">
          <div className="job-item-main-legend">
            <p>Company Name</p>
            <p>Job Board</p>
            <p>Status</p>
            <p>Date Applied</p>
          </div>
        </div>
          {jobList.map(item => {
            let formattedDate;

            if (item.created_at.includes(item.applied_date)) {
              formattedDate = new Date(item.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
              });
            } else {
              formattedDate = item.applied_date 
              ? new Date(item.applied_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
              })
              : "N/A";
            }
            return (
              <JobItem 
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
                applicationStatus={item.status}/>
            )
          })
        }
      </div>
    </div>
  )
}

export default JobList;
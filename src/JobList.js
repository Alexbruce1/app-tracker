import React, { useState, useEffect } from "react";
import "./JobList.css";
import JobItem from "./JobItem";
import search from "./assets/search.svg";
import filter from "./assets/filter.svg";
import refresh from "./assets/refresh.svg";

function JobList({ jobList, getJobList }) {

  return(
    <div className="app-content job-list">
      <div className="job-search">
        <button className="button-element job-search-refresh" onClick={getJobList}>
          <img className="job-search-icon refresh-button-icon" src={refresh} />
        </button>
        <input
          ype="text" 
          className="job-search-field" 
          placeholder="Search" />
        <button 
          type="button" 
          className="job-search-submit button-element">
            <img src={search} className="job-search-icon filter-button-icon" />
          </button>
      </div>
      <div className="job-item-container">
        <div className="job-item-legend">
          <p>Company Name</p>
          <p>Job Board</p>
          <p>Date Applied</p>
        </div>
        {jobList.length && (
          jobList.map(item => {
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
                companyName={item.company_name}
                jobBoard={item.job_board}
                notes={item.notes}
                createdAt={item.created_at}
                appliedDate={formattedDate} />
            )
          })
        )}
      </div>
    </div>
  )
}

export default JobList;
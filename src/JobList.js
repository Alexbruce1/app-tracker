import React, { useState, useEffect } from "react";
import "./JobList.css";

function JobList() {
  return(
    <div className="app-content job-list">
      <div className="job-search">
        <input
          ype="text" 
          className="job-search-field" 
          placeholder="Search" />
        <input 
          type="button" 
          className="job-search-submit"
          value=">" />
      </div>
      Job List
    </div>
  )
}

export default JobList;
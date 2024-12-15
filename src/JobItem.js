import { useState } from "react";
import clear from "./assets/clear.svg";
import caret from "./assets/caret.svg";
import "./JobItem.css";

function JobItem({ id, companyName, jobBoard, notes, createdAt, appliedDate, deleteApplication }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpansion = () => {
    setIsExpanded(!isExpanded)
  }

  const handleDeletePress = () => {
    const userConfirmed = window.confirm(`Are you sure you want to delete "${companyName}"?`);
    if (userConfirmed) {
      deleteApplication(id);
    }
  }

  return (
    <div 
      className="job-item" 
      key={id}>
      <div className="job-item-top-row">
        <div className="caret-container">
          <img 
            className={isExpanded ? "job-search-icon job-item-caret job-item-caret-expanded" : "job-search-icon job-item-caret"} 
            src={caret} 
            onClick={handleExpansion}/>
        </div>
        <div className="job-item-inner-container">
          <p className="job-item-company">{companyName}</p>
          <p className="job-item-board">{jobBoard}</p>
          <p className="job-item-applied-date">{appliedDate}</p>
        </div>
      </div>
    </div>
  )
}

export default JobItem;
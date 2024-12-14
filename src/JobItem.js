import { useState } from "react";
import clear from "./assets/clear.svg";
import "./JobItem.css";

function JobItem({ id, companyName, jobBoard, notes, createdAt, appliedDate, deleteApplication }) {

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
    <div className="job-item-inner-container">
      <p className="job-item-company">{companyName}</p>
      <p className="job-item-board">{jobBoard}</p>
      <p className="job-item-applied-date">{appliedDate}</p>
    </div>
  </div>
  )
}

export default JobItem;
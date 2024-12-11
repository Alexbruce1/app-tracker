import { useState } from "react";
import clear from "./assets/clear.svg";
import "./JobItem.css";

function JobItem({ id, companyName, jobBoard, notes, createdAt, appliedDate, setItemHover, itemHover, deleteApplication }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setItemHover(true);
    setIsHovered(true);
  }

  const handleMouseLeave = () => {
    setItemHover(false);
    setIsHovered(false);
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
    key={id}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}>
      <div className="job-item-inner-container">
        <p className="job-item-company">{companyName}</p>
        <p className="job-item-board">{jobBoard}</p>
        <p className="job-item-applied-date">{appliedDate}</p>
      </div>
      {isHovered ? (
        <button className="delete-item-button" onClick={handleDeletePress}>
          <img className="delete-record-icon" src={clear} />
        </button>
      ) : itemHover ? (
        <div className="hover-active-space"></div>
      ) : null}
    </div>
  )
}

export default JobItem;
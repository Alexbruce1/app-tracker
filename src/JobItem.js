import { useState, useEffect } from "react";
import clear from "./assets/clear.svg";
import caret from "./assets/caret.svg";
import "./JobItem.css";

function JobItem({ id, companyName, jobBoard, notes, createdAt, appliedDate, deleteApplication, updateApplication, heardBack }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newNotes, setNewNotes] = useState(notes);
  const [updateHeardBack, setUpdateHeardBack] = useState(heardBack);

  useEffect(() => {
    setNewNotes(notes)
  }, [notes])

  const handleExpansion = () => {
    setIsExpanded(!isExpanded)
  }

  const handleDeletePress = () => {
    const userConfirmed = window.confirm(`Are you sure you want to delete "${companyName}"?`);
    if (userConfirmed) {
      deleteApplication(id);
    }
  }

  const handleCheckboxChange = e => {
    const checked = e.target.checked;
    setUpdateHeardBack(checked);

    handleHeardBackUpdate(e.target.name);
  }

  const updateNotes = e => {
    setNewNotes(e.target.value)
  }

  const handleNotesUpdate = e => {
    const [ name ] = e.target;
    updateApplication(id, name, newNotes);
  }

  const handleHeardBackUpdate = name => {
    updateApplication(id, name, !updateHeardBack);
  };

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
          <p className="job-item-company" onClick={handleExpansion}>{companyName}</p>
          <p className="job-item-board">{jobBoard}</p>
          <p className="job-item-applied-date">{appliedDate}</p>
        </div>
      </div>
      {isExpanded && (
        <div className="job-item-bottom-row">
          <div className="job-item-bottom-row-field-container">
            <div className="job-item-bottom-row-field heard-back">
              <label className="custom-checkbox">
                <input 
                  type="checkbox" 
                  name="heard_back"
                  onChange={handleCheckboxChange}
                  checked={updateHeardBack}
                  />
                <span className="checkbox"></span>
              </label>

              <p className="heard-back-text">Heard back</p>
            </div>
            <select className="status-dropdown">
              <option>Application Status</option>
              <option>Haven't heard back</option>
              <option>Interviewing</option>
              <option>Offer</option>
              <option>Declined</option>
            </select>
            <div className="job-item-notes-container">
              <input 
                type="text" 
                placeholder="Notes" 
                className="job-item-notes" 
                value={newNotes}
                onChange={updateNotes}/>
              <button 
                className="job-item-notes-submit button-element" 
                onClick={handleNotesUpdate}
                name="notes">Update</button>
            </div>
            <button className="delete-item-button" onClick={handleDeletePress}>
              <img className="delete-record-icon" src={clear} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobItem;
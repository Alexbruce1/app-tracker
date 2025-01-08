import { useState, useEffect } from "react";
import clear from "./assets/clear.svg";
import caret from "./assets/caret.svg";
import "./JobItem.css";

function JobItem({ id, companyName, jobBoard, notes, createdAt, appliedDate, deleteApplication, updateApplication, heardBack, customLetter, applicationStatus, applicationStatusOptions }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newNotes, setNewNotes] = useState(notes);
  const [notesUpdated, setNotesUpdated] = useState(notes);
  const [updateHeardBack, setUpdateHeardBack] = useState(heardBack);
  const [customCoverLetter, setCustomCoverLetter] = useState(customLetter);
  const [appStatus, setAppStatus] = useState(applicationStatus);

  useEffect(() => {
    setNewNotes(notes);
    setAppStatus(applicationStatus);
  }, [notes, applicationStatus]);

  const handleExpansion = () => {
    setIsExpanded(!isExpanded)
  }

  const handleDeletePress = () => {
    const userConfirmed = window.confirm(`Are you sure you want to delete "${companyName}"?`);
    if (userConfirmed) {
      deleteApplication(id);
    }
  }

  const handleFieldUpdates = e => {
    e.stopPropagation();
    const name = e.target.name;
    const value = e.target.value;

    if (name === "status") {      
      // If the user doesn't select "Application Status" or "Haven't heard back", set the updateHeardBack state to true
      if (value !== applicationStatusOptions[0] & value !== applicationStatusOptions[1]) {
        setUpdateHeardBack(true);
        handleAppUpdate(id, "heard_back", true);
      } else if (value === applicationStatusOptions[1]) {
        setUpdateHeardBack(false);
        handleAppUpdate(id, "heard_back", false);
      }
      setAppStatus(value);

      if (value === "Application Status") {
        handleAppUpdate(id, name, "");
      } else {
        handleAppUpdate(id, name, value);
      }

      // If heard_back is adjusted, update state and handle the DB update
    } else if (name === "heard_back") {
      setUpdateHeardBack(prevState => {
        const newState = !prevState;
        handleAppUpdate(id, name, newState);
        return newState;
      });

      // If notes are updated, handle the DB update
    } else if (name === "notes") {
      handleAppUpdate(id, "notes", newNotes);
      setNotesUpdated(true);
      setTimeout(() => {
        setNotesUpdated(false);
      }, 2000);

      // If custom_cover_letter is adjusted, update state and handle the DB update
    } else if (name === "custom_cover_letter") {
      setCustomCoverLetter(prevState => {
        const newState = !prevState;
        handleAppUpdate(id, name, newState);
        return newState;
      });
    }
  };

  const handleAppUpdate = (id, name, value) => {
    updateApplication(id, name, value);

    if (name === "status") {
      setIsExpanded(false);
    }
  };

  const updateNotes = e => {
    setNewNotes(e.target.value)
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
          <p className="job-item-company" onClick={handleExpansion}>{companyName}</p>
          <p className="job-item-board">{jobBoard}</p>
          {isExpanded && (
            <select 
              className="status-dropdown job-item-status" 
              onChange={handleFieldUpdates} 
              name="status"
              value={appStatus || "Application Status"}>
                {applicationStatusOptions.map(option => {
                  return <option key={option} value={option}>{option}</option>
                })}
            </select>
          )}
          {!isExpanded && (
            <p className="job-item-status">{
              appStatus === applicationStatusOptions[0] ? "-" : 
              appStatus === applicationStatusOptions[1] ? "-" : 
              !appStatus ? "-" :
              appStatus}</p>
          )}
          <p className="job-item-applied-date">{appliedDate}</p>
        </div>
      </div>
      {isExpanded && (
        <div className="job-item-bottom-row">
          <div className="job-item-bottom-row-field-container">
            <div className="job-item-bottom-row-field custom-cover-letter">
              <label className="custom-checkbox">
                <input 
                  type="checkbox" 
                  name="custom_cover_letter"
                  onChange={handleFieldUpdates}
                  checked={customCoverLetter}
                  />
                <span className="checkbox"></span>
              </label>
              <p className="custom-letter-text">Custom Cover Letter</p>
            </div>
            <div className="job-item-notes-container">
              <input 
                type="text" 
                placeholder="Notes" 
                className="job-item-notes" 
                value={newNotes}
                onChange={updateNotes}/>
              <button 
                className={notesUpdated ? "job-item-notes-submit button-element job-item-notes-submit-updated" : "job-item-notes-submit button-element"} 
                onClick={handleFieldUpdates}
                name={"notes"}>{notesUpdated ? "Saved" : "Update"}</button>
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
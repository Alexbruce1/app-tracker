import { useState, useEffect } from "react";
import clear from "./assets/clear.svg";
import caret from "./assets/caret.svg";
import check from "./assets/check.svg";
import copy from "./assets/copy.svg";
import "./JobItem.css";

function JobItem({ 
  id, 
  companyName, 
  jobBoard, 
  notes, 
  createdAt, 
  appliedDate,
  recentCommunication, 
  deleteApplication, 
  updateApplication, 
  heardBack, 
  customLetter, 
  applicationStatus, 
  certified,
  applicationStatusOptions,
  mobileWidthCutoff,
  recentCommunicationOptions,
  getJobList
}) {
    
  const [isExpanded, setIsExpanded] = useState(false);
  const [newNotes, setNewNotes] = useState(notes);
  const [notesUpdated, setNotesUpdated] = useState(notes);
  const [updateHeardBack, setUpdateHeardBack] = useState(heardBack);
  const [customCoverLetter, setCustomCoverLetter] = useState(customLetter);
  const [appStatus, setAppStatus] = useState(applicationStatus);
  const [recentCommunicationStatus, setRecentCommunicationStatus] = useState(recentCommunication);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const displayedJobBoard = (jobBoard === "Welcome To The Jungle" && windowWidth < mobileWidthCutoff) ? "WTTJ" : jobBoard;
  const formattedDate = (windowWidth < mobileWidthCutoff) ? new Date(appliedDate).toLocaleDateString("en-US", {
    year: "2-digit",
    month: "numeric",
    day: "numeric",
  }) : new Date(appliedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  
  useEffect(() => {
    setNewNotes(notes);
    setAppStatus(applicationStatus);
  }, [notes, applicationStatus]);

  useEffect(() => {
    setRecentCommunicationStatus(recentCommunication);
  }, [recentCommunication]);

  const handleExpansion = (e) => {
    e.stopPropagation(); 

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

  const updateInterviewSteps = e => {
    const value = e.target.value;
    setRecentCommunicationStatus(value);
    handleAppUpdate(id, "recent_communication", value);
  }

  const handleCopyIconClick = e => {
    e.stopPropagation();
    navigator.clipboard.writeText(companyName);
    
    handleAppUpdate(id, "coui_certified", true);

    setTimeout(() => {
      getJobList();
    }, 500);

  }

  return (
    <div 
      className={isExpanded ? "job-item job-item-expanded" : "job-item"}
      key={id}
      name="expand">
      <div className="job-item-top-row">
        <div className="caret-container" onClick={e => handleExpansion(e)}>
          <img 
            className={isExpanded ? "job-search-icon job-item-caret job-item-caret-expanded" : "job-search-icon job-item-caret"} 
            src={caret}/>
        </div>
        <div className="job-item-inner-container">
          <p className={certified ? "job-item-company job-item-company-certified" : "job-item-company"} onClick={e => handleExpansion(e)}>
            {certified && (
                <img className="job-item-certified-icon" src={check} />
            )}
            {companyName}
          </p>
          {(!isExpanded || windowWidth > mobileWidthCutoff) && (
            <p className="job-item-board" onClick={e => handleExpansion(e)}>{displayedJobBoard}</p>
          )}
          {isExpanded && windowWidth > mobileWidthCutoff && (
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
          {!isExpanded && windowWidth > mobileWidthCutoff && (
            <p className="job-item-status" onClick={e => handleExpansion(e)}>{
              appStatus === applicationStatusOptions[0] ? "-" : 
              appStatus === applicationStatusOptions[1] ? "-" : 
              !appStatus ? "-" :
              appStatus}</p>
          )}
          <p className="job-item-applied-date" onClick={e => handleExpansion(e)}>
            {!certified && (
              <img className="job-item-copy-icon" src={copy} onClick={handleCopyIconClick} title="Copy the company name & certify on COUI" />
            )}
            {formattedDate}
          </p>
        </div>
      </div>
      {isExpanded && (
        <div className="job-item-bottom-row">
          <div className="job-item-middle-row-field-container">
            <div className="job-item-bottom-row-field custom-cover-letter">
              <label className="custom-checkbox">
                <input 
                  type="checkbox" 
                  name="custom_cover_letter"
                  onChange={handleFieldUpdates}
                  checked={customCoverLetter}/>
                <span className="checkbox"></span>
              </label>
              <p className="custom-letter-text">Custom Cover Letter</p>
            </div>
            {windowWidth < mobileWidthCutoff && (
              <select 
                className="status-dropdown job-item-status" 
                onChange={handleFieldUpdates} 
                name="status"
                value={appStatus || "Application Status"}>
                  {applicationStatusOptions.map((option, index) => {
                    return <option key={index} value={option}>{option}</option>
                  })}
              </select>
            )}
            <select 
              className="interview-steps-dropdown" 
              value={recentCommunicationStatus || recentCommunicationOptions[0]} 
              onChange={updateInterviewSteps}
              name="recent_communication">
              {recentCommunicationOptions.map((option, index) => {
                return <option key={index} value={option}>{option}</option>
              })}
            </select>

            {windowWidth > mobileWidthCutoff && (
              <button className="delete-item-button" onClick={handleDeletePress}>
                <img className="delete-record-icon" src={clear} />
              </button>
            )}
          </div>
          <div className="job-item-bottom-row-field-container">
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
            {windowWidth < mobileWidthCutoff && (
              <button className="delete-item-button" onClick={handleDeletePress}>
                <img className="delete-record-icon" src={clear} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default JobItem;
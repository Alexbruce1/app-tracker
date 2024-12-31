import { useEffect, useState } from 'react';
import './Stats.css';

function Stats({ jobList }) {
  const [customCoverLetterCount, setCustomCoverLetterCount] = useState(0);
  const [heardBackCount, setHeardBackCount] = useState(0);
  const [haventHeardBackCount, setHaventHeardBackCount] = useState(0);
  const [BuiltInCount, setBuiltInCount] = useState(0);
  const [IndeedCount, setIndeedCount] = useState(0);
  const [LinkedInCount, setLinkedInCount] = useState(0);


  useEffect(() => {
    const customCoverLetterCount = jobList.filter(job => job.custom_cover_letter).length;
    const heardBackCount = jobList.filter(job => job.heard_back).length;
    const builtin = jobList.filter(job => job.job_board === "BuiltIn").length;
    const indeed = jobList.filter(job => job.job_board === "Indeed").length;
    const linkedin = jobList.filter(job => job.job_board === "LinkedIn").length;

    setCustomCoverLetterCount(customCoverLetterCount);
    setHeardBackCount(heardBackCount);
    setHaventHeardBackCount(jobList.length - heardBackCount);
    setBuiltInCount(builtin);
    setIndeedCount(indeed);
    setLinkedInCount(linkedin);

  }, [jobList]);

  return (
    <div className="stats-section app-content body-app-content">
      <h2 className="stats-title">Stats</h2>
      <div className="stat-container">
        <p className="stat-title">
          Custom Cover Letters
        </p> 
        <p className="stat-count">
          {customCoverLetterCount}
        </p>
      </div>
      <div className="stat-container">
        <p className="stat-title">
          Heard Back
        </p> 
        <p className="stat-count">
          {heardBackCount}
        </p>
      </div>
      <div className="stat-container">
        <p className="stat-title">
          Haven't Heard Back
        </p> 
        <p className="stat-count">
          {haventHeardBackCount}
        </p>
      </div>
      <div className="stat-container">
        <p className="stat-title">
          BuiltIn Applications
        </p> 
        <p className="stat-count">
          {BuiltInCount}
        </p>
      </div>
      <div className="stat-container">
        <p className="stat-title">
          Indeed Applications
        </p> 
        <p className="stat-count">
          {IndeedCount}
        </p>
      </div>
      <div className="stat-container">
        <p className="stat-title">
          LinkedIn Applications
        </p> 
        <p className="stat-count">
          {LinkedInCount}
        </p>
      </div>
    </div>
  );
}

export default Stats;
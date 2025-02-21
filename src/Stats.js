import { useEffect, useState } from 'react';
import './Stats.css';

function Stats({ jobList }) {
  const [customCoverLetterCount, setCustomCoverLetterCount] = useState(0);
  const [heardBackCount, setHeardBackCount] = useState(0);
  const [haventHeardBackCount, setHaventHeardBackCount] = useState(0);
  const [BuiltInCount, setBuiltInCount] = useState(0);
  const [IndeedCount, setIndeedCount] = useState(0);
  const [LinkedInCount, setLinkedInCount] = useState(0);
  const [wttjCount, setWttjCount] = useState(0);
  const [jobCount, setJobCount] = useState(0);
  const [statusDeclined, setStatusDeclined] = useState(0);

  useEffect(() => {
    const jobCount = jobList.length;
    const customCoverLetterCount = jobList.filter(job => job.custom_cover_letter).length;
    const heardBackCount = jobList.filter(job => job.heard_back).length;
    const builtin = jobList.filter(job => job.job_board === "BuiltIn").length;
    const indeed = jobList.filter(job => job.job_board === "Indeed").length;
    const linkedin = jobList.filter(job => job.job_board === "LinkedIn").length;
    const wttj = jobList.filter(job => job.job_board === "Welcome To The Jungle").length;
    const declined = jobList.filter(job => job.status === "Declined").length;

    setCustomCoverLetterCount(customCoverLetterCount);
    setHeardBackCount(heardBackCount);
    setHaventHeardBackCount(jobList.length - heardBackCount);
    setBuiltInCount(builtin);
    setIndeedCount(indeed);
    setLinkedInCount(linkedin);
    setWttjCount(wttj);
    setJobCount(jobCount);
    setStatusDeclined(declined);

  }, [jobList]);

  return (
    <div className="stats-section app-content body-app-content">
      <h2 className="stats-title">Stats</h2>
      <div className="stats-progress-bar">
        {haventHeardBackCount > 0 && (
          <div className="stats-progress-bar-havent-heard-back" style={{ width: `${(haventHeardBackCount / jobCount) * 100}%` }}>
            {((haventHeardBackCount / jobCount) * 100).toFixed(0)}%
          </div>
        )}
        {statusDeclined > 0 && (
          <div className="stats-progress-bar-declined" style={{ width: `${(statusDeclined / jobCount) * 100}%` }}>
            {((statusDeclined / jobCount) * 100).toFixed(0)}%
          </div>
        )}
      </div>
      <div className="stats-jobs">
        <div className="stats-count-text">
          <p className="stats-count-p stats-count-bold">
            {jobCount} 
          </p>
          <p className="stats-count-p">
            Jobs Applied For
          </p>
        </div>
        <div className="stats-count-text">
          <p className="stats-count-p stats-count-bold">
            {heardBackCount} 
          </p>
          <p className="stats-count-p">
            Heard Back ({ (heardBackCount / jobCount).toFixed(3) * 100 }%)
          </p>
        </div>
        <div className="stats-count-text">
          <p className="stats-count-p stats-count-bold">
            {customCoverLetterCount} 
          </p>
          <p className="stats-count-p">
            Custom Cover Letters
          </p>
        </div>
      </div>
      <div className="stats-job-boards">
        <div className="stats-count-text">
          <p className="stats-count-p">
            Job Board split:
          </p>
        </div>
        <ul className="stats-count-p stats-count-job-boards">
          <li className="job-board-li">
            BuiltIn:
            <p className="stats-count-bold">
              {(BuiltInCount / jobCount * 100).toFixed(1)}%
            </p>
          </li>
          <li className="job-board-li">
            Indeed:
            <p className="stats-count-bold">
              {(IndeedCount / jobCount * 100).toFixed(1)}%
            </p>
          </li>
          <li className="job-board-li">
            LinkedIn:
            <p className="stats-count-bold">
              {(LinkedInCount / jobCount * 100).toFixed(1)}%
            </p>
          </li>
          <li className="job-board-li">
            Welcome To The Jungle:
            <p className="stats-count-bold">
              {(wttjCount / jobCount * 100).toFixed(1)}%
            </p>
          </li>
          <li className="job-board-li">
            Other:
            <p className="stats-count-bold">
              {((jobCount - BuiltInCount - IndeedCount - LinkedInCount) / jobCount * 100).toFixed(2)}%
            </p>
          </li>
        </ul>
      </div>

    </div>
  );
}

export default Stats;
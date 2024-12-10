import "./JobItem.css";

function JobItem({ key, companyName, jobBoard, notes, createdAt, appliedDate }) {
  return (
    <div className="job-item">
      <p className="job-item-company">{companyName}</p>
      <p className="job-item-board">{jobBoard}</p>
      <p className="job-item-applied-date">{appliedDate}</p>
    </div>
  )
}

export default JobItem;
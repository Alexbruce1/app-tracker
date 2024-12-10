import "./JobItem.css";

function JobItem({ key, companyName, jobBoard, notes, createdAt, appliedDate }) {
  // const formattedDate = appliedDate ? new Date(appliedDate).toISOString().split("T")[0] : "N/A";

  return (
    <div className="job-item">
      <p className="job-item-company">{companyName}</p>
      <p className="job-item-board">{jobBoard}</p>
      <p className="job-item-applied-date">{appliedDate}</p>
      {/* <p className="job-item-applied-date">{formattedDate}</p> */}
    </div>
  )
}

export default JobItem;
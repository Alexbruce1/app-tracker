import React, { useState } from "react";
import "./JobList.css";
import caret from "./assets/caret.svg";
import JobItem from "./JobItem";
import search from "./assets/search.svg";
import filter from "./assets/filter.svg";
import clear from "./assets/clear.svg";
import refresh from "./assets/refresh.svg";

function JobList({ 
  jobList, 
  getJobList, 
  deleteApplication, 
  updateApplication, 
  filterResultsByCompanyName, 
  applicationStatusOptions, 
  submitResultsSearch, 
  clearResultsSearch }) {
    
  const [searchFieldText, setSearchFieldText] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [resultsPage, setResultsPage] = useState(1);
  const [resultsShown] = useState(10);

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());

  const thisWeekJobs = jobList.filter((job) => {
    const appliedDate = new Date(job.applied_date || job.created_at);
    return appliedDate >= startOfWeek;
  });

  const previousJobs = jobList.filter((job) => {
    const appliedDate = new Date(job.applied_date || job.created_at);
    return appliedDate < startOfWeek;
  });

  const categorizedJobs = [
    ...(thisWeekJobs.length > 0 ? [{ isDivider: true, label: "This Week", jobs: thisWeekJobs }] : []),
    { isDivider: true, label: "Previous Weeks", jobs: previousJobs },
  ].flatMap((category) => [category, ...category.jobs]);

  const startIndex = (resultsPage - 1) * resultsShown;
  const endIndex = startIndex + resultsShown;
  const paginatedJobs = categorizedJobs.slice(startIndex, endIndex);

  const handleTextInput = (e) => {
    e.preventDefault();
    setSearchFieldText(e.target.value);

    filterResultsByCompanyName(e.target.value);
  };

  const clearSearchField = () => {
    setSearchFieldText("");
    clearResultsSearch();
  };

  const toggleFiltersOpen = () => {
    setFiltersOpen(!filtersOpen);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    submitResultsSearch(searchFieldText.toLowerCase());
  }

  const totalPages = Math.ceil(categorizedJobs.length / resultsShown);

  return (
    <div className="app-content body-app-content">
      <div className="job-search job-list-child">
        <form 
          className="job-search-top-row" 
          onSubmit={submitSearch}>
          <button className="button-element job-search-refresh" onClick={getJobList}>
            <img className="job-search-icon refresh-button-icon" src={refresh} />
          </button>
          <input
            type="text"
            className="job-search-field"
            placeholder="Search for a Company"
            value={searchFieldText}
            onChange={handleTextInput}
          />
          {searchFieldText && (
            <button className="job-search-clear-text" onClick={clearSearchField}>
              <img className="job-search-icon clear-text-icon" src={clear} />
            </button>
          )}
          <button
            className={filtersOpen ? "job-search-filter button-element job-search-filter-open" : "job-search-filter button-element"}
            onClick={toggleFiltersOpen}>
            <img src={filter} className="job-search-icon filter-button-icon" />
          </button>
          <button className="job-search-submit button-element">
            <img src={search} className="job-search-icon filter-button-icon" />
          </button>
        </form>
        {filtersOpen && (
          <div className="job-item-filter-list job-list-child">
            {/* Add filters here */}
          </div>
        )}
      </div>
      <div className="job-item-container job-list-child">
        <div className="job-item-main-legend">
          <p>Company Name</p>
          <p>Job Board</p>
          <p>Status</p>
          <p>Date Applied</p>
        </div>
        {paginatedJobs.map((item, index) => {
          if (item.isDivider) {
            return (
              <div key={`divider-${item.label}-${index}`} className="week-section">
                <h3 className="week-divider">{item.label}</h3>
              </div>
            );
          }

          const formattedDate = item.applied_date
            ? new Date(item.applied_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "N/A";

          return (
            <JobItem
              key={item.id}
              id={item.id}
              companyName={item.company_name}
              jobBoard={item.job_board}
              notes={item.notes}
              createdAt={item.created_at}
              appliedDate={formattedDate}
              deleteApplication={deleteApplication}
              updateApplication={updateApplication}
              heardBack={item.heard_back}
              customLetter={item.custom_cover_letter}
              applicationStatus={item.status}
              applicationStatusOptions={applicationStatusOptions}
            />
          );
        })}
      </div>
      {totalPages > 1 && (
        <div className="job-list-page-controls">
          <div 
            className={resultsPage > 1 ? "job-list-page-control-button" : "job-list-page-control-button-hidden job-list-page-control-button"} 
            onClick={() => setResultsPage((prev) => Math.max(prev - 1, 1))}>
            <img 
              src={caret} 
              className="job-list-page-control-caret caret-left"/>
          </div>
          <div className="job-list-page-control-button">{resultsPage}</div>
          <div 
            className={resultsPage < totalPages ? "job-list-page-control-button" : "job-list-page-control-button-hidden job-list-page-control-button"} 
            onClick={() => setResultsPage((prev) => Math.min(prev + 1, totalPages))}>
            <img 
              src={caret} 
              className="job-list-page-control-caret"/>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobList;
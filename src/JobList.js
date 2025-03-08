import React, { useState, useEffect } from "react";
import "./JobList.css";
import JobItem from "./JobItem";
import JobListSearch from "./JobListSearch";
import caret from "./assets/caret.svg";
import doubleCaret from "./assets/double-caret.svg";
import search from "./assets/search.svg";
import filter from "./assets/filter.svg";
import clear from "./assets/clear.svg";
import refresh from "./assets/refresh.svg";

function JobList({ 
  jobList, 
  getJobList, 
  jobBoards,
  deleteApplication, 
  updateApplication, 
  filterResultsByCompanyName, 
  filterExistingResults, 
  applicationStatusOptions, 
  clearResultsSearch,
  filterJobsByJobBoard,
  waitingOnFetch,
  statusFilter,
  setStatusFilter }) {
    
  const [searchFieldText, setSearchFieldText] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [resultsPage, setResultsPage] = useState(1);
  const [resultsShown, setResultsShown] = useState(10);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [filteredByJobBoard, setFilteredByJobBoard] = useState(false);

  const mobileWidthCutoff = 860;
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    setSearchFieldText(e.target.value);
    filterExistingResults(e.target.value.toLowerCase());
  };
  
  const clearSearchField = () => {
    setSearchFieldText("");
    clearResultsSearch();

    handleTextInput({ target: { value: "" } });
  };
  
  const toggleFiltersOpen = () => {
    setFiltersOpen(!filtersOpen);
  };
  
  const submitSearch = (e) => {
    e.preventDefault();
    
    filterResultsByCompanyName(e.target.value);
  }

  const handleResultsShownChange = (e) => {
    setResultsShown(parseInt(e.target.value));
    setResultsPage(1);
  }

  const handleJobBoardFilter = (e) => {
    if (e.target.value === "Job Board") {
      setFilteredByJobBoard(false);
    } else {
      setFilteredByJobBoard(true);
    }

    filterJobsByJobBoard(e.target.value);
  }

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  }

  const clearFilters = () => {
    setStatusFilter("All");
  }

  const totalPages = Math.ceil(categorizedJobs.length / resultsShown);

  return (
    jobList.length === 0 ? (
      <div className="app-content body-app-content">
        <div className="job-search job-list-child">
          <JobListSearch
            submitSearch={submitSearch}
            getJobList={getJobList}
            refresh={refresh}
            searchFieldText={searchFieldText}
            handleTextInput={handleTextInput}
            clearSearchField={clearSearchField}
            clear={clear} 
            filtersOpen={filtersOpen}
            toggleFiltersOpen={toggleFiltersOpen}
            filter={filter}
            search={search}
          />
        </div>
        <div className="job-search-no-results">
          {waitingOnFetch ? (
            <h3 className="no-results-header">
              Loading jobs...
            </h3>
            ) : (
            <h3 className="no-results-header">
              No results found...
            </h3>
          )}
        </div>
      </div>
    ) : (
      <div className="app-content body-app-content">
        <div className="job-search job-list-child">
          <JobListSearch
            submitSearch={submitSearch}
            getJobList={getJobList}
            refresh={refresh}
            searchFieldText={searchFieldText}
            handleTextInput={handleTextInput}
            clearSearchField={clearSearchField}
            clear={clear} 
            filtersOpen={filtersOpen}
            toggleFiltersOpen={toggleFiltersOpen}
            filter={filter}
            search={search}
          />
          {filtersOpen && (
            <div className="job-item-filter-list job-list-child">
              <div className="results-filter">
                <label className="filter-label">Results shown</label>
                <select 
                  className="results-shown-select"
                  onChange={handleResultsShownChange} 
                  value={resultsShown}>
                  <option className="results-shown-option" value={10}>10</option>
                  <option className="results-shown-option" value={20}>20</option>
                  <option className="results-shown-option" value={100}>100</option>
                </select>
              </div>
              <div className="results-filter">
                <label className="filter-label">Only show</label>
                <select 
                  className="results-shown-select"
                  onChange={handleStatusFilterChange} 
                  value={statusFilter}>
                  <option className="results-shown-option" default value={"All"}>All</option>
                  <option className="results-shown-option" value={"Haven't heard back"}>Haven't heard back</option>
                  <option className="results-shown-option" value={"In Progress"}>In Progress</option>
                  <option className="results-shown-option" value={"Declined"}>Declined</option>
                </select>
              </div>
              <div className="results-filter">
                <button className="filter-button button-element" onClick={clearFilters}>Clear Filters</button>
              </div>
            </div>
          )}
        </div>
        <div className="job-item-container job-list-child">
          <div className="job-item-main-legend">
            <p className="job-list-company-name">Company Name {filteredByJobBoard && <strong>{jobList.length}</strong>}</p>
            <select onChange={handleJobBoardFilter} className="job-list-job-board">
              {jobBoards && jobBoards.map((job, index) => (
                <option default={job === "Job Board"} key={index}>{job}</option>
              ))}
            </select>
            {windowWidth > mobileWidthCutoff && <p className="job-list-status">Status</p> }
            <p className="job-list-date-applied">Date Applied</p>
          </div>
          {paginatedJobs.map((item, index) => {
            if (item.isDivider) {
              return (
                <div key={`divider-${item.label}-${index}`} className="week-section">
                  <h3 className="week-divider">{item.label}</h3>
                </div>
              );
            }

            return (
              <JobItem
                key={item.id}
                id={item.id}
                companyName={item.company_name}
                jobBoard={item.job_board}
                notes={item.notes}
                createdAt={item.created_at}
                appliedDate={item.applied_date}
                deleteApplication={deleteApplication}
                updateApplication={updateApplication}
                heardBack={item.heard_back}
                customLetter={item.custom_cover_letter}
                applicationStatus={item.status}
                applicationStatusOptions={applicationStatusOptions}
                mobileWidthCutoff={mobileWidthCutoff}
              />
            );
          })}
        </div>
        {totalPages > 1 && (
          <div className="job-list-page-controls">
            <div className={resultsPage > 1 ? "job-list-page-control-button" : "job-list-page-control-button-hidden job-list-page-control-button"}>
              <img 
                src={doubleCaret} 
                className="job-list-page-control-caret caret-left"
                onClick={() => setResultsPage(1)} />
            </div>
            <div 
              className={resultsPage > 1 ? "job-list-page-control-button" : "job-list-page-control-button-hidden job-list-page-control-button"} 
              onClick={() => setResultsPage((prev) => Math.max(prev - 1, 1))}>
              <img 
                src={caret} 
                className="job-list-page-control-caret caret-left"/>
            </div>
            <div className="job-list-page-control-button job-list-page-number">
              {resultsPage}
            </div>
            <div 
              className={resultsPage < totalPages ? "job-list-page-control-button" : "job-list-page-control-button-hidden job-list-page-control-button"} 
              onClick={() => setResultsPage((prev) => Math.min(prev + 1, totalPages))}>
              <img 
                src={caret} 
                className="job-list-page-control-caret"/>
            </div>
            <div className={resultsPage < totalPages ? "job-list-page-control-button" : "job-list-page-control-button-hidden job-list-page-control-button"}>
              <img 
                src={doubleCaret} 
                className="job-list-page-control-caret"
                onClick={() => setResultsPage(totalPages)} />
            </div>
          </div>
        )}
      </div>
    )
  );
}

export default JobList;
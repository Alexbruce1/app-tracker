import React from "react";

function JobListSearch({
  submitSearch,
  getJobList,
  refresh,
  searchFieldText,
  handleTextInput,
  clearSearchField,
  clear, 
  filtersOpen,
  toggleFiltersOpen,
  filter,
  search
}) {

  return (
    <form 
      className={filtersOpen ? "job-search-top-row job-search-top-row-open" : "job-search-top-row"} 
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
        type="button"
        className={filtersOpen ? "job-search-filter button-element job-search-filter-open" : "job-search-filter button-element"}
        onClick={toggleFiltersOpen}>
        <img src={filter} className="job-search-icon filter-button-icon" />
      </button>
      <button 
        className="job-search-submit button-element"
        onClick={submitSearch}>
        <img 
          src={search} 
          className="job-search-icon filter-button-icon" />
      </button>
    </form>
  )
}

export default JobListSearch;
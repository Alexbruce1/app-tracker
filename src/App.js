import { useState, useEffect } from 'react';
import './App.css';


function App() {
  const [currentDate, setCurrentDate] = useState("");
  
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setCurrentDate(today);
  }, []);

  const saveJob = e => {
    e.preventDefault();
  }

  return (
    <div className="App">
      <div className="app-header-background"></div>
      <div className="app-header-fade"></div>
      <div className="header">
        <h1>
          App-Tracker
        </h1>
      </div>
      <div className="application-form-outline">
        <form className="application-submit-form" onSubmit={saveJob}>
          <input 
            type="text" 
            placeholder="Company Applied To" 
            className="form-element company-field"
            autoComplete="off"/>
          <input 
            type="date" 
            placeholder="Date Applied" 
            className="form-element date-applied-field"
            defaultValue={currentDate}/>
          <input 
            type="text" 
            placeholder="Job Board Used" 
            className="form-element job-board-field"/>
          <input 
            type="submit" 
            value="Save Job" 
            className="form-element form-submit" />
        </form>
      </div>
    </div>
  );
}

export default App;

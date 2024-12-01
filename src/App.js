import './App.css';

const today = new Date();

function App() {
  return (
    <div className="App">
      <div className="header">
        <h1>
          App-Tracker
        </h1>
      </div>
      <div className="application-form-outline">
        <form className="application-submit-form">
          <input 
            type="text" 
            placeholder="Company Applied To" 
            className="form-element company-field"/>
          <input 
            type="date" 
            placeholder="Date Applied" 
            className="form-element date-applied-field"/>
          <input 
            type="text" 
            placeholder="Job Board Used" 
            className="form-element job-board-field"/>
          <input 
            type="button" 
            value="Save Job" 
            className="form-element form-submit" />
        </form>
      </div>
    </div>
  );
}

export default App;

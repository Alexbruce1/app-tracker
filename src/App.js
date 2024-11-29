import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>
        App-Tracker
      </h1>
      <form className="application-submit-form">
        <input 
          type="text" 
          placeholder="Company" 
          className="company-field"/>
        <input 
          type="date" 
          placeholder="Date Applied" 
          className="date-applied-field"/>
        <input 
          type="text" 
          placeholder="Job Board" 
          className="job-board-field"/>
      </form>
    </div>
  );
}

export default App;

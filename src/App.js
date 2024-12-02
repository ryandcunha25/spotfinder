import React from 'react';
// import LoginRegister from './Components/LoginRegister';
import "./Components/css/output.css"
import SignUp from './Components/SignUp';
import LoginPage from './Components/LoginPage';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from './Components/HomePage';



function App() {
  return (
    <Router>
       <Routes>
          <Route exact path="/" element={ <LoginPage />} />
          <Route  path="/signup" element={  <SignUp />} />      
          <Route  path="/homepage" element={  <HomePage />} />      
        </Routes>
    </Router>
  );
}

export default App;

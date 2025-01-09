import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./Components/css/output.css";
import SignUp from './Components/SignUp';
import LoginPage from './Components/LoginPage';
import HomePage from './Components/HomePage';
import Navbar from './Components/Navbar';
import Spots from './Components/Spots';
import VenueDetails from './Components/VenueDetails';
import Accounts from './Components/Accounts';
import Wishlist from './Components/Wishlist';
import AboutUs from './Components/AboutUs';
import ContactUs from './Components/ContactUs';
import TermsAndConditions from './Components/TermsAndConditions';
import PrivacyPolicy from './Components/PrivacyPolicy';

function AppContent() {
  const location = useLocation();

  // Define routes where the Navbar should not be displayed
  const noNavbarRoutes = ["/", "/signup"];

  return (
    <div>
      {/* Conditionally render Navbar */}
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}
      
      <div>
        <Routes>
          <Route exact path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/spots" element={<Spots />} />
          <Route path="/venues/:venueId" element={<VenueDetails />} />
          <Route path="/profile" element={<Accounts />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/terms-condition" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

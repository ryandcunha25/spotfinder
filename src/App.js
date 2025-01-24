import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./Components/css/output.css";
import SignUp from './Components/SignUp';
import LoginPage from './Components/LoginPage';
import HomePage from './Components/Users/HomePage';
import Navbar from './Components/Navbar';
import Spots from './Components/Users/Spots';
import VenueDetails from './Components/Users/VenueDetails';
import Accounts from './Components/Users/Accounts';
import Wishlist from './Components/Users/Wishlist';
import AboutUs from './Components/Users/AboutUs';
import ContactUs from './Components/Users/ContactUs';
import TermsAndConditions from './Components/Users/TermsAndConditions';
import PrivacyPolicy from './Components/Users/PrivacyPolicy';
import BookVenue from './Components/Users/BookVenue';
import PaymentPage from './Components/Users/PaymentPage';
import PaymentConfirmation from './Components/Users/PaymentConfirmation';
import UserBookings from './Components/Users/UserBookings';
import { SearchProvider } from "./Components/SearchContext"; // Adjust the path


function AppContent() {
  const location = useLocation();

  // Define routes where the Navbar should not be displayed
  const noNavbarRoutes = ["/", "/signup"];

  return (
    <SearchProvider>
      <div>
        {/* Conditionally render Navbar */}
        {!noNavbarRoutes.includes(location.pathname) && <Navbar />}

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
          <Route path="/venues/:venueId/book-venue" element={<BookVenue />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
          <Route path="/bookings" element={<UserBookings />} />
        </Routes>
      </div>
    </SearchProvider>
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

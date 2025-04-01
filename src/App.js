import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import "./Components/css/output.css";
import SignUp from './Components/SignUp';
import LoginPage from './Components/LoginPage';
import HomePage from './Components/Users/HomePage';
import Navbar from './Components/Navbar';
import Spots from './Components/Users/Spots';
import VenueDetails from './Components/Users/VenueDetails';
import Accounts from './Components/Users/Profile/Accounts';
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
import Dashboard from './Components/VenueOwners/Dashboard';
import VenueOwnerSignup from './Components/VenueOwners/VenueOwnerSignup';
import VenueOwnerLogin from './Components/VenueOwners/VenueOwnerLogin';
import MyVenues from './Components/VenueOwners/MyVenues';
import ManageBookings from './Components/VenueOwners/ManageBookings';
import ReviewForm from "./Components/Users/ReviewForm";
import Analytics from "./Components/VenueOwners/Analytics";
import ManageRatingReviews from "./Components/VenueOwners/ManageRatingReviews";
import SupportTickets from "./Components/Users/CustomerSupport/SupportTickets";
import NewSupportTicket from "./Components/Users/CustomerSupport/NewSupportTicket";
import VenueOwnerTickets from "./Components/VenueOwners/CustomerSupport/VenueOwnerTickets";
// import SupportTicketDetail from "./Components/Users/CustomerSupport/SupportTicketDetail";


function AppContent() {
  const location = useLocation();
  // const navigate = useNavigate();

  // const isTokenExpired = (token) => {
  //   if (!token) return true; // If no token, treat it as expired

  //   const tokenParts = token.split('.');
  //   if (tokenParts.length !== 3) return true; // Invalid token format

  //   try {
  //     const decodedPayload = JSON.parse(atob(tokenParts[1])); // Decode payload
  //     const expiry = decodedPayload.exp; // Get expiration time
  //     if (!expiry) return true; // No expiry in token

  //     return Date.now() >= expiry * 1000; // Convert to milliseconds and check expiration
  //   } catch (error) {
  //     return true; // If error occurs, assume token is expired
  //   }
  // };
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (isTokenExpired(token)) {
  //     localStorage.removeItem('token'); // Remove expired token
  //     localStorage.removeItem('userId'); // Remove userId if stored
  //     alert('Your session has expired. Please log in again.');
  //     navigate('/login'); // Redirect user to login page
  //   }
  // }, []);

  // Define routes where the Navbar should not be displayed
  const noNavbarRoutes = ["/", "/signup", "/venues/:venuename/book-venue", "/payment", "/payment-confirmation",
    "/dashboard", "/venueownersregistration", "/venueownerslogin", "/myvenues", "/managebookings",
    "/managepayments", "/manage-review-and-ratings", "/review-form", "/analytics", "/customer-support-handle", ];

  const shouldShowNavbar = !noNavbarRoutes.some(route => location.pathname.startsWith(route)) &&
    !location.pathname.startsWith("/venues/") ||
    !location.pathname.includes("/book-venue");

  return (
    <SearchProvider>
      <div>
        {/* Conditionally render Navbar */}
        {!noNavbarRoutes.includes(location.pathname) && shouldShowNavbar && <Navbar />}

        <Routes>
          <Route exact path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/venues" element={<Spots />} />
          <Route path="/venues/:venuename" element={<VenueDetails />} />
          <Route path="/profile/*" element={<Accounts />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/customer-support" element={<NewSupportTicket />} />
          <Route path="/terms-condition" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/venues/:venuename/book-venue" element={<BookVenue />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
          <Route path="/bookings" element={<UserBookings />} />
          <Route path="/user-tickets" element={<SupportTickets />} />
          <Route path="/user-tickets/create-ticket" element={<NewSupportTicket />} />
          <Route path="/user-tickets/detailedticket/:id" element={<SupportTickets />} />

          <Route path="/venueownersregistration" element={<VenueOwnerSignup />} />
          <Route path="/venueownerslogin" element={<VenueOwnerLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/myvenues" element={<MyVenues />} />
          <Route path="/managebookings" element={<ManageBookings />} />
          <Route path="/manage-review-and-ratings" element={<ManageRatingReviews />} />
          <Route path="/review-form" element={<ReviewForm />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/ticket-handler" element={<VenueOwnerTickets />} />
         


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

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
import Dashboard from './Components/VenueOwners/Dashboard';
import VenueOwnerSignup from './Components/VenueOwners/VenueOwnerSignup';
import VenueOwnerLogin from './Components/VenueOwners/VenueOwnerLogin';
import MyVenues from './Components/VenueOwners/MyVenues';
import ManageBookings from './Components/VenueOwners/ManageBookings';
import ReviewForm from "./Components/Users/ReviewForm";
import Analytics from "./Components/VenueOwners/Analytics";


function AppContent() {
  const location = useLocation();

  // Define routes where the Navbar should not be displayed
  const noNavbarRoutes = ["/", "/signup", "/venues/:venueId/book-venue", "/payment", "/payment-confirmation", "/dashboard", "/venueownersregistration", "/venueownerslogin", "/myvenues", "/managebookings", "/managepayments", "/review-form", "/analytics"];

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

          <Route path="/venueownersregistration" element={<VenueOwnerSignup />} />
          <Route path="/venueownerslogin" element={<VenueOwnerLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/myvenues" element={<MyVenues />} />
          <Route path="/managebookings" element={<ManageBookings />} />
          <Route path="/review-form" element={<ReviewForm />} />
          <Route path="/analytics" element={<Analytics />} />

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

# SpotFinder

SpotFinder is a venue booking and management system where users can browse venues, book them online, and owners can manage their listings and bookings. The platform also supports payments, user authentication, and booking management.

---

## Tech Stack Used
- **Frontend:** React.js, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL (Render)
- **Payment:** Razorpay 
- **Authentication:** JWT-based
- **Email Service:** Nodemailer

---

## How to Run the App Locally

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ryandcunha25/spotfinder.git
   cd spotfinder
   ```

2. **Install Dependencies**
   ```bash
    npm install
   ```

4. **Set up Enviroment Variables**
   ```bash
    DATABASE_URL=your_render_postgres_connection_string
    RAZORPAY_KEY_ID=your_key_id
    RAZORPAY_KEY_SECRET=your_secret
    JWT_SECRET=your_jwt_secret
   ```

5. **Run the backend**
   ```bash
   cd backend
   node server.js
   ```

6. **Install Dependencies**
   ```bash
   npm start
   ```

8. **Open in Browser** <br>
   (http://localhost:3000)

---

## Features

- User & Owner Authentication (Signup/Login with PostgreSQL)
- Venue Listings with details (name, image, description, location, price, rating)
- Booking System (users can request and book venues)
- Venue Owner Dashboard to accept/reject bookings
- Payment Integration (Razorpay)
- Ticket Raiser for customer grieviances
- Database backup & restore (PostgreSQL with Render)
- Deployment on Vercel + Render

---

## Demo Login 
* Email - testuser@gmail.com
* Password - tester

---

## LIVE DEMO
The project is deployed on Vercel & its backend on Render. <br>
Website Link - (https://spotfinder-chi.vercel.app)
  

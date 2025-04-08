const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require("./db")
const authRoutes = require('./routes/authentication');
const venueRoutes = require("./routes/venues"); 
const token = require("./routes/token"); 
const favourites = require("./routes/wishlist"); 
const razorpayRoutes = require('./routes/razorpay');
const bookings = require('./routes/bookings');
const owner_authentication = require('./routes/owner_authentication');
const reviews = require('./routes/reviews');
const notifications = require('./routes/notifications');
const analytics = require('./routes/analytics');
const grievances = require('./routes/grievances');
const dashboard = require('./routes/dashboard');
const home = require('./routes/home');

pool.connect();

const app = express();

// app.use(cors());
app.use(cors({ origin: "*" }));
// app.use(cors({
//   origin: ["https://spotfinder-chi.vercel.app"], // replace with your frontend
//   credentials: true
// }));


app.use(bodyParser.json());

app.use('/', home);

app.use('/authentication', authRoutes);

app.use("/venues", venueRoutes);

app.use("/token", token);

app.use("/favourites", favourites);

app.use('/razorpay', razorpayRoutes);

app.use('/bookings', bookings);

app.use('/owner_authentication', owner_authentication);

app.use('/notifications', notifications);

app.use('/reviews', reviews);

app.use('/analytics', analytics);

app.use('/grievances', grievances);

app.use('/dashboard', dashboard);


app.listen(5000, () => {
  console.log('\nServer is running on http://localhost:5000');
});

require('./routes/email_service');
require("./cron_jobs");
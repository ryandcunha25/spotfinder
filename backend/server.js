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

pool.connect();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// app.use('/cron_jobs', cron_jobs);

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

app.listen(5000, () => {
  console.log('\nServer is running on http://localhost:5000');
});

require('./routes/email_service');
require("./cron_jobs");
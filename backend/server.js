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

pool.connect();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/authentication', authRoutes);

app.use("/venues", venueRoutes);

app.use("/token", token);

app.use("/favourites", favourites);

app.use('/razorpay', razorpayRoutes);

app.use('/bookings', bookings);

app.listen(5000, () => {
  console.log('\nServer is running on http://localhost:5000');
});

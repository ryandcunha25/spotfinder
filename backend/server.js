const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require("./db")
const authRoutes = require('./routes/authentication');
const venueRoutes = require("./routes/venues"); 
const token = require("./routes/token"); 

pool.connect();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/authentication', authRoutes);

app.use("/venues", venueRoutes);

app.use("/token", token);

app.listen(5000, () => {
  console.log('\nServer is running on http://localhost:5000');
});

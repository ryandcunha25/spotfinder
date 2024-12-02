const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require("./db")
const authRoutes = require('./routes/authentication');
pool.connect();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/authentication', authRoutes);

app.listen(5000, () => {
  console.log('\nServer is running on http://localhost:3000');
});

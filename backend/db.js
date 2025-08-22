const { Pool } = require('pg');
require('dotenv').config({ path: 'E:/Final Year Project/spotfinder/backend/.env' });

// const pool = new Pool({
//     user: process.env.USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASS,
//     port: process.env.DB_PORT,
// });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,  // required on Render
  },
});


(async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database'); 
    client.release(); 
  } catch (err) {
    console.error('Error connecting to PostgreSQL database:', err);
  }
})();

module.exports = pool;

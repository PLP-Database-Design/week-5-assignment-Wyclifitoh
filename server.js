const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connecting to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to the database.');
});

// 1. Retrieving all patients
app.get('/patients', (req, res) => {
  db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, results) => {
    if (err) return res.status(500).json(err);
    console.log('Patients retrieved:', results); // Displaying patients in the console
    res.json(results);
  });
});

// 2. Retrieving all providers
app.get('/providers', (req, res) => {
  db.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results) => {
    if (err) return res.status(500).json(err);
    console.log('Providers retrieved:', results); // Displaying providers in the console
    res.json(results);
  });
});

// 3. Filtering patients by First Name
app.get('/patients/first-name/:firstName', (req, res) => {
  const { firstName } = req.params;
  db.query('SELECT * FROM patients WHERE first_name = ?', [firstName], (err, results) => {
    if (err) return res.status(500).json(err);
    console.log(`Patients retrieved with first name ${firstName}:`, results); // Displaying filtered patients in the console
    res.json(results);
  });
});

// 4. Retrieving all providers by their specialty
app.get('/providers/specialty/:specialty', (req, res) => {
  const { specialty } = req.params;
  db.query('SELECT * FROM providers WHERE provider_specialty = ?', [specialty], (err, results) => {
    if (err) return res.status(500).json(err);
    console.log(`Providers retrieved with specialty ${specialty}:`, results); // Displaying filtered providers in the console
    res.json(results);
  });
});

// Listen to the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

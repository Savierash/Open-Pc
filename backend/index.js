const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 5000;

DB_URL = 'mongodb://localhost:5000/';

mongoose.connect(DB_URL);
const db = mongoose.connection;

conn.once('open', () => {
    console.log('MongoDB database connection established successfully');
})
conn.on('error', () => {
    console.log('MongoDB connection error');
})

app.use(express.json());

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});




require('dotenv').config();

const express = require("express");

// Express app
const app = express();

// Middleware
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes in web browser
app.get('/', (req, res) => {
  res.json({ msg: 'Welcome to my Life' });
});

// Listen for requests
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log('Listening for requests on port', port);
});
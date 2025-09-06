const express = require('express');
const app = express();
const port = 3000;

// Importing the scraper routes
const scraperRoutes = require('./routes/scraper');

// Middleware to parse JSON bodies
app.use(express.json());

// Using the scraper routes for API
app.use('/api', scraperRoutes);

// Starting the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
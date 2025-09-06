const express = require('express');
const app = express();
const PORT = process.env.PORT || 3002;

// Import your scraping logic
const runScraper = require('./scraper'); // Adjust path if needed

app.get('/scrape', async (req, res) => {
  try {
    await runScraper();
    res.send('Scraping completed!');
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

app.get('/', (req, res) => {
  res.send('Scraper service is running. Visit /scrape to start scraping.');
});

app.listen(PORT, () => {
  console.log(`Scraper service running on port ${PORT}`);
});
const axios = require('axios');

const SCRAPER_URL = process.env.SCRAPER_URL || 'https://your-scraper-service.onrender.com/scraper';

async function triggerScraper(req, res) {
  try {
    const response = await axios.get(SCRAPER_URL);
    res.json({ message: response.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { triggerScraper };
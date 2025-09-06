const express = require('express');
const router = express.Router();
const { triggerScraper } = require('../controllers/scraperController');

router.get('/trigger-scraper', triggerScraper);

module.exports = router;
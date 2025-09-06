const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// GET /api/books - Get paginated list of books with filters and search
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      minRating = 0,
      maxRating = 5,
      minPrice = 0,
      maxPrice = 1000,
      inStock = '',
      sortBy = 'title',
      sortOrder = 'asc'
    } = req.query;

    // Convert string parameters to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const minRatingNum = parseFloat(minRating);
    const maxRatingNum = parseFloat(maxRating);
    const minPriceNum = parseFloat(minPrice);
    const maxPriceNum = parseFloat(maxPrice);

    // Build query object
    let query = {};

    // Search by title
    if (search.trim()) {
      query.$text = { $search: search.trim() };
    }

    // Filter by rating range
    if (minRatingNum >= 0 && maxRatingNum <= 5) {
      query.rating = { $gte: minRatingNum, $lte: maxRatingNum };
    }

    // Filter by price range
    if (minPriceNum >= 0 && maxPriceNum > minPriceNum) {
      query.price = { $gte: minPriceNum, $lte: maxPriceNum };
    }

    // Filter by stock status
    if (inStock !== '') {
      query.inStock = inStock === 'true';
    }

    // Build sort object
    const sort = {};
    const validSortFields = ['title', 'price', 'rating', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'title';
    const sortDirection = sortOrder === 'desc' ? -1 : 1;
    sort[sortField] = sortDirection;

    // Execute query with pagination
    const skip = (pageNum - 1) * limitNum;
    const books = await Book.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination
    const totalBooks = await Book.countDocuments(query);
    const totalPages = Math.ceil(totalBooks / limitNum);

    // Response
    res.json({
      success: true,
      data: {
        books,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalBooks,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
          limit: limitNum
        },
        filters: {
          search,
          minRating: minRatingNum,
          maxRating: maxRatingNum,
          minPrice: minPriceNum,
          maxPrice: maxPriceNum,
          inStock: inStock === '' ? null : inStock === 'true',
          sortBy: sortField,
          sortOrder
        }
      }
    });

  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch books',
      message: error.message
    });
  }
});

// GET /api/books/:id - Get single book by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    res.json({
      success: true,
      data: book
    });

  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch book',
      message: error.message
    });
  }
});

// GET /api/books/stats - Get database statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const inStockBooks = await Book.countDocuments({ inStock: true });
    const outOfStockBooks = await Book.countDocuments({ inStock: false });

    const priceStats = await Book.aggregate([
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    const ratingDistribution = await Book.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const stockByRating = await Book.aggregate([
      {
        $group: {
          _id: { rating: '$rating', inStock: '$inStock' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.rating': 1, '_id.inStock': -1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalBooks,
        inStockBooks,
        outOfStockBooks,
        stockPercentage: totalBooks > 0 ? Math.round((inStockBooks / totalBooks) * 100) : 0,
        priceStats: priceStats[0] || { avgPrice: 0, minPrice: 0, maxPrice: 0 },
        ratingDistribution,
        stockByRating
      }
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

// POST /api/books/refresh - Trigger fresh scraping (bonus endpoint)
router.post('/refresh', async (req, res) => {
  try {
    const { exec } = require('child_process');
    const path = require('path');

    // Run the scraper script
    const scraperPath = path.join(__dirname, '../../scraper');

    exec('npm start', { cwd: scraperPath }, (error, stdout, stderr) => {
      if (error) {
        console.error('Scraper error:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to trigger scraping',
          message: error.message
        });
      }

      console.log('Scraper output:', stdout);
      if (stderr) console.error('Scraper stderr:', stderr);
    });

    res.json({
      success: true,
      message: 'Scraping process started. This may take a few minutes to complete.',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error triggering refresh:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to trigger refresh',
      message: error.message
    });
  }
});

module.exports = router;

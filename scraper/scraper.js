const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookexplorer';

// Book schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  priceText: { type: String, required: true },
  rating: { type: Number, required: true },
  ratingText: { type: String, required: true },
  availability: { type: String, required: true },
  inStock: { type: Boolean, required: true },
  imageUrl: { type: String, required: true },
  bookUrl: { type: String, required: true },
  scrapedAt: { type: Date, default: Date.now }
});

const Book = mongoose.model('Book', bookSchema);

// Rating conversion map
const ratingMap = {
  'One': 1,
  'Two': 2,
  'Three': 3,
  'Four': 4,
  'Five': 5
};

class BookScraper {
  constructor() {
    this.baseUrl = 'https://books.toscrape.com';
    this.totalPages = 50;
  }

  async connectDB() {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  }

  async scrapePage(pageNumber) {
    try {
      const url = pageNumber === 1 
        ? `${this.baseUrl}/index.html`
        : `${this.baseUrl}/catalogue/page-${pageNumber}.html`;

      console.log(`Scraping page ${pageNumber}: ${url}`);
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      const books = [];

      $('article.product_pod').each((index, element) => {
        const $book = $(element);

        // Extract book data
        const titleElement = $book.find('h3 a');
        const title = titleElement.attr('title');
        const bookUrl = titleElement.attr('href');

        const priceText = $book.find('p.price_color').text().trim();
        const price = parseFloat(priceText.replace('£', ''));

        const ratingElement = $book.find('p.star-rating');
        const ratingClass = ratingElement.attr('class');
        const ratingText = ratingClass ? ratingClass.split(' ')[1] : 'Zero';
        const rating = ratingMap[ratingText] || 0;

        const availability = $book.find('p.instock.availability').text().trim();
        const inStock = availability.toLowerCase().includes('in stock');

        const imageUrl = $book.find('div.image_container img').attr('src');

        if (title && price && imageUrl) {
          books.push({
            title,
            price,
            priceText,
            rating,
            ratingText,
            availability,
            inStock,
            imageUrl: `${this.baseUrl}/${imageUrl}`,
            bookUrl: `${this.baseUrl}/${bookUrl}`
          });
        }
      });

      return books;
    } catch (error) {
      console.error(`Error scraping page ${pageNumber}:`, error.message);
      return [];
    }
  }

  async scrapeAllBooks() {
    console.log('Starting book scraping...');

    // Clear existing books
    await Book.deleteMany({});
    console.log('Cleared existing books from database');

    const allBooks = [];

    for (let page = 1; page <= this.totalPages; page++) {
      const books = await this.scrapePage(page);
      allBooks.push(...books);

      // Add delay to be respectful to the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`Scraped ${allBooks.length} books from ${this.totalPages} pages`);

    // Save to database
    if (allBooks.length > 0) {
      await Book.insertMany(allBooks);
      console.log('Successfully saved books to database');
    }

    return allBooks;
  }

  async getStats() {
    const totalBooks = await Book.countDocuments();
    const inStockBooks = await Book.countDocuments({ inStock: true });
    const avgPrice = await Book.aggregate([
      { $group: { _id: null, avgPrice: { $avg: '$price' } } }
    ]);

    console.log(`\nDatabase Stats:`);
    console.log(`Total books: ${totalBooks}`);
    console.log(`In stock: ${inStockBooks}`);
    console.log(`Average price: £${avgPrice[0]?.avgPrice.toFixed(2) || 0}`);
  }
}

// Main execution
async function main() {
  const scraper = new BookScraper();

  try {
    await scraper.connectDB();
    await scraper.scrapeAllBooks();
    await scraper.getStats();
    console.log('\nScraping completed successfully!');
  } catch (error) {
    console.error('Scraping failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Handle command line execution
if (require.main === module) {
  main();
}

module.exports = { BookScraper, Book };

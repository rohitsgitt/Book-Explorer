# Book Explorer

A full-stack web application that scrapes book data from [Books to Scrape](https://books.toscrape.com/), stores it in MongoDB, and provides a modern React frontend for browsing and searching books.

## Features

- **Web Scraper**: Automated scraping of book data from Books to Scrape
- **REST API**: Express.js backend with comprehensive endpoints
- **Modern Frontend**: React application with search, filtering, and pagination
- **Database**: MongoDB storage with optimized indexes
- **Real-time Search**: Text search and advanced filtering options
- **Responsive Design**: Mobile-friendly interface
- **Docker Support**: Easy deployment with Docker Compose

## Project Structure

```text
book-explorer/
├── scraper/                 # Web scraper module
│   ├── scraper.js          # Main scraping script
│   ├── package.json        # Dependencies
│   └── .env.example        # Environment variables template
├── backend/                # Express.js API server
│   ├── server.js          # Main server file
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── config/            # Database configuration
│   ├── package.json       # Dependencies
│   └── .env.example       # Environment variables template
├── frontend/              # React application
│   ├── public/           # Static files
│   ├── src/              # React source code
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   └── services/     # API services
│   └── package.json      # Dependencies
├── README.md             # This file
├── .gitignore           # Git ignore rules
└── docker-compose.yml   # Docker configuration
```

## One-Click Launch Options

Choose one of the following files based on your system:

| Script File         | Platform            | Description                                                                                    |
| ------------------- | ------------------- | ---------------------------------------------------------------------------------------------- |
| **oneClickRun.cmd** | Windows CMD         | Opens 3 CMD terminals and runs frontend, backend, and scraper. **(Recommended)**               |

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Quick Start with Docker (Recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd book-explorer
   ```

2. **Start with Docker Compose**

   ```bash
   docker-compose up -d
   ```

3. **Run the scraper to populate data**

   ```bash
   docker-compose exec scraper npm start
   ```

4. **Access the application**
   - Frontend: <http://localhost:3000>
   - Backend API: <http://localhost:3001>
   - MongoDB: mongodb://localhost:27017

### Manual Installation

#### 1. Setup MongoDB

Make sure MongoDB is running on your system:

```bash
# Using brew (macOS)
brew services start mongodb/brew/mongodb-community

# Using systemctl (Linux)
sudo systemctl start mongod

# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env

# Edit .env file with your MongoDB connection string
# MONGODB_URI=mongodb://localhost:27017/bookexplorer

npm run dev
```

#### 3. Setup Scraper

```bash
cd scraper
npm install
cp .env.example .env

# Edit .env file if needed
npm start
```

#### 4. Setup Frontend

```bash
cd frontend
npm install
npm start
```

## API Endpoints

### Books

- `GET /api/books` - Get paginated books with filters

  - Query parameters:
    - `page` - Page number (default: 1)
    - `limit` - Items per page (default: 20)
    - `search` - Search by title
    - `minRating` - Minimum rating (0-5)
    - `maxRating` - Maximum rating (0-5)
    - `minPrice` - Minimum price
    - `maxPrice` - Maximum price
    - `inStock` - Filter by stock status (true/false)
    - `sortBy` - Sort field (title, price, rating, createdAt)
    - `sortOrder` - Sort direction (asc, desc)

- `GET /api/books/:id` - Get single book by ID
- `GET /api/books/stats/summary` - Get database statistics
- `POST /api/books/refresh` - Trigger fresh scraping

### Health Check

- `GET /health` - Server health status

## Usage Examples

### Search Books by Title

```bash
curl "http://localhost:3001/api/books?search=python&limit=10"
```

### Filter by Rating and Price

```bash
curl "http://localhost:3001/api/books?minRating=4&maxPrice=30&inStock=true"
```

### Get Book Statistics

```bash
curl "http://localhost:3001/api/books/stats/summary"
```

### Trigger Data Refresh

```bash
curl -X POST "http://localhost:3001/api/books/refresh"
```

## Data Scraping

The scraper automatically:

- Navigates through all 50 pages of Books to Scrape
- Extracts title, price, rating, stock status, image URL, and book URL
- Stores data in MongoDB with proper indexing
- Can be run repeatedly to refresh the database

### Manual Scraping

```bash
cd scraper
npm start
```

### Scheduled Scraping (Cron)

Add to your crontab for daily updates:

```bash
# Run daily at 2 AM
0 2 * * * cd /path/to/book-explorer/scraper && npm start
```

## Frontend Features

### Home Page

- Responsive grid layout of book cards
- Advanced search and filtering
- Pagination with page navigation
- Book detail modal/page
- Loading states and error handling

### Search & Filters

- Text search by book title
- Filter by rating range (1-5 stars)
- Filter by price range
- Filter by stock availability
- Sort by title, price, rating, or date added
- Real-time filter application

### Book Details

- Full book information display
- High-quality book cover images
- External link to source page
- Responsive design for mobile devices

## Deployment

### Using Docker Compose (Production)

1. **Build and deploy**

   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Manual Deployment

#### Backend (Heroku/Railway/Render)

1. Set environment variables:

   ```env
   MONGODB_URI=your-mongodb-connection-string
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.com
   ```

2. Deploy backend code

#### Frontend (Vercel/Netlify)

1. Build the React app:

   ```bash
   cd frontend
   npm run build
   ```

2. Set environment variables:

   ```env
   REACT_APP_API_URL=https://your-backend-url.com
   ```

3. Deploy the build folder

## Configuration

### Environment Variables

#### Backend (.env)

```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bookexplorer
FRONTEND_URL=http://localhost:3000
API_RATE_LIMIT=100
```

#### Scraper (.env)

```env
MONGODB_URI=mongodb://localhost:27017/bookexplorer
BASE_URL=https://books.toscrape.com
TOTAL_PAGES=50
DELAY_MS=100
```

#### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:3001
```

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### API Testing with curl

```bash
# Health check
curl http://localhost:3001/health

# Get books
curl http://localhost:3001/api/books

# Search books
curl "http://localhost:3001/api/books?search=python"
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Books to Scrape](https://books.toscrape.com/) - Demo website for scraping practice
- React community for excellent documentation
- MongoDB for robust data storage
- Express.js for the web framework

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Ensure MongoDB is running
   - Check connection string in .env file
   - Verify network connectivity

2. **Scraper Not Finding Books**

   - Check if Books to Scrape website is accessible
   - Verify scraper script has proper selectors
   - Look at console logs for errors

3. **Frontend Not Loading Data**

   - Ensure backend server is running
   - Check API URL configuration
   - Verify CORS settings

4. **Port Already in Use**
   - Kill existing processes: `lsof -ti:3000 | xargs kill -9`
   - Change port in .env files

### Debug Mode

Enable debug logging:

```bash
DEBUG=book-explorer:* npm start
```

## Performance

The application is optimized for performance:

- Database indexes on searchable fields
- Pagination to limit data transfer
- Image lazy loading in frontend
- API response caching headers
- Efficient MongoDB queries with aggregation

---

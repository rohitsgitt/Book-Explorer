import React, { useState, useEffect, useCallback } from 'react';
import { bookApi, buildQueryParams } from '../services/api';
import BookCard from '../components/BookCard';
import BookDetail from '../components/BookDetail';
import SearchFilter from '../components/SearchFilter';
import Pagination from '../components/Pagination';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalBooks: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 20
  });
  const [filters, setFilters] = useState({
    search: '',
    minRating: '',
    maxRating: '',
    minPrice: '',
    maxPrice: '',
    inStock: '',
    sortBy: 'title',
    sortOrder: 'asc',
    page: 1,
    limit: 20
  });

  // Fetch books with current filters
  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = buildQueryParams(filters);
      const response = await bookApi.getBooks(params);

      if (response.success) {
        setBooks(response.data.books);
        setPagination(response.data.pagination);
      } else {
        throw new Error(response.error || 'Failed to fetch books');
      }
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err.message);
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Initial load
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }));
  };

  // Handle page changes
  const handlePageChange = (page) => {
    setFilters(prev => ({
      ...prev,
      page
    }));

    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle book card click
  const handleBookClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  // Handle retry
  const handleRetry = () => {
    fetchBooks();
  };

  // Loading state
  if (isLoading && books.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading books...</p>
      </div>
    );
  }

  // Error state
  if (error && books.length === 0) {
    return (
      <div className="error-container">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.5rem' }}></i>
          {error}
        </div>
        <button className="retry-button" onClick={handleRetry}>
          <i className="fas fa-redo" style={{ marginRight: '0.5rem' }}></i>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">
        {/* Page Header */}
        <div className="text-center mb-4">
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            Book Explorer
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
            Discover and explore thousands of books from our collection
          </p>
          {pagination.totalBooks > 0 && (
            <p style={{ fontSize: '1rem', color: '#9ca3af', marginTop: '0.5rem' }}>
              {pagination.totalBooks.toLocaleString()} books available
            </p>
          )}
        </div>

        {/* Search and Filters */}
        <SearchFilter
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSearch={fetchBooks}
          isLoading={isLoading}
        />

        {/* Error banner (if error occurs during filtering) */}
        {error && books.length > 0 && (
          <div className="error" style={{ marginBottom: '2rem' }}>
            <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.5rem' }}></i>
            {error}
            <button 
              onClick={handleRetry}
              style={{ marginLeft: '1rem', background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Retry
            </button>
          </div>
        )}

        {/* No results */}
        {!isLoading && books.length === 0 && !error && (
          <div className="text-center" style={{ padding: '4rem 2rem' }}>
            <i className="fas fa-search" style={{ fontSize: '3rem', color: '#d1d5db', marginBottom: '1rem' }}></i>
            <h3 style={{ color: '#6b7280', marginBottom: '0.5rem' }}>No books found</h3>
            <p style={{ color: '#9ca3af' }}>
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}

        {/* Books Grid */}
        {books.length > 0 && (
          <>
            <div className="books-grid">
              {books.map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  onClick={handleBookClick}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalBooks={pagination.totalBooks}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
              onPageChange={handlePageChange}
              limit={pagination.limit}
              isLoading={isLoading}
            />
          </>
        )}

        {/* Loading overlay for subsequent pages */}
        {isLoading && books.length > 0 && (
          <div style={{ 
            position: 'fixed', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '2rem',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 999
          }}>
            <div className="loading-spinner"></div>
          </div>
        )}

        {/* Book Details Modal */}
        <BookDetail
          book={selectedBook}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      </div>
    </div>
  );
};

export default Home;

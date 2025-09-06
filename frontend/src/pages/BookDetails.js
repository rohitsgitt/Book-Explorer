import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookApi } from '../services/api';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) {
        setError('No book ID provided');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await bookApi.getBookById(id);

        if (response.success) {
          setBook(response.data);
        } else {
          throw new Error(response.error || 'Failed to fetch book');
        }
      } catch (err) {
        console.error('Error fetching book:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`fas fa-star ${i <= rating ? 'star' : 'star empty'}`}
        />
      );
    }
    return stars;
  };

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x400/e5e7eb/9ca3af?text=No+Image';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p style={{ marginTop: '1rem', color: '#6b7280' }}>Loading book details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="error-container">
            <div className="error-message">
              <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.5rem' }}></i>
              {error}
            </div>
            <div style={{ marginTop: '1rem' }}>
              <button className="btn btn-primary" onClick={() => navigate('/')}>
                <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
                Back to Books
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="text-center" style={{ padding: '4rem 2rem' }}>
            <h2>Book not found</h2>
            <button className="btn btn-primary mt-2" onClick={() => navigate('/')}>
              <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
              Back to Books
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">
        {/* Back Button */}
        <div style={{ marginBottom: '2rem' }}>
          <button className="btn btn-outline" onClick={() => navigate('/')}>
            <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
            Back to Books
          </button>
        </div>

        {/* Book Details */}
        <div className="card">
          <div className="card-body">
            <div className="book-details-content">
              <div className="book-details-image">
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  onError={handleImageError}
                />
              </div>

              <div className="book-details-info">
                <h1 className="book-details-title">{book.title}</h1>

                <div className="book-details-meta">
                  <div className="meta-item">
                    <span className="meta-label">Price</span>
                    <span className="meta-value book-price">
                      {book.priceText || `£${book.price.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="meta-item">
                    <span className="meta-label">Rating</span>
                    <div className="meta-value">
                      <div className="rating-stars">
                        {renderStars(book.rating)}
                      </div>
                      <span style={{ marginLeft: '0.5rem' }}>
                        {book.rating}/5 ({book.ratingText})
                      </span>
                    </div>
                  </div>

                  <div className="meta-item">
                    <span className="meta-label">Availability</span>
                    <span
                      className={`meta-value book-availability ${
                        book.inStock ? 'availability-in-stock' : 'availability-out-of-stock'
                      }`}
                    >
                      <i className={`fas ${book.inStock ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                      {book.availability || (book.inStock ? 'In Stock' : 'Out of Stock')}
                    </span>
                  </div>

                  {book.scrapedAt && (
                    <div className="meta-item">
                      <span className="meta-label">Last Updated</span>
                      <span className="meta-value">
                        {formatDate(book.scrapedAt)}
                      </span>
                    </div>
                  )}

                  <div className="meta-item">
                    <span className="meta-label">Book ID</span>
                    <span className="meta-value" style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                      {book._id}
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: '2rem' }}>
                  <a
                    href={book.bookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ marginRight: '1rem' }}
                  >
                    <i className="fas fa-external-link-alt"></i>
                    View on Books to Scrape
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;

import React from 'react';

const BookDetail = ({ book, isOpen, onClose }) => {
  if (!isOpen || !book) return null;

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
    e.target.src = 'https://via.placeholder.com/200x300/e5e7eb/9ca3af?text=No+Image';
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
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

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Book Details</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
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

                <button
                  onClick={onClose}
                  className="btn btn-outline"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;

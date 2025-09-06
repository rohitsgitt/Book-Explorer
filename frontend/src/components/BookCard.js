import React from 'react';

const BookCard = ({ book, onClick }) => {
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

  return (
    <div className="book-card" onClick={() => onClick(book)}>
      <div className="book-image-container">
        <img
          src={book.imageUrl}
          alt={book.title}
          className="book-image"
          onError={handleImageError}
          loading="lazy"
        />
        <div className="book-rating-overlay">
          <div className="rating-stars">
            {renderStars(book.rating)}
          </div>
          <span>({book.rating})</span>
        </div>
      </div>

      <div className="book-info">
        <h3 className="book-title" title={book.title}>
          {book.title}
        </h3>

        <div className="book-price">
          {book.priceText || `£${book.price.toFixed(2)}`}
        </div>

        <span
          className={`book-availability ${
            book.inStock ? 'availability-in-stock' : 'availability-out-of-stock'
          }`}
        >
          <i className={`fas ${book.inStock ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
          {book.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
    </div>
  );
};

export default BookCard;

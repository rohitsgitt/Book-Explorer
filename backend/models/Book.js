const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  priceText: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
    index: true
  },
  ratingText: {
    type: String,
    required: true,
    enum: ['Zero', 'One', 'Two', 'Three', 'Four', 'Five']
  },
  availability: {
    type: String,
    required: true
  },
  inStock: {
    type: Boolean,
    required: true,
    index: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  bookUrl: {
    type: String,
    required: true,
    unique: true
  },
  scrapedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
bookSchema.index({ title: 'text' }); // Text search
bookSchema.index({ price: 1, rating: 1 }); // Price and rating queries
bookSchema.index({ inStock: 1, rating: 1 }); // Stock and rating queries
bookSchema.index({ createdAt: -1 }); // Sort by creation date

// Virtual for formatted price
bookSchema.virtual('formattedPrice').get(function() {
  return `£${this.price.toFixed(2)}`;
});

// Instance method to check if book is highly rated
bookSchema.methods.isHighlyRated = function() {
  return this.rating >= 4;
};

// Static method to get books by rating range
bookSchema.statics.findByRatingRange = function(minRating, maxRating) {
  return this.find({
    rating: { $gte: minRating, $lte: maxRating }
  });
};

// Static method to get books by price range
bookSchema.statics.findByPriceRange = function(minPrice, maxPrice) {
  return this.find({
    price: { $gte: minPrice, $lte: maxPrice }
  });
};

// Static method to search books by title
bookSchema.statics.searchByTitle = function(searchTerm) {
  return this.find({
    $text: { $search: searchTerm }
  });
};

module.exports = mongoose.model('Book', bookSchema);

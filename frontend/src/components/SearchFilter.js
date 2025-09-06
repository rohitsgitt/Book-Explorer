import React, { useState, useEffect } from 'react';

const SearchFilter = ({ filters, onFiltersChange, onSearch, isLoading }) => {
  const [localFilters, setLocalFilters] = useState({
    search: '',
    minRating: '',
    maxRating: '',
    minPrice: '',
    maxPrice: '',
    inStock: '',
    sortBy: 'title',
    sortOrder: 'asc',
    ...filters
  });

  // Update local filters when parent filters change
  useEffect(() => {
    setLocalFilters(prev => ({
      ...prev,
      ...filters
    }));
  }, [filters]);

  const handleInputChange = (name, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFiltersChange(localFilters);
    onSearch();
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      minRating: '',
      maxRating: '',
      minPrice: '',
      maxPrice: '',
      inStock: '',
      sortBy: 'title',
      sortOrder: 'asc'
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
    onSearch();
  };

  const hasActiveFilters = () => {
    return localFilters.search ||
           localFilters.minRating !== '' ||
           localFilters.maxRating !== '' ||
           localFilters.minPrice !== '' ||
           localFilters.maxPrice !== '' ||
           localFilters.inStock !== '';
  };

  return (
    <div className="search-filters">
      <form onSubmit={handleSubmit}>
        {/* Search Row */}
        <div className="search-row">
          <div className="search-input-group">
            <label className="form-label">Search Books</label>
            <div className="search-input">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                className="form-input"
                placeholder="Search by book title..."
                value={localFilters.search}
                onChange={(e) => handleInputChange('search', e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Searching...
                </>
              ) : (
                <>
                  <i className="fas fa-search"></i>
                  Search
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="filters-row">
          {/* Rating Filter */}
          <div className="filter-group">
            <label className="form-label">Rating Range</label>
            <div className="range-inputs">
              <select
                className="form-select"
                value={localFilters.minRating}
                onChange={(e) => handleInputChange('minRating', e.target.value)}
              >
                <option value="">Min</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>

              <span className="range-separator">to</span>

              <select
                className="form-select"
                value={localFilters.maxRating}
                onChange={(e) => handleInputChange('maxRating', e.target.value)}
              >
                <option value="">Max</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>
          </div>

          {/* Price Filter */}
          <div className="filter-group">
            <label className="form-label">Price Range (£)</label>
            <div className="range-inputs">
              <input
                type="number"
                className="form-input"
                placeholder="Min"
                min="0"
                step="0.01"
                value={localFilters.minPrice}
                onChange={(e) => handleInputChange('minPrice', e.target.value)}
              />

              <span className="range-separator">to</span>

              <input
                type="number"
                className="form-input"
                placeholder="Max"
                min="0"
                step="0.01"
                value={localFilters.maxPrice}
                onChange={(e) => handleInputChange('maxPrice', e.target.value)}
              />
            </div>
          </div>

          {/* Stock Filter */}
          <div className="filter-group">
            <label className="form-label">Availability</label>
            <select
              className="form-select"
              value={localFilters.inStock}
              onChange={(e) => handleInputChange('inStock', e.target.value)}
            >
              <option value="">All Books</option>
              <option value="true">In Stock Only</option>
              <option value="false">Out of Stock Only</option>
            </select>
          </div>

          {/* Sort Options */}
          <div className="filter-group">
            <label className="form-label">Sort By</label>
            <div className="range-inputs">
              <select
                className="form-select"
                value={localFilters.sortBy}
                onChange={(e) => handleInputChange('sortBy', e.target.value)}
              >
                <option value="title">Title</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
                <option value="createdAt">Date Added</option>
              </select>

              <select
                className="form-select"
                value={localFilters.sortOrder}
                onChange={(e) => handleInputChange('sortOrder', e.target.value)}
              >
                <option value="asc">A-Z / Low-High</option>
                <option value="desc">Z-A / High-Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleReset}
            disabled={isLoading || !hasActiveFilters()}
          >
            <i className="fas fa-undo"></i>
            Reset Filters
          </button>

          {hasActiveFilters() && (
            <div style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center' }}>
              <i className="fas fa-filter" style={{ marginRight: '0.5rem' }}></i>
              Filters active
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchFilter;

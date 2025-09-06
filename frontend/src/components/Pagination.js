import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalBooks, 
  hasNextPage, 
  hasPrevPage, 
  onPageChange,
  limit,
  isLoading 
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if end page is at the maximum
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis and last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageClick = (page) => {
    if (page !== '...' && page !== currentPage && !isLoading) {
      onPageChange(page);
    }
  };

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalBooks);

  return (
    <div className="pagination">
      {/* Previous button */}
      <button
        className={`pagination-button ${!hasPrevPage || isLoading ? 'disabled' : ''}`}
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={!hasPrevPage || isLoading}
        title="Previous page"
      >
        <i className="fas fa-chevron-left"></i>
      </button>

      {/* Page numbers */}
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          className={`pagination-button ${
            page === currentPage ? 'active' : ''
          } ${page === '...' || isLoading ? 'disabled' : ''}`}
          onClick={() => handlePageClick(page)}
          disabled={page === '...' || isLoading}
        >
          {page}
        </button>
      ))}

      {/* Next button */}
      <button
        className={`pagination-button ${!hasNextPage || isLoading ? 'disabled' : ''}`}
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={!hasNextPage || isLoading}
        title="Next page"
      >
        <i className="fas fa-chevron-right"></i>
      </button>

      {/* Results info */}
      <div className="pagination-info">
        Showing {startItem}-{endItem} of {totalBooks} books
        {isLoading && (
          <span style={{ marginLeft: '0.5rem' }}>
            <i className="fas fa-spinner fa-spin"></i>
          </span>
        )}
      </div>
    </div>
  );
};

export default Pagination;

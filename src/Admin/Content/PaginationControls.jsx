import React from 'react';

// Simple numeric pagination component with ellipsis
// Props: count (total items), page (0-based), rowsPerPage, onPageChange
export default function PaginationControls({ count, page, rowsPerPage, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(count / rowsPerPage));
  const prev = () => onPageChange(Math.max(0, page - 1));
  const next = () => onPageChange(Math.min(totalPages - 1, page + 1));

  if (totalPages === 1) return null;

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7; // Maximum number of page buttons to show

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(0);

      let start = Math.max(1, page - 1);
      let end = Math.min(totalPages - 2, page + 1);

      // Adjust if near the start
      if (page < 3) {
        start = 1;
        end = 4;
      }
      // Adjust if near the end
      else if (page > totalPages - 4) {
        start = totalPages - 5;
        end = totalPages - 2;
      }

      // Add ellipsis before if needed
      if (start > 1) {
        pages.push('ellipsis-start');
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis after if needed
      if (end < totalPages - 2) {
        pages.push('ellipsis-end');
      }

      // Always show last page
      pages.push(totalPages - 1);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="simple-pagination" role="navigation" aria-label="Pagination">
      <button className="page-btn prev" onClick={prev} disabled={page === 0} aria-label="Previous page">‹</button>
      {pageNumbers.map((p, idx) => {
        if (typeof p === 'string') {
          return <span key={p} className="page-ellipsis">...</span>;
        }
        return (
          <button
            key={p}
            className={`page-btn ${p === page ? 'active' : ''}`}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? 'page' : undefined}
          >
            {p + 1}
          </button>
        );
      })}
      <button className="page-btn next" onClick={next} disabled={page === totalPages - 1} aria-label="Next page">›</button>
    </div>
  );
}

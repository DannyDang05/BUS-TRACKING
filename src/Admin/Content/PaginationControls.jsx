import React from 'react';

// Simple numeric pagination component
// Props: count (total items), page (0-based), rowsPerPage, onPageChange
export default function PaginationControls({ count, page, rowsPerPage, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(count / rowsPerPage));
  const pages = Array.from({ length: totalPages }, (_, i) => i);

  const prev = () => onPageChange(Math.max(0, page - 1));
  const next = () => onPageChange(Math.min(totalPages - 1, page + 1));

  if (totalPages === 1) return null;

  return (
    <div className="simple-pagination" role="navigation" aria-label="Pagination">
      <button className="page-btn prev" onClick={prev} disabled={page === 0} aria-label="Previous page">‹</button>
      {pages.map((p) => (
        <button
          key={p}
          className={`page-btn ${p === page ? 'active' : ''}`}
          onClick={() => onPageChange(p)}
          aria-current={p === page ? 'page' : undefined}
        >
          {p + 1}
        </button>
      ))}
      <button className="page-btn next" onClick={next} disabled={page === totalPages - 1} aria-label="Next page">›</button>
    </div>
  );
}

import React from 'react';
import styles from './Pagination.module.scss';
import { useTranslation } from 'react-i18next';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false
}) => {
  const { t } = useTranslation();
  
  // Don't render pagination if there's only one page or none
  if (totalPages <= 1) return null;
  
  // Calculate page numbers to display
  const getPageNumbers = (): number[] => {
    const pageNumbers: number[] = [];
    
    // Maximum number of page buttons to show
    const maxVisiblePages = 5;
    
    // If we have 7 or fewer pages, show all
    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }
    
    // Always include first page
    pageNumbers.push(0);
    
    // Calculate start and end of current page group
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 2, startPage + maxVisiblePages - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Add ellipsis after first page if needed
    if (startPage > 1) {
      pageNumbers.push(-1); // -1 represents ellipsis
    }
    
    // Add mid pages
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 2) {
      pageNumbers.push(-2); // -2 represents ellipsis
    }
    
    // Always include last page
    pageNumbers.push(totalPages - 1);
    
    return pageNumbers;
  };
  
  const handlePageClick = (page: number) => {
    if (page !== currentPage && !disabled) {
      onPageChange(page);
    }
  };
  
  const goToPrevPage = () => {
    if (currentPage > 0 && !disabled) {
      onPageChange(currentPage - 1);
    }
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages - 1 && !disabled) {
      onPageChange(currentPage + 1);
    }
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <div className={styles.pagination}>
      <button
        className={`${styles.pageButton} ${styles.navButton}`}
        onClick={goToPrevPage}
        disabled={currentPage === 0 || disabled}
        aria-label={t('pagination.previous') || "Previous page"}
      >
        &laquo;
      </button>
      
      {pageNumbers.map((page, index) => {
        // Render ellipsis
        if (page < 0) {
          return (
            <span key={`ellipsis-${index}`} className={styles.ellipsis}>
              &hellip;
            </span>
          );
        }
        
        // Render page button
        return (
          <button
            key={`page-${page}`}
            className={`${styles.pageButton} ${page === currentPage ? styles.active : ''}`}
            onClick={() => handlePageClick(page)}
            disabled={disabled}
            aria-label={`${t('pagination.page') || "Page"} ${page + 1}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page + 1}
          </button>
        );
      })}
      
      <button
        className={`${styles.pageButton} ${styles.navButton}`}
        onClick={goToNextPage}
        disabled={currentPage >= totalPages - 1 || disabled}
        aria-label={t('pagination.next') || "Next page"}
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination;
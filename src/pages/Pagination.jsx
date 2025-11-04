
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
  const [touchStartX, setTouchStartX] = useState(0);

  // Swipe for mobile
  const handleSwipe = (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50 && currentPage < totalPages) setCurrentPage((p) => p + 1);
    else if (diff < -50 && currentPage > 1) setCurrentPage((p) => p - 1);
  };

  // Render page buttons (desktop + mobile)
  const renderPageButtons = (isMobile = false) => {
    const pages = [];
    const visibleRange = 1; // Show 1 page before and after current page

    pages.push(1); // Always show first page

    // Left dots
    if (currentPage - visibleRange > 2) pages.push("left-dots");

    // Middle pages
    for (
      let i = Math.max(2, currentPage - visibleRange);
      i <= Math.min(totalPages - 1, currentPage + visibleRange);
      i++
    ) {
      pages.push(i);
    }

    // Right dots
    if (currentPage + visibleRange < totalPages - 1) pages.push("right-dots");

    // Always show last page
    if (totalPages > 1) pages.push(totalPages);

    return pages.map((page, idx) => {
      if (page === "left-dots" || page === "right-dots") {
        return (
          <span
            key={page + idx}
            className={`text-gray-500 select-none ${
              isMobile ? "text-xs" : "text-sm"
            }`}
          >
            ...
          </span>
        );
      }

      return (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`${
            isMobile ? "px-1 py-1 text-xs" : "px-3 py-1 text-sm"
          } rounded ${
            currentPage === page
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-100 dark:text-gray-900"
          }`}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <>
      {/* Desktop Pagination */}
      {totalPages > 1 && (
        <div className="hidden md:flex justify-center items-center gap-2 mt-6">
          {/* Prev Button */}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`px-3 py-1 text-sm rounded ${
              currentPage === 1
                ? "bg-gray-200 opacity-50 cursor-not-allowed dark:bg-gray-100 dark:text-gray-900"
                : "bg-gray-200 hover:bg-gray-300 cursor-pointer dark:bg-gray-100 dark:text-gray-900"
            }`}
          >
            ‹
          </button>

          {/* Page Numbers */}
          <div className="flex gap-1">{renderPageButtons()}</div>

          {/* Next Button */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`px-3 py-1 text-sm rounded ${
              currentPage === totalPages
                ? "bg-gray-200 opacity-50 cursor-not-allowed dark:bg-gray-100 dark:text-gray-900"
                : "bg-gray-200 hover:bg-gray-300 cursor-pointer dark:bg-gray-100 dark:text-gray-900"
            }`}
          >
            ›
          </button>
        </div>
      )}

      {/* Mobile Pagination */}
      {totalPages > 1 && (
        <div
          className="md:hidden sticky bottom-0 bg-white z-10 flex flex-col gap-1 px-1 py-1 select-none"
          onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
          onTouchEnd={handleSwipe}
        >
          {/* Arrows + Current Page */}
          <div className="flex justify-between items-center">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className={`px-1 py-1 text-xs rounded ${
                currentPage === 1
                  ? "bg-gray-200 opacity-50 cursor-not-allowed dark:bg-gray-100 dark:text-gray-900"
                  : "bg-gray-200 hover:bg-gray-300 cursor-pointer dark:bg-gray-100 dark:text-gray-900"
              }`}
            >
              ‹
            </button>

            <AnimatePresence mode="wait">
              <motion.span
                key={currentPage}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="text-xs font-medium dark:bg-gray-100 dark:text-gray-900"
              >
                Page {currentPage} / {totalPages}
              </motion.span>
            </AnimatePresence>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className={`px-1 py-1 text-xs rounded ${
                currentPage === totalPages
                  ? "bg-gray-200 opacity-50 cursor-not-allowed dark:bg-gray-100 dark:text-gray-900"
                  : "bg-gray-200 hover:bg-gray-300 cursor-pointer dark:bg-gray-100 dark:text-gray-900"
              }`}
            >
              ›
            </button>
          </div>

          {/* Page Numbers for Mobile */}
          <div className="flex justify-center gap-1 items-center overflow-x-auto">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className={`px-1 py-1 text-xs rounded ${
                currentPage === 1
                  ? "bg-gray-200 opacity-50 cursor-not-allowed dark:bg-gray-100 dark:text-gray-900"
                  : "bg-gray-200 hover:bg-gray-300 cursor-pointer dark:bg-gray-100 dark:text-gray-900"
              }`}
            >
              ‹
            </button>

            {renderPageButtons(true)}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className={`px-1 py-1 text-xs rounded ${
                currentPage === totalPages
                  ? "bg-gray-200 opacity-50 cursor-not-allowed dark:bg-gray-100 dark:text-gray-900"
                  : "bg-gray-200 hover:bg-gray-300 cursor-pointer dark:bg-gray-100 dark:text-gray-900"
              }`}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Pagination;
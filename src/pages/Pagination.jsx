import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
  const [touchStartX, setTouchStartX] = useState(0);

  const handleSwipe = (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50 && currentPage < totalPages) setCurrentPage((p) => p + 1);
    else if (diff < -50 && currentPage > 1) setCurrentPage((p) => p - 1);
  };

  // ✅ Smart windowed pagination (shows only 4 page numbers)
  const renderPageButtons = () => {
    const pages = [];
    const maxVisible = 4;

    let start = Math.max(1, currentPage - 1);
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    // Always include first and last if far apart
    if (start > 1) pages.push(1);
    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages - 1) pages.push("...");
    if (end < totalPages) pages.push(totalPages);

    return pages.map((page, index) => {
      if (page === "...") {
        return (
          <span
            key={`dots-${index}`}
            className="px-2 py-1 text-gray-500 select-none"
          >
            ...
          </span>
        );
      }

      return (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-3 py-1 text-sm rounded ${
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

          <div className="flex gap-1">{renderPageButtons()}</div>

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
          className="md:hidden sticky bottom-0 bg-white z-10 flex flex-col gap-2 px-2 py-2 select-none"
          onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
          onTouchEnd={handleSwipe}
        >
          {/* Arrows + Current Page */}
          <div className="flex justify-between items-center">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className={`px-3 py-2 rounded ${
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
                className="text-sm font-medium dark:bg-gray-100 dark:text-gray-900"
              >
                Page {currentPage} / {totalPages}
              </motion.span>
            </AnimatePresence>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className={`px-3 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-200 opacity-50 cursor-not-allowed dark:bg-gray-100 dark:text-gray-900"
                  : "bg-gray-200 hover:bg-gray-300 cursor-pointer dark:bg-gray-100 dark:text-gray-900"
              }`}
            >
              ›
            </button>
          </div>

          {/* Number Buttons with Arrows */}
          <div className="flex justify-center gap-1 overflow-x-auto">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className={`px-3 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-200 opacity-50 cursor-not-allowed dark:bg-gray-100 dark:text-gray-900"
                  : "bg-gray-200 hover:bg-gray-300 cursor-pointer dark:bg-gray-100 dark:text-gray-900"
              }`}
            >
              ‹
            </button>

            {renderPageButtons()}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className={`px-3 py-2 rounded ${
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

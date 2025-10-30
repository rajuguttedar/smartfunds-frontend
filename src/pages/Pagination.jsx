import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
  const [touchStartX, setTouchStartX] = useState(0);

  const handleSwipe = (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50 && currentPage < totalPages) setCurrentPage((p) => p + 1);
    else if (diff < -50 && currentPage > 1) setCurrentPage((p) => p - 1);
  };

  // helper to calculate visible pages (max 4)
  const getVisiblePages = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);

    // always ensure 4 visible
    for (let i = start; i <= end; i++) pages.push(i);
    while (pages.length < 4 && pages[0] > 1) pages.unshift(pages[0] - 1);
    while (pages.length < 4 && pages[pages.length - 1] < totalPages)
      pages.push(pages[pages.length - 1] + 1);

    // ensure no duplicates beyond totalPages range
    return [...new Set(pages)].filter((p) => p >= 1 && p <= totalPages);
  };

  const visiblePages = getVisiblePages();

  return (
    <>
      {/* Desktop Pagination */}
      {totalPages > 1 && (
        <div className="hidden md:flex justify-center items-center gap-2 mt-6">
          {/* Prev */}
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

          {/* Pages */}
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 2 && page <= currentPage + 2)
              )
              .map((page, idx, arr) => {
                const prev = arr[idx - 1];
                if (prev && page - prev > 1)
                  return (
                    <span
                      key={`dots-${page}`}
                      className="px-2 py-1 text-gray-500 select-none"
                    >
                      ...
                    </span>
                  );
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
              })}
          </div>

          {/* Next */}
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
          {/* Top row: arrows + label */}
          <div className="flex justify-between items-center">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className={`px-3 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-200 opacity-50 cursor-not-allowed dark:bg-gray-100 dark:text-gray-900"
                  : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-100 dark:text-gray-900"
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
                  : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-100 dark:text-gray-900"
              }`}
            >
              ›
            </button>
          </div>

          {/* Bottom row: page buttons (limited to 4) */}
          <div className="flex justify-center items-center gap-1">
            {visiblePages[0] > 1 && (
              <>
                <button
                  onClick={() => setCurrentPage(1)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-100 dark:text-gray-900"
                  }`}
                >
                  1
                </button>
                <span className="px-2 text-gray-500">...</span>
              </>
            )}

            {visiblePages.map((page) => (
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
            ))}

            {visiblePages[visiblePages.length - 1] < totalPages && (
              <>
                <span className="px-2 text-gray-500">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === totalPages
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-100 dark:text-gray-900"
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Pagination;

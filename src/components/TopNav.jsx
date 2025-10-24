import { FaBars } from "react-icons/fa";
import clsx from "clsx";

export default function TopNav({ onMenuClick, showHamburger }) {
  return (
    <nav
      className={clsx(
        "flex items-center justify-between  font-suse-mono w-full max-w-full px-4 py-3 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-gray-800 dark:text-white">
          YMG SmartFunds
        </span>
      </div>
      <div className="flex items-center gap-2">
        {showHamburger && (
          <button
            className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <FaBars size={22} />
          </button>
        )}
      </div>
    </nav>
  );
}

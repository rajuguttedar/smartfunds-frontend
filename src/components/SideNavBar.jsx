import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUserPlus,
  FaUsers,
  FaUserEdit,
  FaUserFriends,
  FaSignOutAlt,
  FaCheckCircle,
  FaTimes,
  FaCalendarDay,
  FaUser,
} from "react-icons/fa"; // ✅ Added FaCheckCircle for completed accounts
import { IoMoonSharp, IoSunnySharp } from "react-icons/io5";
import clsx from "clsx";
import { useAuth } from "../context/AuthContext";


export default function SideNavBar({ dark, setDark, onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    if (onNavigate) onNavigate();
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },

    // Admin only
    user?.role === "admin" && {
      name: "Add Editor",
      path: "/add-editor",
      icon: <FaUserPlus />,
    },

    // Admin & Editor
    (user?.role === "admin" || user?.role === "editor") && {
      name: "Add Customer",
      path: "/add-customer",
      icon: <FaUsers />,
    },

    // Admin only: Editors list
    user?.role === "admin" && {
      name: "Editors",
      path: "/editors",
      icon: <FaUserEdit />,
    },

    // Admin & Editor: Customers list
    (user?.role === "admin" || user?.role === "editor") && {
      name: "Customers",
      path: "/customers",
      icon: <FaUserFriends />,
    },
    // ✅ Admin only: Completed Accounts
    user?.role === "admin" && {
      name: "Completed Accounts",
      path: "/completed-accounts",
      icon: <FaCheckCircle />,
    },
    (user?.role === "admin" || user?.role === "editor") && {
      name: "Find 100th Day",
      path: "/days",
      icon: <FaCalendarDay />,
    },
    (user?.role === "admin" || user?.role === "editor") && {
      name: "Find Age",
      path: "/age",
      icon: <FaUser />,
    },
  ].filter(Boolean); // Remove nulls

  return (
    // Use min-h-screen so sidebar spans the viewport; keep w-64 fixed width
    <div
      className={clsx(
        "h-[100dvh] sm:h-screen w-64 p-4 bg-gray-100 dark:bg-gray-900 flex flex-col justify-between overflow-y-auto",
        dark ? "dark" : ""
      )}
    >
      <div>
        {/* Header row: logo and close icon on mobile */}
        <div className="flex items-center justify-between mb-6 pt-6">
          <h1 className="text-2xl font-bold font-suse-mono text-gray-800 dark:text-white">
            YMG SmartFunds
          </h1>
          {onNavigate && (
            <button
              className="sm:hidden p-2 ml-2 rounded  hover:bg-gray-200 dark:hover:bg-gray-800"
              onClick={onNavigate}
              aria-label="Close sidebar"
            >
              <FaTimes className="dark:text-white" size={22} />
            </button>
          )}
        </div>
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="mb-2">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-2 p-2 rounded-md font-suse-mono text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800",
                    isActive && "bg-gray-300 dark:bg-gray-700 font-semibold"
                  )
                }
                onClick={() => {
                  if (onNavigate) onNavigate();
                }}
              >
                {item.icon} {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <button
          onClick={handleLogout}
          className="flex items-center font-suse-mono gap-2 p-2 w-full rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
        >
          <FaSignOutAlt /> Logout
        </button>
        <button
          onClick={() => setDark(!dark)}
          className="flex items-center font-suse-mono gap-2 p-2 w-auto rounded-md mt-4 hover:bg-gray-400 hover:text-white dark:hover:bg-gray-800 text-gray-700 dark:text-white"
        >
          {dark ? (
            <>
              <IoSunnySharp /> Light
            </>
          ) : (
            <>
              <IoMoonSharp /> Dark
            </>
          )}
        </button>
      </div>
    </div>
  );
}

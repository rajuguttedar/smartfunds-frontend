import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import { useAuth } from "../context/AuthContext";
import SideNavBar from "./SideNavBar";

export default function Layout() {
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  // Apply dark mode class to <html>
  useEffect(() => {
    const html = document.documentElement;
    dark ? html.classList.add("dark") : html.classList.remove("dark");
  }, [dark]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Mobile TopNav */}
      <div className="sm:hidden w-full sticky top-0 z-50">
        <TopNav
          onMenuClick={() => setSidebarOpen(true)}
          showHamburger={!sidebarOpen}
        />
      </div>

      <div className="flex flex-1 min-h-0 w-full overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden sm:block h-full">
          <SideNavBar dark={dark} setDark={setDark} />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex bg-black/20">
            <div className="w-64 min-h-screen bg-gray-100 dark:bg-gray-900 shadow-2xl">
              <SideNavBar
                dark={dark}
                setDark={setDark}
                onNavigate={() => setSidebarOpen(false)}
              />
            </div>
            <div className="flex-1" onClick={() => setSidebarOpen(false)} />
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-0 bg-gray-50 dark:bg-gray-800 overflow-hidden">
          {/* Desktop Header */}
          <div className="hidden sm:block p-6 border-b mx-auto border-gray-200 dark:border-gray-700">
            <span className="text-2xl  font-bold font-suse-mono text-gray-800 dark:text-white">
              Welcome to YMG SmartFunds - {user?.name || "User"}
            </span>
          </div>

          {/* Routed Page Content */}
          <div className="flex-1 min-h-0 overflow-auto dark:text-gray-200 p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

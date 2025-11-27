import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

const Sidebar = ({ className = "", onClose }: SidebarProps) => {
  const location = useLocation();
  const { signOut, user } = useAuth();

  const navItems = [
    { name: "Dashboard", icon: "dashboard", path: "/dashboard" },
    { name: "Tasks", icon: "checklist", path: "/project/tasks" },
    { name: "Design Catalogue", icon: "home_work", path: "/catalogue" },
    { name: "Plan Editor", icon: "architecture", path: "/editor" },
    { name: "Permit Guide", icon: "description", path: "/guide" },
    { name: "Financial Planning", icon: "paid", path: "/finance" },
    { name: "Payments & Budget", icon: "credit_card", path: "/payments" },
    { name: "Find Professionals", icon: "groups", path: "/contractors" },
    { name: "Documents", icon: "folder_open", path: "/documents" },
    { name: "Messages", icon: "chat", path: "/messages" },
  ];

  return (
    <aside
      className={`flex flex-col w-72 bg-white border-r border-slate-200 h-screen ${className}`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="size-8 text-primary">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              HomeFlow
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md hover:bg-slate-100 text-slate-500"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>

        <div className="mt-8 flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div
            className="w-10 h-10 rounded-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${
                user?.user_metadata?.avatar_url ||
                "https://ui-avatars.com/api/?name=" +
                  (user?.email || "User") +
                  "&background=0D8ABC&color=fff"
              })`,
            }}
          ></div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900">
              {user?.user_metadata?.full_name ||
                user?.email?.split("@")[0] ||
                "User"}
            </span>
            <span className="text-xs text-slate-500 truncate w-32">
              {user?.email}
            </span>
          </div>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                  ${
                    isActive
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-slate-600 hover:bg-slate-50 font-medium"
                  }
                `}
              >
                <span
                  className={`material-symbols-outlined ${
                    isActive ? "filled" : ""
                  }`}
                >
                  {item.icon}
                </span>
                <span className="text-sm">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-100">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

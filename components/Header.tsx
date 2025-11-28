import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const Header = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleScrollTo = (elementId: string) => {
    if (location.pathname === "/") {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/", { state: { scrollTo: elementId } });
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 sticky top-0 z-50">
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

      <div className="flex items-center gap-4 sm:gap-8">
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => handleScrollTo("how-it-works")}
            className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
          >
            How it Works
          </button>
          <Link
            to="/features"
            className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
          >
            Features
          </Link>
        </nav>

        {user ? (
          <Link
            to="/dashboard"
            className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-black text-sm font-bold rounded-lg transition-colors shadow-sm shadow-primary/20"
          >
            Dashboard
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-bold text-slate-600 hover:text-primary px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/login?mode=signup"
              className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-black text-sm font-bold rounded-lg transition-colors shadow-sm shadow-primary/20"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

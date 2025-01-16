import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-500 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold tracking-wide">
              Mental Health App
            </Link>
          </div>

          <div className="hidden md:flex space-x-8">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/mood">Mood Tracker</NavLink>
            <NavLink href="/journal">Journal</NavLink>
            <NavLink href="/challenges">Daily Challenges</NavLink>
            <NavLink href="/profile">Profile</NavLink>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm">
                  Hello, {user.displayName || "User"}!
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-500 rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={handleToggle}
              className="text-white focus:outline-none"
              aria-label="Toggle navigation"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-400">
          <div className="space-y-1 px-2 py-3">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/mood">Mood Tracker</NavLink>
            <NavLink href="/journal">Journal</NavLink>
            <NavLink href="/challenges">Daily Challenges</NavLink>
            <NavLink href="/profile">Profile</NavLink>
            {user && (
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 bg-red-500 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500"
    >
      {children}
    </Link>
  );
}

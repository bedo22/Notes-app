import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar(){
    const {signOut, user} = useAuth()
    const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check localStorage and system preference on mount
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = stored === "dark" || (!stored && prefersDark);
    
    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  function toggleDarkMode() {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  return (
    <nav className="border-b bg-white dark:bg-gray-950 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          QuickNotes
        </Link>
        <div className="flex items-center gap-4">
          <Button
            onClick={toggleDarkMode}
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0"
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          {user && (
            <>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user.email}
              </span>
              <Button onClick={signOut} variant="outline" size="sm">
                Sign Out
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
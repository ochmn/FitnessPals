import { Home, BookmarkCheck, CalendarDays, User } from "lucide-react";
import { Link, useLocation } from "wouter";

const BottomNavigation = () => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="sticky bottom-0 bg-white border-t border-neutral-200 py-2 px-4 z-10">
      <div className="grid grid-cols-4 gap-1">
        <Link href="/">
          <button className={`flex flex-col items-center justify-center py-1 ${isActive('/') ? 'text-primary' : 'text-neutral-400'}`}>
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </button>
        </Link>
        <Link href="/saved">
          <button className={`flex flex-col items-center justify-center py-1 ${isActive('/saved') ? 'text-primary' : 'text-neutral-400'}`}>
            <BookmarkCheck className="h-6 w-6" />
            <span className="text-xs mt-1">Saved</span>
          </button>
        </Link>
        <Link href="/calendar">
          <button className={`flex flex-col items-center justify-center py-1 ${isActive('/calendar') ? 'text-primary' : 'text-neutral-400'}`}>
            <CalendarDays className="h-6 w-6" />
            <span className="text-xs mt-1">Calendar</span>
          </button>
        </Link>
        <Link href="/profile">
          <button className={`flex flex-col items-center justify-center py-1 ${isActive('/profile') ? 'text-primary' : 'text-neutral-400'}`}>
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavigation;

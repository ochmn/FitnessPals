import { useQuery } from "@tanstack/react-query";
import { Zap } from "lucide-react";
import { Link } from "wouter";

const Header = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/user'],
  });

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <Zap className="h-8 w-8 text-primary" />
            <h1 className="ml-2 text-xl font-bold text-neutral-800">FitPet</h1>
          </div>
        </Link>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button className="p-2 text-neutral-500 hover:text-primary focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 h-2 w-2 bg-red-500 rounded-full"></div>
            </button>
          </div>
          {!isLoading && user && (
            <div className="rounded-full overflow-hidden w-8 h-8 focus:outline-none ring-2 ring-primary">
              <img 
                src={user.profilePicture || "https://pixabay.com/get/gf37c8313415a9442cc21c61979ba67554513af11c38070e058e4bb7db83f375e77a4418a48777514c23570323403173126fdaa96cb984ed97e7e1609033c7412_1280.jpg"} 
                alt="Profile" 
                className="w-full h-full object-cover" 
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

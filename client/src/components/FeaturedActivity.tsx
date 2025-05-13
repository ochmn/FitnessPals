import { CalendarDays, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Activity } from "@shared/schema";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const FeaturedActivity = () => {
  const { toast } = useToast();
  
  const { data: activities, isLoading, error } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
  });

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl shadow-sm p-5 text-white mb-4 animate-pulse">
        <div className="h-6 w-2/3 bg-white bg-opacity-30 rounded mb-3"></div>
        <div className="h-4 w-full bg-white bg-opacity-20 rounded mb-4"></div>
        <div className="h-4 w-1/2 bg-white bg-opacity-20 rounded mb-2"></div>
        <div className="h-4 w-2/3 bg-white bg-opacity-20 rounded mb-4"></div>
        <div className="h-10 w-24 bg-white bg-opacity-40 rounded"></div>
      </div>
    );
  }

  if (error || !activities || activities.length === 0) {
    return null;
  }

  // Use the first activity
  const activity = activities[0];
  
  // Format the date
  const activityDate = new Date(activity.date);
  const formattedDate = format(activityDate, "EEEE, h:mm a");
  
  const handleSignUp = () => {
    toast({
      title: "Signed Up!",
      description: `You've been registered for ${activity.title}`,
    });
  };

  return (
    <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl shadow-sm p-5 text-white mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-xl">{activity.title}</h3>
          <p className="mt-1 text-white text-opacity-80">{activity.description}</p>
          <div className="mt-4 flex items-center text-sm">
            <CalendarDays className="h-4 w-4 mr-1" />
            <span>{formattedDate}</span>
          </div>
          <div className="mt-1 flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{activity.locationName}</span>
          </div>
          
          <button 
            className="mt-4 bg-white text-primary font-medium px-4 py-2 rounded-lg text-sm"
            onClick={handleSignUp}
          >
            Sign Up
          </button>
        </div>
        
        <div className="hidden sm:flex w-24 h-24 bg-white bg-opacity-10 rounded-full items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default FeaturedActivity;

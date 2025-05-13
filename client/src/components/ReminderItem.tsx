import { X } from "lucide-react";
import { Reminder } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { formatDistanceToNow, isFuture } from "date-fns";

interface ReminderItemProps {
  reminder: Reminder;
}

const ReminderItem: React.FC<ReminderItemProps> = ({ reminder }) => {
  const { toast } = useToast();
  
  // Format the time
  const formattedTime = new Date(reminder.date).toLocaleTimeString([], { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  
  // Format the date
  const today = new Date().setHours(0, 0, 0, 0);
  const reminderDate = new Date(reminder.date).setHours(0, 0, 0, 0);
  const isToday = today === reminderDate;
  const isTomorrow = today + 86400000 === reminderDate;
  
  let dateLabel = '';
  if (isToday) {
    dateLabel = 'Today';
  } else if (isTomorrow) {
    dateLabel = 'Tomorrow';
  } else {
    dateLabel = formatDistanceToNow(new Date(reminder.date), { addSuffix: true });
  }
  
  // Delete reminder mutation
  const deleteReminderMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('DELETE', `/api/reminders/${reminder.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reminders'] });
      toast({
        title: "Reminder deleted",
        description: "The reminder has been successfully removed",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete reminder: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Function to delete reminder
  const handleDelete = () => {
    deleteReminderMutation.mutate();
  };
  
  // Determine icon background based on completion status or recency
  const getIconBackground = () => {
    if (reminder.isCompleted) {
      return "bg-neutral-200 text-neutral-600";
    }
    
    if (isFuture(new Date(reminder.date))) {
      return "bg-primary-light bg-opacity-10 text-primary";
    }
    
    return "bg-red-100 text-red-600";
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
      <div className="flex items-center">
        <div className={`rounded-full p-2 mr-3 ${getIconBackground()}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h4 className="font-medium">{reminder.title}</h4>
          <p className="text-sm text-neutral-500">
            {dateLabel}, {formattedTime} - {reminder.locationName}
          </p>
        </div>
      </div>
      <button 
        className="text-neutral-400 hover:text-neutral-600"
        onClick={handleDelete}
        disabled={deleteReminderMutation.isPending}
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ReminderItem;

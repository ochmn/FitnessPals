import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { addDays, addHours, addMinutes } from "date-fns";
import { Location } from "@shared/schema";

interface AddReminderDialogProps {
  userId: number;
  trigger?: React.ReactNode;
}

const AddReminderDialog: React.FC<AddReminderDialogProps> = ({ userId, trigger }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [locationId, setLocationId] = useState("");
  const [notificationTime, setNotificationTime] = useState("15min");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Fetch locations for dropdown
  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ['/api/locations'],
  });

  // Create reminder mutation
  const createReminderMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/reminders', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reminders'] });
      toast({
        title: "Reminder created",
        description: "Your new reminder has been added to the calendar",
      });
      setOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create reminder: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setTitle("");
    setDate("");
    setTime("");
    setLocationId("");
    setNotificationTime("15min");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !date || !time || !locationId) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Find the selected location to get its name
    const selectedLocation = locations.find(loc => loc.id.toString() === locationId);
    if (!selectedLocation) {
      toast({
        title: "Invalid location",
        description: "Please select a valid location",
        variant: "destructive",
      });
      return;
    }

    // Combine date and time
    const reminderDateTime = new Date(`${date}T${time}`);
    
    // Calculate notification time based on selected option
    let notificationDateTime;
    switch(notificationTime) {
      case "15min":
        notificationDateTime = addMinutes(reminderDateTime, -15);
        break;
      case "30min":
        notificationDateTime = addMinutes(reminderDateTime, -30);
        break;
      case "1hour":
        notificationDateTime = addHours(reminderDateTime, -1);
        break;
      case "1day":
        notificationDateTime = addDays(reminderDateTime, -1);
        break;
      default:
        notificationDateTime = addMinutes(reminderDateTime, -15);
    }

    // Create the reminder
    createReminderMutation.mutate({
      userId,
      title,
      locationId: parseInt(locationId),
      locationName: selectedLocation.name,
      date: reminderDateTime.toISOString(),
      notificationTime: notificationDateTime.toISOString(),
      isCompleted: false
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="text-primary text-sm font-medium flex items-center">
            <PlusCircle className="h-4 w-4 mr-1" />
            Add New
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Reminder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="title">Activity Name</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g., Morning Run with Max"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="time">Time</Label>
              <Input 
                id="time" 
                type="time" 
                value={time} 
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="location">Location</Label>
            <Select value={locationId} onValueChange={setLocationId}>
              <SelectTrigger id="location">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id.toString()}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="notification">Notification</Label>
            <Select value={notificationTime} onValueChange={setNotificationTime}>
              <SelectTrigger id="notification">
                <SelectValue placeholder="Select notification time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15min">15 minutes before</SelectItem>
                <SelectItem value="30min">30 minutes before</SelectItem>
                <SelectItem value="1hour">1 hour before</SelectItem>
                <SelectItem value="1day">1 day before</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={createReminderMutation.isPending}
            >
              {createReminderMutation.isPending ? "Saving..." : "Save Reminder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddReminderDialog;

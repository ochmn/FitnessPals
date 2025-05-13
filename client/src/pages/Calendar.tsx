import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import ReminderItem from "@/components/ReminderItem";
import AddReminderDialog from "@/components/AddReminderDialog";
import { format, isSameDay } from "date-fns";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Fetch all reminders
  const { data: reminders = [], isLoading } = useQuery({
    queryKey: ['/api/reminders', 1], // Using user ID 1 for demo
    queryFn: async () => {
      const response = await fetch('/api/reminders?userId=1');
      if (!response.ok) {
        throw new Error('Failed to fetch reminders');
      }
      return response.json();
    }
  });

  // Filter reminders for the selected date
  const remindersForSelectedDate = selectedDate 
    ? reminders.filter(reminder => 
        isSameDay(new Date(reminder.date), selectedDate)
      )
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Calendar</h2>
          <AddReminderDialog 
            userId={1}
            trigger={
              <button className="p-2 rounded-full bg-primary text-white">
                <Plus className="h-5 w-5" />
              </button>
            }
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <ChevronLeft className="h-5 w-5 text-neutral-500" />
            </button>
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">
                {selectedDate ? format(selectedDate, 'MMMM yyyy') : ''}
              </h3>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <ChevronRight className="h-5 w-5 text-neutral-500" />
            </button>
          </div>
          
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {selectedDate ? `Reminders for ${format(selectedDate, 'MMMM d, yyyy')}` : 'Reminders'}
          </h3>
          
          {isLoading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : remindersForSelectedDate.length > 0 ? (
            <div className="space-y-3">
              {remindersForSelectedDate.map((reminder) => (
                <ReminderItem key={reminder.id} reminder={reminder} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <CalendarIcon className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
              <h4 className="text-lg font-medium text-neutral-700 mb-1">No reminders</h4>
              <p className="text-neutral-500 mb-4">
                You don't have any reminders scheduled for this day.
              </p>
              <AddReminderDialog 
                userId={1}
                trigger={
                  <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm inline-flex items-center">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Reminder
                  </button>
                }
              />
            </div>
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Calendar;

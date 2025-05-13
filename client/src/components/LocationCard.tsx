import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Location } from "@shared/schema";

interface LocationCardProps {
  location: Location;
}

const LocationCard: React.FC<LocationCardProps> = ({ location }) => {
  return (
    <Card className="location-card overflow-hidden transition-transform duration-300 hover:-translate-y-1">
      <div className="w-full h-40 overflow-hidden">
        <img 
          src={location.image || "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80"} 
          alt={location.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">{location.name}</h4>
          <span className="flex items-center text-sm text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1">{location.rating}</span>
          </span>
        </div>
        <div className="flex items-center text-sm text-neutral-500 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location.distance ? `${location.distance} miles away` : location.address}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {location.amenities && location.amenities.map((amenity, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className={`px-2 py-1 text-xs font-medium rounded-full
                ${index % 2 === 0 ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}
            >
              {amenity}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationCard;

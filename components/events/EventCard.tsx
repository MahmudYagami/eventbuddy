import Image from 'next/image';
import { Button } from '../ui/Button';

interface EventCardProps {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  spotsLeft: number;
  isPast?: boolean;
  onBook?: (id: number) => void;
}

export function EventCard({
  id,
  title,
  date,
  time,
  location,
  image,
  spotsLeft,
  isPast = false,
  onBook
}: EventCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 sm:h-56 md:h-64">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold mb-2 line-clamp-2">{title}</h3>
        
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <p className="flex items-center gap-2">
            <span className="font-medium">Date:</span>
            {date}
          </p>
          <p className="flex items-center gap-2">
            <span className="font-medium">Time:</span>
            {time}
          </p>
          <p className="flex items-center gap-2">
            <span className="font-medium">Location:</span>
            {location}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-600">
            {spotsLeft} spots left
          </p>
          
          {!isPast && onBook && (
            <Button
              size="sm"
              onClick={() => onBook(id)}
              disabled={spotsLeft === 0}
            >
              {spotsLeft === 0 ? 'Sold Out' : 'Book Now'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 
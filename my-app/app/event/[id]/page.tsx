"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { events } from "@/lib/data";
import Image from "next/image";
import { use, useState } from "react";

interface EventParams {
  id: string;
}

export default function EventDetails({ params }: { params: Promise<EventParams> }) {
  const router = useRouter();
  const { isAuthenticated, user, addBooking } = useAuth();
  const resolvedParams = use(params);
  const event = events.find((e) => e.id === parseInt(resolvedParams.id));

  const [selectedSeats, setSelectedSeats] = useState(1);

  if (!event) return <div>Event not found</div>;

  const handleBook = () => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      addBooking({
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventLocation: event.location,
        bookingDate: new Date().toLocaleDateString()
      });
      alert(`Booked ${event.title} for ${selectedSeats} seat(s)!`);
      router.push("/dashboard");
    }
  };

  // Check if user has already booked this event
  const hasBooked = user?.bookings?.some(booking => booking.eventId === event.id);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="max-w-4xl mx-auto p-4">
        <button onClick={() => router.back()} className="text-sm text-purple-600 mb-4">← Back to event</button>

        <div className="rounded-xl overflow-hidden mb-6">
          <Image
            src={event.image}
            alt={event.title}
            width={1000}
            height={500}
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="flex flex-wrap gap-2 text-sm text-purple-600 mb-2">
          {event.tags.map((tag, index) => (
            <span key={index} className="bg-purple-100 px-2 py-1 rounded">{tag}</span>
          ))}
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-2">{event.title}</h1>

        <div className="flex flex-col sm:flex-row sm:space-x-6 text-sm text-gray-500 mb-6">
          <div>📅 {event.date}</div>
          <div>⏰ {event.time}</div>
          <div>📍 {event.location}</div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">Select Number of Seats</h2>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                onClick={() => setSelectedSeats(num)}
                className={`border rounded-lg py-3 flex flex-col items-center text-sm font-medium transition-colors ${
                  selectedSeats === num ? 'border-purple-600 text-purple-600' : 'hover:border-purple-400'
                }`}
              >
                🎟 {num} {num === 1 ? "Seat" : "Seats"}
              </button>
            ))}
          </div>
          <button 
            onClick={handleBook} 
            disabled={!event.spotsLeft || hasBooked} 
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {hasBooked ? "Already Booked" : `Book ${selectedSeats} Ticket${selectedSeats > 1 ? "s" : ""}`}
          </button>
        </div>

        <div className="text-sm mb-4">
          <h2 className="text-lg font-semibold mb-2">About this event</h2>
          <p className="text-gray-700 mb-2">{event.description}</p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Keynote talks from industry pioneers</li>
            <li>Live demos presenting tech products</li>
            <li>Startup pitching sessions & hands-on coding workshops</li>
            <li>Networking with top professionals & students</li>
          </ul>
        </div>

        <div className="text-purple-700 text-sm font-medium">
          {event.spotsLeft} Spots Left
        </div>
      </div>
      <footer className="bg-[#f4f4fc] text-sm text-center py-6 border-t mt-12">
        <div className="text-[#1e1e2f] font-semibold mb-1">Event buddy.</div>
        <div className="flex justify-center gap-4 text-gray-600 text-xs">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Sign in</a>
          <a href="#" className="hover:underline">Sign up</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
        </div>
        <p className="mt-2 text-gray-400">© 2025 Event buddy. All rights reserved.</p>
      </footer>
    </div>
    
  );
}
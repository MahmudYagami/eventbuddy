"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Trash2, Pencil } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { events as initialEvents } from "@/lib/data";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  spotsLeft: number;
  isPast: boolean;
}

export default function AdminDashboard() {
  const { isAuthenticated, logout, isAdmin } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);

  const loadEvents = useCallback(() => {
    // Load events from localStorage
    const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    
    // Combine initial events with stored events
    // Filter out any initial events that have been deleted
    const deletedIds = new Set(JSON.parse(localStorage.getItem('deletedEventIds') || '[]'));
    const filteredInitialEvents = initialEvents.filter(event => !deletedIds.has(event.id));
    
    // Create a Map to store unique events by ID
    const uniqueEvents = new Map();
    
    // Add initial events first
    filteredInitialEvents.forEach((event: Event) => {
      uniqueEvents.set(event.id, event);
    });
    
    // Add stored events, ensuring no duplicates
    storedEvents.forEach((event: Event) => {
      if (!uniqueEvents.has(event.id)) {
        uniqueEvents.set(event.id, event);
      }
    });
    
    // Convert Map back to array and sort by date
    const allEvents = Array.from(uniqueEvents.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    setEvents(allEvents);
  }, []); // Empty dependency array since this function doesn't depend on any props or state

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/login");
    } else {
      loadEvents();
    }
  }, [isAuthenticated, isAdmin, router, loadEvents]);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const handleEdit = (id: number) => router.push(`/admin/edit/${id}`);
  
  const handleDelete = (id: number) => {
    // Check if the event is from initial events
    const isInitialEvent = initialEvents.some(event => event.id === id);
    
    if (isInitialEvent) {
      // Add to deleted IDs list
      const deletedIds = new Set(JSON.parse(localStorage.getItem('deletedEventIds') || '[]'));
      deletedIds.add(id);
      localStorage.setItem('deletedEventIds', JSON.stringify([...deletedIds]));
      
      // Also remove from stored events if it exists there
      const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
      const updatedEvents = storedEvents.filter((event: Event) => event.id !== id);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
    } else {
      // Remove from localStorage events
      const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
      const updatedEvents = storedEvents.filter((event: Event) => event.id !== id);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
    }
    
    // Update state
    setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
  };
  
  const handleCreate = () => router.push("/admin/create");

  return (
    <div className="min-h-screen bg-white text-[#1e1e2f] font-sans">
      {/* Top Nav */}
      <header className="flex justify-between items-center px-6 py-4 border-b">
        <h1 className="text-xl font-semibold">Event buddy.</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Hello, Admin</span>
          <button
            onClick={logout}
            className="bg-[#4c60ff] text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold mb-2">Admin Dashboard</h2>
        <p className="text-sm text-gray-500 mb-6">
          Manage events, view registrations, and monitor your platform.
        </p>

        <div className="flex justify-end mb-4">
          <button
            onClick={handleCreate}
            className="bg-[#4c60ff] text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Event
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Registrations</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {events.map((event) => (
                <tr key={event.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{event.title}</td>
                  <td className="px-4 py-3">{event.date}</td>
                  <td className="px-4 py-3">{event.location}</td>
                  <td className="px-4 py-3">{`${event.capacity - event.spotsLeft}/${event.capacity}`}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => handleEdit(event.id)} className="text-blue-600 hover:text-blue-800">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Footer */}
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
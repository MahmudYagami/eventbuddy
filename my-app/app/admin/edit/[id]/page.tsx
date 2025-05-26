"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { events as initialEvents } from "@/lib/data";
import { useEffect, useState } from "react";
import { use } from "react";

interface EventParams {
  id: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  location: string;
  capacity: number;
  tags: string[];
  image: string;
  spotsLeft: number;
  isPast: boolean;
}

export default function EditEvent({ params }: { params: Promise<EventParams> }) {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();
  const resolvedParams = use(params);
  const eventId = parseInt(resolvedParams.id);

  // Find event from either initial events or localStorage
  const initialEvent = initialEvents.find((e) => e.id === eventId);
  const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
  const storedEvent = storedEvents.find((e: Event) => e.id === eventId);
  const event = initialEvent || storedEvent;

  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
    location: "",
    capacity: 0,
    tags: "",
  });

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/login");
    }
  }, [isAuthenticated, isAdmin, router]);

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title,
        date: event.date,
        time: event.time,
        description: event.description,
        location: event.location,
        capacity: event.capacity,
        tags: event.tags.join(","),
      });
    }
  }, [event]);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedEvent = {
      ...event,
      title: form.title,
      date: form.date,
      time: form.time,
      description: form.description,
      location: form.location,
      capacity: parseInt(form.capacity.toString()),
      tags: form.tags.split(',').map(tag => tag.trim()),
      spotsLeft: parseInt(form.capacity.toString()),
      isPast: new Date(form.date) < new Date()
    };

    // If it's an initial event, we need to add it to localStorage
    if (initialEvent) {
      const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
      const updatedEvents = storedEvents.filter((e: Event) => e.id !== eventId);
      updatedEvents.push(updatedEvent);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
    } else {
      // Update the stored event
      const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
      const updatedEvents = storedEvents.map((e: Event) => 
        e.id === eventId ? updatedEvent : e
      );
      localStorage.setItem('events', JSON.stringify(updatedEvents));
    }

    alert("Event updated successfully!");
    router.push("/admin");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-white text-[#1e1e2f] font-sans">
      <header className="flex justify-between items-center px-6 py-4 border-b">
        <h1 className="text-xl font-semibold">Event buddy.</h1>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold mb-6">Edit Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="text"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time</label>
              <input
                type="text"
                name="time"
                value={form.time}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-2 border rounded h-32"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Capacity</label>
            <input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#4c60ff] text-white rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

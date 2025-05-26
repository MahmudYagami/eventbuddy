"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Calendar, Clock, Upload } from "lucide-react";
import { useState, useEffect } from "react";

export default function CreateEvent() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
    location: "",
    capacity: "",
    tags: "",
    image: "/placeholder.png"
  });

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) router.push("/login");
  }, [isAuthenticated, isAdmin, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get existing events from localStorage
    const existingEvents = JSON.parse(localStorage.getItem('events') || '[]');
    
    // Create new event object with a unique ID based on timestamp and random number
    const newEvent = {
      id: Date.now() + Math.floor(Math.random() * 1000), // Ensure unique ID
      title: formData.title,
      date: formData.date,
      time: formData.time,
      description: formData.description,
      location: formData.location,
      capacity: parseInt(formData.capacity),
      tags: formData.tags.split(',').map(tag => tag.trim()),
      image: formData.image,
      spotsLeft: parseInt(formData.capacity),
      isPast: new Date(formData.date) < new Date()
    };

    // Add new event to array
    const updatedEvents = [...existingEvents, newEvent];
    
    // Save to localStorage
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    
    alert("Event created successfully!");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-center p-6">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8 border relative">
        <h2 className="text-2xl font-semibold text-[#1e1e2f] mb-6">Create New Event</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm text-[#1e1e2f]">
          <div>
            <label className="block mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block mb-1">Date</label>
              <div className="relative">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 pr-10 focus:outline-none"
                />
                <Calendar className="absolute right-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>
            <div className="w-1/2">
              <label className="block mb-1">Time</label>
              <div className="relative">
                <input
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  placeholder="e.g. 09:00 AM – 11:00 AM"
                  required
                  className="w-full border rounded px-3 py-2 pr-10 focus:outline-none"
                />
                <Clock className="absolute right-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 h-24 resize-none focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1">Event Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-none"
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block mb-1">Capacity</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
                className="w-full border rounded px-3 py-2 focus:outline-none"
              />
            </div>
            <div className="w-1/2">
              <label className="block mb-1">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2">Image</label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <div className="flex flex-col items-center gap-2 text-gray-500">
                <Upload size={24} />
                <span>
                  Drag or{" "}
                  <a href="#" className="text-blue-500 underline">
                    upload
                  </a>{" "}
                  the picture here
                </span>
                <small>Max. 5MB | JPG, PNG</small>
              </div>
              <div className="mt-3">
                <input type="file" className="hidden" id="file-upload" />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-4 py-2 bg-gray-100 text-sm border rounded cursor-pointer hover:bg-gray-200"
                >
                  Browse
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="text-gray-500 hover:underline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#4c60ff] text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create Event
            </button>
          </div>
        </form>

        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-black text-lg"
          onClick={() => router.push("/admin")}
        >
          &times;
        </button>
      </div>
    </div>
  );
}

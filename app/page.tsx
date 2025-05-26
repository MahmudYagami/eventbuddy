"use client";

import { useRouter } from "next/navigation";
import { events } from "@/lib/data";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import heroImg from "@/public/img.png";
import ticketLeft from "@/public/ticket left.png";
import ticketRight from "@/public/ticket right.png";


export default function Home() {
  const router = useRouter();
  const { user, logout} = useAuth();
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [previousPage, setPreviousPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const eventsPerPage = 5;

  const handleBookNow = (id: number) => {
    router.push(`/event/${id}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setUpcomingPage(1);
    setPreviousPage(1);
  };

  const filteredEvents = events.filter((event) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      event.title.toLowerCase().includes(searchLower) ||
      event.location.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower)
    );
  });

  const upcomingEvents = filteredEvents.filter((event) => !event.isPast);
  const previousEvents = filteredEvents.filter((event) => event.isPast);
  const totalUpcomingPages = Math.ceil(upcomingEvents.length / eventsPerPage);
  const totalPreviousPages = Math.ceil(previousEvents.length / eventsPerPage);

  const getPaginatedEvents = (events: typeof upcomingEvents, page: number) => {
    const startIndex = (page - 1) * eventsPerPage;
    return events.slice(startIndex, startIndex + eventsPerPage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f3f4f6] to-[#e0e7ff] relative">
      {/* Logo */}
      <div className="absolute top-6 left-6 z-20">
        <h1 className="text-2xl font-bold text-white">
          <span className="text-blue-800 flex ml-20">
            <Image
              src="https://img.icons8.com/ios-glyphs/30/today.png"
              alt="today"
              width={30}
              height={30}
              className="mr-2"
            />
            Event buddy.
          </span> 
        </h1>
      </div>

      {/* Hero Section */}
<div className="relative h-[90vh] flex flex-col items-center justify-center text-center px-4">
  {/* Background Image */}
  <Image
    src={heroImg}
    alt="Hero Background"
    layout="fill"
    objectFit="cover"
    className="z-0"
    priority
  />
  {/* Sign In / Sign Up */}
  <div className="absolute top-6 right-6 flex gap-4 z-20">
    {user ? (
      <>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-white hover:text-blue-200 transition-colors"
        >
          Welcome, {user.name}!
        </button>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </>
    ) : (
      <>
        <button
          onClick={() => router.push("/login")}
          className="bg-white text-blue-600 font-medium px-4 py-2 rounded hover:bg-gray-100"
        >
          Sign In
        </button>
        <button
          onClick={() => router.push("/login")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
      </>
    )}
  </div>

  {/* Floating Tickets */}
  <Image
    src={ticketLeft}
    alt="ticket-left"
    width={500}
    height={80}
    className="absolute left-10 top-24 rotate-[-15deg] hidden md:block z-20"
  />
  <Image
    src={ticketRight}
    alt="ticket-right"
    width={500}
    height={80}
    className="absolute right-10 top-24 rotate-[15deg] hidden md:block z-20"
  />

  {/* Main Hero Text */}
  <div className="z-20">
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
      Discover <span className="text-blue-400">Amazing <br /></span> Events
    </h1>
    <p className="text-white max-w-2xl text-lg sm:text-xl mb-8">
      Find and book events that match your interests. From tech conferences to music festivals, we&apos;ve got you covered.
    </p>

    {/* Search Bar */}
    <form
      onSubmit={handleSearch}
      className="flex flex-col sm:flex-row items-center gap-4"
    >
      <input
        type="text"
        placeholder="Search events"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="px-4 py-2 w-72 sm:w-96 rounded-lg border border-gray-300"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Search Events
      </button>
    </form>
  </div>
</div>

      {/* Event Listings */}
      <div className="px-6 py-10">
        {searchQuery && (
          <p className="text-center text-gray-600 mb-4">
            Found {upcomingEvents.length} upcoming and {previousEvents.length} previous events matching &quot;{searchQuery}&quot;
          </p>
        )}

        <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {getPaginatedEvents(upcomingEvents, upcomingPage).map((event) => (
            <div
              key={event.id}
              className="border rounded-lg overflow-hidden shadow-lg hover:scale-105 transition"
              onClick={() => handleBookNow(event.id)}
            >
              <Image
                src={event.image}
                alt={event.title}
                width={300}
                height={200}
                className="w-full h-80 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold">{event.title}</h3>
                <p>{event.date} | {event.time}</p>
                <p>{event.location}</p>
                <p className="text-green-600">{event.spotsLeft} Spots Left</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination for Upcoming Events */}
        {totalUpcomingPages > 1 && (
          <div className="flex justify-center gap-2 mb-8">
            <button
              onClick={() => setUpcomingPage((p) => Math.max(p - 1, 1))}
              disabled={upcomingPage === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {upcomingPage} of {totalUpcomingPages}
            </span>
            <button
              onClick={() => setUpcomingPage((p) => Math.min(p + 1, totalUpcomingPages))}
              disabled={upcomingPage === totalUpcomingPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        <h2 className="text-2xl font-semibold mb-4">Previous Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {getPaginatedEvents(previousEvents, previousPage).map((event) => (
            <div
              key={event.id}
              className="border rounded-lg overflow-hidden shadow-lg"
            >
              <Image
                src={event.image}
                alt={event.title}
                width={300}
                height={200}
                className="w-full h-80 object-cover"  
              />
              <div className="p-4">
                <h3 className="text-xl font-bold">{event.title}</h3>
                <p>{event.date} | {event.time}</p>
                <p>{event.location}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination for Previous Events */}
        {totalPreviousPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setPreviousPage((p) => Math.max(p - 1, 1))}
              disabled={previousPage === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {previousPage} of {totalPreviousPages}
            </span>
            <button
              onClick={() => setPreviousPage((p) => Math.min(p + 1, totalPreviousPages))}
              disabled={previousPage === totalPreviousPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
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

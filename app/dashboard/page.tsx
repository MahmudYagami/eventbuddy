"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageLayout, Footer } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <PageLayout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
            <Button variant="primary" size="lg" onClick={() => router.push("/")}>
              Browse Events
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Your Bookings</h2>
            
            {user.bookings && user.bookings.length > 0 ? (
              <div className="space-y-4">
                {user.bookings.map((booking, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition">
                    <h3 className="text-xl font-semibold">{booking.eventTitle}</h3>
                    <div className="mt-2 text-gray-600">
                      <p>Date: {booking.eventDate}</p>
                      <p>Location: {booking.eventLocation}</p>
                      <p className="text-sm text-gray-500">Booked on: {booking.bookingDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">You haven&apos;t booked any events yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </PageLayout>
  );
}

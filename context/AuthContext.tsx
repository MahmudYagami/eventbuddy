"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface Booking {
  eventId: number;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  bookingDate: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  bookings: Booking[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  addBooking: (booking: Booking) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setIsAuthenticated(true);
    setIsAdmin(userData.isAdmin);
    setUser(userData);
    // Store user data in sessionStorage
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
    // Clear sessionStorage
    sessionStorage.removeItem('user');
  };

  const addBooking = (booking: Booking) => {
    if (user) {
      const updatedUser = {
        ...user,
        bookings: [...(user.bookings || []), booking]
      };
      setUser(updatedUser);
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setIsAuthenticated(true);
      setIsAdmin(userData.isAdmin);
      setUser(userData);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, user, login, logout, addBooking }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
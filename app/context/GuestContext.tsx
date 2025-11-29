"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase init
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type Guest = {
  id: number;
  first_name: string;
  last_name: string;
  code: string;
  [key: string]: any;
} | null;

// Definiujemy możliwe rezultaty logowania
export type LoginResult = {
  success: boolean;
  errorType?: "INVALID_CODE" | "CONNECTION_ERROR" | "UNKNOWN";
};

type GuestContextType = {
  guest: Guest;
  loading: boolean;
  // Zmieniamy typ zwracany z Promise<boolean> na Promise<LoginResult>
  loginWithCode: (code: string) => Promise<LoginResult>;
  logout: () => void;
  refreshGuest: () => Promise<void>;
};

const GuestContext = createContext<GuestContextType>({
  guest: null,
  loading: true,
  loginWithCode: async () => ({ success: false }),
  logout: () => {},
  refreshGuest: async () => {},
});

export const GuestProvider = ({ children }: { children: React.ReactNode }) => {
  const [guest, setGuest] = useState<Guest>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGuest = async () => {
      const savedCode = localStorage.getItem("guestCode");
      if (savedCode) {
        // Tutaj też warto by obsłużyć błąd, ale na razie zostawmy proste sprawdzenie
        const { data, error } = await supabase
          .from("guests")
          .select("*")
          .eq("code", savedCode)
          .single();

        if (!error && data) {
          setGuest(data);
        } else {
          localStorage.removeItem("guestCode");
        }
      }
      setLoading(false);
    };

    loadGuest();
  }, []);

  const loginWithCode = async (code: string): Promise<LoginResult> => {
    const trimmedCode = code.trim().toUpperCase();
    
    try {
      const { data, error } = await supabase
        .from("guests")
        .select("*")
        .eq("code", trimmedCode)
        .single();

      if (error) {
        console.error("Login Supabase error:", error);
        
        // Kod PGRST116 oznacza: zapytanie zwróciło 0 wierszy, a oczekiwano .single()
        // To jest nasz "Nieprawidłowy kod"
        if (error.code === 'PGRST116') {
          return { success: false, errorType: "INVALID_CODE" };
        }

        // Każdy inny błąd (np. brak sieci, timeout, błąd serwera)
        return { success: false, errorType: "CONNECTION_ERROR" };
      }

      if (data) {
        setGuest(data);
        localStorage.setItem("guestCode", trimmedCode);
        return { success: true };
      }

      return { success: false, errorType: "UNKNOWN" };

    } catch (err) {
      // Łapiemy błędy sieciowe, które mogą rzucić wyjątek (np. fetch failed)
      console.error("Network/Unexpected error:", err);
      return { success: false, errorType: "CONNECTION_ERROR" };
    }
  };

  const refreshGuest = async () => {
    if (!guest) return;
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .eq("id", guest.id)
      .single();

    if (!error && data) {
      setGuest(data);
    }
  };

  const logout = () => {
    localStorage.removeItem("guestCode");
    setGuest(null);
  };

  return (
    <GuestContext.Provider
      value={{ guest, loading, loginWithCode, logout, refreshGuest }}
    >
      {children}
    </GuestContext.Provider>
  );
};

export const useGuest = () => useContext(GuestContext);
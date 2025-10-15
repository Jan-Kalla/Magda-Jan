"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase init
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type Guest = {
  id: number;          // bigint z tabeli guests
  first_name: string;
  last_name: string;
  code: string;
  [key: string]: any;
} | null;

type GuestContextType = {
  guest: Guest;
  loading: boolean;
  loginWithCode: (code: string) => Promise<boolean>;
  logout: () => void;
  refreshGuest: () => Promise<void>;
};

const GuestContext = createContext<GuestContextType>({
  guest: null,
  loading: true,
  loginWithCode: async () => false,
  logout: () => {},
  refreshGuest: async () => {},
});

export const GuestProvider = ({ children }: { children: React.ReactNode }) => {
  const [guest, setGuest] = useState<Guest>(null);
  const [loading, setLoading] = useState(true);

  // === Ładowanie gościa z localStorage po stronie klienta ===
  useEffect(() => {
    const loadGuest = async () => {
      const savedCode = localStorage.getItem("guestCode");
      if (savedCode) {
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

  // === Funkcja logowania po kodzie ===
  const loginWithCode = async (code: string) => {
    const trimmedCode = code.trim().toUpperCase();
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .eq("code", trimmedCode)
      .single();

    if (!error && data) {
      setGuest(data);
      localStorage.setItem("guestCode", trimmedCode);
      return true;
    }

    return false;
  };

  // === Odświeżenie danych gościa z bazy ===
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

// Hook do łatwego użycia kontekstu
export const useGuest = () => useContext(GuestContext);

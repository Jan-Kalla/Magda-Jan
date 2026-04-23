"use client";

import { useEffect } from "react";
import { useGuest } from "@/app/context/GuestContext";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function VisitTracker() {
  const { guest, loading } = useGuest();

  useEffect(() => {
    // Czekamy aż gość się załaduje. Jeśli nie jest zalogowany, nic nie robimy.
    if (loading || !guest) return;

    const recordVisit = async () => {
      // Tworzymy dzisiejszą datę w formacie YYYY-MM-DD
      const d = new Date();
      const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      
      // Unikalny klucz dla tego gościa i tego dnia
      const storageKey = `visited_${guest.id}_${today}`;

      // Jeśli w pamięci telefonu/komputera jest już ślad dzisiejszej wizyty, przerywamy (oszczędzamy bazę)
      if (localStorage.getItem(storageKey)) return;

      // Próbujemy zapisać wizytę w Supabase
      const { error } = await supabase
        .from("guest_visits")
        .insert({ 
            guest_id: guest.id, 
            visit_date: today 
        });

      // Jeśli się udało (lub jeśli Supabase odrzuciło duplikat - błąd 23505),
      // zapisujemy ciastko w przeglądarce, żeby dzisiaj już nie wysyłać zapytań.
      if (!error || error.code === '23505') {
        localStorage.setItem(storageKey, "true");
      }
    };

    recordVisit();
  }, [guest, loading]);

  // Ten komponent jest "duchem" - działa tylko w tle i nic nie wyświetla na ekranie
  return null;
}
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function TestSupabase() {
  const [guests, setGuests] = useState<any[]>([]);

  useEffect(() => {
    const fetchGuests = async () => {
      const { data, error } = await supabase.from("guests").select("*");
      if (error) console.error("Błąd Supabase:", error);
      else setGuests(data);
    };

    fetchGuests();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Test połączenia z Supabase</h1>
      {guests.length > 0 ? (
        <ul>
          {guests.map((guest) => (
            <li key={guest.id}>
              {guest.first_name} {guest.last_name} — kod: {guest.code}
            </li>
          ))}
        </ul>
      ) : (
        <p>Ładowanie danych...</p>
      )}
    </div>
  );
}

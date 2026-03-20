"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Users, UtensilsCrossed, CheckCircle2 } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ConfirmedGuestsList() {
  const [guests, setGuests] = useState<any[]>([]);
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfirmedGuests = async () => {
      // 1. Pobieramy wszystkich gości, którzy potwierdzili obecność (z tabeli guests)
      const { data: guestsData } = await supabase
        .from("guests")
        .select("*")
        .eq("rsvp_status", "confirmed")
        .order("first_name", { ascending: true });

      // 2. ZMIANA: Poprawiona nazwa tabeli na "meal_choices" zgodnie z Twoją bazą danych
      const { data: mealsData } = await supabase
        .from("meal_choices")
        .select("*");

      if (guestsData) setGuests(guestsData);
      if (mealsData) setMeals(mealsData);
      
      setLoading(false);
    };

    fetchConfirmedGuests();
  }, []);

  if (loading) {
    return (
      <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-8 md:p-14 text-center text-[#4c4a1e] font-serif italic text-lg animate-pulse">
        Pobieranie listy gości...
      </div>
    );
  }

  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-8 md:p-14">
      
      {/* NAGŁÓWEK KARTY */}
      <div className="flex flex-col items-center mb-10">
        <div className="p-4 bg-[#4c4a1e]/10 rounded-full mb-4 shadow-sm border border-[#4c4a1e]/20">
          <Users className="text-[#4c4a1e]" size={36} />
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-light text-[#4c4a1e] uppercase tracking-[0.15em] text-center drop-shadow-sm">
          Potwierdzeni Goście
        </h2>
        <p className="font-sans font-light text-[#4c4a1e]/80 mt-3 text-center tracking-widest uppercase text-sm">
          Osoby, które zadeklarowały obecność na weselu
        </p>
      </div>

      {/* LISTA GOŚCI */}
      <div className="space-y-3">
        <div className="hidden sm:flex justify-between px-6 pb-2 text-xs font-sans uppercase tracking-widest text-[#4c4a1e]/60 border-b border-[#4c4a1e]/20">
          <span>Imię i Nazwisko</span>
          <span>Wybór posiłku</span>
        </div>
        
        {guests.map((g) => {
          // Szukamy, czy gość zdążył już wybrać jedzenie
          const guestMeal = meals.find((m) => m.guest_id === g.id);
          
          // Pobieramy wartość z kolumny "main_course"
          const mealName = guestMeal ? guestMeal.main_course : null;
          
          return (
            <div key={g.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/50 hover:bg-white/70 transition-colors rounded-xl p-4 md:px-6 border border-white/50 shadow-sm gap-3">
              
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-green-600/70 shrink-0" size={20} />
                <span className="font-serif text-lg md:text-xl text-[#4c4a1e] font-medium tracking-wide">
                  {g.first_name} {g.last_name}
                </span>
              </div>
              
              {mealName ? (
                <div className="flex items-center gap-2 text-sm font-sans font-medium text-[#4E0113] bg-white/60 px-4 py-2 rounded-lg border border-[#4E0113]/20 text-right shadow-sm">
                  <UtensilsCrossed size={16} className="shrink-0" />
                  <span className="truncate max-w-[220px] md:max-w-[300px]" title={mealName}>
                    {mealName}
                  </span>
                </div>
              ) : (
                <span className="text-sm font-serif italic text-[#4c4a1e]/60 px-4 py-2 border border-dashed border-[#4c4a1e]/30 rounded-lg text-center sm:text-right">
                  Czeka na wybór posiłku
                </span>
              )}
            </div>
          );
        })}

        {guests.length === 0 && (
          <p className="text-center font-serif italic text-[#4c4a1e]/60 py-8">
            Jeszcze nikt nie potwierdził obecności.
          </p>
        )}
      </div>
      
      {/* PODSUMOWANIE LICZBOWE */}
      <div className="mt-8 pt-6 border-t border-[#4c4a1e]/20 flex justify-center md:justify-end">
         <div className="bg-[#4c4a1e] text-[#FDF9EC] px-6 py-3 rounded-xl shadow-md flex gap-3 items-center">
           <span className="font-serif italic tracking-wider">Potwierdzonych gości:</span>
           <span className="font-sans text-xl font-bold">{guests.length}</span>
         </div>
      </div>
    </div>
  );
}
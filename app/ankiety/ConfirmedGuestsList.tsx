"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Users, UtensilsCrossed, CheckCircle2, AlertCircle } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ConfirmedGuestsList() {
  const [allGuests, setAllGuests] = useState<any[]>([]);
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      const { data: guestsData } = await supabase
        .from("guests")
        .select("*")
        .order("first_name", { ascending: true });

      const { data: mealsData } = await supabase
        .from("meal_choices")
        .select("*");

      if (guestsData) setAllGuests(guestsData);
      if (mealsData) setMeals(mealsData);
      
      setLoading(false);
    };

    fetchData();
  }, []);

  const confirmedGuests = allGuests.filter(g => g.rsvp_status === 'confirmed');
  
  // LOGIKA DLA PIĄTEGO OKIENKA: Potwierdzeni, ale bez wybranego dania
  const confirmedNoMeal = confirmedGuests.filter(guest => {
    const mealChoice = meals.find(m => m.guest_id === guest.id);
    return !mealChoice || !mealChoice.main_course;
  }).length;

  const stats = {
    confirmed: confirmedGuests.length,
    ceremonyOnly: allGuests.filter(g => g.rsvp_status === 'ceremony_only').length,
    declined: allGuests.filter(g => g.rsvp_status === 'declined').length,
    unconfirmed: allGuests.filter(g => g.rsvp_status === null).length,
    noMeal: confirmedNoMeal
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-[#4c4a1e]/20 border-t-[#4c4a1e] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="mt-12 bg-white/40 backdrop-blur-md rounded-2xl border border-[#4c4a1e]/20 p-6 md:p-10 shadow-sm">
      <div className="flex items-center gap-3 mb-8 border-b border-[#4c4a1e]/10 pb-4">
        <Users className="text-[#4c4a1e]" size={28} />
        <h2 className="font-serif text-2xl md:text-3xl text-[#4c4a1e] uppercase tracking-wider">
          Lista potwierdzonych gości
        </h2>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {confirmedGuests.map((guest) => {
          const mealChoice = meals.find((m) => m.guest_id === guest.id);
          const mealName = mealChoice?.main_course;

          return (
            <div 
              key={guest.id} 
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white/50 rounded-xl border border-white/60 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} className={`shrink-0 ${mealName ? "text-[#4c4a1e]/40" : "text-amber-500"}`} />
                <span className="font-serif text-lg text-[#4c4a1e]">
                  {guest.first_name} {guest.last_name}
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
                <div className="flex items-center gap-2 text-sm font-serif italic text-amber-700 bg-amber-50/50 px-4 py-2 border border-dashed border-amber-200 rounded-lg text-center sm:text-right">
                  <AlertCircle size={14} />
                  Czeka na wybór posiłku
                </div>
              )}
            </div>
          );
        })}

        {confirmedGuests.length === 0 && (
          <p className="text-center font-serif italic text-[#4c4a1e]/60 py-8">
            Jeszcze nikt nie potwierdził obecności na weselu.
          </p>
        )}
      </div>
      
      {/* PODSUMOWANIE LICZBOWE - ZAKTUALIZOWANY GRID DO 5 ELEMENTÓW */}
      <div className="mt-10 pt-8 border-t border-[#4c4a1e]/20">
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            
            {/* 1. POTWIERDZENI (Suma) */}
            <div className="bg-[#4c4a1e] text-[#FDF9EC] px-5 py-4 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center">
               <span className="text-3xl font-bold font-sans mb-1">{stats.confirmed}</span>
               <span className="text-[10px] uppercase tracking-widest font-sans opacity-80 leading-tight">
                  Będzie na weselu
               </span>
            </div>

            {/* 2. NOWOŚĆ: POTWIERDZENI BEZ DANIA */}
            <div className="bg-[#FDF9EC] text-[#4c4a1e] px-5 py-4 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center animate-pulse-subtle">
               <span className="text-3xl font-bold font-sans mb-1">{stats.noMeal}</span>
               <span className="text-[10px] uppercase tracking-widest font-sans font-bold leading-tight">
                  Potwierdzeni bez dania
               </span>
            </div>

            {/* 3. TYLKO ŚLUB */}
            <div className="bg-white/80 text-[#4c4a1e] px-5 py-4 rounded-2xl border border-[#4c4a1e]/20 flex flex-col items-center justify-center text-center">
               <span className="text-3xl font-bold font-sans mb-1">{stats.ceremonyOnly}</span>
               <span className="text-[10px] uppercase tracking-widest font-sans opacity-70 leading-tight">
                  Tylko na ślubie
               </span>
            </div>

            {/* 4. ODMOWY */}
            <div className="bg-white/60 text-[#4c4a1e]/60 px-5 py-4 rounded-2xl border border-[#4c4a1e]/10 flex flex-col items-center justify-center text-center">
               <span className="text-3xl font-bold font-sans mb-1">{stats.declined}</span>
               <span className="text-[10px] uppercase tracking-widest font-sans opacity-60 leading-tight">
                  Nie będzie wcale
               </span>
            </div>

            {/* 5. NIEPOTWIERDZENI (Brak reakcji) */}
            <div className="bg-white/40 text-[#C97B78] px-5 py-4 rounded-2xl border border-[#C97B78]/30 flex flex-col items-center justify-center text-center">
               <span className="text-3xl font-bold font-sans mb-1">{stats.unconfirmed}</span>
               <span className="text-[10px] uppercase tracking-widest font-sans font-bold leading-tight">
                  Brak decyzji
               </span>
            </div>

         </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useGuest } from "@/app/context/GuestContext";
import { motion } from "framer-motion";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type DailyStat = {
  date: string;
  count: number;
};

export default function AdminStats() {
  const { guest } = useGuest();
  const [stats, setStats] = useState<DailyStat[]>([]);
  const [totalVisits, setTotalVisits] = useState(0);

  // 1. NAJPIERW WSZYSTKIE HOOKI (useEffect musi być przed jakimkolwiek 'return')
  useEffect(() => {
    // Sprawdzanie uprawnień wewnątrz hooka
    if (guest?.code !== "FC3818") return;

    const fetchStats = async () => {
      const { data, error } = await supabase
        .from("guest_visits")
        .select("visit_date");

      if (data) {
        setTotalVisits(data.length);

        const counts = data.reduce((acc: any, curr: any) => {
          acc[curr.visit_date] = (acc[curr.visit_date] || 0) + 1;
          return acc;
        }, {});

        const formattedStats = Object.keys(counts)
          .map((date) => ({
            date,
            count: counts[date],
          }))
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(-7); 

        setStats(formattedStats);
      }
    };

    fetchStats();
  }, [guest]); // Dodajemy guest do zależności, by pobrał statystyki po załadowaniu użytkownika

  // 2. DOPIERO TERAZ, po wszystkich hookach, możemy bezpiecznie anulować renderowanie
  if (guest?.code !== "FC3818") return null;
  if (stats.length === 0) return null;

  const maxCount = Math.max(...stats.map((s) => s.count));

  return (
    <section className="w-full bg-[#1A1A1A] text-white py-12 px-6 border-t-4 border-[#4E0113]">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl font-serif uppercase tracking-[0.2em] text-[#C97B78] mb-2">
              Panel Administratora
            </h2>
            <p className="text-white/50 font-sans text-sm">
              Statystyki odwiedzin strony (ostatnie dni)
            </p>
          </div>
          <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
            <span className="text-xs uppercase tracking-widest text-white/40 block mb-1">Suma wizyt</span>
            <span className="text-3xl font-bold font-mono text-[#FDF9EC]">{totalVisits}</span>
          </div>
        </div>

        {/* WYKRES SŁUPKOWY */}
        <div className="flex items-end justify-between gap-2 h-64 w-full bg-white/5 p-6 rounded-3xl border border-white/10">
          {stats.map((day, idx) => {
            const heightPercentage = (day.count / maxCount) * 100;
            const dateObj = new Date(day.date);
            const label = dateObj.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });

            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                <div className="relative w-full flex justify-center items-end h-full">
                  <span className="absolute -top-8 text-sm font-bold font-mono text-[#C97B78] opacity-0 group-hover:opacity-100 transition-opacity">
                    {day.count}
                  </span>
                  
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercentage}%` }}
                    transition={{ delay: idx * 0.1, duration: 0.8, ease: "easeOut" }}
                    className="w-8 md:w-12 bg-gradient-to-t from-[#4E0113] to-[#C97B78] rounded-t-lg shadow-[0_0_15px_rgba(164,108,110,0.3)] group-hover:brightness-125 transition-all"
                  />
                </div>
                
                <span className="text-[10px] md:text-xs uppercase tracking-tighter text-white/40 font-medium">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
        
        <p className="text-center mt-8 text-white/20 text-[10px] uppercase tracking-[0.3em]">
          Dostęp zastrzeżony dla administratora
        </p>
      </div>
    </section>
  );
}
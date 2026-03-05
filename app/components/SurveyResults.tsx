"use client";
import React from "react";

export default function SurveyResults({ guest, dishes, results }: any) {
  if (!guest || (guest.id !== 1 && guest.id !== 2)) return null;

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-yellow-500/30 rounded-2xl shadow-2xl p-8 md:p-12 max-w-4xl mx-auto mt-16">
      <div className="border-b border-yellow-500/30 pb-4 mb-8 text-center">
         <h2 className="font-serif text-2xl md:text-3xl font-light text-yellow-400 uppercase tracking-widest">
            Panel Pary Młodej
         </h2>
         <p className="font-sans font-light text-[#FDF9EC]/60 text-sm mt-2 uppercase tracking-wider">
            Podsumowanie wyborów kulinarnych gości
         </p>
      </div>

      <ul className="space-y-4">
        {dishes.map((dish: any) => {
          const count = results[dish.name] || 0;
          return (
            <li key={dish.name} className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 p-4 bg-white/5 rounded-xl border border-white/10">
              <span className="font-serif text-lg md:text-xl text-[#FDF9EC] opacity-90">{dish.name}</span>
              <span className="font-mono text-xl text-yellow-400 font-bold whitespace-nowrap">
                {count} {count === 1 ? 'głos' : count >= 2 && count <= 4 ? 'głosy' : 'głosów'}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
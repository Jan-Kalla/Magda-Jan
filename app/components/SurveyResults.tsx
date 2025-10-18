"use client";
import React from "react";

export default function SurveyResults({ guest, dishes, results }: any) {
  if (!guest || (guest.id !== 1 && guest.id !== 2)) return null;

  return (
    <div className="bg-[#4E0113] rounded-xl shadow-2xl p-8 max-w-4xl mx-auto mt-12">
      <h2 className="text-2xl font-bold text-[#FAD6C8] mb-6 text-center">Wyniki ankiety</h2>
      <ul className="space-y-3">
        {dishes.map((dish: any) => (
          <li key={dish.name} className="flex justify-between text-lg text-[#FAD6C8]">
            <span>{dish.name}</span>
            <span className="font-semibold">{results[dish.name] || 0} głosów</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

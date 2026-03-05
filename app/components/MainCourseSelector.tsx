"use client";
import React from "react";

export default function MainCourseSelector({ dishes, mainCourse, setMainCourse }: any) {
  return (
    <div className="mt-8">
      <h2 className="font-serif text-3xl md:text-4xl font-light text-[#4c4a1e] mb-10 text-center uppercase tracking-[0.1em] border-t border-[#4c4a1e]/20 pt-10">
        Danie główne
      </h2>
      <div className="space-y-6 mb-12">
        {dishes.map((dish: any) => (
          <label
            key={dish.name}
            className={`flex flex-col sm:flex-row items-center gap-6 border rounded-xl p-6 cursor-pointer transition-all duration-300 ${
              mainCourse === dish.name
                ? "border-[#4c4a1e] bg-white/60 shadow-xl scale-[1.01]"
                : "border-white/50 hover:border-[#4c4a1e]/50 hover:bg-white/30"
            }`}
          >
            <input
              type="radio"
              name="mainCourse"
              value={dish.name}
              checked={mainCourse === dish.name}
              onChange={(e) => setMainCourse(e.target.value)}
              className="hidden"
            />
            {dish.img && (
              <img 
                src={dish.img} 
                alt={dish.name} 
                className="w-full sm:w-52 sm:h-52 object-cover rounded-lg shadow-md flex-shrink-0" 
              />
            )}
            <span className="text-[#4c4a1e] font-serif text-xl md:text-2xl text-center sm:text-left leading-relaxed">
              {dish.name}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
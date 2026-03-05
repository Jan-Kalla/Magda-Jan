"use client";
import React from "react";

export default function ChildrenChoices({
  children,
  standardDishes = [],
  childrenDishes = [],
  childrenChoices,
  handleChildChoice,
}: any) {
  if (!children || children.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="font-serif text-3xl md:text-4xl font-light text-[#4c4a1e] mb-10 text-center uppercase tracking-[0.1em] border-t border-[#4c4a1e]/20 pt-10">
        Menu dla najmłodszych
      </h2>
      
      {children.map((child: any) => (
        <div key={child.id} className="mb-12 bg-white/20 p-6 md:p-8 rounded-xl border border-white/40">
          <h3 className="font-serif text-2xl md:text-3xl text-[#4c4a1e] mb-6 pb-2 border-b border-[#4c4a1e]/20 inline-block">
            {child.first_name} {child.last_name}
          </h3>

          <h4 className="font-sans font-light uppercase tracking-widest text-[#4c4a1e]/80 text-sm mb-4 mt-4">
            Dania standardowe
          </h4>
          <div className="space-y-4 mb-10">
            {standardDishes.map((dish: any) => (
              <label key={dish.name} className={`flex flex-col sm:flex-row items-center gap-6 border rounded-xl p-4 md:p-6 cursor-pointer transition-all duration-300 ${
                childrenChoices[child.id] === dish.name
                  ? "border-[#4c4a1e] bg-white/60 shadow-lg scale-[1.01]"
                  : "border-white/50 hover:border-[#4c4a1e]/50 hover:bg-white/30"
              }`}>
                <input
                  type="radio"
                  name={`child-${child.id}`}
                  value={dish.name}
                  checked={childrenChoices[child.id] === dish.name}
                  onChange={() => handleChildChoice(child.id, dish.name)}
                  className="hidden"
                />
                {dish.img && <img src={dish.img} alt={dish.name} className="w-full sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover rounded-lg shadow-md flex-shrink-0" />}
                <span className="font-serif text-lg md:text-xl text-[#4c4a1e] text-center sm:text-left">{dish.name}</span>
              </label>
            ))}
          </div>

          <h4 className="font-sans font-light uppercase tracking-widest text-[#4c4a1e]/80 text-sm mb-4">
            Specjalne Menu Dziecięce
          </h4>
          <div className="space-y-4">
            {childrenDishes.map((dish: any) => (
              <label key={dish.name} className={`flex flex-col sm:flex-row items-center gap-6 border rounded-xl p-4 md:p-6 cursor-pointer transition-all duration-300 ${
                childrenChoices[child.id] === dish.name
                  ? "border-[#4c4a1e] bg-white/60 shadow-lg scale-[1.01]"
                  : "border-white/50 hover:border-[#4c4a1e]/50 hover:bg-white/30"
              }`}>
                <input
                  type="radio"
                  name={`child-${child.id}`}
                  value={dish.name}
                  checked={childrenChoices[child.id] === dish.name}
                  onChange={() => handleChildChoice(child.id, dish.name)}
                  className="hidden"
                />
                {dish.img && <img src={dish.img} alt={dish.name} className="w-full sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover rounded-lg shadow-md flex-shrink-0" />}
                <span className="font-serif text-lg md:text-xl text-[#4c4a1e] text-center sm:text-left">{dish.name}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
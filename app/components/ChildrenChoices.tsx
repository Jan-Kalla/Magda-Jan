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

  const renderDishOption = (dish: any, childId: number) => {
    const isSelected = childrenChoices[childId] === dish.name;
    return (
      <label
        key={dish.name}
        // ZMIANA: Dodano sm:min-h-[200px] md:min-h-[240px]
        className={`relative flex flex-col sm:flex-row items-stretch border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 sm:min-h-[200px] md:min-h-[240px] ${
          isSelected
            ? "border-[#4c4a1e] bg-white/60 shadow-xl scale-[1.01]"
            : "border-white/50 hover:border-[#4c4a1e]/50 hover:bg-white/30"
        }`}
      >
        <input
          type="radio"
          name={`child-${childId}`}
          value={dish.name}
          checked={isSelected}
          onChange={() => handleChildChoice(childId, dish.name)}
          className="hidden"
        />
        
        {/* ZDJĘCIE */}
        {dish.img && (
          // ZMIANA: Zwiększono rozmiary zdjęcia
          <div className="relative w-full sm:w-48 md:w-56 flex-shrink-0 h-56 sm:h-auto">
            <img 
              src={dish.img} 
              alt={dish.name} 
              className="absolute inset-0 w-full h-full object-cover" 
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-8 pointer-events-none">
              <span className="block text-right text-[9px] text-white/90 uppercase tracking-widest font-sans">
                Propozycja podania
              </span>
            </div>
          </div>
        )}
        
        {/* TEKST */}
        <div className="p-6 md:p-10 flex items-center flex-1">
          <span className="font-serif text-lg md:text-2xl text-[#4c4a1e] text-center sm:text-left leading-relaxed">
            {dish.name}
          </span>
        </div>
      </label>
    );
  };

  return (
    <div className="mt-16">
      <h2 className="font-serif text-3xl md:text-4xl font-light text-[#4c4a1e] mb-10 text-center uppercase tracking-[0.1em] border-t border-[#4c4a1e]/20 pt-10">
        Menu dla najmłodszych
      </h2>
      
      {children.map((child: any) => (
        <div key={child.id} className="mb-12 bg-white/20 p-6 md:p-8 rounded-2xl border border-white/40">
          <h3 className="font-serif text-2xl md:text-3xl text-[#4c4a1e] mb-6 pb-2 border-b border-[#4c4a1e]/20 inline-block">
            {child.first_name} {child.last_name}
          </h3>

          <h4 className="font-sans font-light uppercase tracking-widest text-[#4c4a1e]/80 text-sm mb-4 mt-4">
            Dania standardowe
          </h4>
          <div className="space-y-4 mb-10">
            {standardDishes.map((dish: any) => renderDishOption(dish, child.id))}
          </div>

          <h4 className="font-sans font-light uppercase tracking-widest text-[#4c4a1e]/80 text-sm mb-4">
            Specjalne Menu Dziecięce
          </h4>
          <div className="space-y-4">
            {childrenDishes.map((dish: any) => renderDishOption(dish, child.id))}
          </div>
        </div>
      ))}
    </div>
  );
}
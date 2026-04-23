"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChildrenChoices({
  children,
  standardDishes = [],
  childrenDishes = [],
  childrenChoices,
  handleChildChoice,
  childrenRsvp,           // Odbieramy nowe właściwości
  handleChildRsvpChange,  // Odbieramy nowe właściwości
}: any) {
  if (!children || children.length === 0) return null;

  const renderDishOption = (dish: any, childId: number) => {
    const isSelected = childrenChoices[childId] === dish.name;
    return (
      <label
        key={dish.name}
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
        
        {dish.img && (
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
        
        <div className="p-6 md:p-10 flex items-center flex-1">
          <span className="font-serif text-lg md:text-2xl text-[#4c4a1e] text-center sm:text-left leading-relaxed">
            {dish.name}
          </span>
        </div>
      </label>
    );
  };

  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  return (
    <div className="mt-16">
      <p className="font-serif italic text-lg md:text-xl text-[#4c4a1e]/80 text-center tracking-wide mb-4 px-4">
        Dajcie znać czy pociechy będą z nami!
      </p>
      <h2 className="font-serif text-3xl md:text-4xl font-light text-[#4c4a1e] mb-4 text-center uppercase tracking-[0.1em] border-t border-[#4c4a1e]/20 pt-10">
        Menu dla najmłodszych
      </h2>
      
      <p className="font-serif italic text-lg md:text-xl text-[#4c4a1e]/80 text-center tracking-wide mb-4 px-4">
        Do każdego dania ze specjalnego menu dziecięcego zostanie przypisany delikatny rosół drobiowy z makaronem.
      </p>

      <div className="flex justify-center mb-8">
        <button
          type="button"
          onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
          className="text-xs md:text-sm font-sans uppercase tracking-widest text-[#4c4a1e] border border-[#4c4a1e]/30 px-6 py-2 rounded-full hover:bg-white/30 transition-all duration-300"
        >
          {isDescriptionOpen ? "Zwiń opis" : "Zobacz opis"}
        </button>
      </div>

      <AnimatePresence>
        {isDescriptionOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden mb-12 max-w-3xl mx-auto px-4"
          >
            <div className="bg-white/30 p-6 md:p-8 rounded-xl border border-[#4c4a1e]/10 shadow-inner text-center">
              <p className="font-serif text-[#4c4a1e]/90 leading-relaxed text-sm md:text-base">
                Dania z menu dziecięcego przygotowywane są z delikatnych składników i podawane w atrakcyjny dla maluchów sposób. 
                Również rosół drobiowy z oferty dziecięcej, rekomendowany nam przez Starą Szwajcarię, jako skrojony bardziej pod młodsze podniebienie, to nie to samo co domowy rosół na trzech mięsach z oferty standardowej.
                Natomiast, jeśli Twoje dziecko jest już większe lub po prostu woli zjeść to, co dorośli – nie ma najmniejszego problemu, wystarczy wybrać danie 
                z sekcji standardowej poniżej.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {children.map((child: any) => {
        // Sprawdzamy decyzję dla danego dziecka
        const isAttending = childrenRsvp && childrenRsvp[child.id] === 'confirmed';
        const isDeclined = childrenRsvp && childrenRsvp[child.id] === 'declined';

        return (
          <div key={child.id} className="mb-12 bg-white/20 p-6 md:p-8 rounded-2xl border border-white/40">
            <h3 className="font-serif text-2xl md:text-3xl text-[#4c4a1e] mb-6 pb-2 border-b border-[#4c4a1e]/20 inline-block">
              {child.first_name} {child.last_name}
            </h3>

            {/* ZMIANA: PRZYCISKI RSVP DLA DZIECKA */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4 w-full">
               <button
                  type="button"
                  onClick={() => handleChildRsvpChange(child.id, 'confirmed')}
                  className={`flex-1 px-4 py-4 rounded-xl font-sans uppercase tracking-widest text-sm transition-all ${
                    isAttending
                      ? "bg-[#4c4a1e] text-[#FDF9EC] shadow-lg scale-[1.02] border border-[#4c4a1e]"
                      : "bg-white/40 text-[#4c4a1e] border border-[#4c4a1e]/20 hover:bg-white/60"
                  }`}
               >
                  Będzie z nami na weselu
               </button>
               <button
                  type="button"
                  onClick={() => handleChildRsvpChange(child.id, 'declined')}
                  className={`flex-1 px-4 py-4 rounded-xl font-sans uppercase tracking-widest text-sm transition-all ${
                    isDeclined
                      ? "bg-white/20 text-[#4c4a1e] opacity-80 shadow-inner scale-[0.98] border border-[#4c4a1e]/30"
                      : "bg-white/40 text-[#4c4a1e] border border-[#4c4a1e]/20 hover:bg-white/60"
                  }`}
               >
                  Niestety nie będzie obecny/a
               </button>
            </div>

            {/* ZMIANA: Posiłki pokazują się tylko jeśli kliknięto "Będzie na weselu" */}
            <AnimatePresence>
              {isAttending && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <h4 className="font-sans font-light uppercase tracking-widest text-[#4c4a1e]/80 text-sm mb-4 mt-8">
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
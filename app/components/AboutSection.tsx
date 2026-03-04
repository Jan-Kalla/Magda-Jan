"use client";

import Image from "next/image";

export default function AboutSection() {
  return (
    <div className="w-full text-[#4c4a1e]">
      {/* --- SEKCJA 1: CYTAT Z PISMA ŚWIĘTEGO --- */}
      <div className="max-w-3xl mx-auto px-6 mb-24 text-center flex flex-col items-center">
        <p className="font-serif italic text-xl md:text-2xl leading-relaxed mb-4">
          "Obleczcie się w serdeczne współczucie, w dobroć, pokorę, cichość, cierpliwość, znosząc jedni drugich i wybaczając sobie nawzajem..."
        </p>
        <p className="font-sans text-xs uppercase tracking-[0.2em] opacity-70">
          Kol 3, 12
        </p>
        <div className="w-12 h-[1px] bg-[#4c4a1e]/40 mt-8"></div>
      </div>

      {/* --- SEKCJA 2: O NAS --- */}
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 lg:gap-12 mb-20 md:mb-32">
        
        {/* LEWA KOLUMNA */}
        <div className="flex-shrink-0 relative w-full max-w-sm h-[460px] md:max-w-none md:w-[480px] md:h-[620px] lg:w-[520px] lg:h-[700px] overflow-hidden rounded-sm bg-black/5 shadow-lg">
          <Image 
            src="/fotki/para.jpg"
            alt="Magda i Johny"
            fill
            className="object-cover object-center"
          />
        </div>

        {/* PRAWA KOLUMNA */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left pt-2">  
          
          <p className="font-script text-xl md:text-2xl lg:text-3xl drop-shadow-sm rotate-[-4deg] mb-2 md:-ml-4">
            Pobieramy się!
          </p>
          
          <h2 className="font-serif font-light text-2xl md:text-3xl lg:text-4xl uppercase tracking-[0.15em] mb-12">
            Magdalena <span className="italic pr-1">&amp;</span> Johny
          </h2>
          
          <div className="font-serif font-normal text-lg md:text-xl leading-relaxed max-w-2xl space-y-6">
            Czeeeeeeeeeść! To My! Magda i Johny!
            
            Znamy się od września 2018 roku i już całkiem sporo razem przeżyliśmy. 
            
            Nadszedł w końcu ten czas, że podjęliśmy wspólnie decyzję o tym, że chcemy spędzić ze sobą resztę życia.

            Traktujemy jednak tę decyzję śmiertelnie poważnie, dlatego chcemy jawnie wyznać i zapieczętować ją przed Bogiem i przed ludźmi. 
        
            Dobrze zdając sobie sprawę, z czym się to wiąże, chcemy pozostać ze sobą już do końca życia, bez możliwości rezygnacji z tej umowy.
           
            Chcemy, byście towarzyszyli nam w tym, być może, najważniejszym momencie naszego życia, bo zakładamy, że drugiego takiego już nie będzie. Dlatego zależy nam na Waszej obecności w tym dniu. Na naszym ślubie każdy, kto towarzyszył nam na tej drodze choćby przez moment, jest mile widziany! 

            Super by było, jeżeli jak najwięcej z Was stanie się świadkami naszego sakramentalnego "TAK"!
          </div>
        </div>
      </div>
    </div>
  );
}
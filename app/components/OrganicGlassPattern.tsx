"use client";

// ZMIANA: Komponent wie teraz, w której części strony się znajduje
export default function OrganicGlassPattern({ part = "top" }: { part?: "top" | "bottom" }) {
  
  // GÓRNA CZĘŚĆ (75% całości) - 6 równomiernych tafli
  const topRows = [
    { spineTop: {x: 50, y: 0}, spineBottom: {x: 62, y: 16}, leftTopY: 0, leftBottomY: 14, rightTopY: 0, rightBottomY: 18, blurL: 2, blurR: 5, bgL: 'from-white/20 to-transparent', bgR: 'from-[#C97B78]/10 to-transparent' },
    { spineTop: {x: 62, y: 16}, spineBottom: {x: 35, y: 33}, leftTopY: 14, leftBottomY: 30, rightTopY: 18, rightBottomY: 36, blurL: 6, blurR: 2, bgL: 'from-white/5 to-white/10', bgR: 'from-white/25 to-transparent' },
    { spineTop: {x: 35, y: 33}, spineBottom: {x: 55, y: 50}, leftTopY: 30, leftBottomY: 48, rightTopY: 36, rightBottomY: 53, blurL: 3, blurR: 8, bgL: 'from-[#EBBFB8]/15 to-transparent', bgR: 'from-white/10 to-white/5' },
    { spineTop: {x: 55, y: 50}, spineBottom: {x: 42, y: 66}, leftTopY: 48, leftBottomY: 64, rightTopY: 53, rightBottomY: 69, blurL: 5, blurR: 3, bgL: 'from-white/20 to-transparent', bgR: 'from-[#4E0113]/5 to-transparent' },
    { spineTop: {x: 42, y: 66}, spineBottom: {x: 58, y: 83}, leftTopY: 64, leftBottomY: 81, rightTopY: 69, rightBottomY: 86, blurL: 2, blurR: 6, bgL: 'from-white/5 to-transparent', bgR: 'from-white/15 to-transparent' },
    { spineTop: {x: 58, y: 83}, spineBottom: {x: 50, y: 100}, leftTopY: 81, leftBottomY: 100, rightTopY: 86, rightBottomY: 100, blurL: 4, blurR: 2, bgL: 'from-white/10 to-transparent', bgR: 'from-[#A46C6E]/10 to-transparent' }
  ];

  // DOLNA CZĘŚĆ (25% całości) - zaledwie 2 tafle (gęstość fizycznie zostaje taka sama jak u góry!)
  const bottomRows = [
    { spineTop: {x: 50, y: 0}, spineBottom: {x: 40, y: 50}, leftTopY: 0, leftBottomY: 45, rightTopY: 0, rightBottomY: 55, blurL: 5, blurR: 3, bgL: 'from-[#75897D]/10 to-transparent', bgR: 'from-white/5 to-transparent' },
    { spineTop: {x: 40, y: 50}, spineBottom: {x: 50, y: 100}, leftTopY: 45, leftBottomY: 100, rightTopY: 55, rightBottomY: 100, blurL: 8, blurR: 4, bgL: 'from-[#75897D]/20 to-transparent', bgR: 'from-black/10 to-transparent' }
  ];

  const rows = part === "top" ? topRows : bottomRows;

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {rows.map((r, i) => (
        <div key={`pane-${i}`}>
          <div 
            className={`absolute inset-0 bg-gradient-to-br ${r.bgL}`} 
            style={{ clipPath: `polygon(0% ${r.leftTopY}%, ${r.spineTop.x}% ${r.spineTop.y}%, ${r.spineBottom.x}% ${r.spineBottom.y}%, 0% ${r.leftBottomY}%)`, backdropFilter: `blur(${r.blurL}px)`, WebkitBackdropFilter: `blur(${r.blurL}px)` }} 
          />
          <div 
            className={`absolute inset-0 bg-gradient-to-bl ${r.bgR}`} 
            style={{ clipPath: `polygon(${r.spineTop.x}% ${r.spineTop.y}%, 100% ${r.rightTopY}%, 100% ${r.rightBottomY}%, ${r.spineBottom.x}% ${r.spineBottom.y}%)`, backdropFilter: `blur(${r.blurR}px)`, WebkitBackdropFilter: `blur(${r.blurR}px)` }} 
          />
        </div>
      ))}

      <svg className="absolute inset-0 w-full h-full opacity-60">
        {rows.map((r, i) => {
          // ZMIANA: Na dole linie stają się ledwo widocznym, wtapiającym się burgundem
          const strokeColor = part === "top" ? "rgba(255,255,255,0.4)" : "rgba(78, 1, 19, 0.08)";
          const strokeWidth = part === "top" ? "1.5" : "1";
          
          return (
            <g key={`lines-${i}`} fill="none" strokeWidth={strokeWidth}>
              <line x1={`${r.spineTop.x}%`} y1={`${r.spineTop.y}%`} x2={`${r.spineBottom.x}%`} y2={`${r.spineBottom.y}%`} stroke={strokeColor} />
              <line x1="0%" y1={`${r.leftBottomY}%`} x2={`${r.spineBottom.x}%`} y2={`${r.spineBottom.y}%`} stroke={strokeColor} />
              <line x1="100%" y1={`${r.rightBottomY}%`} x2={`${r.spineBottom.x}%`} y2={`${r.spineBottom.y}%`} stroke={strokeColor} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
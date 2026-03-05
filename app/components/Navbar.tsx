"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useGuest } from "@/app/context/GuestContext";
import { usePathname } from "next/navigation";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { togglePause } from "@/app/components/tetris/gameLogic";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";
import { useSound } from "@/app/context/SoundContext";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return isMobile;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { guest, logout } = useGuest();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { isMuted, toggleMute } = useSound();

  // ZMIANA 1: Zaktualizowana kolejność podstron (Strefa dla gościa zaraz po stronie głównej)
  const navItems = [
    { label: "Strona główna", href: "/" },
    { label: "Wybory dla gościa", href: "/ankiety", protected: true },
    { label: "Harmonogram wesela", href: "/harmonogram", protected: true },
    { label: "Galeria", href: "/galeria", protected: true },
    { label: "Rywalizacja", href: "/rywalizacja", protected: true },
    { label: "FAQ", href: "/faq", protected: true },
    { label: "Kontakt", href: "/kontakt" },
  ];

  const visibleItems = navItems.filter((item) => !item.protected || guest);

  const handleMenuClick = () => {
    setIsOpen((prev) => !prev);
    if (isMobile) {
      try {
        togglePause();
      } catch {}
    }
  };

  return (
  <nav className="sticky top-0 left-0 w-full bg-[#4E0113] text-white shadow-md z-50 md:fixed">
    <div className="w-full px-6 lg:px-16 py-3 flex justify-between items-center">
      
      {/* ZMIANA 2: Dodano shrink-0 pr-12 md:pr-24, co "powiększa pole M&J" i tworzy barierę dla tekstu */}
      <Link href="/" className="text-4xl md:text-5xl font-script text-[#FAD6C8] hover:opacity-80 transition-opacity mt-1 shrink-0 pr-12 md:pr-24">
        M&J
      </Link>

      {/* Jeśli urządzenie mobilne → toggle */}
      {isMobile ? (
        <button
          className="focus:outline-none p-2 rounded-lg bg-[#841D30] hover:bg-[#9b3042] transition"
          onClick={handleMenuClick}
          aria-label="Otwórz menu"
        >
          <Bars3Icon className="w-7 h-7 text-white" />
        </button>
      ) : (
        /* Jeśli desktop → pełne menu */
        <ul className="flex space-x-6 lg:space-x-8 items-center">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`relative group transition-colors font-serif font-medium uppercase tracking-[0.15em] text-xs lg:text-sm ${
                    isActive ? "text-[#FAD6C8]" : "hover:text-[#FAD6C8]"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute left-0 -bottom-2 h-[1px] bg-[#FAD6C8] transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
          
          {/* PRZYCISK DŹWIĘKU */}
         <button 
           onClick={(e) => {
             e.stopPropagation();
             toggleMute();
           }}
           className="p-2 rounded-full hover:bg-black/10 transition text-[#FAD6C8]"
           title={isMuted ? "Włącz dźwięki" : "Wycisz dźwięki"}
         >
           {isMuted ? (
             <SpeakerXMarkIcon className="w-5 h-5" />
           ) : (
             <SpeakerWaveIcon className="w-5 h-5 animate-pulse" />
           )}
         </button>

          {guest && (
            <li>
              <button
                onClick={logout}
                className="ml-2 bg-[#841D30] hover:bg-[#9b3042] transition px-4 py-2 rounded-lg text-white text-xs font-serif font-medium uppercase tracking-widest shadow"
              >
                Wyloguj się
              </button>
            </li>
          )}
        </ul>
      )}
    </div>

    {/* Mobile menu – tylko gdy isMobile i otwarte */}
    {isMobile && isOpen && (
      <div className="bg-[#841D30] px-4 pb-4 border-t border-white/10">
        <ul className="flex flex-col space-y-2 mt-2">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block py-3 transition-colors font-serif font-medium uppercase tracking-widest text-sm ${
                    isActive
                      ? "text-[#FAD6C8]"
                      : "hover:text-[#FAD6C8]"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}

          {guest && (
            <li>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full text-left py-3 transition font-serif font-medium uppercase tracking-widest text-sm text-white/80 hover:text-white"
              >
                Wyloguj się
              </button>
            </li>
          )}
        </ul>
      </div>
    )}
  </nav>
);
}
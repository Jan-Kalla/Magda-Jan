"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useGuest } from "@/app/context/GuestContext";
import { usePathname } from "next/navigation";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { togglePause } from "@/app/components/tetris/gameLogic";
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
  <nav className="sticky top-0 left-0 w-full bg-[#FDF9EC] text-[#4E0113] shadow-md z-50 md:fixed transition-colors duration-300">
    <div className="w-full px-6 lg:px-16 py-3 flex justify-between items-center relative z-20 bg-[#FDF9EC]">
      
      {/* Logo M&J */}
      <Link href="/" className="text-4xl md:text-5xl font-script text-[#4E0113] hover:opacity-80 transition-opacity mt-1 shrink-0 pr-12 md:pr-24">
        M&J
      </Link>

      {/* MOBILE TOGGLE BUTTONS */}
      {isMobile ? (
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* PRZYCISK DŹWIĘKU - MOBILE */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            className="p-2 rounded-full hover:bg-black/5 transition text-[#4c4a1e]"
            title={isMuted ? "Włącz dźwięki" : "Wycisz dźwięki"}
          >
            {isMuted ? (
              <SpeakerXMarkIcon className="w-6 h-6" />
            ) : (
              <SpeakerWaveIcon className="w-6 h-6 animate-pulse" />
            )}
          </button>

          {/* PRZYCISK MENU (HAMBURGER) */}
          <button
            className="focus:outline-none p-2 rounded-lg bg-[#4c4a1e] hover:bg-[#3b3917] transition shadow-sm flex items-center justify-center w-11 h-11"
            onClick={handleMenuClick}
            aria-label={isOpen ? "Zamknij menu" : "Otwórz menu"}
          >
            <div className="relative w-6 h-4">
              <motion.span
                className="absolute left-0 top-0 w-full h-[2px] bg-[#FDF9EC] rounded-full"
                animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 7 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
              <motion.span
                className="absolute left-0 top-[7px] w-full h-[2px] bg-[#FDF9EC] rounded-full"
                animate={{ opacity: isOpen ? 0 : 1, x: isOpen ? -10 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
              <motion.span
                className="absolute left-0 top-[14px] w-full h-[2px] bg-[#FDF9EC] rounded-full"
                animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -7 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </div>
          </button>
        </div>
      ) : (
        /* DESKTOP MENU */
        <ul className="flex space-x-6 lg:space-x-8 items-center">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`relative group transition-colors font-serif font-medium uppercase tracking-[0.15em] text-xs lg:text-sm ${
                    isActive ? "text-[#4c4a1e]" : "text-[#4c4a1e]/70 hover:text-[#4c4a1e]"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute left-0 -bottom-2 h-[1px] bg-[#4c4a1e] transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
          
          {/* PRZYCISK DŹWIĘKU - DESKTOP */}
         <button 
           onClick={(e) => {
             e.stopPropagation();
             toggleMute();
           }}
           className="p-2 rounded-full hover:bg-black/5 transition text-[#4c4a1e]"
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
                className="ml-2 bg-[#4c4a1e] hover:bg-[#3b3917] transition px-4 py-2 rounded-lg text-[#FDF9EC] text-xs font-serif font-medium uppercase tracking-widest shadow"
              >
                Wyloguj się
              </button>
            </li>
          )}
        </ul>
      )}
    </div>

    {/* MOBILE DROPDOWN MENU */}
    <AnimatePresence>
      {isMobile && isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="overflow-hidden bg-[#FDF9EC] border-t border-[#4c4a1e]/10 shadow-lg relative z-10"
        >
          <div className="px-4 pb-4">
            <ul className="flex flex-col space-y-2 mt-2">
              {visibleItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block py-3 transition-colors font-serif font-medium uppercase tracking-widest text-sm ${
                        isActive
                          ? "text-[#4c4a1e] font-bold"
                          : "text-[#4c4a1e]/80 hover:text-[#4c4a1e]"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}

              {guest && (
                <li className="pt-2">
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    // ZMIANA: Zrobiono z tego pełnoprawny, widoczny przycisk z tłem
                    className="w-full text-center py-3 bg-[#4c4a1e] hover:bg-[#3b3917] transition-colors rounded-lg font-serif font-medium uppercase tracking-widest text-sm text-[#FDF9EC] shadow-md"
                  >
                    Wyloguj się
                  </button>
                </li>
              )}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </nav>
);
}
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useGuest } from "@/app/context/GuestContext";
import { usePathname } from "next/navigation";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/app/context/SoundContext";
import { createClient } from "@supabase/supabase-js";

// Inicjalizacja klienta Supabase dla Navbara
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

  // ZMIANA: Nowy stan przechowujący informację, czy gość potwierdził przybycie
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    // 1. Pobranie początkowego statusu z bazy podczas ładowania Navbara
    const fetchRsvp = async () => {
      if (!guest) return;
      const { data } = await supabase
        .from("guests")
        .select("rsvp_status")
        .eq("id", guest.id)
        .maybeSingle();
        
      if (data) {
        setIsConfirmed(data.rsvp_status === "confirmed");
      }
    };
    fetchRsvp();

    // 2. Nasłuchiwanie na bieżące zmiany statusu (np. gdy gość właśnie klika "Będę" na podstronie)
    const handleRsvpChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsConfirmed(customEvent.detail === "confirmed");
    };

    window.addEventListener("rsvpChanged", handleRsvpChange);
    return () => window.removeEventListener("rsvpChanged", handleRsvpChange);
  }, [guest]);

  const navItems = [
    { label: "Strona główna", href: "/" },
    { 
      label: "Wybory dla gościa", 
      href: "/ankiety", 
      protected: true,
      // ZMIANA: Sub-elementy pojawią się TYLKO, jeśli isConfirmed === true
      subItems: isConfirmed ? [
        { label: "Wybór posiłku", hash: "#posilek" },
        { label: "Test zgodności", hash: "#test-zgodnosci" },
      ] : undefined
    },
    { label: "Harmonogram wesela", href: "/harmonogram", protected: true },
    { label: "Galeria", href: "/galeria", protected: true },
    { label: "Rywalizacja", href: "/rywalizacja", protected: true },
    { label: "FAQ", href: "/faq", protected: true },
    { label: "Kontakt", href: "/kontakt" },
  ];

  const visibleItems = navItems.filter((item) => !item.protected || guest);

  const handleMenuClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
  <nav className="sticky top-0 left-0 w-full bg-[#FDF9EC] text-[#4E0113] shadow-md z-[100] md:fixed transition-colors duration-300">
    {/* ZMIANA: Płynniejsze zarządzanie bocznymi paddingami (px-4 -> lg:px-8 -> xl:px-16) */}
    <div className="w-full px-4 lg:px-8 xl:px-16 py-3 flex justify-between items-center relative z-20 bg-[#FDF9EC]">
      
      {/* Logo M&J */}
      {/* ZMIANA: Zmniejszono marginesy prawego odstępu dla średnich ekranów (pr-6 -> lg:pr-8 -> xl:pr-24) */}
      <Link href="/" className="text-4xl md:text-5xl font-script text-[#4E0113] hover:opacity-80 transition-opacity mt-1 shrink-0 pr-6 lg:pr-8 xl:pr-24">
        M&J
      </Link>

      {/* MOBILE TOGGLE BUTTONS */}
      {isMobile ? (
        <div className="flex items-center gap-2 sm:gap-4">
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            className="p-2 rounded-full hover:bg-black/5 transition text-[#C05454]"
            title={isMuted ? "Włącz dźwięki" : "Wycisz dźwięki"}
          >
            {isMuted ? (
              <SpeakerXMarkIcon className="w-6 h-6" />
            ) : (
              <SpeakerWaveIcon className="w-6 h-6 animate-pulse" />
            )}
          </button>

          <button
            className="focus:outline-none p-2 rounded-lg bg-[#C05454] hover:bg-[#c99a93] transition shadow-sm flex items-center justify-center w-11 h-11"
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
        /* ZMIANA: Zmniejszono luki pomiędzy słowami (space-x-4 -> lg:space-x-5 -> xl:space-x-8) */
        <ul className="flex space-x-4 lg:space-x-5 xl:space-x-8 items-center">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href} className="relative group">
                <Link
                  href={item.href}
                  // ZMIANA: Zmniejszono tracking (odstępy między literami) i wielkość tekstu na 1024px-1280px
                  className={`relative transition-colors font-serif font-bold uppercase tracking-[0.1em] xl:tracking-[0.15em] text-[11px] xl:text-sm ${
                    isActive ? "text-[#C97B78]" : "text-[#4E0113]/70 hover:text-[#C97B78]"
                  }`}
                >
                  <span className="absolute -inset-y-4 -inset-x-3 z-10 cursor-pointer" />
                  
                  {item.label}
                  <span
                    className={`absolute left-0 -bottom-2 h-[1px] bg-[#C97B78] transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>

                {item.subItems && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="bg-[#FDF9EC] shadow-2xl border border-[#4E0113]/10 rounded-2xl py-3 w-56 flex flex-col gap-1 relative before:content-[''] before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-b-[#FDF9EC]">
                      {item.subItems.map((sub) => (
                        <Link
                          key={sub.hash}
                          href={`${item.href}${sub.hash}`}
                          className="px-4 py-3 mx-2 hover:bg-[#C05454]/10 rounded-xl text-[#4E0113] text-xs font-serif font-bold uppercase tracking-widest text-center transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
          
         <button 
           onClick={(e) => {
             e.stopPropagation();
             toggleMute();
           }}
           className="p-2 rounded-full hover:bg-black/5 transition text-[#C05454]"
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
                className="ml-2 bg-[#C05454] hover:bg-[#4E0113] transition px-4 py-2 rounded-lg text-[#FDF9EC] text-xs font-serif font-medium uppercase tracking-widest shadow"
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
          className="overflow-hidden bg-[#FDF9EC] border-t border-[#4E0113]/10 shadow-lg relative z-10"
        >
          <div className="px-4 pb-4">
            <ul className="flex flex-col space-y-2 mt-2">
              {visibleItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href} className="w-full">
                    <Link
                      href={item.href}
                      className={`block py-3 transition-colors font-serif font-medium uppercase tracking-widest text-sm ${
                        isActive
                          ? "text-[#4E0113] font-bold"
                          : "text-[#4E0113]/80 hover:text-[#4E0113]"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>

                    {item.subItems && (
                      <div className="flex flex-col space-y-1 bg-[#4E0113]/5 rounded-xl p-2 mb-2 mt-1">
                        {item.subItems.map((sub) => (
                          <Link
                            key={sub.hash}
                            href={`${item.href}${sub.hash}`}
                            onClick={() => setIsOpen(false)}
                            className="block py-3 px-4 text-xs font-serif font-bold uppercase tracking-widest text-[#4E0113]/70 hover:text-[#4E0113] transition-colors"
                          >
                            ↳ {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
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
                    className="w-full text-center py-3 bg-[#C05454] hover:bg-[#c99a93] transition-colors rounded-lg font-serif font-medium uppercase tracking-widest text-sm text-[#FDF9EC] shadow-sm"
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
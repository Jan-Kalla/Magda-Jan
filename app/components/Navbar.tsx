"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useGuest } from "@/app/context/GuestContext";
import { usePathname } from "next/navigation";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { togglePause } from "@/app/components/tetris/gameLogic";

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

  const navItems = [
    { label: "Strona główna", href: "/" },
    { label: "Galeria", href: "/galeria", protected: true },
    { label: "Harmonogram wesela", href: "/harmonogram", protected: true },
    { label: "Ankiety", href: "/ankiety", protected: true },
    { label: "Rywalizacja", href: "/rywalizacja", protected: true },
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
    <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-[#FAD6C8]">
        Magda & Jan
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
        <ul className="flex space-x-6 items-center">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`relative group transition-colors ${
                    isActive ? "text-[#FAD6C8]" : "hover:text-[#FAD6C8]"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] bg-[#FAD6C8] transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              </li>
            );
          })}

          {guest && (
            <li>
              <button
                onClick={logout}
                className="ml-4 bg-[#841D30] hover:bg-[#9b3042] transition px-4 py-2 rounded-lg text-white font-medium shadow"
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
      <div className="bg-[#841D30] px-4 pb-4">
        <ul className="flex flex-col space-y-2">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block py-2 transition-colors ${
                    isActive
                      ? "text-[#FAD6C8] font-semibold"
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
                className="w-full text-left py-2 px-2 rounded-lg bg-[#9b3042] hover:bg-[#b64557] transition"
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

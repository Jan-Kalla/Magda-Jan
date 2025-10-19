"use client";

import Link from "next/link";
import { useState } from "react";
import { useGuest } from "@/app/context/GuestContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { guest, logout } = useGuest();
  const pathname = usePathname(); // <-- aktualna ścieżka

  const navItems = [
    { label: "Strona główna", href: "/" },
    { label: "Galeria", href: "/galeria", protected: true },
    { label: "Harmonogram wesela", href: "/harmonogram", protected: true },
    { label: "Ankiety", href: "/ankiety", protected: true },
    { label: "Rywalizacja", href: "/rywalizacja", protected: true },
    { label: "Kontakt", href: "/kontakt" },
  ];

  const visibleItems = navItems.filter((item) => !item.protected || guest);

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#4E0113] text-white shadow-md z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-[#FAD6C8]">
          Magda & Jan
        </Link>

        {/* Desktop menu */}
        <ul className="hidden md:flex space-x-6 items-center">
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
                  ></span>
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

        {/* Mobile toggle */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="material-icons text-3xl">menu</span>
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#841D30] px-4 pb-4">
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

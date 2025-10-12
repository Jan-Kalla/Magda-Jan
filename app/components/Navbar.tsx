"use client";

import Link from "next/link";
import { useState } from "react";
import { useGuest } from "@/app/context/GuestContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { guest, logout } = useGuest();

  // 🟢 Dodajemy pole "protected" do elementów, które mają być widoczne tylko po zalogowaniu
  const navItems = [
    { label: "Strona główna", href: "/" },
    { label: "Galeria", href: "/galeria", protected: true },
    { label: "Harmonogram wesela", href: "/harmonogram", protected: true },
    { label: "Informacje", href: "/informacje", protected: true },
    { label: "Kontakt", href: "/kontakt" },
  ];

  // 🟢 Filtrowanie elementów w zależności od tego, czy użytkownik jest zalogowany
  const visibleItems = navItems.filter((item) => !item.protected || guest);

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#4E0113] text-white shadow-md z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo / nazwa */}
        <Link href="/" className="text-2xl font-bold text-[#FAD6C8]">
          Magda & Jan
        </Link>

        {/* Desktop menu */}
        <ul className="hidden md:flex space-x-6 items-center">
          {visibleItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="hover:text-[#FAD6C8] transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}

          {/* 🟢 Przycisk wylogowania tylko jeśli jest zalogowany */}
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
            {visibleItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block py-2 hover:text-[#FAD6C8] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {/* 🟢 Wyloguj w menu mobilnym */}
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

"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Strona główna", href: "/" },
    { label: "Galeria", href: "/galeria" },
    { label: "Harmonogram wesela", href: "/harmonogram" },
    { label: "Informacje", href: "/informacje" },
    { label: "Kontakt", href: "/kontakt" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#4E0113] text-white shadow-md z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo / nazwa */}
        <Link href="/" className="text-2xl font-bold text-[#FAD6C8]">
          Magda & Jan
        </Link>

        {/* Desktop menu */}
        <ul className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="hover:text-[#FAD6C8] transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
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
            {navItems.map((item) => (
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
          </ul>
        </div>
      )}
    </nav>
  );
}

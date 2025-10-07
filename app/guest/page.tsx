"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import { motion } from "framer-motion";

const validCodes = [
  { code: "A4D7FZ", name: "Jan Kalla" },
  { code: "B9T1QM", name: "Magdalena Panek" },
  { code: "C2X8RS", name: "Ania Kowalska" },
];

export default function GuestPage() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [guest, setGuest] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const match = validCodes.find(
      (g) => g.code.toUpperCase() === input.trim().toUpperCase()
    );
    if (match) {
      setGuest(match);
      setError("");
      localStorage.setItem("guestCode", match.code); // zapamiętanie kodu
    } else {
      setError("Nieprawidłowy kod. Spróbuj ponownie 😅");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAD6C8] to-[#4E0113] text-white flex flex-col items-center justify-center px-6 py-20">
      <Navbar />

      {!guest ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg max-w-md w-full text-center"
        >
          <h1 className="text-3xl font-bold mb-6">Witaj, gościu weselny 💌</h1>
          <p className="mb-6 text-[#FBE4DA]/90">
            Wpisz kod z zaproszenia, aby zobaczyć szczegóły naszego wielkiego dnia.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Wpisz swój kod..."
              className="w-full p-3 rounded-lg text-black text-center font-semibold tracking-widest uppercase"
              maxLength={6}
            />
            {error && <p className="text-red-300 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#841D30] hover:bg-[#9b3042] transition-colors px-6 py-3 rounded-xl text-white font-semibold"
            >
              Sprawdź kod
            </button>
          </form>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg"
        >
          <h2 className="text-3xl font-bold mb-4 text-[#FBE4DA]">
            Cześć, {guest.name}! 🎉
          </h2>
          <p className="mb-6">Miło Cię widzieć! Kliknij poniżej, by zobaczyć szczegóły wesela:</p>
          <a
            href="/harmonogram"
            className="inline-block bg-[#841D30] hover:bg-[#9b3042] transition-colors px-6 py-3 rounded-xl text-white font-semibold"
          >
            Przejdź do harmonogramu 📅
          </a>
        </motion.div>
      )}
    </div>
  );
}

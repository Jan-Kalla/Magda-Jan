"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import SharedWeddingLayout from "@/app/components/SharedWeddingLayout";
import Navbar from "@/app/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useGuest } from "@/app/context/GuestContext";

// --- Supabase init ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function GuestPage() {
  const { guest, loginWithCode } = useGuest();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const verifyCode = async (code: string) => {
    const success = await loginWithCode(code.trim().toUpperCase());
    if (!success) {
      setError("Nieprawidłowy kod 😅");
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = input.trim().toUpperCase();
    await verifyCode(code);
  };

  useEffect(() => {
    const storedCode = localStorage.getItem("guestCode");
    if (storedCode) {
      verifyCode(storedCode).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-screen bg-[#FAD6C8] text-[#4E0113]">
          <p>Ładowanie...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* === Sekcja logowania z tłem === */}
      <div className="relative bg-[#FAD6C8] -mt-4 pb-4">
        <AnimatePresence>
          {!guest && (
            <motion.section
              key="guest-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                height: 0,
                paddingTop: 0,
                paddingBottom: 0,
                transition: { duration: 0.6, ease: "easeInOut" },
              }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="w-full flex items-center justify-center pt-28 overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="bg-white/60 backdrop-blur-md rounded-3xl shadow-lg p-8 max-w-md w-[90%] border border-[#4E0113]/20"
              >
                <h1 className="text-2xl md:text-3xl font-bold mb-4 text-[#4E0113]">
                  Witaj, gościu weselny 💌
                </h1>
                <p className="mb-6 text-[#4E0113]/80">
                  Wpisz kod z zaproszenia, aby zobaczyć szczegóły naszego wielkiego dnia.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Wpisz kod..."
                    className="w-full p-3 rounded-lg text-black text-center font-semibold tracking-widest uppercase shadow-sm"
                    maxLength={6}
                  />
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                  <button
                    type="submit"
                    className="w-full bg-[#841D30] hover:bg-[#9b3042] transition px-6 py-3 rounded-xl text-white font-semibold shadow-md"
                  >
                    Sprawdź kod
                  </button>
                </form>
              </motion.div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* === Reszta strony === */}
      <SharedWeddingLayout showNavbar={false} />
    </>
  );
}

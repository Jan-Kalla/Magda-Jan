"use client";
import { useEffect, useState } from "react";
import SharedWeddingLayout from "@/app/components/SharedWeddingLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useGuest } from "@/app/context/GuestContext";

export default function GuestPage() {
  const { guest, loginWithCode } = useGuest();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  const verifyCode = async (code: string) => {
    setIsChecking(true);
    setError(""); 
    
    const result = await loginWithCode(code.trim().toUpperCase());
    
    if (result.success) {
      setError("");
    } else {
      if (result.errorType === "INVALID_CODE") {
        setError("Nieprawidłowy kod 😅 Sprawdź literówki.");
      } else if (result.errorType === "CONNECTION_ERROR") {
        setError("Problem z połączeniem 📡 Sprawdź internet.");
      } else {
        setError("Wystąpił nieoczekiwany błąd. Spróbuj ponownie.");
      }
    }
    setIsChecking(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    await verifyCode(input);
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
      <div className="flex items-center justify-center h-screen bg-[#FFFDF9] text-[#4E0113]">
        <p className="animate-pulse font-serif tracking-widest text-lg">Ładowanie...</p>
      </div>
    );
  }

  return (
    // ZMIANA: Zamiast osobnych divów z tłami, przekazujemy formularz jako CHILD do SharedWeddingLayout.
    // Dzięki temu formularz znajdzie się wewnątrz wielkiego, spójnego bloku z gradientem!
    <SharedWeddingLayout showNavbar={true}>
      <AnimatePresence mode="sync">
        {!guest && (
          <motion.section
            key="guest-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{
              opacity: 0,
              height: 0,
              transition: { duration: 0.5, ease: "easeInOut" },
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="w-full flex items-center justify-center overflow-hidden"
          >
            <div className="w-full flex justify-center pb-12 relative z-10"> 
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white/60 backdrop-blur-md rounded-3xl shadow-xl p-8 max-w-md w-[90%] border border-white/40"
              >
                <h1 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-[#4E0113]">
                  Witaj, gościu weselny 💌
                </h1>
                <p className="mb-6 text-[#4E0113]/80 font-medium">
                  Wpisz kod z zaproszenia, aby zobaczyć szczegóły naszego wielkiego dnia.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Wpisz kod..."
                    className="w-full p-4 rounded-xl bg-white/80 border border-[#4E0113]/10 text-[#4E0113] placeholder-[#4E0113]/40 text-center font-bold tracking-widest uppercase shadow-inner focus:outline-none focus:ring-2 focus:ring-[#FAD6C8] transition-all disabled:opacity-50"
                    maxLength={6}
                    disabled={isChecking}
                  />
                  
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-xl border border-red-200"
                    >
                      {error}
                    </motion.p>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isChecking}
                    className="w-full bg-[#841D30] hover:bg-[#9b3042] disabled:bg-[#841D30]/70 transition-colors px-6 py-4 rounded-xl text-[#FBE4DA] font-bold shadow-md flex justify-center items-center"
                  >
                    {isChecking ? (
                      <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      "Sprawdź kod"
                    )}
                  </button>
                </form>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </SharedWeddingLayout>
  );
}
"use client";
import { useEffect, useState } from "react";
import SharedWeddingLayout from "@/app/components/SharedWeddingLayout";
import Navbar from "@/app/components/Navbar";
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
      <>
        <Navbar />
        <div className="flex items-center justify-center h-screen bg-[#FAD6C8] text-[#4E0113]">
          <p className="animate-pulse">Ładowanie...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* === Sekcja logowania z tłem === */}
      {/* ZMIANA: Usunięto pb-16. Teraz ten kontener nie narzuca sztywnego odstępu na dole */}
      <div className="relative bg-[#FAD6C8] -mt-4">
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
              <div className="w-full flex justify-center py-20"> 
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
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
                      className="w-full p-3 rounded-lg text-black text-center font-semibold tracking-widest uppercase shadow-sm disabled:opacity-50"
                      maxLength={6}
                      disabled={isChecking}
                    />
                    
                    {error && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 text-sm font-medium bg-red-50 p-2 rounded border border-red-200"
                      >
                        {error}
                      </motion.p>
                    )}
                    
                    <button
                      type="submit"
                      disabled={isChecking}
                      className="w-full bg-[#841D30] hover:bg-[#9b3042] disabled:bg-[#841D30]/70 transition px-6 py-3 rounded-xl text-white font-semibold shadow-md flex justify-center items-center"
                    >
                      {isChecking ? (
                        <span className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
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
      </div>

      {/* === Reszta strony === */}
      <SharedWeddingLayout showNavbar={false} />
    </>
  );
}
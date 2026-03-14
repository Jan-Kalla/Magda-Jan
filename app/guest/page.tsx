"use client";
import { useEffect, useState } from "react";
import SharedWeddingLayout from "@/app/components/SharedWeddingLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useGuest } from "@/app/context/GuestContext";
import Image from "next/image"; 

export default function GuestPage() {
  const { guest, loginWithCode } = useGuest();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  
  const [greeting, setGreeting] = useState("Witaj");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 3 && hour < 18) {
      setGreeting("Dzień dobry");
    } else {
      setGreeting("Dobry wieczór");
    }
  }, []);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FFFDF9] text-[#4E0113]">
        <p className="animate-pulse font-serif tracking-widest text-lg">Ładowanie...</p>
      </div>
    );
  }

  return (
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
            <div className="w-full flex justify-center pb-2 relative z-10"> 
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="relative bg-white/20 backdrop-blur-md rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] p-10 md:p-14 max-w-lg w-[95%] border border-white/30 overflow-hidden flex flex-col items-center"
              >
                
                {/* ======================================================= */}
                {/* KWIATOWE RAMKI */}
                {/* ======================================================= */}
                
                <div className="absolute top-0 left-0 w-28 h-28 md:w-36 md:h-36 pointer-events-none opacity-90 z-0">
                  <Image src="/fotki/kwiatki2.png" alt="Kwiaty" fill className="object-contain object-top-left -scale-x-100" />
                </div>
                
                <div className="absolute top-0 right-0 w-28 h-28 md:w-36 md:h-36 pointer-events-none opacity-90 z-0">
                  <Image src="/fotki/kwiatki2.png" alt="Kwiaty" fill className="object-contain object-top-right" />
                </div>

                <div className="absolute bottom-0 left-0 w-36 h-36 md:w-48 md:h-48 pointer-events-none opacity-90 z-0">
                  <Image src="/fotki/kwiatki1.png" alt="Kwiaty" fill className="object-contain object-bottom-left -scale-x-100" />
                </div>

                <div className="absolute bottom-0 right-0 w-36 h-36 md:w-48 md:h-48 pointer-events-none opacity-90 z-0">
                  <Image src="/fotki/kwiatki1.png" alt="Kwiaty" fill className="object-contain object-bottom-right" />
                </div>

                {/* ======================================================= */}

                <div className="relative z-10 w-full text-center mt-6 mb-2">
                  <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-[#4E0113] drop-shadow-sm">
                    {greeting},<br className="md:hidden"/> gościu weselny!
                  </h1>
                  <p className="mb-8 text-[#4E0113]/90 font-medium px-2 text-sm md:text-base">
                    Wpisz kod z zaproszenia, aby zobaczyć szczegóły naszego wielkiego dnia.
                  </p>

                  {/* ZMIANA: flex-col items-center wyśrodkowuje i pozwala na elastyczne szerokości */}
                  <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-xs mx-auto flex flex-col items-center">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Wpisz kod..."
                      // ZMIANA: rounded-full, lżejszy font, szerokie litery, delikatniejsze tło
                      className="w-full py-3 px-4 rounded-full bg-white/40 backdrop-blur-sm border border-white/50 text-[#4E0113] placeholder-[#4E0113]/60 text-center font-sans font-light tracking-[0.2em] uppercase shadow-sm focus:outline-none focus:bg-white/60 focus:border-white/80 transition-all disabled:opacity-50"
                      maxLength={6}
                      disabled={isChecking}
                    />
                    
                    {error && (
                      <motion.p 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 text-sm font-medium bg-red-50/80 backdrop-blur-sm p-3 rounded-xl border border-red-200 w-full"
                      >
                        {error}
                      </motion.p>
                    )}
                    
                    <button
                      type="submit"
                      disabled={isChecking}
                      // ZMIANA: usunięte w-full, dodane px-10, zaokrąglone rogi i elegancki font szeryfowy
                      className="bg-[#4E0113] hover:bg-[#6A051C] disabled:opacity-70 transition-all px-10 py-3 rounded-full text-[#FDF9EC] font-serif font-light uppercase tracking-widest text-sm shadow-md flex justify-center items-center"
                    >
                      {isChecking ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      ) : (
                        "Sprawdź kod"
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </SharedWeddingLayout>
  );
}
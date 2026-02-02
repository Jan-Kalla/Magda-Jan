"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react"; // Ikony z lucide-react dla spójności z kontaktem
import { useGuest } from "@/app/context/GuestContext";
import { useSound } from "@/app/context/SoundContext";
import PageWrapper from "@/app/components/PageWrapper";

// --- DANE PYTAŃ ---
const faqData = [
  {
    id: 1,
    question: "Do kiedy musimy potwierdzić przybycie?",
    answer: "Będziemy wdzięczni za informację zwrotną najpóźniej do 1 czerwca 2026 roku. Pomoże nam to w zaplanowaniu posiłków i organizacji logistycznej."
  },
  {
    id: 2,
    question: "Co z prezentami?",
    answer: "Nie ma co tutaj za bardzo owijać. Dla młodych, którzy muszą dopiero poukładać sobie nowe życie i wyremontować mieszkanie, zdecydowanie najpraktyczniejszym wsparciem jest po prostu co nieco pieniążków ;)"
  },
  {
    id: 3,
    question: "Czy zapewniacie nocleg?",
    answer: "Tak, jednak z uwagi na ograniczoną ilość pokoi w Starej Szwajcarii, jest on tylko dla rodziców i gości przyjezdnych z daleka."
  },
    {
    id: 4,
    question: "Czy przewidziany jest transport?",
    answer: "Coś ogarniemy! ;)"
  },
  {
    id: 5,
    question: "Czy na weselu będzie coś przewidziane specjalnie dla dzieci?",
    answer: "Owszem! Jeszcze jak! W godzinach około 17:00-22:00 będzie dostępny kącik zabaw z animatorkami, gdzie dzieci będą mogły się bawić pod opieką profesjonalistek, podczas gdy dorośli będą cieszyć się zabawą na parkiecie."
  },
  {
    id: 6,
    question: "Jaki obowiązuje Dress Code?",
    answer: ""
  },
  {
    id: 7,
    question: "Mam dietę wegetariańską. Co robić?",
    answer: "W zakładce Ankiety znajdziecie miejsce, gdzie możecie zaznaczyć swoje preferencje żywieniowe. Postaramy się, aby każdy znalazł coś dla siebie!"
  },
];

export default function FaqPage() {
  const { loading } = useGuest();
  const { playSound } = useSound();
  // Stan dla aktualnie otwartego pytania (null = wszystkie zamknięte)
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleItem = (id: number) => {
    playSound("click");
    setOpenId(openId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FAD6C8] text-[#4E0113]">
        <p>Ładowanie...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="flex-grow bg-gradient-to-b from-[#FAD6C8] to-[#4E0113] py-24 px-4 md:px-8 text-white">
        {/* TU ZMIANA: Zwykły div zamieniony na PageWrapper */}
        <PageWrapper className="max-w-4xl mx-auto">
          
          {/* NAGŁÓWEK */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              Częste Pytania <HelpCircle className="text-[#FAD6C8]" size={40} />
            </h1>
            <p className="text-[#FBE4DA]/80 text-lg">
              Wszystko, co chcielibyście wiedzieć, a boicie się zapytać ;)
            </p>
          </motion.div>

          {/* LISTA PYTAŃ */}
          <div className="space-y-4">
            {faqData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden hover:bg-white/15 transition-colors"
              >
                {/* Pytanie (Klikalne) */}
                <button
                  onClick={() => toggleItem(item.id)}
                  onMouseEnter={() => playSound("hover")}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 outline-none focus:bg-white/5"
                >
                  <span className="font-semibold text-lg md:text-xl text-[#FBE4DA]">
                    {item.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openId === item.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-[#FBE4DA]/70 shrink-0"
                  >
                    <ChevronDown size={24} />
                  </motion.div>
                </button>

                {/* Odpowiedź (Rozwijana) */}
                <AnimatePresence>
                  {openId === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-0 text-white/90 leading-relaxed border-t border-white/10 mt-2">
                        <div className="pt-4">
                            {item.answer}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* KONTAKT NA DOLE */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-16 text-[#FBE4DA]/60 text-sm"
          >
            <p>Nie znalazłeś odpowiedzi? Napisz do nas w zakładce Kontakt.</p>
          </motion.div>

        </PageWrapper>
      </section>

      <Footer />
    </div>
  );
}
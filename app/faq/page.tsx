"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronDown, HelpCircle, Send, ShieldCheck } from "lucide-react";
import { useGuest } from "@/app/context/GuestContext";
import { useSound } from "@/app/context/SoundContext";
import PageWrapper from "@/app/components/PageWrapper";
import { createClient } from "@supabase/supabase-js";

// --- INICJALIZACJA BAZY DANYCH ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- DANE PYTAŃ STATYCZNYCH ---
const faqData = [
  {
    id: 1,
    question: "Do kiedy musimy potwierdzić przybycie?",
    answer: "Będziemy wdzięczni za informację zwrotną najpóźniej do 15 maja 2026 roku. Pomoże nam to w zaplanowaniu posiłków i organizacji logistycznej."
  },
  {
    id: 2,
    question: "Co z prezentami?",
    answer: "Nie ma co tutaj za bardzo owijać. Dla młodych, którzy muszą dopiero poukładać sobie nowe życie i wyremontować mieszkanie, zdecydowanie najpraktyczniejszym wsparciem jest po prostu co nieco pieniążków 😁💰"
  },
  {
    id: 3,
    question: "Czy zapewniacie nocleg?",
    answer: "Tak, jednak z uwagi na ograniczoną ilość pokoi w Starej Szwajcarii, jest on tylko dla rodziców i gości przyjezdnych z daleka."
  },
  {
    id: 4,
    question: "Czy przewidziany jest transport?",
    answer: "Coś ogarniemy! ;) Na pewno będą jeździły busiki rozwożące ludzi do domu."
  },
  {
    id: 5,
    question: "Czy na weselu będzie coś przewidziane specjalnie dla dzieci?",
    answer: "Owszem! Jeszcze jak! W godzinach około 17:00-22:00 będzie dostępny kącik zabaw z animatorkami, gdzie dzieci będą mogły się bawić pod opieką profesjonalistek, podczas gdy dorośli będą cieszyć się zabawą na parkiecie."
  },
  {
    id: 6,
    question: "Jaki obowiązuje Dress Code?",
    answer: "Styl: Semi-Formal / Cocktail. Chcemy, żebyście czuli się elegancko, ale też swobodnie. Prosimy jedynie, aby kolor biały i écru zostawić w tym dniu dla Panny Młodej."
  },
  {
    id: 7,
    question: "Mam dietę wegetariańską. Co robić?",
    answer: "W zakładce Ankiety znajdziecie miejsce, gdzie możecie zaznaczyć swoje preferencje żywieniowe. Postaramy się, aby każdy znalazł coś dla siebie!"
  },
];

export default function FaqPage() {
  const { guest, loading } = useGuest();
  const { playSound } = useSound();
  
  const [openId, setOpenId] = useState<number | null>(null);
  
  // Stany formularza i pytań
  const [customQuestion, setCustomQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [suggestedQuestions, setSuggestedQuestions] = useState<any[]>([]);

  // Weryfikacja Pary Młodej
  const isBrideOrGroom = guest?.code === "FC3818" || guest?.code === "8DD06D";

  // Pobieranie pytań z bazy (tylko dla Pary Młodej)
  useEffect(() => {
    if (isBrideOrGroom) {
      const fetchQuestions = async () => {
        const { data } = await supabase
          .from("faq_suggestions")
          .select("*")
          .order("created_at", { ascending: false });
        if (data) setSuggestedQuestions(data);
      };
      fetchQuestions();
    }
  }, [isBrideOrGroom]);

  const toggleItem = (id: number) => {
    playSound("click");
    setOpenId(openId === id ? null : id);
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;
    
    setIsSubmitting(true);
    setSubmitStatus("idle");
    playSound("click");

    const guestName = guest ? `${guest.first_name} ${guest.last_name}` : "Anonim";

    const { error } = await supabase.from("faq_suggestions").insert([
      {
        guest_name: guestName,
        question: customQuestion.trim(),
      },
    ]);

    setIsSubmitting(false);

    if (error) {
      setSubmitStatus("error");
    } else {
      setSubmitStatus("success");
      setCustomQuestion("");
      playSound("success"); // Jeśli masz taki dźwięk
      
      // Jeśli PM testuje formularz, odświeżamy listę w locie
      if (isBrideOrGroom) {
        const { data } = await supabase.from("faq_suggestions").select("*").order("created_at", { ascending: false });
        if (data) setSuggestedQuestions(data);
      }
    }
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
        <PageWrapper className="max-w-4xl mx-auto">
          
          {/* NAGŁÓWEK */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3 text-[#4E0113]">
              Częste Pytania <HelpCircle className="text-[#4E0113]" size={40} />
            </h1>
            <p className="text-[#4E0113]/80 text-lg">
              Wszystko, co chcielibyście wiedzieć, a boicie się zapytać 😉
            </p>
          </motion.div>

          {/* LISTA PYTAŃ */}
          <div className="space-y-4 mb-16">
            {faqData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden hover:bg-white/15 transition-colors shadow-sm"
              >
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

          {/* FORMULARZ ZADAWANIA PYTAŃ DLA GOŚCI */}
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="bg-white/20 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/30 shadow-lg text-center"
          >
             <h2 className="text-2xl font-bold text-[#FBE4DA] mb-2">Masz inne pytanie?</h2>
             <p className="text-white/80 mb-6 text-sm md:text-base">
                Zadaj je tutaj. Dostaniemy powiadomienie i jak najszybciej postaramy się na nie odpowiedzieć!
             </p>
             
             <form onSubmit={handleQuestionSubmit} className="flex flex-col gap-4 max-w-2xl mx-auto">
                <textarea 
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder="Twoje pytanie..."
                  rows={3}
                  className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FBE4DA]/50 resize-none transition-all"
                />
                <button 
                  type="submit"
                  disabled={isSubmitting || !customQuestion.trim()}
                  className="flex items-center justify-center gap-2 bg-[#4E0113] text-[#FBE4DA] py-3 px-6 rounded-xl font-bold hover:bg-[#6b1326] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Wysyłanie..." : "Wyślij pytanie"}
                  <Send size={18} />
                </button>
                
                {submitStatus === "success" && (
                  <p className="text-green-300 font-medium text-sm mt-2">Pytanie wysłane! Dziękujemy.</p>
                )}
                {submitStatus === "error" && (
                  <p className="text-red-300 font-medium text-sm mt-2">Coś poszło nie tak. Spróbuj ponownie.</p>
                )}
             </form>
          </motion.div>

          {/* SEKRETNY PANEL PARY MŁODEJ */}
          {isBrideOrGroom && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 bg-[#841D30]/80 backdrop-blur-md rounded-2xl p-6 md:p-8 border-2 border-dashed border-[#FBE4DA]/40 shadow-xl"
            >
               <div className="flex items-center gap-3 mb-6 border-b border-[#FBE4DA]/20 pb-4">
                  <ShieldCheck className="text-[#FBE4DA]" size={32} />
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-[#FBE4DA] uppercase tracking-wider">
                      Panel Pary Młodej
                    </h2>
                    <p className="text-white/70 text-sm">Pytania nadesłane przez gości</p>
                  </div>
               </div>

               {suggestedQuestions.length === 0 ? (
                 <p className="text-center text-white/60 py-4">Na razie brak nowych pytań od gości.</p>
               ) : (
                 <div className="space-y-4">
                   {suggestedQuestions.map((q) => (
                     <div key={q.id} className="bg-white/10 rounded-lg p-4 border border-white/10">
                        <p className="text-xs text-[#FBE4DA]/60 mb-1 font-mono">
                          Od: <span className="font-bold text-white">{q.guest_name}</span> • {new Date(q.created_at).toLocaleDateString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-white text-lg font-medium">{q.question}</p>
                     </div>
                   ))}
                 </div>
               )}
            </motion.div>
          )}

          {/* KONTAKT NA DOLE */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12 text-[#FBE4DA]/60 text-sm"
          >
            <p>Pilna sprawa? Napisz do nas w zakładce Kontakt.</p>
          </motion.div>

        </PageWrapper>
      </section>

      <Footer />
    </div>
  );
}
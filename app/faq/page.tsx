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
import OrganicGlassPattern from "@/app/components/OrganicGlassPattern";

// --- INICJALIZACJA BAZY DANYCH ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- DANE PYTAŃ STATYCZNYCH (Wyczyszczone z emoji, wygładzony język) ---
const faqData = [
  {
    id: 1,
    question: "Do kiedy musimy potwierdzić przybycie?",
    answer: "Będziemy wdzięczni za informację zwrotną najpóźniej do 15 maja 2026 roku. Pomoże nam to w zaplanowaniu posiłków i organizacji logistycznej."
  },
  {
    id: 2,
    question: "Co z prezentami?",
    answer: "Dla nas, jako Młodej Pary, która musi dopiero poukładać sobie nowe życie i wyremontować mieszkanie, zdecydowanie najpraktyczniejszym wsparciem będzie po prostu gotówka."
  },
  {
    id: 3,
    question: "Czy zapewniacie nocleg?",
    answer: "Tak, jednak z uwagi na ograniczoną ilość pokoi w Starej Szwajcarii, jest on przewidziany tylko dla rodziców i gości przyjezdnych z daleka."
  },
  {
    id: 4,
    question: "Czy przewidziany jest transport?",
    answer: "Oczywiście! Na pewno będą zorganizowane busy, które po zakończeniu przyjęcia rozwiozą gości do domów."
  },
  {
    id: 5,
    question: "Czy na weselu będzie coś przewidziane specjalnie dla dzieci?",
    answer: "Jak najbardziej! W godzinach około 17:00-22:00 będzie dostępny kącik zabaw z animatorkami, gdzie dzieci będą mogły się bawić pod profesjonalną opieką, podczas gdy dorośli będą cieszyć się zabawą na parkiecie."
  },
  {
    id: 6,
    question: "Jaki obowiązuje Dress Code?",
    answer: "Styl: Semi-Formal / Cocktail. Chcemy, żebyście czuli się elegancko, ale też swobodnie. Prosimy jedynie, aby kolor biały i écru zostawić w tym dniu dla Panny Młodej."
  },
  {
    id: 7,
    question: "Mam dietę wegetariańską. Co robić?",
    answer: "W zakładce 'Wybory dla gościa' znajdziecie miejsce, gdzie możecie zaznaczyć swoje preferencje żywieniowe. Postaramy się, aby każdy znalazł coś dla siebie."
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
      playSound("success"); 
      
      // Jeśli PM testuje formularz, odświeżamy listę w locie
      if (isBrideOrGroom) {
        const { data } = await supabase.from("faq_suggestions").select("*").order("created_at", { ascending: false });
        if (data) setSuggestedQuestions(data);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FDF9EC] text-[#4c4a1e]">
        <p className="font-serif italic text-xl tracking-widest uppercase">Ładowanie...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* GŁÓWNY KONTENER Z PŁYNNYM GRADIENTEM I SZKŁEM */}
      <section className="relative flex-grow bg-gradient-to-b from-[#FDF9EC] via-[#A46C6E] to-[#4E0113] pt-24 md:pt-32 pb-32 overflow-hidden text-[#4c4a1e]">
        
        <div className="absolute inset-0 z-0 pointer-events-none">
          <OrganicGlassPattern part="top" />
        </div>

        <div className="relative z-10 px-4 md:px-8">
          <PageWrapper className="max-w-4xl mx-auto">
            
            {/* NAGŁÓWEK */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="font-script text-6xl md:text-7xl mb-6 flex items-center justify-center gap-4 text-[#4c4a1e] drop-shadow-sm">
                Częste Pytania <HelpCircle className="text-[#4c4a1e]/80" size={48} />
              </h1>
              <p className="font-sans font-light tracking-[0.15em] text-[#4c4a1e]/80 text-sm md:text-base">
                Wszystko, co chcielibyście wiedzieć, a o co boicie się zapytać
              </p>
            </motion.div>

            {/* LISTA PYTAŃ - Jasne szkło na jasnym/przejściowym tle */}
            <div className="space-y-5 mb-24">
              {faqData.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    onMouseEnter={() => playSound("hover")}
                    className="w-full text-left px-6 py-6 md:px-8 flex items-center justify-between gap-4 outline-none hover:bg-white/30 transition-colors"
                  >
                    <span className="font-serif text-xl md:text-2xl text-[#4c4a1e] font-light tracking-wide leading-snug">
                      {item.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openId === item.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-[#4c4a1e]/50 shrink-0"
                    >
                      <ChevronDown size={28} />
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
                        <div className="px-6 md:px-8 pb-8 pt-0 border-t border-[#4c4a1e]/10 mt-2">
                          <div className="pt-6 font-sans font-light text-[#4c4a1e]/90 text-base md:text-lg leading-relaxed">
                              {item.answer}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* FORMULARZ ZADAWANIA PYTAŃ DLA GOŚCI - Ciemne szkło na bordowym tle */}
            <motion.div
               initial={{ opacity: 0, y: 40 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="bg-black/20 backdrop-blur-xl rounded-2xl p-8 md:p-14 border border-white/20 shadow-2xl text-center"
            >
               <h2 className="font-serif text-3xl md:text-4xl font-light text-[#FDF9EC] mb-4 uppercase tracking-[0.1em]">
                 Masz inne pytanie?
               </h2>
               <p className="font-sans font-light text-[#FDF9EC]/80 mb-8 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
                  Zadaj je tutaj. Dostaniemy powiadomienie i jak najszybciej postaramy się na nie odpowiedzieć.
               </p>
               
               <form onSubmit={handleQuestionSubmit} className="flex flex-col gap-5 max-w-2xl mx-auto">
                  <textarea 
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    placeholder="Treść pytania..."
                    rows={4}
                    className="w-full p-5 rounded-xl bg-white/10 border border-white/30 text-[#FDF9EC] placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FDF9EC]/50 resize-none transition-all font-sans shadow-inner"
                  />
                  <button 
                    type="submit"
                    disabled={isSubmitting || !customQuestion.trim()}
                    className="flex items-center justify-center gap-3 bg-[#FDF9EC] text-[#4E0113] py-4 px-8 rounded-xl font-serif uppercase tracking-widest hover:bg-white hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg font-bold"
                  >
                    {isSubmitting ? "Wysyłanie..." : "Wyślij pytanie"}
                    <Send size={18} />
                  </button>
                  
                  {submitStatus === "success" && (
                    <p className="text-[#FDF9EC] font-serif italic mt-4 text-lg drop-shadow-md">Pytanie wysłane! Dziękujemy.</p>
                  )}
                  {submitStatus === "error" && (
                    <p className="text-red-300 font-serif italic font-bold mt-4 text-lg drop-shadow-md">Coś poszło nie tak. Spróbuj ponownie.</p>
                  )}
               </form>
            </motion.div>

            {/* SEKRETNY PANEL PARY MŁODEJ */}
            {isBrideOrGroom && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-16 bg-black/40 backdrop-blur-xl rounded-2xl p-8 md:p-12 shadow-2xl border border-yellow-500/30 relative z-10"
              >
                 <div className="flex items-center gap-4 mb-8 border-b border-yellow-500/30 pb-6">
                    <ShieldCheck className="text-yellow-400" size={36} />
                    <div className="text-left">
                      <h2 className="font-serif text-2xl md:text-3xl font-light text-yellow-400 uppercase tracking-widest">
                        Panel Pary Młodej
                      </h2>
                      <p className="font-sans font-light text-white/60 text-sm mt-1">Pytania nadesłane przez gości</p>
                    </div>
                 </div>

                 {suggestedQuestions.length === 0 ? (
                   <p className="text-center font-serif italic text-white/60 py-8">Na razie brak nowych pytań od gości.</p>
                 ) : (
                   <div className="space-y-4">
                     {suggestedQuestions.map((q) => (
                       <div key={q.id} className="bg-white/5 rounded-xl p-5 border border-white/10 text-left">
                          <p className="text-xs text-yellow-200/60 mb-2 font-sans uppercase tracking-wider">
                            Od: <span className="font-medium text-white">{q.guest_name}</span> • {new Date(q.created_at).toLocaleDateString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <p className="text-white text-lg font-serif italic">"{q.question}"</p>
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
              className="text-center mt-20"
            >
              <p className="font-sans font-light uppercase tracking-widest text-[#FDF9EC]/60 text-sm">
                Jakakolwiek inna pilna sprawa? Napisz do nas w zakładce Kontakt.
              </p>
            </motion.div>

          </PageWrapper>
        </div>
      </section>

      <Footer />
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { useMealSurvey } from "./hooks/useMealSurvey";
import MainCourseSelector from "@/app/components/MainCourseSelector";
import ChildrenChoices from "@/app/components/ChildrenChoices";
import SurveyResults from "@/app/components/SurveyResults";
import PlusOneSelector from "@/app/components/PlusOneSelector";
import Footer from "@/app/components/Footer";
import RsvpSelector, { RsvpStatus } from "@/app/components/RsvpSelector";
import PageWrapper from "@/app/components/PageWrapper";
import { createClient } from "@supabase/supabase-js";

import { motion, Variants, easeOut, easeInOut, AnimatePresence } from "framer-motion";
import { Send, Music, ShieldCheck } from "lucide-react"; // Ikony dodane

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const mainCourses = [
  { name: "Rolada śląska z modrą kapustą i kluskami śląskimi", img: "/fotki/rolada.jpg" },
  { name: "Roladki drobiowe z serem feta i szpinakiem owinięte w boczku z gratiną ziemniaczaną i marchewką glazurowaną", img: "/fotki/roladki.webp" },
  { name: "Polędwiczki z kurczaka owinięte w boczku w sosie śmietanowym z gnocchi i glazurowaną w miodzie baby marchewką", img: "/fotki/poledwiczki.jpg" },
  { name: "Udziec z Indyka z brukselką grillowaną z miodem balsamicznym i frytkami z batatów", img: "/fotki/udziec.jpg" },
  { name: "Pieczony pstrąg w ziołach z opiekanymi batatami i mixem sałat", img: "/fotki/pstrag.jpeg" },
  { name: "Opcja wegetariańska: Pieróg z farszem z pieczarek i kaszy gryczanej", img: "/fotki/vege.jpg"},
];

const childrenDishes = [
  { name: "Nuggetsy z kurczaka z frytkami", img: "/fotki/nuggetsy.jpg" },
  { name: "Pulpeciki drobiowe w sosie pomidorowym", img: "/fotki/pulpeciki.jpg" },
  { name: "Buchty z musem truskawkowym", img: "/fotki/butchy.jpg" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeOut },
  },
};

const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: easeInOut },
  },
};

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: easeInOut },
  },
};

export default function MealSurveyPage() {
  const {
    guest,
    mainCourse,
    setMainCourse,
    children,
    childrenChoices,
    handleChildChoice,
    handleSubmit,
    loading,
    message,
    results,
  } = useMealSurvey();

  const [rsvpStatus, setRsvpStatus] = useState<RsvpStatus>(null);

  // --- STANY DO FORMULARZA GRY ---
  const [gameQuestion, setGameQuestion] = useState("");
  const [isSubmittingGame, setIsSubmittingGame] = useState(false);
  const [gameSubmitStatus, setGameSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [wodzirejQuestions, setWodzirejQuestions] = useState<any[]>([]);

  // Sprawdzamy czy to Wodzirej (na podst. kodu)
  const isWodzirej = guest?.code === "C83841";
  
  // Zablokujmy możliwość czytania pytań dla PM (nawet jeśli podepną się pod kod wodzireja w inspektorze, nie pokażemy im tego)
  const isBrideOrGroom = guest?.code === "FC3818" || guest?.code === "8DD06D";

  useEffect(() => {
    // Ładujemy pytania tylko dla wodzireja, i upewniamy się, że to na pewno nie para młoda
    if (isWodzirej && !isBrideOrGroom) {
      const fetchQuestions = async () => {
        const { data } = await supabase
          .from("game_questions")
          .select("*")
          .order("created_at", { ascending: false });
        if (data) setWodzirejQuestions(data);
      };
      fetchQuestions();
    }
  }, [isWodzirej, isBrideOrGroom]);

  const handleGameQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameQuestion.trim()) return;
    
    setIsSubmittingGame(true);
    setGameSubmitStatus("idle");

    const guestName = guest ? `${guest.first_name} ${guest.last_name}` : "Anonim";

    const { error } = await supabase.from("game_questions").insert([
      {
        guest_name: guestName,
        question: gameQuestion.trim(),
      },
    ]);

    setIsSubmittingGame(false);

    if (error) {
      setGameSubmitStatus("error");
    } else {
      setGameSubmitStatus("success");
      setGameQuestion("");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#FAD6C8] to-[#4E0113] pt-5 md:pt-[112px] pb-20">
        
        <PageWrapper>
            {/* 1. SEKCJA RSVP */}
            {guest && (
              <RsvpSelector 
                guestId={guest.id} 
                onDecisionChange={(status) => setRsvpStatus(status)} 
              />
            )}

            {/* 2. Reszta strony - widoczna TYLKO gdy rsvpStatus === 'confirmed' */}
            <AnimatePresence>
              {rsvpStatus === 'confirmed' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <PlusOneSelector
                    canBringPlusOne={guest?.can_bring_plus_one}
                    parentGuestId={guest?.id}
                  />

                  {/* Formularz jedzenia */}
                  <motion.form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-xl shadow-2xl p-6 md:p-10 max-w-4xl mx-auto mt-10"
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                  >
                    <motion.h1
                      className="text-3xl md:text-4xl font-bold mb-10 text-[#4E0113] text-center"
                      variants={fadeUp}
                    >
                      Wybierz swoje danie
                    </motion.h1>

                    <motion.div variants={fadeInLeft}>
                      <MainCourseSelector
                        dishes={mainCourses}
                        mainCourse={mainCourse}
                        setMainCourse={setMainCourse}
                      />
                    </motion.div>

                    <motion.div variants={fadeInRight} className="mt-8">
                      <ChildrenChoices
                        children={children}
                        standardDishes={mainCourses}
                        childrenDishes={childrenDishes}
                        childrenChoices={childrenChoices}
                        handleChildChoice={handleChildChoice}
                      />
                    </motion.div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#4E0113] text-white py-4 rounded-lg hover:bg-[#6b1326] transition text-xl font-semibold mt-8 shadow-md"
                      variants={fadeUp}
                    >
                      {loading ? "Zapisywanie..." : "Zatwierdź wybór posiłku"}
                    </motion.button>

                    {message && (
                      <motion.p
                        className="mt-8 text-center text-[#4E0113] font-medium text-lg"
                        variants={fadeUp}
                      >
                        {message}
                      </motion.p>
                    )}
                  </motion.form>

                  {/* Wyniki ankiety */}
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInRight}
                    className="mt-12"
                  >
                    <SurveyResults
                      guest={guest}
                      dishes={[...mainCourses, ...childrenDishes]}
                      results={results}
                    />
                  </motion.div>

                  {/* === SEKCJA GRY (TEST ZGODNOŚCI) - Pokazuje się tylko gościom (i ewentualnie PM/Wodzirejowi by też mogli zadać) === */}
                  <motion.div
                     initial={{ opacity: 0, y: 40 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.8, delay: 0.2 }}
                     className="max-w-4xl mx-auto mt-16 bg-white/20 backdrop-blur-md rounded-2xl p-6 md:p-10 border border-white/30 shadow-xl text-center"
                  >
                     <div className="flex justify-center mb-4">
                        <Music className="text-[#FBE4DA]" size={40} />
                     </div>
                     <h2 className="text-3xl font-bold text-[#FBE4DA] mb-3 drop-shadow-sm">Test Zgodności</h2>
                     <p className="text-white/90 mb-6 text-base md:text-lg max-w-2xl mx-auto">
                        Przed oczepinami zmierzymy się w klasycznym teście na zgodność. Jednak aby było to mniej sztampowe, niż zwykle, chcemy, aby pytania zadawali goście! <br/><br/>
                        Masz pomysł na zabawne pytanie, które sprawdzi, jak dobrze znamy się jako para? A może chcesz zadać podchwytliwe pytanie, które nas zaskoczy? <br/><br/>
                        Śmiało – nie krępuj się! Im bardziej kreatywne pytanie, tym lepiej. Pamiętaj tylko o tym, aby było ono tak skonstruowane, żeby odpowiedź na nie mogła brzmieć: "Panna młoda" albo "Pan młody", ewentualnie "oboje" <br/><br/>
                        Spokojnie, para młoda oczywiście nie zobaczy tych pytań przed weselem, trafią one prosto do wodzireja! <br/><br/>
                     </p>
                     
                     <form onSubmit={handleGameQuestionSubmit} className="flex flex-col gap-4 max-w-xl mx-auto">
                        <input 
                          value={gameQuestion}
                          onChange={(e) => setGameQuestion(e.target.value)}
                          placeholder="Twoje pytanie (np. kto częściej coś tam albo kto bardziej coś tam)"
                          className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FBE4DA]/50 transition-all text-center"
                        />
                        <button 
                          type="submit"
                          disabled={isSubmittingGame || !gameQuestion.trim()}
                          className="flex items-center justify-center gap-2 bg-[#FBE4DA] text-[#4E0113] py-3 px-6 rounded-xl font-bold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                          {isSubmittingGame ? "Wysyłanie..." : "Wyślij pytanie"}
                          <Send size={18} />
                        </button>
                        
                        {gameSubmitStatus === "success" && (
                          <p className="text-green-300 font-medium mt-2">Pytanie wysłane! Ależ będzie zabawa 🎉</p>
                        )}
                        {gameSubmitStatus === "error" && (
                          <p className="text-red-300 font-medium mt-2">Coś poszło nie tak. Spróbuj ponownie.</p>
                        )}
                     </form>
                  </motion.div>

                  {/* === SEKRETNY PANEL WODZIREJA === */}
                  {isWodzirej && !isBrideOrGroom && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-4xl mx-auto mt-12 bg-[#841D30] rounded-2xl p-6 md:p-8 border border-yellow-500/50 shadow-2xl"
                    >
                       <div className="flex items-center gap-3 mb-6 border-b border-yellow-500/30 pb-4">
                          <ShieldCheck className="text-yellow-400" size={32} />
                          <div className="text-left">
                            <h2 className="text-xl md:text-2xl font-bold text-yellow-400 uppercase tracking-wider">
                              Panel Wodzireja
                            </h2>
                            <p className="text-white/70 text-sm">Zgłoszone pytania do testu zgodności (parówy Magda z Jankiem tego nie widzą!)</p>
                          </div>
                       </div>

                       {wodzirejQuestions.length === 0 ? (
                         <p className="text-center text-white/60 py-4">Czekamy na pierwsze pytania od gości...</p>
                       ) : (
                         <div className="space-y-3">
                           {wodzirejQuestions.map((q) => (
                             <div key={q.id} className="bg-black/20 rounded-lg p-4 border border-white/10 text-left">
                                <p className="text-xs text-yellow-200/60 mb-1 font-mono">
                                  Od: <span className="font-bold text-white">{q.guest_name}</span>
                                </p>
                                <p className="text-white text-lg font-medium">"{q.question}"</p>
                             </div>
                           ))}
                         </div>
                       )}
                    </motion.div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>
        </PageWrapper>
      </div>
      <Footer />
    </>
  );
}
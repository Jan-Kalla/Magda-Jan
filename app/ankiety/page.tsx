"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import OrganicGlassPattern from "@/app/components/OrganicGlassPattern";
import CustomCursor from "@/app/components/CustomCursor";
import ConfirmedGuestsList from "./ConfirmedGuestsList";

import { motion, Variants, easeOut, easeInOut, AnimatePresence } from "framer-motion";
import { Send, Music, ShieldCheck } from "lucide-react";

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
  { name: "Pulpeciki drobiowe w sosie pomidorowym", img: "/fotki/pulpeciki.webp" },
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
    childrenRsvp,            // <--- TO DODANO
    handleChildRsvpChange,   // <--- TO DODANO
    handleSubmit,
    loading,
    message,
    results,
  } = useMealSurvey();

  const router = useRouter();

  const [rsvpStatus, setRsvpStatus] = useState<RsvpStatus>(null);

  const [gameQuestion, setGameQuestion] = useState("");
  const [isSubmittingGame, setIsSubmittingGame] = useState(false);
  const [gameSubmitStatus, setGameSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [wodzirejQuestions, setWodzirejQuestions] = useState<any[]>([]);

  const isWodzirej = guest?.code === "C83841";
  const isBrideOrGroom = guest?.code === "FC3818" || guest?.code === "8DD06D";

  // ZMIANA: Powiadomienie globalne (dla Navbara) o zmianie statusu RSVP
  useEffect(() => {
    if (rsvpStatus !== null) {
      window.dispatchEvent(new CustomEvent("rsvpChanged", { detail: rsvpStatus }));
    }
  }, [rsvpStatus]);

  useEffect(() => {
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

  useEffect(() => {
    if (!loading && !guest) {
      router.push("/");
    }
  }, [guest, loading, router]);

  if (loading || !guest) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#FDF9EC] via-[#A46C6E] to-[#4E0113] text-[#FDF9EC]">
        <p className="font-serif italic text-xl tracking-widest uppercase">Ładowanie...</p>
      </div>
    );
  }

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
      <CustomCursor />
      
      <Navbar />
      
      <div className="relative min-h-screen bg-gradient-to-b from-[#FDF9EC] via-[#A46C6E] to-[#4E0113] pt-24 md:pt-32 pb-32 z-0 overflow-hidden text-[#4c4a1e]">
        
        <div className="absolute inset-0 z-0 pointer-events-none hidden md:block">
          <OrganicGlassPattern part="top" />
        </div>

        <div className="relative z-10">
          <PageWrapper>
              {/* 1. SEKCJA RSVP */}
              {guest && (
                <div className="relative z-10 drop-shadow-lg">
                  <RsvpSelector 
                    guestId={guest.id} 
                    onDecisionChange={(status) => setRsvpStatus(status)} 
                  />
                </div>
              )}

              {/* 2. Reszta strony - widoczna TYLKO gdy rsvpStatus === 'confirmed' */}
              <AnimatePresence>
                {rsvpStatus === 'confirmed' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="relative z-10"
                  >
                    <PlusOneSelector
                      canBringPlusOne={guest?.can_bring_plus_one}
                      parentGuestId={guest?.id}
                    />

                    <motion.form
                      id="posilek"
                      onSubmit={handleSubmit}
                      className="scroll-mt-28 md:scroll-mt-36 bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-8 md:p-14 max-w-4xl mx-auto mt-16 relative z-10"
                      initial="hidden"
                      animate="visible"
                      variants={fadeUp}
                    >
                      <motion.h1
                        className="font-serif text-3xl md:text-5xl font-light text-[#4c4a1e] mb-4 text-center uppercase tracking-[0.15em] drop-shadow-md"
                        variants={fadeUp}
                      >
                        Wybierz swoje danie
                      </motion.h1>

                      <motion.p
                        className="font-serif italic text-lg md:text-xl text-[#4c4a1e]/80 text-center tracking-wide mb-12"
                        variants={fadeUp}
                      >
                        Prosimy o ostateczny wybór najpóźniej do <strong className="font-bold text-[#4c4a1e]">3 lipca</strong>
                      </motion.p>

                      <motion.div variants={fadeInLeft}>
                        <MainCourseSelector
                          dishes={mainCourses}
                          mainCourse={mainCourse}
                          setMainCourse={setMainCourse}
                        />
                      </motion.div>

                      <motion.div variants={fadeInRight} className="mt-12">
                        <ChildrenChoices
                          children={children}
                          standardDishes={mainCourses}
                          childrenDishes={childrenDishes}
                          childrenChoices={childrenChoices}
                          handleChildChoice={handleChildChoice}
                          childrenRsvp={childrenRsvp}                  
                          handleChildRsvpChange={handleChildRsvpChange} 
                        />
                      </motion.div>

                      <motion.div 
                        variants={fadeUp}
                        className="mt-12 bg-white/30 border border-[#4c4a1e]/10 p-5 md:p-6 rounded-xl shadow-inner text-center"
                      >
                        <p className="font-sans font-light text-[#4c4a1e]/90 text-sm md:text-base leading-relaxed">
                          <span className="font-serif italic font-bold text-lg block mb-1 text-[#4c4a1e]">Drogi Gościu,</span>
                          w zależności od Twojego wyboru, przypisane zostanie Ci również pierwsze danie. Każde danie mięsne poprzedzone będzie domowym rosołem na trzech mięsach ze swojskim makaronem, a danie wegetariańskie poprzedzone będzie kremem z pieczonej papryki z pomidorami.
                        </p>
                      </motion.div>

                      <motion.button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#4c4a1e] text-[#FDF9EC] py-5 rounded-xl hover:bg-[#383716] transition-all duration-300 font-serif uppercase tracking-widest mt-8 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                        variants={fadeUp}
                      >
                        {loading ? "Zapisywanie..." : "Zatwierdź wybór posiłku"}
                      </motion.button>

                      {message && (
                        <motion.p
                          className="mt-8 text-center text-[#4c4a1e] font-serif italic text-lg tracking-wide drop-shadow-md"
                          variants={fadeUp}
                        >
                          {message}
                        </motion.p>
                      )}
                    </motion.form>

                    {/* === SPIS POTWIERDZONYCH GOŚCI (TYLKO DLA PARY MŁODEJ) === */}
                    {isBrideOrGroom && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInRight}
                        className="mt-16 max-w-4xl mx-auto relative z-10"
                      >
                        <ConfirmedGuestsList />
                      </motion.div>
                    )}

                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={fadeInRight}
                      className="mt-16 max-w-4xl mx-auto"
                    >
                      <SurveyResults
                        guest={guest}
                        dishes={[...mainCourses, ...childrenDishes]}
                        results={results}
                      />
                    </motion.div>

                    {/* === SEKCJA GRY (TEST ZGODNOŚCI) === */}
                    <motion.div
                      id="test-zgodnosci"
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="scroll-mt-28 md:scroll-mt-36 max-w-4xl mx-auto mt-24 bg-black/20 backdrop-blur-xl rounded-2xl p-8 md:p-14 border border-white/20 shadow-2xl text-center relative z-10 text-[#F6f4e5]"
                    >
                      <div className="flex justify-center mb-6">
                          <Music className="text-[#F6f4e5]/80" size={32} />
                      </div>
                      <h2 className="font-script text-5xl md:text-6xl text-[#F6f4e5] mb-6 drop-shadow-sm">
                        Test Zgodności
                      </h2>
                      <p className="font-sans font-light text-[#F6f4e5]/90 mb-10 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                          Przed oczepinami zmierzymy się w klasycznym teście na zgodność. Jednak aby było to mniej sztampowe, chcemy, aby pytania podsunęli sami goście! <br/><br/>
                          Masz pomysł na zabawne pytanie, które sprawdzi, jak dobrze znamy się jako para? A może chcesz zadać podchwytliwe pytanie, które nas zaskoczy? <br/><br/>
                          Śmiało – nie krępuj się. Im bardziej kreatywne pytanie, tym lepiej. Pamiętaj tylko o tym, aby było ono tak skonstruowane, żeby odpowiedź mogła brzmieć: "Panna młoda" albo "Pan młody", ewentualnie "Oboje". <br/><br/>
                          Spokojnie, Para Młoda nie zobaczy tych pytań przed weselem, trafią one prosto do wodzireja.
                      </p>
                      
                      <form onSubmit={handleGameQuestionSubmit} className="flex flex-col gap-5 max-w-xl mx-auto text-[#F6f4e5]">
                          <input 
                            value={gameQuestion}
                            onChange={(e) => setGameQuestion(e.target.value)}
                            placeholder="Treść pytania..."
                            className="w-full p-5 rounded-xl bg-white/10 border border-white/30 text-[#F6f4e5] placeholder-[#F6f4e5]/50 focus:outline-none focus:ring-2 focus:ring-[#F6f4e5]/40 transition-all font-sans text-center shadow-inner"
                          />
                          <button 
                            type="submit"
                            disabled={isSubmittingGame || !gameQuestion.trim()}
                            className="flex items-center justify-center gap-3 bg-[#F6f4e5] text-[#4E0113] py-4 px-8 rounded-xl font-serif uppercase tracking-widest hover:bg-white hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg font-bold"
                          >
                            {isSubmittingGame ? "Wysyłanie..." : "Wyślij pytanie"}
                            <Send size={16} />
                          </button>
                          
                          {gameSubmitStatus === "success" && (
                            <p className="text-[#F6f4e5] font-serif italic mt-4 text-lg drop-shadow-md">Pytanie zostało wysłane. Dziękujemy!</p>
                          )}
                          {gameSubmitStatus === "error" && (
                            <p className="text-red-300 font-serif italic font-bold mt-4 text-lg drop-shadow-md">Wystąpił błąd. Spróbuj ponownie.</p>
                          )}
                      </form>
                    </motion.div>

                    {/* === SEKRETNY PANEL WODZIREJA === */}
                    {isWodzirej && !isBrideOrGroom && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto mt-24 bg-black/40 backdrop-blur-xl rounded-2xl p-8 md:p-12 shadow-2xl border border-yellow-500/30 relative z-10"
                      >
                         <div className="flex items-center gap-4 mb-8 border-b border-yellow-500/30 pb-6">
                            <ShieldCheck className="text-yellow-400" size={36} />
                            <div className="text-left">
                              <h2 className="font-serif text-2xl md:text-3xl font-light text-yellow-400 uppercase tracking-widest">
                                Panel Wodzireja
                              </h2>
                              <p className="font-sans font-light text-white/60 text-sm mt-1">
                                Zgłoszone pytania do testu zgodności (Te parówy Janek z Magdą tego nie widzą 😉)
                              </p>
                            </div>
                         </div>

                       {wodzirejQuestions.length === 0 ? (
                         <p className="text-center font-serif italic text-white/60 py-8">Czekamy na pierwsze pytania od gości...</p>
                       ) : (
                         <div className="space-y-4">
                           {wodzirejQuestions.map((q) => (
                             <div key={q.id} className="bg-white/5 rounded-xl p-5 border border-white/10 text-left">
                                <p className="text-xs text-yellow-200/60 mb-2 font-sans uppercase tracking-wider">
                                  Od: <span className="font-medium text-white">{q.guest_name}</span>
                                </p>
                                <p className="text-white text-lg font-serif italic">"{q.question}"</p>
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
      </div>
      <Footer />
    </>
  );
}
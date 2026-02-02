"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import { useMealSurvey } from "./hooks/useMealSurvey";
import MainCourseSelector from "@/app/components/MainCourseSelector";
import ChildrenChoices from "@/app/components/ChildrenChoices";
import SurveyResults from "@/app/components/SurveyResults";
import PlusOneSelector from "@/app/components/PlusOneSelector";
import Footer from "@/app/components/Footer";
import RsvpSelector, { RsvpStatus } from "@/app/components/RsvpSelector"; // Importujemy też typ
import PageWrapper from "@/app/components/PageWrapper";

import { motion, Variants, easeOut, easeInOut, AnimatePresence } from "framer-motion";

// ... (tutaj Twoje stałe mainCourses, childrenDishes, variants - bez zmian) ...
// (dla czytelności pominąłem definicje tablic z jedzeniem, wklej je tu tak jak były)
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

  // Zmieniamy stan z boolean na RsvpStatus (string | null)
  const [rsvpStatus, setRsvpStatus] = useState<RsvpStatus>(null);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#FAD6C8] to-[#4E0113] pt-5 md:pt-[112px] pb-20">
        
        {/* WRAPPER OTULA CAŁĄ TREŚĆ FORMULARZY */}
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
                  {/* Moduł osoby towarzyszącej */}
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
                </motion.div>
              )}
            </AnimatePresence>
        </PageWrapper>
      </div>
      <Footer />
    </>
  );
}
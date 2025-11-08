"use client";

import Navbar from "@/app/components/Navbar";
import { useMealSurvey } from "./hooks/useMealSurvey";
import MainCourseSelector from "@/app/components/MainCourseSelector";
import ChildrenChoices from "@/app/components/ChildrenChoices";
import SurveyResults from "@/app/components/SurveyResults";
import PlusOneSelector from "@/app/components/PlusOneSelector";
import { motion, Variants, easeOut, easeInOut } from "framer-motion";


const mainCourses = [
  { name: "Rolada śląska z modrą kapustą i kluskami śląskimi", img: "/fotki/rolada.jpg" },
  { name: "Roladki drobiowe z serem feta i szpinakiem owinięte w boczku z gratiną ziemniaczaną i marchewką glazurowaną", img: "/fotki/roladki.webp" },
  { name: "Polędwiczki z kurczaka owinięte w boczku w sosie śmietanowym z gnocchi i glazurowaną w miodzie baby marchewką", img: "/fotki/poledwiczki.jpeg" },
  { name: "Udziec z Indyka z brukselką grillowaną z miodem balsamicznym i frytkami z batatów", img: "/fotki/udziec.jpg" },
  { name: "Pieczony pstrąg w ziołach z opiekanymi batatami i mixem sałat", img: "/fotki/pstrag.jpeg" },
  { name: "Opcja wegetariańska: Pieróg z farszem z pieczarek i kaszy gryczanej", img: "/fotki/vege.jpg"},
];

const childrenDishes = [
  { name: "Nuggetsy z kurczaka z frytkami", img: "/fotki/nuggetsy.jpg" },
  { name: "Pulpeciki drobiowe w sosie pomidorowym", img: "/fotki/pulpeciki.jpg" },
  { name: "Buchty z musem truskawkowym", img: "/fotki/butchy.jpg" },
];

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.12 },
  },
};

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAD6C8] to-[#4E0113] pt-20">
      <Navbar />

      {/* Moduł osoby towarzyszącej */}
      <PlusOneSelector
        canBringPlusOne={guest?.can_bring_plus_one}
        parentGuestId={guest?.id}
      />

      {/* Formularz z animacją */}
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-2xl p-10 max-w-4xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <motion.h1
          className="text-4xl font-bold mb-10 text-[#4E0113] text-center"
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
          className="w-full bg-[#4E0113] text-white py-4 rounded-lg hover:bg-[#6b1326] transition text-xl font-semibold mt-8"
          variants={fadeUp}
        >
          {loading ? "Zapisywanie..." : "Zatwierdź wybór"}
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

      {/* Wyniki ankiety z animacją */}
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
    </div>
  );
}

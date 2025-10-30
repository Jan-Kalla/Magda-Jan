"use client";

import Navbar from "@/app/components/Navbar";
import { useMealSurvey } from "./hooks/useMealSurvey";
import MainCourseSelector from "@/app/components/MainCourseSelector";
import ChildrenChoices from "@/app/components/ChildrenChoices";
import SurveyResults from "@/app/components/SurveyResults";
import PlusOneSelector from "@/app/components/PlusOneSelector";

const mainCourses = [
  { name: "Rolada śląska z modrą kapustą i kluskami śląskimi", img: "/fotki/rolada.jpg" },
  { name: "Roladki drobiowe z serem feta i szpinakiem owinięte w boczku z gratiną ziemniaczaną i marchewką glazurowaną", img: "/fotki/roladki.webp" },
  { name: "Udziec z Indyka z brukselką grillowaną z miodem balsamicznym i frytkami z batatów", img: "/fotki/udziec.jpg" },
  { name: "Pieczony pstrąg w ziołach z opiekanymi batatami i mixem sałat", img: "/fotki/pstrag.jpeg" },
  { name: "Opcja wegetariańska: Pieróg z farszem z pieczarek i kaszy gryczanej"},
  { name: "Opcja wegetariańska: Pierogi z serem kozim i gruszką"},
  { name: "Opcja wegetariańska: Risotto ze szpinakiem i selerem naciowym"},
  { name: "Opcja wegetariańska: Gonoccki ze szpinakiem i suszonymi pomidorami"},
  { name: "Opcja wegańska: Kopytka podsmażane ze szparagami", img: "/fotki/vege.jpg"},
  { name: "Opcja wegańska: Gołąbki z soczewicą i grzybami"},
  { name: "Opcja wegańska: Pierogi ze szpinakiem"},
];

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

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-2xl p-10 max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-10 text-[#4E0113] text-center">
          Wybierz swoje danie
        </h1>

        <MainCourseSelector
          dishes={mainCourses}
          mainCourse={mainCourse}
          setMainCourse={setMainCourse}
        />

        <ChildrenChoices
          children={children}
          dishes={mainCourses}
          childrenChoices={childrenChoices}
          handleChildChoice={handleChildChoice}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#4E0113] text-white py-4 rounded-lg hover:bg-[#6b1326] transition text-xl font-semibold"
        >
          {loading ? "Zapisywanie..." : "Zatwierdź wybór"}
        </button>

        {message && (
          <p className="mt-8 text-center text-[#4E0113] font-medium text-lg">
            {message}
          </p>
        )}
      </form>

      <SurveyResults guest={guest} dishes={mainCourses} results={results} />
    </div>
  );
}

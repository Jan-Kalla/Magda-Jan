"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/app/components/Navbar";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const mainCourses = [
  {
    name: "Rolada śląska z modrą kapustą i kluskami śląskimi",
    img: "/fotki/rolada.jpg",
  },
  {
    name: "Roladki drobiowe z serem feta i szpinakiem owinięte w boczku z gratiną ziemniaczaną i marchewką glazurowaną",
    img: "/fotki/roladki.webp",
  },
  {
    name: "Udziec z Indyka z brukselką grillowaną z miodem balsamicznym i frytkami z batatów",
    img: "/fotki/udziec.jpg",
  },
  {
    name: "Pieczony pstrąg w ziołach z opiekanymi batatami i mixem sałat",
    img: "/fotki/pstrag.jpeg",
  },
  {
    name: "Danie wegańskie",
    img: "/fotki/vege.jpg",
  },
];

const desserts = [
  { name: "Lody waniliowe z musem malinowym", img: "/fotki/lody.jpeg" },
  { name: "Panna cotta", img: "/fotki/panna.webp" },
  { name: "Creme brulee", img: "/fotki/brulee.webp" },
  { name: "Dekonstrukcja bezy pavlova", img: "/fotki/beza.jpg" },
];

export default function MealSurveyPage() {
  const [mainCourse, setMainCourse] = useState("");
  const [dessert, setDessert] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("meal_choices").insert([
      {
        main_course: mainCourse,
        dessert: dessert,
      },
    ]);

    if (error) {
      setMessage("Wystąpił błąd przy zapisie 😢");
    } else {
      setMessage("Twój wybór został zapisany! 🎉");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAD6C8] to-[#4E0113] pt-20">
      <Navbar />
      <form
  onSubmit={handleSubmit}
  className="bg-white rounded-xl shadow-2xl p-10 max-w-4xl mx-auto"
>
  <h1 className="text-4xl font-bold mb-10 text-[#4E0113] text-center">
    Wybierz swoje danie
  </h1>

  {/* DANIA GŁÓWNE */}
  <h2 className="text-2xl font-semibold mb-6 text-[#4E0113]">
    Danie główne
  </h2>
  <div className="space-y-6 mb-12">
    {mainCourses.map((dish) => (
      <label
        key={dish.name}
        className={`flex items-center gap-6 border rounded-lg p-6 cursor-pointer transition hover:shadow-lg ${
          mainCourse === dish.name
            ? "border-[#4E0113] shadow-md"
            : "border-gray-300"
        }`}
      >
        <input
          type="radio"
          name="mainCourse"
          value={dish.name}
          checked={mainCourse === dish.name}
          onChange={(e) => setMainCourse(e.target.value)}
          className="hidden"
        />
        <img
          src={dish.img}
          alt={dish.name}
          className="w-40 h-40 object-cover rounded-lg"
        />
        <span className="text-[#4E0113] font-semibold text-xl">
          {dish.name}
        </span>
      </label>
    ))}
  </div>

  {/* DESERY */}
  <h2 className="text-2xl font-semibold mb-6 text-[#4E0113]">Deser</h2>
  <div className="space-y-6 mb-12">
    {desserts.map((dish) => (
      <label
        key={dish.name}
        className={`flex items-center gap-6 border rounded-lg p-6 cursor-pointer transition hover:shadow-lg ${
          dessert === dish.name
            ? "border-[#4E0113] shadow-md"
            : "border-gray-300"
        }`}
      >
        <input
          type="radio"
          name="dessert"
          value={dish.name}
          checked={dessert === dish.name}
          onChange={(e) => setDessert(e.target.value)}
          className="hidden"
        />
        <img
          src={dish.img}
          alt={dish.name}
          className="w-40 h-40 object-cover rounded-lg"
        />
        <span className="text-[#4E0113] font-semibold text-xl">
          {dish.name}
        </span>
      </label>
    ))}
  </div>

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

    </div>
  );
}

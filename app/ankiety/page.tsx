"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/app/components/Navbar";
import { useGuest } from "@/app/context/GuestContext";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const mainCourses = [
  { name: "Rolada śląska z modrą kapustą i kluskami śląskimi", img: "/fotki/rolada.jpg" },
  { name: "Roladki drobiowe z serem feta i szpinakiem owinięte w boczku z gratiną ziemniaczaną i marchewką glazurowaną", img: "/fotki/roladki.webp" },
  { name: "Udziec z Indyka z brukselką grillowaną z miodem balsamicznym i frytkami z batatów", img: "/fotki/udziec.jpg" },
  { name: "Pieczony pstrąg w ziołach z opiekanymi batatami i mixem sałat", img: "/fotki/pstrag.jpeg" },
  { name: "Danie wegańskie", img: "/fotki/vege.jpg" },
];

export default function MealSurveyPage() {
  const { guest } = useGuest();
  const [mainCourse, setMainCourse] = useState("");
  const [children, setChildren] = useState<any[]>([]);
  const [childrenChoices, setChildrenChoices] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [results, setResults] = useState<Record<string, number>>({});

  // === Pobierz dzieci zalogowanego gościa ===
  useEffect(() => {
    const fetchChildren = async () => {
      if (!guest) return;
      const { data, error } = await supabase
        .from("relations")
        .select("child:child_id (id, first_name, last_name)")
        .eq("parent_id", guest.id);

      if (!error && data) {
        // data = [{ child: { id, first_name, last_name }}, ...]
        const kids = data.map((row) => row.child);
        setChildren(kids);

        // opcjonalnie: pobierz aktualne wybory dzieci z meal_choices
        const { data: choices } = await supabase
          .from("meal_choices")
          .select("guest_id, main_course")
          .in("guest_id", kids.map((c) => c.id));

        if (choices) {
          const map: Record<number, string> = {};
          choices.forEach((c) => (map[c.guest_id] = c.main_course));
          setChildrenChoices(map);
        }
      }
    };

    fetchChildren();
  }, [guest]);

  // === Zmiana wyboru dziecka ===
  const handleChildChoice = (childId: number, dish: string) => {
    setChildrenChoices((prev) => ({ ...prev, [childId]: dish }));
  };

  // === Zapis wyborów ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!guest) {
      setMessage("Musisz być zalogowany, aby zapisać wybór.");
      setLoading(false);
      return;
    }

    // przygotuj rekordy: rodzic + dzieci
    const records = [
      { guest_id: guest.id, main_course: mainCourse },
      ...children.map((child) => ({
        guest_id: child.id,
        main_course: childrenChoices[child.id] || null,
      })),
    ];

    const { error } = await supabase
      .from("meal_choices")
      .upsert(records, { onConflict: "guest_id" });

    if (error) {
      console.error("Supabase error:", error);
      setMessage("Wystąpił błąd przy zapisie 😢");
    } else {
      setMessage("Wybory zostały zapisane! 🎉");
      if (guest.id === 1 || guest.id === 2) {
        fetchResults();
      }
    }

    setLoading(false);
  };


  // === Pobieranie wyników tylko dla gości 1 i 2 ===
  const fetchResults = async () => {
    const { data, error } = await supabase.from("meal_choices").select("main_course");
    if (error) {
      console.error("Błąd przy pobieraniu wyników:", error);
      return;
    }

    const counts: Record<string, number> = {};
    data.forEach((row) => {
      counts[row.main_course] = (counts[row.main_course] || 0) + 1;
    });
    setResults(counts);
  };

  useEffect(() => {
    if (guest && (guest.id === 1 || guest.id === 2)) {
      fetchResults();
    }
  }, [guest]);

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
        <h2 className="text-2xl font-semibold mb-6 text-[#4E0113]">Danie główne</h2>
        <div className="space-y-6 mb-12">
          {mainCourses.map((dish) => (
            <label
              key={dish.name}
              className={`flex items-center gap-6 border rounded-lg p-6 cursor-pointer transition hover:shadow-lg ${
                mainCourse === dish.name ? "border-[#4E0113] shadow-md" : "border-gray-300"
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
              <img src={dish.img} alt={dish.name} className="w-40 h-40 object-cover rounded-lg" />
              <span className="text-[#4E0113] font-semibold text-xl">{dish.name}</span>
            </label>
          ))}
        </div>

        {children.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6 text-[#4E0113]">
            Wybory dla dzieci
          </h2>
          {children.map((child) => (
            <div key={child.id} className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-[#4E0113]">
                {child.first_name} {child.last_name}
              </h3>
              <div className="space-y-4">
                {mainCourses.map((dish) => (
                  <label
                    key={dish.name}
                    className={`flex items-center gap-6 border rounded-lg p-4 cursor-pointer transition hover:shadow-lg ${
                      childrenChoices[child.id] === dish.name
                        ? "border-[#4E0113] shadow-md"
                        : "border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`child-${child.id}`}
                      value={dish.name}
                      checked={childrenChoices[child.id] === dish.name}
                      onChange={() => handleChildChoice(child.id, dish.name)}
                      className="hidden"
                    />
                    <img src={dish.img} alt={dish.name} className="w-24 h-24 object-cover rounded-lg" />
                    <span className="text-[#4E0113] font-medium">{dish.name}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#4E0113] text-white py-4 rounded-lg hover:bg-[#6b1326] transition text-xl font-semibold"
        >
          {loading ? "Zapisywanie..." : "Zatwierdź wybór"}
        </button>

        {message && (
          <p className="mt-8 text-center text-[#4E0113] font-medium text-lg">{message}</p>
        )}
      </form>

      {/* Formularz dla dzieci */}


      {/* === Wyniki ankiety (tylko dla id 1 i 2) === */}
      {guest && (guest.id === 1 || guest.id === 2) && (
        <div className="bg-[#4E0113] rounded-xl shadow-2xl p-8 max-w-4xl mx-auto mt-12">
          <h2 className="text-2xl font-bold text-[#FAD6C8] mb-6 text-center">
            Wyniki ankiety
          </h2>
          <ul className="space-y-3">
            {mainCourses.map((dish) => (
              <li key={dish.name} className="flex justify-between text-lg text-[#FAD6C8]">
                <span>{dish.name}</span>
                <span className="font-semibold">
                  {results[dish.name] || 0} głosów
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

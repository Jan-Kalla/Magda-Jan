// app/ankieta/hooks/useMealSurvey.ts
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useGuest } from "@/app/context/GuestContext";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useMealSurvey() {
  const { guest } = useGuest();
  const [mainCourse, setMainCourse] = useState("");
  const [children, setChildren] = useState<any[]>([]);
  const [childrenChoices, setChildrenChoices] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // === Pobierz dzieci ===
  useEffect(() => {
    const fetchChildren = async () => {
      if (!guest) return;
      const { data, error } = await supabase
        .from("relations")
        .select("child:child_id (id, first_name, last_name)")
        .eq("parent_id", guest.id);

      if (!error && data) setChildren(data.map((row) => row.child));
    };
    fetchChildren();
  }, [guest]);

  // === Pobierz wcześniejsze wybory ===
  useEffect(() => {
    const fetchChoices = async () => {
      if (!guest) return;

      const { data: parentChoice } = await supabase
        .from("meal_choices")
        .select("main_course")
        .eq("guest_id", guest.id)
        .single();

      if (parentChoice) setMainCourse(parentChoice.main_course);

      if (children.length > 0) {
        const { data: childChoices } = await supabase
          .from("meal_choices")
          .select("guest_id, main_course")
          .in("guest_id", children.map((c) => c.id));

        if (childChoices) {
          const map: Record<number, string> = {};
          childChoices.forEach((c) => (map[c.guest_id] = c.main_course));
          setChildrenChoices(map);
        }
      }
    };
    fetchChoices();
  }, [guest, children]);

  // === Zmiana wyboru dziecka ===
  const handleChildChoice = (childId: number, dish: string) => {
    setChildrenChoices((prev) => ({ ...prev, [childId]: dish }));
  };

  // === Zapis wyborów ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guest) {
      setMessage("Musisz być zalogowany, aby zapisać wybór.");
      return;
    }

    setLoading(true);

    const records = [
      { guest_id: guest.id, main_course: mainCourse },
      ...children.map((child) => ({
        guest_id: child.id,
        main_course: childrenChoices[child.id] || null,
      })),
    ];

    const { error } = await supabase.from("meal_choices").upsert(records, { onConflict: "guest_id" });

    if (error) {
      console.error(error);
      setMessage("Błąd przy zapisie 😢");
    } else {
      setMessage("Wybory zostały zapisane! 🎉");
      if (guest.id === 1 || guest.id === 2) fetchResults();
    }

    setLoading(false);
  };

  // === Wyniki ankiety (dla Jan/Magda) ===
  const fetchResults = async () => {
    const { data, error } = await supabase.from("meal_choices").select("main_course");
    if (error) return console.error(error);

    const counts: Record<string, number> = {};
    data.forEach((row) => {
      counts[row.main_course] = (counts[row.main_course] || 0) + 1;
    });
    setResults(counts);
  };

  useEffect(() => {
    if (guest && (guest.id === 1 || guest.id === 2)) fetchResults();
  }, [guest]);

  return {
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
  };
}

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
  const [childrenRsvp, setChildrenRsvp] = useState<Record<number, string>>({});
  
  const [results, setResults] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchChildren = async () => {
      if (!guest) return;
      const { data, error } = await supabase
        .from("relations")
        .select("child:child_id (id, first_name, last_name, rsvp_decision_made, rsvp_status)")
        .eq("parent_id", guest.id);

      if (!error && data) {
        // POPRAWKA: Definiujemy (row: any) i sprawdzamy, czy Supabase nie ubrało dziecka w tablicę
        const fetchedChildren = data.map((row: any) => {
            return Array.isArray(row.child) ? row.child[0] : row.child;
        }).filter(Boolean); // filter(Boolean) usunie ewentualne puste wyniki
        
        setChildren(fetchedChildren);

        const rsvpMap: Record<number, string> = {};
        // POPRAWKA: Definiujemy (c: any), aby uciszyć nadgorliwego TypeScripta
        fetchedChildren.forEach((c: any) => {
           if (c && c.rsvp_decision_made && c.rsvp_status) {
               rsvpMap[c.id] = c.rsvp_status;
           }
        });
        setChildrenRsvp(rsvpMap);
      }
    };
    fetchChildren();
  }, [guest]);

  useEffect(() => {
    const fetchChoices = async () => {
      if (!guest) return;

      const { data: parentChoice } = await supabase
        .from("meal_choices")
        .select("main_course")
        .eq("guest_id", guest.id)
        .maybeSingle();

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

  const handleChildChoice = (childId: number, dish: string) => {
    setChildrenChoices((prev) => ({ ...prev, [childId]: dish }));
  };

  const handleChildRsvpChange = (childId: number, status: string) => {
    setChildrenRsvp((prev) => ({ ...prev, [childId]: status }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guest) {
      setMessage("Musisz być zalogowany, aby zapisać wybór.");
      return;
    }

    setLoading(true);

    const records = [
      { guest_id: guest.id, main_course: mainCourse },
      ...children
        .filter(child => childrenRsvp[child.id]) 
        .map((child) => ({
          guest_id: child.id,
          main_course: childrenRsvp[child.id] === 'confirmed' ? (childrenChoices[child.id] || null) : null,
        })),
    ];

    const { error: mealError } = await supabase.from("meal_choices").upsert(records, { onConflict: "guest_id" });

    const updatePromises = children.map(child => {
      if (childrenRsvp[child.id]) {
        return supabase.from("guests").update({
          rsvp_decision_made: true,
          rsvp_status: childrenRsvp[child.id]
        }).eq("id", child.id);
      }
      return Promise.resolve();
    });

    await Promise.all(updatePromises);

    if (mealError) {
      console.error(mealError);
      setMessage("Wystąpił błąd podczas zapisywania.");
    } else {
      setMessage("Twój wybór i informacje o obecności zostały pomyślnie zapisane!");
      if (guest.id === 1 || guest.id === 2) fetchResults();
    }

    setLoading(false);
  };

  const fetchResults = async () => {
    const { data, error } = await supabase.from("meal_choices").select("main_course");
    if (error) return console.error(error);

    const counts: Record<string, number> = {};
    data.forEach((row) => {
      if (row.main_course) {
        counts[row.main_course] = (counts[row.main_course] || 0) + 1;
      }
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
    childrenRsvp,           
    handleChildRsvpChange,  
    handleSubmit,
    loading,
    message,
    results,
  };
}
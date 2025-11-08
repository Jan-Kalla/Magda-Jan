"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, easeOut  } from "framer-motion";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PlusOneSelectorProps {
  canBringPlusOne: boolean;
  parentGuestId?: number;
}

function generateCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function generateUniqueCode() {
  for (let i = 0; i < 5; i++) {
    const code = generateCode(6);
    const { data, error } = await supabase
      .from("guests")
      .select("id")
      .eq("code", code)
      .maybeSingle();

    if (error) throw error;
    if (!data) return code;
  }
  throw new Error("Nie udało się wygenerować unikalnego kodu");
}

// Animation variants
const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeOut }, // ✅ poprawne
  },
};


export default function PlusOneSelector({
  canBringPlusOne,
  parentGuestId,
}: PlusOneSelectorProps) {
  const [loading, setLoading] = useState(false);
  const [decisionMade, setDecisionMade] = useState(false);
  const [plusOneData, setPlusOneData] = useState<{ firstName: string; lastName: string } | null>(null);
  const [savedPlusOne, setSavedPlusOne] = useState<{ firstName: string; lastName: string; code: string } | null>(null);
  const [declined, setDeclined] = useState(false);

  useEffect(() => {
    const fetchDecision = async () => {
      if (!parentGuestId) return;
      const { data, error } = await supabase
        .from("guests")
        .select(`
          plus_one_decision_made,
          id,
          plus_ones:guests!parent_guest_id (
            first_name,
            last_name,
            code
          )
        `)
        .eq("id", parentGuestId)
        .maybeSingle();

    if (!error && data) {
      setDecisionMade(data.plus_one_decision_made);
      if (data.plus_ones && data.plus_ones.length > 0) {
        setSavedPlusOne({
          firstName: data.plus_ones[0].first_name,
          lastName: data.plus_ones[0].last_name,
          code: data.plus_ones[0].code,
        });
      } else if (data.plus_one_decision_made) {
        setDeclined(true);
      }
    }
    };
    fetchDecision();
  }, [parentGuestId]);

  if (!canBringPlusOne) return null;

  const handleDecline = async () => {
    if (!parentGuestId) return;
    if (!window.confirm("Czy na pewno chcesz zdecydować, że nie przyjdziesz z osobą towarzyszącą?")) return;

    setLoading(true);
    const { error } = await supabase
      .from("guests")
      .update({ plus_one_decision_made: true })
      .eq("id", parentGuestId);

    setLoading(false);

    if (error) {
      alert("Błąd zapisu decyzji.");
      return;
    }

    setDecisionMade(true);
    setDeclined(true);
  };

  const handleSave = async () => {
    if (!plusOneData?.firstName || !plusOneData?.lastName) {
      alert("Podaj imię i nazwisko osoby towarzyszącej.");
      return;
    }
    if (!parentGuestId) {
      alert("Brak identyfikatora gościa głównego.");
      return;
    }

    const confirmMsg = `Czy na pewno chcesz dodać ${plusOneData.firstName} ${plusOneData.lastName} jako swoją osobę towarzyszącą?`;
    if (!window.confirm(confirmMsg)) return;

    setLoading(true);

    try {
      const code = await generateUniqueCode();

      const { error: insertErr } = await supabase.from("guests").insert({
        code,
        first_name: plusOneData.firstName,
        last_name: plusOneData.lastName,
        is_plus_one: true,
        parent_guest_id: parentGuestId,
        table_number: null,
        notes: null,
      });

      if (insertErr) {
        console.error(insertErr);
        alert(`Błąd dodawania osoby towarzyszącej: ${insertErr.message}`);
        return;
      }

      await supabase
        .from("guests")
        .update({ plus_one_decision_made: true })
        .eq("id", parentGuestId);

      setSavedPlusOne({
        firstName: plusOneData.firstName,
        lastName: plusOneData.lastName,
        code,
      });
      setDecisionMade(true);
    } catch (err: any) {
      console.error(err);
      alert(`Wystąpił błąd: ${err?.message ?? "Nieznany błąd"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
  <motion.div
    className="mt-16 mb-20 flex flex-col items-center justify-center text-center"
    variants={container}
    initial="hidden"
    animate="visible"
  >
      <motion.h2
        variants={fadeUp}
        className="text-3xl font-bold text-[#4E0113] mb-8"
      >
        Osoba towarzysząca
      </motion.h2>

      {!decisionMade && (
        <motion.div variants={fadeUp} className="max-w-2xl">
          <h3 className="text-2xl font-semibold text-[#4E0113] mb-4">
            Wybór osoby towarzyszącej
          </h3>
          <p className="text-gray-800 mb-2">
            Możesz zdecydować, czy chcesz przyjść na wesele z osobą towarzyszącą.
          </p>
          <p className="text-gray-800 mb-2">
            Prosimy, abyś dobrze przemyślał tę decyzję – masz na to czas do miesiąca przed weselem.
          </p>
          <p className="text-red-600 font-medium">
            Pamiętaj: raz podjętej decyzji nie można cofnąć.
          </p>
        </motion.div>
      )}

      {decisionMade ? (
        <motion.div variants={fadeUp} className="mt-8">
          {declined ? (
            <p className="text-lg font-medium text-gray-700">
              Zdecydowałeś, że nie przychodzisz z osobą towarzyszącą.
            </p>
          ) : savedPlusOne ? (
            <div>
              <p className="text-lg text-gray-700 mb-2">Osoba towarzysząca została wybrana:</p>
              <p className="text-2xl font-bold text-[#4E0113] mb-2">
                {savedPlusOne.firstName} {savedPlusOne.lastName}
              </p>
              <p className="text-gray-700">
                Kod dostępu:{" "}
                <span className="font-mono font-semibold text-green-700">
                  {savedPlusOne.code}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-lg text-gray-700">Decyzja została już podjęta.</p>
          )}
        </motion.div>
      ) : (
        <>
          <motion.div variants={fadeUp} className="flex justify-center gap-8 mt-8">
            <button
              type="button"
              onClick={() => setPlusOneData({ firstName: "", lastName: "" })}
              className="px-10 py-4 rounded-lg font-semibold bg-[#4E0113] text-white shadow-lg hover:bg-[#6b1326] transition"
            >
              Tak
            </button>
            <button
              type="button"
              onClick={handleDecline}
              className="px-10 py-4 rounded-lg font-semibold bg-gray-200 text-gray-800 shadow-lg hover:bg-gray-300 transition"
            >
              Nie
            </button>
          </motion.div>

          {plusOneData && (
            <motion.div
              variants={fadeUp}
              className="flex flex-col gap-4 max-w-md mx-auto mt-8"
            >
              <input
                type="text"
                placeholder="Imię"
                value={plusOneData.firstName}
                onChange={(e) =>
                  setPlusOneData({ ...plusOneData, firstName: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#4E0113]"
              />
              <input
                type="text"
                placeholder="Nazwisko"
                value={plusOneData.lastName}
                onChange={(e) =>
                  setPlusOneData({ ...plusOneData, lastName: e.target.value })
                }
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#4E0113]"
              />

              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="bg-[#4E0113] text-white py-3 rounded-lg shadow-lg hover:bg-[#6b1326] transition disabled:opacity-60 font-semibold"
              >
                {loading ? "Zapisywanie..." : "Zatwierdź"}
              </button>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, easeOut } from "framer-motion";

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

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeOut },
  },
};

export default function PlusOneSelector({ canBringPlusOne, parentGuestId }: PlusOneSelectorProps) {
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
    if (!window.confirm("Czy na pewno chcesz zrezygnować z osoby towarzyszącej?")) return;

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

    const confirmMsg = `Czy potwierdzasz dodanie ${plusOneData.firstName} ${plusOneData.lastName} jako osoby towarzyszącej?`;
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
    className="mt-20 mb-24 flex flex-col items-center justify-center text-center bg-black/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] p-8 md:p-14 max-w-4xl mx-auto"
    variants={container}
    initial="hidden"
    animate="visible"
  >
      <motion.h2
        variants={fadeUp}
        className="font-serif text-3xl md:text-4xl font-light text-[#FDF9EC] mb-6 uppercase tracking-[0.15em]"
      >
        Osoba Towarzysząca
      </motion.h2>

      {!decisionMade && (
        <motion.div variants={fadeUp} className="max-w-2xl text-[#FDF9EC]/90 font-sans font-light text-base md:text-lg">
          <p className="mb-3">
            Przysługuje Ci prawo do zaproszenia na uroczystość osoby towarzyszącej.
          </p>
          <p className="mb-4">
            Prosimy o rozważną decyzję. Należy ją podjąć najpóźniej na dwa tygodnie przed planowanym dniem wesela.
          </p>
          <p className="font-serif italic text-white opacity-80 mt-6 text-sm">
            Zatwierdzona decyzja ma charakter ostateczny.
          </p>
        </motion.div>
      )}

      {decisionMade ? (
        <motion.div variants={fadeUp} className="mt-8 p-6 w-full max-w-xl mx-auto border-t border-white/20">
          {declined ? (
            <p className="font-serif text-xl text-[#FDF9EC] tracking-wide">
              Zrezygnowano z osoby towarzyszącej.
            </p>
          ) : savedPlusOne ? (
            <div>
              <p className="font-sans font-light text-[#FDF9EC]/70 uppercase tracking-widest text-sm mb-3">Zgłoszona osoba towarzysząca:</p>
              <p className="font-serif text-3xl text-[#FDF9EC] mb-4">
                {savedPlusOne.firstName} {savedPlusOne.lastName}
              </p>
              <div className="bg-white/10 py-3 px-6 rounded-lg inline-block border border-white/10">
                <span className="font-sans font-light text-[#FDF9EC]/70 uppercase tracking-wider text-sm mr-3">
                  Indywidualny kod dostępu:
                </span>
                <span className="font-mono font-bold text-white tracking-widest text-lg">
                  {savedPlusOne.code}
                </span>
              </div>
              <p className="font-sans font-light text-[#FDF9EC]/60 text-xs mt-4">Prosimy przekazać ten kod osobie towarzyszącej, aby mogła się zalogować.</p>
            </div>
          ) : (
            <p className="text-lg text-[#FDF9EC]/80">Status zapisany.</p>
          )}
        </motion.div>
      ) : (
        <>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-center gap-6 mt-10 w-full max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setPlusOneData({ firstName: "", lastName: "" })}
              className="flex-1 px-8 py-4 rounded-xl font-serif uppercase tracking-widest text-[#4E0113] bg-[#FDF9EC] shadow-lg hover:bg-white transition-all"
            >
              Potwierdzam
            </button>
            <button
              type="button"
              onClick={handleDecline}
              className="flex-1 px-8 py-4 rounded-xl font-serif uppercase tracking-widest text-[#FDF9EC] bg-white/10 border border-white/20 shadow-lg hover:bg-white/20 transition-all"
            >
              Rezygnuję
            </button>
          </motion.div>

          {plusOneData && (
            <motion.div
              variants={fadeUp}
              className="flex flex-col gap-5 w-full max-w-md mx-auto mt-12"
            >
              <input
                type="text"
                placeholder="Imię osoby towarzyszącej"
                value={plusOneData.firstName}
                onChange={(e) =>
                  setPlusOneData({ ...plusOneData, firstName: e.target.value })
                }
                className="w-full p-4 rounded-lg bg-white/10 border border-white/30 text-[#FDF9EC] placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FDF9EC]/50 font-sans shadow-inner"
              />
              <input
                type="text"
                placeholder="Nazwisko osoby towarzyszącej"
                value={plusOneData.lastName}
                onChange={(e) =>
                  setPlusOneData({ ...plusOneData, lastName: e.target.value })
                }
                className="w-full p-4 rounded-lg bg-white/10 border border-white/30 text-[#FDF9EC] placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#FDF9EC]/50 font-sans shadow-inner"
              />

              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="w-full mt-4 bg-[#FDF9EC] text-[#4E0113] py-4 rounded-xl shadow-lg hover:bg-white transition-all font-serif uppercase tracking-widest font-bold disabled:opacity-50"
              >
                {loading ? "Przetwarzanie..." : "Zapisz dane"}
              </button>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}
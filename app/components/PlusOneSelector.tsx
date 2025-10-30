"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PlusOneSelectorProps {
  canBringPlusOne: boolean;
  parentGuestId?: number;
}

// generator kodu 6‑znakowego
function generateCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// sprawdza unikalność kodu w bazie
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

export default function PlusOneSelector({
  canBringPlusOne,
  parentGuestId,
}: PlusOneSelectorProps) {
  const [loading, setLoading] = useState(false);
  const [decisionMade, setDecisionMade] = useState(false);
  const [plusOneData, setPlusOneData] = useState<{ firstName: string; lastName: string } | null>(null);
  const [savedPlusOne, setSavedPlusOne] = useState<{ firstName: string; lastName: string; code: string } | null>(null);
  const [declined, setDeclined] = useState(false);

  // pobieranie decyzji i ewentualnej osoby towarzyszącej
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

      // oznacz decyzję jako podjętą
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
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-[#4E0113] mb-4 text-center">
        Osoba towarzysząca
      </h2>

      {/* Jeśli decyzja już podjęta */}
      {decisionMade ? (
        <div className="text-center">
          {declined ? (
            <p>Zdecydowałeś, że nie przychodzisz z osobą towarzyszącą.</p>
          ) : savedPlusOne ? (
            <div>
              <p>Osoba towarzysząca została wybrana:</p>
              <p className="font-bold">
                {savedPlusOne.firstName} {savedPlusOne.lastName}
              </p>
              <p>
                Kod dostępu:{" "}
                <span className="font-mono">{savedPlusOne.code}</span>
              </p>
            </div>
          ) : (
            <p>Decyzja została już podjęta.</p>
          )}
        </div>
      ) : (
        <>
          <div className="flex justify-center gap-6 mb-4">
            <button
              type="button"
              onClick={() => setPlusOneData({ firstName: "", lastName: "" })}
              className="px-6 py-2 rounded-lg font-semibold bg-[#4E0113] text-white"
            >
              Tak
            </button>
            <button
              type="button"
              onClick={handleDecline}
              className="px-6 py-2 rounded-lg font-semibold bg-gray-200"
            >
              Nie
            </button>
          </div>

          {plusOneData && (
            <div className="flex flex-col gap-4 max-w-md mx-auto">
              <input
                type="text"
                placeholder="Imię"
                value={plusOneData.firstName}
                onChange={(e) =>
                  setPlusOneData({ ...plusOneData, firstName: e.target.value })
                }
                className="border rounded-lg p-3"
              />
              <input
                type="text"
                placeholder="Nazwisko"
                value={plusOneData.lastName}
                onChange={(e) =>
                  setPlusOneData({ ...plusOneData, lastName: e.target.value })
                }
                className="border rounded-lg p-3"
              />

              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="bg-[#4E0113] text-white py-2 rounded-lg shadow hover:bg-[#6b1326] transition disabled:opacity-60"
              >
                {loading ? "Zapisywanie..." : "Zatwierdź"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, easeOut } from "framer-motion";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Definiujemy możliwe statusy jako typ TypeScript
export type RsvpStatus = 'confirmed' | 'ceremony_only' | 'declined' | null;

interface RsvpSelectorProps {
  guestId?: number;
  // Zmieniamy typ funkcji zwrotnej, teraz przekazuje string, a nie boolean
  onDecisionChange: (status: RsvpStatus) => void;
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

export default function RsvpSelector({ guestId, onDecisionChange }: RsvpSelectorProps) {
  const [loading, setLoading] = useState(false);
  const [decisionMade, setDecisionMade] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<RsvpStatus>(null);

  useEffect(() => {
    const fetchDecision = async () => {
      if (!guestId) return;
      // Pobieramy rsvp_status zamiast is_attending
      const { data, error } = await supabase
        .from("guests")
        .select("rsvp_decision_made, rsvp_status")
        .eq("id", guestId)
        .maybeSingle();

      if (!error && data) {
        setDecisionMade(data.rsvp_decision_made);
        setRsvpStatus(data.rsvp_status as RsvpStatus);
        
        if (data.rsvp_decision_made) {
          onDecisionChange(data.rsvp_status as RsvpStatus);
        }
      }
    };
    fetchDecision();
  }, [guestId, onDecisionChange]);

  const handleDecision = async (status: RsvpStatus) => {
    if (!guestId || !status) return;
    
    let confirmMsg = "";
    if (status === 'confirmed') confirmMsg = "Czy potwierdzasz obecność na ślubie i weselu?";
    if (status === 'ceremony_only') confirmMsg = "Czy potwierdzasz obecność TYLKO na ślubie?";
    if (status === 'declined') confirmMsg = "Czy na pewno chcesz poinformować, że Cię nie będzie?";
      
    if (!window.confirm(confirmMsg)) return;

    setLoading(true);

    const { error } = await supabase
      .from("guests")
      .update({ 
        rsvp_decision_made: true,
        rsvp_status: status 
      })
      .eq("id", guestId);

    setLoading(false);

    if (error) {
      alert("Błąd zapisu decyzji. Spróbuj ponownie.");
      console.error(error);
      return;
    }

    setDecisionMade(true);
    setRsvpStatus(status);
    onDecisionChange(status);
  };

  if (!guestId) return null;

  return (
    <motion.div
      className="mt-10 mb-16 flex flex-col items-center justify-center text-center"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 variants={fadeUp} className="text-3xl font-bold text-[#4E0113] mb-6">
        Potwierdzenie przybycia
      </motion.h2>

      {!decisionMade && (
        <motion.div variants={fadeUp} className="max-w-2xl">
          <p className="text-gray-800 mb-6 text-lg">
            Daj nam znać, czy będziesz z nami w tym dniu.{"\n\n"}
            Prosimy o odpowiedź najlepiej do miesiąca przed ślubem.😊
          </p>
        </motion.div>
      )}

      {decisionMade ? (
        <motion.div variants={fadeUp} className="mt-4 p-6 bg-white/50 rounded-xl border border-[#4E0113]/10">
          {rsvpStatus === 'confirmed' && (
            <div>
              <p className="text-xl font-bold text-[#4E0113] mb-2">
                Super! Widzimy się na ślubie i weselu! 💃🕺
              </p>
              <p className="text-gray-700">Poniżej wybierz posiłki.</p>
            </div>
          )}
          {rsvpStatus === 'ceremony_only' && (
            <div>
              <p className="text-xl font-bold text-[#4E0113] mb-2">
                Cieszymy się, że będziesz z nami na ślubie! 💒
              </p>
              <p className="text-gray-700">Dziękujemy za informację.</p>
            </div>
          )}
          {rsvpStatus === 'declined' && (
            <div>
              <p className="text-xl font-bold text-gray-600 mb-2">
                Szkoda, że Cię nie będzie. 😔
              </p>
              <p className="text-gray-700">Dziękujemy za poinformowanie nas.</p>
            </div>
          )}
          
          <button 
            onClick={() => setDecisionMade(false)}
            className="text-sm text-gray-500 underline mt-4 hover:text-[#4E0113]"
          >
            Zmień decyzję
          </button>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="flex flex-col md:flex-row gap-4 mt-4 w-full md:w-auto px-4">
          <button
            onClick={() => handleDecision('confirmed')}
            disabled={loading}
            className="flex-1 px-8 py-4 rounded-lg font-bold text-white bg-[#4E0113] hover:bg-[#6b1326] shadow-lg transition transform hover:scale-105"
          >
            Będę na weselu! 🥂
          </button>
          
          <button
            onClick={() => handleDecision('ceremony_only')}
            disabled={loading}
            className="flex-1 px-8 py-4 rounded-lg font-bold text-[#4E0113] bg-[#FAD6C8] hover:bg-[#ffc5af] shadow-lg transition transform hover:scale-105"
          >
            Będę tylko na ślubie 💒
          </button>
          
          <button
            onClick={() => handleDecision('declined')}
            disabled={loading}
            className="flex-1 px-8 py-4 rounded-lg font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 shadow-lg transition transform hover:scale-105"
          >
            Nie będzie mnie 😢
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
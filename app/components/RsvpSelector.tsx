"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion, easeOut } from "framer-motion";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type RsvpStatus = 'confirmed' | 'ceremony_only' | 'declined' | null;

interface RsvpSelectorProps {
  guestId?: number;
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
      <motion.h2 variants={fadeUp} className="font-serif text-3xl md:text-5xl font-light text-[#4c4a1e] mb-6 uppercase tracking-[0.15em] drop-shadow-md">
        Potwierdzenie przybycia
      </motion.h2>

      {!decisionMade && (
        <motion.div variants={fadeUp} className="max-w-2xl text-[#4c4a1e]/90 font-sans font-light text-lg">
          <p className="mb-6 leading-relaxed">
            Daj nam znać, czy zaszczycisz nas swoją obecnością w tym wyjątkowym dniu.{"\n\n"}
            Prosimy o odpowiedź najlepiej do miesiąca przed uroczystością.
          </p>
        </motion.div>
      )}

      {decisionMade ? (
        <motion.div variants={fadeUp} className="mt-4 p-8 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl max-w-2xl w-full">
          {rsvpStatus === 'confirmed' && (
            <div>
              <p className="font-serif text-2xl text-[#4c4a1e] mb-2 tracking-wide">
                Z przyjemnością gościć Cię będziemy na ślubie i weselu.
              </p>
              <p className="font-sans font-light text-[#4c4a1e]/80 mt-2">Poniżej prosimy o wybór preferowanego posiłku.</p>
            </div>
          )}
          {rsvpStatus === 'ceremony_only' && (
            <div>
              <p className="font-serif text-2xl text-[#4c4a1e] mb-2 tracking-wide">
                Cieszymy się, że będziesz z nami podczas ceremonii zaślubin.
              </p>
              <p className="font-sans font-light text-[#4c4a1e]/80 mt-2">Dziękujemy za przekazaną informację.</p>
            </div>
          )}
          {rsvpStatus === 'declined' && (
            <div>
              <p className="font-serif text-2xl text-[#4c4a1e]/80 mb-2 tracking-wide">
                Z żalem przyjmujemy informację o Twojej nieobecności.
              </p>
              <p className="font-sans font-light text-[#4c4a1e]/80 mt-2">Dziękujemy za odpowiedź.</p>
            </div>
          )}
          
          <button 
            onClick={() => setDecisionMade(false)}
            className="text-sm text-[#4c4a1e]/60 underline mt-8 hover:text-[#4c4a1e] transition-colors font-sans uppercase tracking-widest"
          >
            Zmień decyzję
          </button>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="flex flex-col md:flex-row gap-6 mt-6 w-full md:w-auto px-4">
          <button
            onClick={() => handleDecision('confirmed')}
            disabled={loading}
            className="flex-1 px-8 py-5 rounded-xl font-serif uppercase tracking-widest text-[#FDF9EC] bg-[#4c4a1e] hover:bg-[#383716] shadow-lg transition-all hover:-translate-y-0.5"
          >
            Będę na weselu
          </button>
          
          <button
            onClick={() => handleDecision('ceremony_only')}
            disabled={loading}
            className="flex-1 px-8 py-5 rounded-xl font-serif uppercase tracking-widest text-[#4c4a1e] bg-white/60 backdrop-blur-sm border border-white/80 hover:bg-white shadow-lg transition-all hover:-translate-y-0.5"
          >
            Tylko ceremonia
          </button>
          
          <button
            onClick={() => handleDecision('declined')}
            disabled={loading}
            className="flex-1 px-8 py-5 rounded-xl font-serif uppercase tracking-widest text-[#4c4a1e]/80 bg-white/30 backdrop-blur-sm hover:bg-white/50 border border-white/50 shadow-lg transition-all hover:-translate-y-0.5"
          >
            Niestety, nie będę
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlobeEuropeAfricaIcon } from "@heroicons/react/24/solid";

type Props = {
  onSuccess: () => void;
  onMistake: () => void;
};

export function StageTwoPuzzle({ onSuccess, onMistake }: Props) {
  const [inputVal, setInputVal] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const checkAnswer = () => {
    const answer = inputVal.trim().toLowerCase();
    const validAnswers = ["finlandia", "finlandii", "suomi", "helsinki", "laponia"];

    if (validAnswers.some(v => answer.includes(v))) {
      onSuccess();
    } else {
      onMistake();
      setErrorMsg("Kaprawo! ❄️");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      className="text-center"
    >
      <GlobeEuropeAfricaIcon className="w-16 h-16 mx-auto text-blue-800 mb-4 opacity-80" />
      <h2 className="text-2xl font-bold mb-2 text-[#4E0113]">Etap 2: Gdzie jedziemy?</h2>

      <div className="mt-4">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Wpisz nazwę miejsca..."
          className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-[#4E0113] focus:outline-none text-center text-lg font-bold bg-gray-50 mb-4 text-[#4E0113]"
          onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
        />
        
        {errorMsg && (
          <p className="text-red-500 font-bold text-sm mb-4">{errorMsg}</p>
        )}

        <button
          onClick={checkAnswer}
          className="w-full bg-[#4E0113] text-[#FAD6C8] py-4 rounded-xl font-bold text-xl shadow-lg hover:bg-[#6b1326] transition"
        >
          Sprawdź!
        </button>
      </div>
    </motion.div>
  );
}
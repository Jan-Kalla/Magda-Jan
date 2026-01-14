"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";

type Props = {
  onSuccess: () => void;
  onMistake: () => void;
};

// WAŻNE: Musi być 'export default'
export function StageThreePuzzle({ onSuccess, onMistake }: Props) {
  const [inputVal, setInputVal] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const checkAnswer = () => {
    const answer = inputVal.trim().toLowerCase();
    const validAnswers = ["14", "czternaście", "czternascie"];

    if (validAnswers.some(v => answer.includes(v))) {
      onSuccess();
    } else {
      onMistake();
      setErrorMsg("Blisko, ale to nie tyle dni. Spróbuj innej liczby! 📅");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      className="text-center"
    >
      <CalendarDaysIcon className="w-16 h-16 mx-auto text-[#4E0113] mb-4 opacity-80" />
      <h2 className="text-2xl font-bold mb-2 text-[#4E0113]">Finał: Czas Wyprawy</h2>
      
      <p className="text-lg mb-6 italic text-gray-700">
        "Szczęśliwi czasu nie liczą, ale my musimy kupić bilety powrotne..."
      </p>
      
      <div className="bg-red-100 p-3 rounded-xl text-sm text-red-800 mb-6 border border-red-200">
        📅 Zgadnijcie (lub poszukajcie wskazówki na sali), na ile dni znikamy po weselu!
      </div>

      <div className="mt-4">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Liczba dni..."
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
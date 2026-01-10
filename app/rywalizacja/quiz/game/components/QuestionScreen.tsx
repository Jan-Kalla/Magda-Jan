"use client";
import { motion } from "framer-motion";
import { ClockIcon, CheckCircleIcon } from "@heroicons/react/24/solid";

type Props = {
  questionText: string;
  answers: { label: string; isCorrect: boolean }[];
  timeLeft: number;
  progress: number;
  submittedIndex: number | null;
  onSubmit: (index: number) => void;
};

const colors = ["bg-red-500", "bg-blue-500", "bg-yellow-500", "bg-green-500"];
const icons = ["▲", "◆", "●", "■"];

export default function QuestionScreen({
  questionText,
  answers,
  timeLeft,
  progress,
  submittedIndex,
  onSubmit,
}: Props) {
  const isTimeUp = timeLeft <= 0;
  const isInteractionDisabled = submittedIndex !== null || isTimeUp;

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full h-full flex flex-col max-w-lg mx-auto"
    >
      {/* Pasek czasu */}
      <div className="w-full h-4 bg-gray-300 rounded-full mb-6 overflow-hidden border border-[#4E0113]/20 relative">
        <motion.div
          className="h-full bg-[#4E0113]"
          style={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0.1 }}
        />
      </div>

      {/* Pytanie */}
      <div className="bg-white p-6 rounded-2xl shadow-xl mb-6 text-center border-2 border-[#4E0113]/10 relative overflow-hidden">
        <div className="absolute top-2 right-3 flex items-center gap-1 text-[#4E0113]/50 font-bold font-mono">
          <ClockIcon className="w-4 h-4" />
          <span>{Math.max(0, timeLeft)}s</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-[#4E0113] leading-snug mt-2">
          {questionText}
        </h2>
      </div>

      {/* Odpowiedzi */}
      <div className="grid grid-cols-2 gap-4 flex-1 min-h-[300px]">
        {answers.map((ans, idx) => {
          const isSelected = submittedIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => onSubmit(idx)}
              disabled={isInteractionDisabled}
              className={`
                  ${colors[idx % 4]} rounded-xl shadow-lg p-4 flex flex-col items-center justify-center text-white transition-all transform duration-200 relative overflow-hidden
                  ${isInteractionDisabled && !isSelected ? "opacity-40 grayscale scale-95" : "hover:scale-105 active:scale-95"}
                  ${isSelected ? "!opacity-100 !grayscale-0 ring-4 ring-[#4E0113] scale-100 z-10" : ""}
              `}
            >
              <span className="absolute -bottom-4 -right-4 text-8xl opacity-20 pointer-events-none">
                {icons[idx % 4]}
              </span>
              <span className="text-4xl mb-2 drop-shadow-md">{icons[idx % 4]}</span>
              <span className="font-bold text-lg leading-tight drop-shadow-sm">
                {ans.label}
              </span>
              {isSelected && (
                <div className="absolute top-2 right-2 bg-white text-[#4E0113] rounded-full p-1">
                  <CheckCircleIcon className="w-5 h-5" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Status na dole */}
      <div className="h-12 flex items-center justify-center mt-4">
        {submittedIndex !== null ? (
          <div className="text-[#4E0113] font-bold bg-white/60 px-6 py-2 rounded-full backdrop-blur-sm shadow-sm animate-pulse">
            Odpowiedź zapisana! Czekaj na wynik... 🤞
          </div>
        ) : isTimeUp ? (
          <div className="text-red-600 font-bold bg-white/80 px-6 py-2 rounded-full shadow-md">
            Czas minął! 🐢 Czekaj na Wodzireja.
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
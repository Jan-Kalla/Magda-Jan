"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  KeyIcon, 
  LifebuoyIcon, 
  LightBulbIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  SparklesIcon // Ikona do super-podpowiedzi
} from "@heroicons/react/24/solid";

type Props = {
  onSuccess: () => void;
  onMistake: () => void;
};

// === 1. PEŁNE TRAFIENIE (SUKCES) ===
const VALID_FINALS = [
  "żeglować", "żagle", "żaglówka", "zagle", "zaglowka", 
  "jacht", "jachting", "żeglowanie", "zeglowanie", "zeglowac", 
  "pływać żaglówką", "plywac zaglowka", "plywac zaglowką",
  "rejs żeglarski", "rejs zeglarski", "rejs zaglarski",
  "rejs", "wyprawa żeglarska", "wyprawa zeglarska",
  "płynąć w rejs", "plynac w rejs", "pływać jachtem", "plywac jachtem",
  "płynąć jachtem", "plynac jachtem", "pływanie jachtem", "plywanie jachtem"
];

// === 2. GORĄCO (ALMOST) - Bardzo blisko, ale nieprecyzyjnie ===
const ALMOST_VALID_FINALS = [
  "łódka", "łódź", "lodz", "lodka", "łódką", "lodka",
  "statek", "prom", "kajak", "motorówka", "motorowka",
  "woda", "jezioro", "jeziora", "morze", "ocean",
  "mazury", "finlandia", "skandynawia",
  "pływanie", "pływać", "plywac", "plywanie",
  "płynąć", "plynac", "popłynąć",
  "wiosłować", "wioslowac",
  "żeglarz", "zeglarz", "kapitan"
];

// === 3. DOBRZE KOMBINUJESZ (A LITTLE) - Prawda, ale daleko od sedna ===
const A_LITTLE_VALID_FINALS = [
  "wakacje", "podróż", "podroz", "wycieczka", "wyprawa",
  "zwiedzać", "zwiedzanie",
  "odpoczywać", "odpoczynek", "relaks",
  "biwak", "biwakować", "biwakowanie",
  "kemping", "camping", "namiot", "spanie pod namiotem", "pod namiotem",
  "łowić", "łowienie", "ryby", "wędkować", "wedkowac",
  "pić", "imprezować", "impreza", "picie", "jedzenie",
  "przygoda", "las", "natura", "przyroda",
  "miesiąc miodowy", "miesiac miodowy", "noc poślubna", "noc poslubna",
  "opalanie", "słońce", "slonce",
  "wyspa", "wyspy", "archipelag",
  "plecak", "śpiwór"
];

// === KONFIGURACJA PYTAŃ I POSZLAK ===
// Pamiętaj, aby uzupełnić pola "valid" (odpowiedzi) małymi literami!
const QUESTIONS_DATA = [
  { id: 1,  question: "Jaki jest ulubiony kolor Magdy?", valid: ["karmin", "czerwony", "bordo"], clue: "🧭" }, // Kompas
  { id: 2,  question: "Jaki jest ulubiony kolor Jana?", valid: ["czerwony", "niebieski"], clue: "🌬️" }, // Wiatr
  { id: 3,  question: "Miesiąc naszych zaręczyn?", valid: ["sierpień", "08", "8", "sierpien"], clue: "🪢" }, // Lina
  { id: 4,  question: "Ile lat się znamy?", valid: ["6", "sześć", "szesc"], clue: "🗺️" }, // Mapa
  { id: 5,  question: "Ulubiona marka auta Jana?", valid: ["audi"], clue: "⚙️❌" }, // Brak silnika
  { id: 6,  question: "Kto lepiej gotuje?", valid: ["jan", "janek", "magda", "oboje"], clue: "⛺" }, // Namiot
  { id: 7,  question: "Gdzie była pierwsza randka?", valid: ["kino", "park", "spacer"], clue: "🌊" }, // Fale
  { id: 8,  question: "Jakie zwierzę chcielibyśmy mieć?", valid: ["pies", "psa", "kot", "kota"], clue: "🔕" }, // Cisza
  { id: 9,  question: "Rozmiar buta Magdy?", valid: ["36"], clue: "🐟" }, // NOWE: Ryba (zamiast Kotwicy)
  { id: 10, question: "Ulubiony alkohol Jana?", valid: ["whisky", "piwo", "rum"], clue: "🌲" }, // Drzewo
  { id: 11, question: "Kto jest starszy?", valid: ["jan", "janek", "on"], clue: "🕶️" }, // NOWE: Okulary (zamiast Koła)
  { id: 12, question: "Data ślubu (Dzień)?", valid: ["26", "dwudziesty szósty"], clue: "🌅" }, // Zachód słońca
];

export default function StageOnePuzzle({ onSuccess, onMistake }: Props) {
  const [solvedIds, setSolvedIds] = useState<number[]>([]);
  const [inputs, setInputs] = useState<{ [key: number]: string }>({});

  const [finalGuess, setFinalGuess] = useState("");
  const [shakeFinal, setShakeFinal] = useState(false);
  
  // Licznik prób "Prawie Dobrze"
  const [almostCount, setAlmostCount] = useState(0);
  
  const [finalMsg, setFinalMsg] = useState<{ text: string; type: 'error' | 'warning' | 'info' } | null>(null);

  const checkQuestion = (id: number) => {
    const q = QUESTIONS_DATA.find(item => item.id === id);
    if (!q) return;
    const userVal = (inputs[id] || "").trim().toLowerCase();
    if (q.valid.some(v => userVal.includes(v))) {
      setSolvedIds(prev => [...prev, id]);
    } else {
      onMistake();
      setInputs(prev => ({ ...prev, [id]: "❌" }));
      setTimeout(() => setInputs(prev => ({ ...prev, [id]: "" })), 500);
    }
  };

  const checkFinal = () => {
    const val = finalGuess.trim().toLowerCase();
    setFinalMsg(null);

    // 1. SUKCES
    if (VALID_FINALS.some(v => val.includes(v))) {
      onSuccess();
      return;
    }

    // Błąd techniczny (zawsze naliczamy błąd, jeśli to nie jest sukces)
    setShakeFinal(true);
    setTimeout(() => setShakeFinal(false), 500);
    onMistake();

    // 2. GORĄCO (ALMOST) - Zliczamy próby
    if (ALMOST_VALID_FINALS.some(v => val.includes(v))) {
      const newCount = almostCount + 1;
      setAlmostCount(newCount);

      setFinalMsg({ 
        text: "Gorąco! 🔥 Jesteś bardzo blisko, ale bądź bardziej precyzyjny...", 
        type: 'warning' 
      });
      return;
    }

    // 3. DOBRZE KOMBINUJESZ (A LITTLE)
    if (A_LITTLE_VALID_FINALS.some(v => val.includes(v))) {
      setFinalMsg({ 
        text: "Dobrze kombinujesz! 🤔 To część planu, ale szukamy głównej aktywności...", 
        type: 'info' 
      });
      return;
    }

    // 4. ZIMNO
    setFinalMsg({ text: "Pudło! To nie to. ❄️", type: 'error' });
  };

  return (
    <div className="w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <LifebuoyIcon className="w-16 h-16 mx-auto text-blue-600 mb-4 opacity-80" />
        <h2 className="text-2xl font-bold mb-2">Etap 1: Co będziemy robić?</h2>
        <p className="text-gray-600 text-sm">
          Odpowiadaj na pytania o nas, aby odkrywać poszlaki. <br/>
          Spokojnie, najpewniej nie znasz odpowiedzi na wszysrtkie pytania.<br/>
          Nie martw się, to nie szkodzi, każda z poszlak przybliża Cię do rozwiązania!<br/>
          Gdy domyślisz się całości, wpisz hasło główne na górze!<br/>
          Tutaj ważniejsza jest poprawność niż czas, choć lepiej go nie tracić 😉<br/>
          Przy punktacji za ten etap liczy się liczba błędów, więc uważaj!
        </p>
      </motion.div>

      {/* === GŁÓWNE HASŁO === */}
      <div className={`mb-8 p-4 bg-[#4E0113] rounded-2xl shadow-xl text-[#FAD6C8] transition-transform ${shakeFinal ? "translate-x-2" : ""}`}>
         <div className="flex items-center gap-2 mb-2 justify-center">
            <KeyIcon className="w-5 h-5" />
            <span className="font-bold uppercase tracking-widest text-sm">Hasło Główne</span>
         </div>
         
        <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Wpisz rozwiązanie..." 
              // --- ZMIANY W STYLACH INPUTA ---
              className="
                flex-1 
                p-3 
                rounded-lg 
                bg-white 
                text-[#4E0113] 
                font-bold 
                text-center 
                focus:outline-none 
                placeholder:text-gray-400
                placeholder:transition-opacity 
                focus:placeholder:opacity-0
              "
              // ------------------------------
              value={finalGuess}
              onChange={(e) => setFinalGuess(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkFinal()}
            />
            <button 
              onClick={checkFinal}
              className="bg-[#FAD6C8] text-[#4E0113] px-4 py-2 rounded-lg font-bold hover:bg-white transition"
            >
              OK
            </button>
         </div>

        {/* Komunikaty błędów / ostrzeżeń */}
         <AnimatePresence>
            {finalMsg && (
                <div className="flex flex-col items-center">
                    <motion.div 
                        key="main-msg"
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`mt-3 text-sm font-bold text-center flex items-center justify-center gap-2 ${
                            finalMsg.type === 'warning' ? 'text-yellow-400' : 
                            finalMsg.type === 'info' ? 'text-blue-300' : 
                            'text-red-400'
                        }`}
                    >
                        {finalMsg.type === 'warning' && <ExclamationCircleIcon className="w-4 h-4"/>}
                        {finalMsg.type === 'info' && <InformationCircleIcon className="w-4 h-4"/>}
                        {finalMsg.text}
                    </motion.div>

                    {/* DODATKOWA WSKAZÓWKA PO 3 PRÓBACH "GORĄCO" */}
                    {finalMsg.type === 'warning' && almostCount >= 3 && (
                         <motion.div
                            key="extra-hint"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 bg-yellow-500/20 px-3 py-1 rounded-full text-[#FAD6C8] text-s font-bold border border-yellow-500/50 flex items-center gap-2"
                         >
                            <SparklesIcon className="w-6 h-6 text-yellow-300" />
                            Jesteś już naprawdę bardzo blisko! ⛵⚓
                         </motion.div>
                    )}
                </div>
            )}
         </AnimatePresence>
      </div>

      {/* === SIATKA POSZLAK (BEZ PODPISÓW) === */}
      <h3 className="font-bold text-[#4E0113] mb-4 flex items-center gap-2">
        <LightBulbIcon className="w-5 h-5" />
        Twoje Poszlaki ({solvedIds.length}/{QUESTIONS_DATA.length})
      </h3>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8">
        {QUESTIONS_DATA.map((item) => {
          const isSolved = solvedIds.includes(item.id);
          return (
            <motion.div 
              key={item.id}
              initial={false}
              animate={isSolved ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
              className={`
                aspect-square rounded-xl flex items-center justify-center border-2 transition-all
                ${isSolved 
                    ? "bg-white border-[#4E0113] shadow-md text-4xl" 
                    : "bg-gray-100 border-gray-200 opacity-50 text-2xl"}
              `}
            >
              {isSolved ? item.clue : "❓"}
            </motion.div>
          );
        })}
      </div>

      {/* === LISTA PYTAŃ === */}
      <div className="space-y-3">
        {QUESTIONS_DATA.map((item) => {
          const isSolved = solvedIds.includes(item.id);
          if (isSolved) return null; // Ukrywamy rozwiązane

          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 rounded-xl border border-[#4E0113]/10 shadow-sm"
            >
              <p className="font-bold text-[#4E0113] text-sm mb-2">{item.question}</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-[#4E0113] focus:outline-none"
                  placeholder="Odpowiedź..."
                  value={inputs[item.id] || ""}
                  onChange={(e) => setInputs(prev => ({ ...prev, [item.id]: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && checkQuestion(item.id)}
                />
                <button 
                  onClick={() => checkQuestion(item.id)}
                  className="bg-[#4E0113] text-white px-3 rounded-lg text-sm font-bold"
                >
                  ?
                </button>
              </div>
            </motion.div>
          );
        })}
        
        {solvedIds.length === QUESTIONS_DATA.length && (
            <div className="text-center p-4 text-green-800 font-bold bg-green-100 rounded-xl border border-green-200">
                Masz już komplet poszlak! <br/>
                Spójrz na emotki powyżej i wpisz hasło w bordowym polu!
            </div>
        )}
      </div>
    </div>
  );
}
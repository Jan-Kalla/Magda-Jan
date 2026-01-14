"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LockClosedIcon, 
  LockOpenIcon, 
  KeyIcon, 
  LifebuoyIcon, 
  LightBulbIcon 
} from "@heroicons/react/24/solid";

type Props = {
  onSuccess: () => void;
  onMistake: () => void;
};

// === KONFIGURACJA PYTAŃ I POSZLAK ===
// WAŻNE: Uzupełnij pole "valid" poprawnymi odpowiedziami o Was!
const QUESTIONS_DATA = [
  { id: 1,  question: "Jaki jest ulubiony kolor Magdy?", valid: ["karmin", "czerwony"], clue: "🧭", label: "Kompas" },
  { id: 2,  question: "Jaki jest ulubiony kolor Jana?", valid: ["czerwony"], clue: "🌬️", label: "Wiatr" },
  { id: 3,  question: "Miesiąc naszych zaręczyn?", valid: ["sierpień", "08", "8"], clue: "🪢", label: "Lina" },
  { id: 4,  question: "Ile lat się znamy?", valid: ["6", "sześć", "szesc"], clue: "🗺️", label: "Mapa bez dróg" },
  { id: 5,  question: "Ulubiona marka auta Jana?", valid: ["audi"], clue: "⚙️❌", label: "Brak Silnika" },
  { id: 6,  question: "Kto lepiej gotuje?", valid: ["jan", "janek", "magda", "oboje"], clue: "⛺", label: "Kemping" }, // Tu wpisz prawdę ;)
  { id: 7,  question: "Gdzie była pierwsza randka?", valid: ["kino", "park", "spacer"], clue: "🌊", label: "Fale" },
  { id: 8,  question: "Jakie zwierzę chcielibyśmy mieć?", valid: ["pies", "psa", "kot", "kota"], clue: "🔕", label: "Cisza" },
  { id: 9,  question: "Rozmiar buta Magdy?", valid: ["38", "37", "39"], clue: "⚓", label: "Kotwica" },
  { id: 10, question: "Ulubiony alkohol Jana?", valid: ["whisky", "piwo", "rum"], clue: "☸️", label: "Ster" },
  { id: 11, question: "Kto jest starszy?", valid: ["jan", "janek", "on"], clue: "🛟", label: "Koło ratunkowe" },
  { id: 12, question: "Data ślubu (Dzień)?", valid: ["26", "dwudziesty szósty"], clue: "🌅", label: "Zachód słońca" },
];

export default function StageOnePuzzle({ onSuccess, onMistake }: Props) {
  // Stan odkrytych poszlak (tablica ID pytań, które rozwiązano)
  const [solvedIds, setSolvedIds] = useState<number[]>([]);
  
  // Stan wpisywanych odpowiedzi dla poszczególnych pytań
  const [inputs, setInputs] = useState<{ [key: number]: string }>({});

  // Stan głównego hasła
  const [finalGuess, setFinalGuess] = useState("");
  const [shakeFinal, setShakeFinal] = useState(false);

  // Sprawdzanie pojedynczego pytania o Was
  const checkQuestion = (id: number) => {
    const q = QUESTIONS_DATA.find(item => item.id === id);
    if (!q) return;

    const userVal = (inputs[id] || "").trim().toLowerCase();
    
    if (q.valid.some(v => userVal.includes(v))) {
      // Sukces - dodajemy do rozwiązanych
      setSolvedIds(prev => [...prev, id]);
    } else {
      // Błąd
      onMistake();
      // Prosta animacja błędu (czyszczenie pola + wibracja)
      setInputs(prev => ({ ...prev, [id]: "❌" }));
      setTimeout(() => setInputs(prev => ({ ...prev, [id]: "" })), 500);
    }
  };

  // Sprawdzanie GŁÓWNEGO hasła (Żeglowanie)
  const checkFinal = () => {
    const val = finalGuess.trim().toLowerCase();
    const validFinals = ["żagle", "żaglówka", "zagle", "zaglowka", "jacht", "jachting", "rejs", "pływanie", "żeglowanie", "zeglowanie"];

    if (validFinals.some(v => val.includes(v))) {
      onSuccess();
    } else {
      setShakeFinal(true);
      setTimeout(() => setShakeFinal(false), 500);
      onMistake();
    }
  };

  return (
    <div className="w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <LifebuoyIcon className="w-16 h-16 mx-auto text-blue-600 mb-4 opacity-80" />
        <h2 className="text-2xl font-bold mb-2">Etap 1: Co będziemy robić?</h2>
        <p className="text-gray-600 text-sm">
          Odpowiadaj na pytania o nas, aby odkrywać poszlaki. <br/>
          Gdy domyślisz się całości, wpisz hasło główne na górze!<br/>
          Tutaj ważniejsza jest poprawność niż czas, choć lepiej go nie tracić 😉<br/>
          Przy punktacji za ten etap liczy się liczba błędów, więc uważaj!
        </p>
      </motion.div>

      {/* === GŁÓWNE HASŁO (DOSTĘPNE ZAWSZE) === */}
      <div className={`mb-8 p-4 bg-[#4E0113] rounded-2xl shadow-xl text-[#FAD6C8] transition-transform ${shakeFinal ? "translate-x-2" : ""}`}>
         <div className="flex items-center gap-2 mb-2 justify-center">
            <KeyIcon className="w-5 h-5" />
            <span className="font-bold uppercase tracking-widest text-sm">Hasło Główne</span>
         </div>
         <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Co będziemy robić?" 
              className="flex-1 p-3 rounded-lg text-[#4E0113] font-bold text-center focus:outline-none placeholder:text-gray-400"
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
         <p className="text-xs text-center mt-2 opacity-60">Możesz strzelać w każdej chwili (ale uwaga na błędy!)</p>
      </div>

      {/* === SIATKA POSZLAK === */}
      <h3 className="font-bold text-[#4E0113] mb-4 flex items-center gap-2">
        <LightBulbIcon className="w-5 h-5" />
        Zdobyte Poszlaki ({solvedIds.length}/{QUESTIONS_DATA.length})
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
                aspect-square rounded-xl flex flex-col items-center justify-center border-2 transition-colors
                ${isSolved ? "bg-white border-[#4E0113] shadow-md" : "bg-gray-100 border-gray-200 opacity-60"}
              `}
            >
              <div className="text-2xl mb-1">
                {isSolved ? item.clue : "❓"}
              </div>
              <div className="text-[10px] font-bold uppercase text-center leading-tight px-1">
                {isSolved ? item.label : "Zablokowane"}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* === LISTA PYTAŃ === */}
      <div className="space-y-3">
        {QUESTIONS_DATA.map((item) => {
          const isSolved = solvedIds.includes(item.id);
          if (isSolved) return null; // Ukrywamy już rozwiązane pytania, żeby nie śmieciły

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
                  placeholder="Twoja odpowiedź..."
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
        
        {/* Komunikat gdy wszystko rozwiązane */}
        {solvedIds.length === QUESTIONS_DATA.length && (
            <div className="text-center p-4 text-green-600 font-bold bg-green-50 rounded-xl">
                Odkryłeś wszystkie poszlaki! <br/>
                Teraz musisz wiedzieć, co to oznacza... 🤔
            </div>
        )}
      </div>
    </div>
  );
}
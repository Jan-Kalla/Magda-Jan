"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js"; // Potrzebne do zapisu
import { motion, AnimatePresence } from "framer-motion";
import { 
  KeyIcon, 
  LifebuoyIcon, 
  LightBulbIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  SparklesIcon
} from "@heroicons/react/24/solid";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = {
  guestId: number;
  onSuccess: () => void;
  onMistake: () => void;
};

// === 1. PEŁNE TRAFIENIE (SUKCES) ===
const VALID_FINALS = [
  "żeglować", "żagle", "żaglówka", "zagle", "zaglowka", 
  "jacht", "jachting", "żeglowanie", "zeglowanie", "zeglowac", 
  "żeglarstwo", "zeglarstwo",
  "pływać żaglówką", "plywac zaglowka", "plywac zaglowką",
  "rejs żeglarski", "rejs zeglarski", "rejs zaglarski",
  "wyprawa żeglarska", "wyprawa zeglarska",
  "pływać jachtem", "plywac jachtem",
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
  "rejs", "płynąć w rejs", "plynac w rejs",
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
  "miesiąc miodowy", "miesiac miodowy",
  "opalanie", "słońce", "slonce",
  "wyspa", "wyspy", "archipelag",
  "plecak", "śpiwór"
];

const BAWDY = [
"jajczyć się", "noc poślubna", "noc poslubna",
"dzieci", "robić dzieci", "potomstwo",
"seks", "sex", "uprawiać seks", "uprawiać sex",
"współżyć", "współżycie", "konsumować małżeństwo", "konsumatacja małżeństwa",
"ruchać się", "ruchanie"
];

// === KONFIGURACJA PYTAŃ I POSZLAK ===
// Pamiętaj, aby uzupełnić pola "valid" (odpowiedzi) małymi literami!
const QUESTIONS_DATA = [
  { id: 1,  question: "Ulica w Katowicach na której Magda z Johnym swego czasu często bywali?", valid: ["mariacka", "na mariackiej", "mariackiej"], clue: "🧭" }, // Kompas
  { id: 2,  question: "Największe jezioro, na jakim wspólnie byli Magda z Janem?", valid: ["sniardwy", "śniardwy"], clue: "🌬️" }, // Wiatr
  { id: 3,  question: "Najwyższy szczyt, na jaki razem weszli Magda z Janem?", valid: ["świnica", "swinica", "2303", "2304", "2303m.n.p.m.", "2304m.n.p.m.", "2303 m.n.p.m.", "2304 m.n.p.m."], clue: "🪢" }, // Lina
  { id: 4,  question: "Państwo, do którego odbył się pierwszy wspólny zagraniczny wyjazd Magdy i Johnego?", valid: ["austria"], clue: "🗺️" }, // Mapa
  { id: 5,  question: "W jaką grę video Magda najbardziej lubi grać u Jana?", valid: ["granturismo", "gran turismo", "gr7","granturismo7", "gran turismo7","granturismo 7", "gran turismo 7", "gr 7"], clue: "⚙️❌" }, // Brak silnika
  { id: 6,  question: "Pierwsze miasto, w którym Magda z Johnym zamieszkają po ślubie?", valid: ["zabrze"], clue: "⛺" }, // Namiot
  { id: 7,  question: "Co Magda z Janem częściej wybierają, gdy się ich o to spyta: kawa czy herbata?", valid: ["kawa", "kawę"], clue: "🌊" }, // Fale
  { id: 8,  question: "Wymień chociaż jeden z trzech zespołów, na których występie na żywo byli wspólnie Magda z Janem?", valid: ["myslovitz", "myslowic", "strachy na lachy", "strachynalachy","tlove","t-love"], clue: "🔕" }, // Cisza
  { id: 9,  question: "Danie, które Magda i Jan oboje lubią jeść?", valid: ["jajecznica","owsianka","bar gil","sushi","vifon","zupka chińska","kebab", "pizza","pizze","pizzę", "burger", "burgery", "hamburger", "hamburgery", "wszystko","spaghetti"], clue: "🐟" }, // NOWE: Ryba (zamiast Kotwicy)
  { id: 10, question: "Wspólne hobby Magdy i Jana?", valid: ["film", "kino", "chodzenie do kina", "oglądanie filmów", "oglądanie filmow", "kinematografia", "sauna", "sauny", "chodzenie na saune", "saunowanie", "taniec", "tanczenie", "tańczenie", "gory", "góry", "chodzenie po górach", "chodzenie po gorach", "gorskie wedrowki", "górskie wędrówki", "wedrowki gorskie", "trekking", "hiking", "spacery", "spacer", "chodzenie na spacery", "jedzenie", "chodzenie na jedzenie", "jedzenie na miescie", "food", "foodie", "muzyka", "sluchanie muzyki", "słuchanie muzyki", "koncerty", "zeglowanie", "żeglowanie", "plywanie zaglowka", "pływanie żaglówką", "zaglowka", "żaglówka", "standup", "stand-up", "oglądanie standupów", "oglądanie stand-upów", "standupy", "narty", "narciarstwo", "jazda na nartach", "gotowanie", "gotowanie razem", "gotuja razem", "gotują razem", "kuchnia", "biblia", "czytanie biblii", "pismo święte" , "czytanie pisma świętego"], clue: "🌲" }, // Drzewo
  { id: 11, question: "Marka samochodu, która często pojawiała się zarówno w rodzinie Magdy, jak i w rodzinie Jana?", valid: ["skoda", "škoda"], clue: "🕶️" }, // NOWE: Okulary (zamiast Koła)
  { id: 12, question: "Ulubiona księga Nowego Testamentu Johnego i Magdy?", valid: ["dzieje apostolskie"], clue: "🌅" }, // Zachód słońca
];

export default function StageOnePuzzle({ guestId, onSuccess, onMistake }: Props) {
  const [solvedIds, setSolvedIds] = useState<number[]>([]);
  const [inputs, setInputs] = useState<{ [key: number]: string }>({});

  const [finalGuess, setFinalGuess] = useState("");
  const [shakeFinal, setShakeFinal] = useState(false);
  const [almostCount, setAlmostCount] = useState(0);
  const [finalMsg, setFinalMsg] = useState<{ text: string; type: 'error' | 'warning' | 'info' } | null>(null);

  // === 1. POBIERANIE STANU Z BAZY PRZY STARCIE ===
  useEffect(() => {
    const loadState = async () => {
      const { data } = await supabase
        .from('honey_hunt_progress')
        .select('stage_1_clues')
        .eq('guest_id', guestId)
        .single();

      if (data && data.stage_1_clues) {
        // Rzutowanie na tablicę liczb (jsonb w bazie -> number[] w JS)
        const savedIds = data.stage_1_clues as number[];
        setSolvedIds(savedIds);
      }
    };
    loadState();
  }, [guestId]);

  // === 2. FUNKCJA ZAPISUJĄCA STAN ===
  const saveSolvedToDb = async (newSolvedIds: number[]) => {
    // Aktualizujemy tylko kolumnę stage_1_clues
    await supabase
      .from('honey_hunt_progress')
      .update({ stage_1_clues: newSolvedIds })
      .eq('guest_id', guestId);
  };

  const checkQuestion = async (id: number) => {
    const q = QUESTIONS_DATA.find(item => item.id === id);
    if (!q) return;
    const userVal = (inputs[id] || "").trim().toLowerCase();
    
    if (q.valid.some(v => userVal.includes(v))) {
      // SUKCES:
      // 1. Aktualizujemy lokalnie
      const newSolved = [...solvedIds, id];
      setSolvedIds(newSolved);
      
      // 2. Zapisujemy w bazie (żeby po odświeżeniu pamiętało)
      await saveSolvedToDb(newSolved);

    } else {
      // BŁĄD:
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

    setShakeFinal(true);
    setTimeout(() => setShakeFinal(false), 500);
    onMistake();

    // 2. GORĄCO
    if (ALMOST_VALID_FINALS.some(v => val.includes(v))) {
      setAlmostCount(prev => prev + 1);
      setFinalMsg({ 
        text: "Gorąco! 🔥 Jesteś bardzo blisko, ale bądź bardziej precyzyjny...", 
        type: 'warning' 
      });
      return;
    }

    // 3. DOBRZE KOMBINUJESZ
    if (A_LITTLE_VALID_FINALS.some(v => val.includes(v))) {
      setFinalMsg({ 
        text: "Dobrze kombinujesz! 🤔 To część planu, ale szukamy głównej aktywności...", 
        type: 'info' 
      });
      return;
    }

    // 4.
    if (BAWDY.some(v => val.includes(v))) {
      setFinalMsg({
        text: "Seriooo?! Ile Ty masz lat? No tak, to generalnie też część planu, ale nie o to chodziło w głównym haśle... 😅"
        , type: 'error'
      });
      return;
    }
    // 5. ZIMNO
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
          Spokojnie, najpewniej nie znasz odpowiedzi na wszystkie pytania.<br/>
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
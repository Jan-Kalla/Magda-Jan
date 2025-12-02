// app/harmonogram/data.tsx
import { 
  PartyPopper, 
  Heart, 
  Utensils, 
  Music, 
  Camera, 
  Mic2, 
  Clapperboard 
} from "lucide-react";

export type TimelineEvent = {
  id: number;
  time: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: "act" | "event" | "party";
  details?: string;
};

export const scheduleData: TimelineEvent[] = [
  {
    id: 1,
    time: "AKT I",
    title: "Ruch i Integracja",
    description: "Rozpoczynamy naszą wspólną przygodę. Czas się poznać i rozruszać!",
    icon: <PartyPopper className="w-6 h-6 text-[#FAD6C8]" />,
    type: "act",
  },
  {
    id: 2,
    time: "14:00",
    title: "Wielkie Otwarcie & Życzenia",
    description: "Powitanie w Starej Szwajcarii. To idealny moment na uściski i pierwsze zdjęcia.",
    icon: <Heart className="w-5 h-5 text-white" />,
    type: "event",
  },
  {
    id: 3,
    time: "15:00",
    title: "Uczta Weselna",
    description: "Dwudaniowy obiad, który da nam siłę na resztę nocy.",
    details: "Szef kuchni przygotował dla Was wyjątkowe menu (pamiętacie ankiety?). Spokojnie, nikt nie wyjdzie głodny!",
    icon: <Utensils className="w-5 h-5 text-white" />,
    type: "event",
  },
  {
    id: 4,
    time: "16:00",
    title: "Pierwszy Taniec",
    description: "Oficjalne otwarcie parkietu. Mamy nadzieję, że nie pomylimy kroków!",
    icon: <Music className="w-5 h-5 text-white" />,
    type: "event",
  },
  {
    id: 5,
    time: "AKT II",
    title: "Nostalgia i Anegdoty",
    description: "Chwila oddechu i powrót do przeszłości. Przygotujcie chusteczki (ze śmiechu).",
    icon: <Camera className="w-6 h-6 text-[#FAD6C8]" />,
    type: "act",
  },
  {
    id: 6,
    time: "17:30",
    title: "Czas na tort i kawę",
    description: "Słodkie doładowanie cukrem przed dalszą zabawą.",
    icon: <Utensils className="w-5 h-5 text-white" />,
    type: "event",
  },
  {
    id: 7,
    time: "18:30",
    title: "Wasze 5 minut",
    description: "Dedykacje, krótkie przemowy i luźne rozmowy przy stolikach.",
    details: "To ten moment, kiedy wujek Janusz może opowiedzieć tę historię z '98 roku. Jesteśmy na to (chyba) gotowi.",
    icon: <Mic2 className="w-5 h-5 text-white" />,
    type: "event",
  },
  {
    id: 8,
    time: "AKT III",
    title: "Multimedialny Ping-Pong",
    description: "Interaktywne show, jakiego nie widzieliście. Wy oglądacie, my komentujemy.",
    icon: <Clapperboard className="w-6 h-6 text-[#FAD6C8]" />,
    type: "act",
  },
  {
    id: 9,
    time: "20:00",
    title: "Seans Filmowy z Komentarzem",
    description: "Film -> Stop -> Komentarz na żywo -> Start.",
    details: "Przygotowaliśmy dla Was filmową podróż. Ale to nie jest zwykły film. Będziemy go zatrzymywać, by dodać kontekst, wyjaśnić niejasności i zdradzić kulisy. Bądźcie czujni!",
    icon: <Clapperboard className="w-5 h-5 text-white" />,
    type: "event",
  },
  {
    id: 10,
    time: "AKT IV",
    title: "Czyste Kino i Emocje",
    description: "Finał części oficjalnej. Tradycja miesza się z nowoczesnością.",
    icon: <Heart className="w-6 h-6 text-[#FAD6C8]" />,
    type: "act",
  },
  {
    id: 11,
    time: "22:30",
    title: "Ciepła kolacja: Płonące Prosię",
    description: "Jan obiecał, że zje jak koń, ale dla Was też wystarczy!",
    icon: <Utensils className="w-5 h-5 text-white" />,
    type: "event",
  },
  {
    id: 12,
    time: "00:00",
    title: "Oczepiny & Podziękowania",
    description: "Tradycji musi stać się zadość. Rzucamy bukietem i muchą.",
    icon: <PartyPopper className="w-5 h-5 text-white" />,
    type: "event",
  },
  {
    id: 13,
    time: "01:00 - 06:00",
    title: "Afterparty & Hardcore Dancing",
    description: "Dla najwytrwalszych graczy. Muzyka, luźne zabawy i barszczyk nad ranem.",
    icon: <Music className="w-5 h-5 text-white" />,
    type: "party",
  },
];
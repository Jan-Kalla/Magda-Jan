import { 
  PartyPopper, 
  Heart, 
  Utensils, 
  Music, 
  Mic2, 
  Clapperboard,
  Users,
  Star,
  Cake
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
  // --- TRADYCYJNY POCZĄTEK ---
  {
    id: 1,
    time: "14:00",
    title: "Przyjazd i Powitanie",
    description: "Spotykamy się wszyscy w Starej Szwajcarii. Czas na życzenia, uściski i pierwsze wspólne zdjęcia.",
    icon: <Heart className="w-5 h-5 text-white" />,
    type: "event",
  },
  {
    id: 2,
    time: "15:00",
    title: "Uroczysty Obiad",
    description: "Dwudaniowy posiłek, który da nam siłę na nadchodzącą noc.",
    details: "Szef kuchni przygotował menu zgodnie z Waszymi wyborami w ankiecie.",
    icon: <Utensils className="w-5 h-5 text-white" />,
    type: "event",
  },
  {
    id: 3,
    time: "16:00",
    title: "Pierwszy Taniec",
    description: "Oficjalne otwarcie parkietu. Mamy nadzieję, że nie pomylimy kroków! Zaraz po nim ruszamy z zabawą.",
    icon: <Music className="w-5 h-5 text-white" />,
    type: "event",
  },

  // --- AKT I ---
  {
    id: 4,
    time: "17:00",
    title: "Akt I: Ruch i Integracja",
    description: "Pierwsza niespodzianka wieczoru.",
    details: "...",
    icon: <Users className="w-6 h-6 text-[#FAD6C8]" />, 
    type: "act",
  },

  // --- ZABAWA I DESER ---
  {
    id: 11,
    time: "18:00",
    title: "Słodka chwila",
    description: "Czas na kawę i pyszne ciasto.",
    icon: <Utensils className="w-5 h-5 text-white" />,
    type: "event",
  },
  
  // --- AKT II ---
  {
    id: 5,
    time: "19:00",
    title: "Akt II: Nostalgia i Anegdoty",
    description: "Podróż w czasie do lat szkolnych i studenckich.",
    details: "...",
    icon: <Mic2 className="w-6 h-6 text-[#FAD6C8]" />, 
    type: "act",
  },
  
  {
    id: 12,
    time: "20:00",
    title: "Wjazd Tortu",
    description: "Oficjalne krojenie tortu weselnego.",
    icon: <Cake className="w-5 h-5 text-white" />,
    type: "event",
  },

  // --- AKT III ---
  {
    id: 6,
    time: "21:00",
    title: "Akt III: Multimedialny Ping-Pong",
    description: "Rodzinne starcie na ekranie.",
    details: "...",
    icon: <Clapperboard className="w-6 h-6 text-[#FAD6C8]" />, 
    type: "act",
  },

  {
    id: 10,
    time: "23:00",
    title: "Wielki Turniej - Edycja II",
    description: "Jeżeli masz na tym weselu osobę do pary, to już teraz ćwiczcie sprawność motoryczną ;)",
    icon: <PartyPopper className="w-5 h-5 text-white" />,
    type: "event",
  },

  // --- AKT IV ---
  {
    id: 7,
    time: "23:30",
    title: "Akt IV: Czyste Kino i Emocje",
    description: "Najważniejszy moment wieczoru tuż przed północą.",
    details: "Prosimy o przygotowanie chusteczek.",
    icon: <Star className="w-6 h-6 text-[#FAD6C8]" />, 
    type: "act",
  },

  // --- FINAŁ I NOC ---
  {
    id: 8,
    time: "00:00",
    title: "Oczepiny",
    description: "Tradycji musi stać się zadość! Rzut bukietem, muchą i garść zabaw weselnych.",
    icon: <PartyPopper className="w-5 h-5 text-white" />,
    type: "event",
  },
  {
    id: 9,
    time: "01:00 - 06:00",
    title: "Afterparty",
    description: "Czas dla najwytrwalszych graczy. Luźne tańce, rozmowy i zabawa do białego rana.",
    icon: <Music className="w-5 h-5 text-white" />,
    type: "party",
  },
];
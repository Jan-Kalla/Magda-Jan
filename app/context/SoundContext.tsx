"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

type SoundType = "click" | "ticking" | "success" | "shutter" | "hover";

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (type: SoundType) => void;
  stopSound: (type: SoundType) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Web Audio API Context
  const audioCtxRef = useRef<AudioContext | null>(null);
  // Bufor (Pamięć RAM) na dźwięki - dzięki temu odpalają się w 0ms
  const buffersRef = useRef<Record<string, AudioBuffer>>({});
  // Referencje do aktualnie grających źródeł (żeby móc je zatrzymać, np. tykanie)
  const activeSourcesRef = useRef<Record<string, AudioBufferSourceNode>>({});

  // 1. INICJALIZACJA I ŁADOWANIE PLIKÓW DO PAMIĘCI
  useEffect(() => {
    // Tworzymy kontekst Audio tylko raz
    const CtxClass = (window.AudioContext || (window as any).webkitAudioContext);
    const ctx = new CtxClass();
    audioCtxRef.current = ctx;

    // Lista plików do załadowania
    const soundsToLoad: Record<string, string> = {
      "timer": "/sounds/ui/timer.mp3",
      "hover": "/sounds/ui/hover.mp3",
      "click-1": "/sounds/ui/click1.mp3",
      "click-2": "/sounds/ui/click2.mp3",
      "click-3": "/sounds/ui/click3.mp3",
      "click-4": "/sounds/ui/click4.mp3",
    };

    // Funkcja pobierająca i dekodująca plik
    const loadSound = async (key: string, url: string) => {
      try {
        const response = await fetch(url);
        
        // 1. Sprawdź czy plik w ogóle istnieje (Status 200 OK)
        if (!response.ok) {
          throw new Error(`Błąd sieci: ${response.status} ${response.statusText}`);
        }

        // 2. Sprawdź czy to na pewno audio (opcjonalne, ale pomocne)
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("text/html")) {
           throw new Error(`Pobrano stronę HTML zamiast pliku audio! Sprawdź ścieżkę do pliku.`);
        }

        const arrayBuffer = await response.arrayBuffer();
        
        // 3. Dekodowanie
        const decodedBuffer = await ctx.decodeAudioData(arrayBuffer);
        buffersRef.current[key] = decodedBuffer;
        
      } catch (err) {
        // Tu zobaczysz w konsoli dokładnie, który plik robi problem
        console.error(`❌ BŁĄD ładowania dźwięku: "${key}" (URL: ${url})`, err);
      }
    };

    // Ładujemy wszystko równolegle
    Promise.all(
      Object.entries(soundsToLoad).map(([key, url]) => loadSound(key, url))
    ).then(() => {
      setIsReady(true);
      console.log("Audio System Ready 🔊");
    });

    return () => {
      ctx.close();
    };
  }, []);

  // 2. FUNKCJA ODTWARZANIA (Niskopoziomowa)
  const playSound = useCallback((type: SoundType) => {
    if (isMuted || !audioCtxRef.current || !isReady) return;

    const ctx = audioCtxRef.current;

    // Przeglądarki usypiają AudioContext do pierwszej interakcji. Budzimy go.
    if (ctx.state === "suspended") {
      ctx.resume();
    }

   let bufferKey: string = type;
    let volume = 1.0;
    let playbackRate = 1.0;
    let loop = false;

    // LOGIKA LOSOWANIA I GŁOŚNOŚCI
    if (type === "click") {
      // Losujemy wariant
      const variant = Math.floor(Math.random() * 4) + 1;
      bufferKey = `click-${variant}`;
      
      // Losowy pitch (wysokość dźwięku) dla realizmu
      playbackRate = 0.95 + Math.random() * 0.1;

      // Specjalna głośność dla click3 (jak ustalałeś wcześniej)
      volume = variant === 3 ? 1.0 : 0.5;
    
    } else if (type === "ticking") {
      volume = 0.4; // Głośność tykania ustawiamy tutaj bazowo, ale Timer ją nadpisuje swoim volume
      loop = true;  // Zapętlamy
    } else {
      volume = 0.5;
    }

    // Pobieramy zdekodowany dźwięk z pamięci
    const buffer = buffersRef.current[bufferKey];
    if (!buffer) return;

    // Tworzymy źródło dźwięku
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;
    source.playbackRate.value = playbackRate;

    // Tworzymy węzeł głośności (GainNode)
    const gainNode = ctx.createGain();
    gainNode.gain.value = volume;

    // Łączymy: Źródło -> Głośność -> Głośniki
    source.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Start!
    source.start(0);

    // Zapisujemy referencję (tylko dla długich dźwięków, żeby móc je zatrzymać)
    if (type === "ticking") {
      // Jeśli coś już tykało, zatrzymaj to najpierw
      if (activeSourcesRef.current["ticking"]) {
        try { activeSourcesRef.current["ticking"].stop(); } catch(e){}
      }
      activeSourcesRef.current["ticking"] = source;
    }
  }, [isMuted, isReady]);

  // 3. FUNKCJA ZATRZYMYWANIA
  const stopSound = useCallback((type: SoundType) => {
    const source = activeSourcesRef.current[type];
    if (source) {
      try {
        source.stop();
      } catch (e) {
        // Ignorujemy błędy, jeśli dźwięk już się skończył
      }
      delete activeSourcesRef.current[type];
    }
  }, []);

  const toggleMute = () => {
    // Przy odciszaniu musimy upewnić się, że kontekst jest aktywny
    if (isMuted && audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }
    setIsMuted((prev) => !prev);
  };

  // 4. GLOBALNY LISTENER - ZMIANA NA POINTERDOWN (SZYBSZE NIŻ CLICK)
  useEffect(() => {
    const handleGlobalInteraction = () => {
      // Budzimy kontekst przy pierwszym dotknięciu
      if (audioCtxRef.current?.state === "suspended") {
        audioCtxRef.current.resume();
      }
      playSound("click");
    };

    // Używamy 'pointerdown' zamiast 'click'. 
    // 'click' czeka na puszczenie przycisku myszy. 'pointerdown' działa natychmiast po wciśnięciu.
    window.addEventListener("pointerdown", handleGlobalInteraction);
    
    return () => window.removeEventListener("pointerdown", handleGlobalInteraction);
  }, [playSound]);

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, playSound, stopSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error("useSound must be used within a SoundProvider");
  return context;
};
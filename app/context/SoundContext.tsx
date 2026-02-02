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
  const buffersRef = useRef<Record<string, AudioBuffer>>({});
  const activeSourcesRef = useRef<Record<string, AudioBufferSourceNode>>({});
  
  // Ref do śledzenia ostatniego elementu hover
  const lastHoveredRef = useRef<Element | null>(null);

  // 1. WCZYTYWANIE USTAWIEŃ Z LOCALSTORAGE (Nowość)
  useEffect(() => {
    // Sprawdzamy, czy w przeglądarce jest zapisane ustawienie
    const savedMuteState = localStorage.getItem("wedding_isMuted");
    
    if (savedMuteState === "true") {
      setIsMuted(true);
    }
  }, []);

  // 2. INICJALIZACJA AUDIO
  useEffect(() => {
    const CtxClass = (window.AudioContext || (window as any).webkitAudioContext);
    const ctx = new CtxClass();
    audioCtxRef.current = ctx;

    const soundsToLoad: Record<string, string> = {
      "hover":   "/sounds/ui/hover.mp3",
      "click-1": "/sounds/ui/click1.mp3",
      "click-2": "/sounds/ui/click2.mp3",
      "click-3": "/sounds/ui/click3.mp3",
      "click-4": "/sounds/ui/click4.mp3",
    };

    const loadSound = async (key: string, url: string) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          console.warn(`⚠️ Brak pliku dźwiękowego: ${url}`);
          return; 
        }
        const arrayBuffer = await response.arrayBuffer();
        const decodedBuffer = await ctx.decodeAudioData(arrayBuffer);
        buffersRef.current[key] = decodedBuffer;
      } catch (err) {
        console.error(`❌ BŁĄD ładowania dźwięku: "${key}"`, err);
      }
    };

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

  // 3. ODTWARZANIE
  const playSound = useCallback((type: SoundType) => {
    // Jeśli wyciszone - nie graj (nawet nie sprawdzaj reszty)
    if (isMuted || !audioCtxRef.current || !isReady) return;

    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    let bufferKey: string = type;
    let volume = 1.0;
    let playbackRate = 1.0;
    let loop = false;

    // --- KONFIGURACJA DŹWIĘKÓW ---
    if (type === "click") {
      const variant = Math.floor(Math.random() * 4) + 1;
      bufferKey = `click-${variant}`;
      playbackRate = 0.95 + Math.random() * 0.1;
      volume = variant === 3 ? 1.0 : 0.5;
    
    } else if (type === "ticking") {
      volume = 0.4;
      loop = true;

    } else if (type === "hover") {
      volume = 0.15; 
      playbackRate = 1.2 + Math.random() * 0.1; 

    } else {
      volume = 0.5;
    }

    const buffer = buffersRef.current[bufferKey];
    if (!buffer) return;

    // Anti-Machine-Gun dla Hovera
    if (type === "hover" && activeSourcesRef.current["last-hover"]) {
       try { activeSourcesRef.current["last-hover"].stop(); } catch(e){}
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;
    source.playbackRate.value = playbackRate;

    const gainNode = ctx.createGain();
    gainNode.gain.value = volume;

    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    source.start(0);

    if (type === "ticking") {
      if (activeSourcesRef.current["ticking"]) {
        try { activeSourcesRef.current["ticking"].stop(); } catch(e){}
      }
      activeSourcesRef.current["ticking"] = source;
    } else if (type === "hover") {
      activeSourcesRef.current["last-hover"] = source;
    }

  }, [isMuted, isReady]);

  const stopSound = useCallback((type: SoundType) => {
    const source = activeSourcesRef.current[type];
    if (source) {
      try { source.stop(); } catch (e) {}
      delete activeSourcesRef.current[type];
    }
  }, []);

  // 4. PRZEŁĄCZANIE WYCISZENIA + ZAPIS DO LOCALSTORAGE
  const toggleMute = () => {
    // Jeśli odciszamy, musimy upewnić się, że kontekst wstanie
    if (isMuted && audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }

    setIsMuted((prev) => {
      const newState = !prev;
      // Zapisujemy nowy stan do pamięci przeglądarki
      localStorage.setItem("wedding_isMuted", String(newState));
      return newState;
    });
  };

  // 5. GLOBALNE NASŁUCHIWANIE
  useEffect(() => {
    const handleGlobalClick = () => {
      if (audioCtxRef.current?.state === "suspended") audioCtxRef.current.resume();
      playSound("click");
    };

    const handleGlobalHover = (e: MouseEvent) => {
      const target = e.target as Element;
      const interactiveElement = target.closest("button, a, input, [role='button']");

      if (interactiveElement) {
        if (interactiveElement !== lastHoveredRef.current) {
          lastHoveredRef.current = interactiveElement;
          playSound("hover");
        }
      } else {
        lastHoveredRef.current = null;
      }
    };

    window.addEventListener("pointerdown", handleGlobalClick);
    window.addEventListener("mouseover", handleGlobalHover);
    
    return () => {
      window.removeEventListener("pointerdown", handleGlobalClick);
      window.removeEventListener("mouseover", handleGlobalHover);
    };
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
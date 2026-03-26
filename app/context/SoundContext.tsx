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
  
  // Refs do śledzenia stanu urządzeń wejściowych
  const lastHoveredRef = useRef<Element | null>(null);
  const lastPointerType = useRef<string>("mouse"); 

  // 1. WCZYTYWANIE USTAWIEŃ Z LOCALSTORAGE
  useEffect(() => {
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
      "click-3": "/sounds/ui/click.mp3",
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
    if (isMuted || !audioCtxRef.current || !isReady) return;

    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    let bufferKey: string = type;
    let volume = 0.7;
    let playbackRate = 1.0;
    let loop = false;
    
    // --- KONFIGURACJA DŹWIĘKÓW ---
    if (type === "click") {
      // Losujemy 1 z 4 dostępnych plików kliknięcia
      const variant = Math.floor(Math.random() * 4) + 1;
      bufferKey = `click-${variant}`;
      
      // ZMIANA: Losowanie modyfikatora tonu (0 = normalny, 1 = niższy, 2 = wyższy)
      const pitchModifier = Math.floor(Math.random() * 5);
      
      if (pitchModifier === 1) {
        playbackRate = 0.75; // Zauważalnie niższy ton
      } else if (pitchModifier === 2) {
        playbackRate = 1.25; // Zauważalnie wyższy ton
      } else if (pitchModifier === 3) {
        playbackRate = 0.87; // Lżeśnie niższy ton
      } else if (pitchModifier === 4) {
        playbackRate = 1.13; // Lżeśnie wyższy ton
      } else {
        playbackRate = 1.0; // Normalny ton
      }

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

  // 4. PRZEŁĄCZANIE WYCISZENIA
  const toggleMute = () => {
    if (isMuted && audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }

    setIsMuted((prev) => {
      const newState = !prev;
      localStorage.setItem("wedding_isMuted", String(newState));
      return newState;
    });
  };

  // 5. GLOBALNE NASŁUCHIWANIE
  useEffect(() => {
    
    const handlePointerDown = (e: PointerEvent) => {
      lastPointerType.current = e.pointerType || "mouse"; 
      if (audioCtxRef.current?.state === "suspended") audioCtxRef.current.resume();

      // ZMIANA: Ignoruj kliknięcia (chrumknięcia) na elementach z klasą .no-global-click
      const target = e.target as Element;
      if (target?.closest(".no-global-click")) return;

      if (lastPointerType.current === "mouse") {
        playSound("click");
      }
    };

    const handleGlobalClick = (e: MouseEvent) => {
      if (audioCtxRef.current?.state === "suspended") audioCtxRef.current.resume();

      // ZMIANA: Ignoruj kliknięcia (chrumknięcia) na elementach z klasą .no-global-click
      const target = e.target as Element;
      if (target?.closest(".no-global-click")) return;

      if (lastPointerType.current === "touch" || lastPointerType.current === "pen") {
        const interactiveElement = target.closest("button, a, input, [role='button'], .cursor-pointer");

        if (interactiveElement) {
          playSound("click");
        }
      }
    };

    const handleGlobalHover = (e: MouseEvent) => {
      if (lastPointerType.current === "touch" || lastPointerType.current === "pen") return;

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

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("click", handleGlobalClick);
    window.addEventListener("mouseover", handleGlobalHover);
    
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("click", handleGlobalClick);
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
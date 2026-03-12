"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useGuest } from "@/app/context/GuestContext";
import Image from "next/image";

export default function CustomCursor() {
  const { guest } = useGuest();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  const [isClicking, setIsClicking] = useState(false);
  const [isPulseLarge, setIsPulseLarge] = useState(false);
  
  const isLargeRef = useRef(false);
  
  // 1. Logika pozycji myszy
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // 2. Fizyka sprężyny
  const springConfig = { damping: 25, stiffness: 400 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    // ZMIANA: Funkcja sprawdzająca, co dokładnie znajduje się pod wskaźnikiem myszy
    const checkHoverState = (clientX: number, clientY: number, targetElement?: HTMLElement) => {
      // Jeśli mamy target z eventu to go używamy, w przeciwnym razie skanujemy koordynaty
      const el = targetElement || (document.elementFromPoint(clientX, clientY) as HTMLElement);
      if (el) {
        const interactiveElement = el.closest("a, button, input, select, textarea, [role='button'], .cursor-pointer");
        setIsHovering(!!interactiveElement);
      }
    };

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
      
      // ZMIANA: Sprawdzamy stan najechania przy każdym ruchu (mousemove), a nie tylko na wejściu (mouseover)
      checkHoverState(e.clientX, e.clientY, e.target as HTMLElement);
    };

    const handleMouseDown = () => setIsClicking(true);
    
    const handleMouseUp = (e: MouseEvent) => {
      setIsClicking(false);
      
      // ZMIANA: Gdy użytkownik kliknie, DOM ulega zmianie (usunięcie klasy cursor-pointer z tła).
      // Dajemy systemowi 100ms na zaktualizowanie HTMLa i sprawdzamy ponownie, by wyłączyć pulsowanie.
      setTimeout(() => {
        checkHoverState(e.clientX, e.clientY);
      }, 100);
    };

    // Nasłuchiwacze (usunięto stary mouseover, by nie duplikować zapytań)
    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isVisible]);

  // Funkcja wyłapująca fazę pulsowania świnki
  const handleAnimationUpdate = (latest: { scale?: number }) => {
    if (latest.scale !== undefined) {
      const currentIsLarge = latest.scale > 1.075;
      if (currentIsLarge !== isLargeRef.current) {
        isLargeRef.current = currentIsLarge;
        setIsPulseLarge(currentIsLarge);
      }
    }
  };

  // 3. Wykrywanie płci
  const isFemale = guest?.first_name?.trim().endsWith("a");
  
  const frame1 = isFemale ? "/cursors/madzi.jpg" : "/cursors/swinia1.png";
  const frame2 = isFemale ? "/cursors/madzi.jpg" : "/cursors/swinia2.png"; 

  const cursorImage = (isClicking || (isHovering && isPulseLarge)) ? frame2 : frame1;

  return (
    <>
      <style jsx global>{`
        @media (min-width: 768px) {
          * {
            cursor: none !important;
          }
        }
      `}</style>

      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
        style={{
          x,
          y,
        }}
      >
        <motion.div
          className="origin-top-left"
          animate={{ scale: isHovering ? [1, 1.15, 1] : 1 }}
          transition={{ 
            duration: isHovering ? 1.2 : 0.3, 
            repeat: isHovering ? Infinity : 0, 
            ease: "easeInOut" 
          }}
          onUpdate={handleAnimationUpdate}
        >
          <Image
            src={cursorImage}
            alt="Kursor"
            width={64}  
            height={64}
            className="drop-shadow-lg" 
            priority
          />
        </motion.div>
      </motion.div>
    </>
  );
}
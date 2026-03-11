"use client";

// ZMIANA: Dodano useRef do importów
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useGuest } from "@/app/context/GuestContext";
import Image from "next/image";

export default function CustomCursor() {
  const { guest } = useGuest();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  // ZMIANA: Nowe stany do obsługi klikania i fazy animacji
  const [isClicking, setIsClicking] = useState(false);
  const [isPulseLarge, setIsPulseLarge] = useState(false);
  
  // Referencja zapobiegająca niepotrzebnym renderowaniom podczas animacji
  const isLargeRef = useRef(false);
  
  // 1. Logika pozycji myszy
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // 2. Fizyka sprężyny
  const springConfig = { damping: 25, stiffness: 400 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveElement = target.closest("a, button, input, select, textarea, [role='button'], .cursor-pointer");
      
      if (interactiveElement) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    // ZMIANA: Funkcje wykrywające wciśnięcie i puszczenie LPM
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [mouseX, mouseY, isVisible]);

  // ZMIANA: Funkcja wyłapująca moment, gdy kursor podczas pulsowania jest "większy" (powyżej połowy skali)
  const handleAnimationUpdate = (latest: { scale?: number }) => {
    if (latest.scale !== undefined) {
      // Skala pulsuje od 1 do 1.15. Wartość 1.075 to dokładnie połowa tego cyklu.
      const currentIsLarge = latest.scale > 1.075;
      if (currentIsLarge !== isLargeRef.current) {
        isLargeRef.current = currentIsLarge;
        setIsPulseLarge(currentIsLarge);
      }
    }
  };

  // 3. Wykrywanie płci
  const isFemale = guest?.first_name?.trim().endsWith("a");
  
  // ZMIANA: Dwie osobne klatki animacji!
  // PS. Jeśli w przyszłości dodasz "madzi2.jpg" z otwartymi ustami, wystarczy wpisać to poniżej zamiast powielać "madzi.jpg"
  const frame1 = isFemale ? "/cursors/madzi.jpg" : "/cursors/swinia1.png";
  const frame2 = isFemale ? "/cursors/madzi.jpg" : "/cursors/swinia2.png"; 

  // Świnia otwiera ryjek, jeśli użytkownik klika LPM *ALBO* (najechał na przycisk i świnia jest w fazie bycia dużą)
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
          // ZMIANA: Nasłuchujemy zmian skali na żywo w trakcie animacji
          onUpdate={handleAnimationUpdate}
        >
          <Image
            // ZMIANA: Źródło obrazka jest teraz dynamiczne!
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
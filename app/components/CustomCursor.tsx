"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useGuest } from "@/app/context/GuestContext";
import Image from "next/image";

export default function CustomCursor() {
  const { guest } = useGuest();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
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

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible]);

  // 3. Wykrywanie płci
  const isFemale = guest?.first_name?.trim().endsWith("a");
  const cursorImage = isFemale ? "/cursors/madzi.jpg" : "/cursors/winia_.png";

  return (
    <>
      {/* ZMIANA: Zastosowano selektor uniwersalny *, aby nadpisać WSZYSTKIE klasy wymuszające wskaźnik (np. cursor-pointer) */}
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
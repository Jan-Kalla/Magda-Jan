"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useGuest } from "@/app/context/GuestContext";
import Image from "next/image";

export default function CustomCursor() {
  const { guest } = useGuest();
  const [isVisible, setIsVisible] = useState(false);
  
  // 1. Logika pozycji myszy (Framer Motion dla płynności)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // 2. Fizyka sprężyny (Spring) - kursor będzie "pływał" za myszką
  const springConfig = { damping: 25, stiffness: 400 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      // Pokaż kursor dopiero po pierwszym ruchu myszą
      if (!isVisible) setIsVisible(true);
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [mouseX, mouseY, isVisible]);

  // 3. Wykrywanie płci na podstawie imienia (Polska zasada: kończy się na "a" = kobieta)
  // Wyjątek: Kuba (ale to rzadki przypadek w oficjalnych zaproszeniach, zazwyczaj Jakub)
  const isFemale = guest?.first_name?.trim().endsWith("a");
  
  // Domyślnie świnka, jeśli nie rozpoznano
  const cursorImage = isFemale ? "/cursors/swinia.png" : "/cursors/dzik.png";

  // Ukrywamy customowy kursor na telefonach i tabletach (dotyk)
  return (
    <>
      {/* Globalny styl ukrywający systemowy kursor TYLKO na desktopie */}
      <style jsx global>{`
        @media (min-width: 768px) {
          body, a, button, input, select, textarea {
            cursor: none !important;
          }
        }
      `}</style>

      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
        style={{
          x,
          y,
          translateX: "-50%", // Wyśrodkowanie główki względem grota myszy
          translateY: "-50%",
        }}
      >
        {/* Animacja "pulsowania" główki dla efektu życia */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Upewnij się, że masz pliki w public/cursors/ */}
          <Image
            src={cursorImage}
            alt="Kursor"
            width={48}  // Dostosuj wielkość
            height={48}
            className="drop-shadow-lg" // Cień dla lepszej widoczności
            priority
          />
        </motion.div>
      </motion.div>
    </>
  );
}
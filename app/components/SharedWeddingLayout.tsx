"use client";

import Navbar from "./Navbar";
import Timer from "./Timer";
import PolaroidSection from "./PolaroidSection";
import ChurchSection from "./ChurchSection";
import MapSection from "./MapSection";
import Footer from "./Footer";
import PageWrapper from "./PageWrapper"; 
import OrganicGlassPattern from "./OrganicGlassPattern"; 
import AboutSection from "./AboutSection"; 
import Image from "next/image";
import { useGuest } from "@/app/context/GuestContext";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import CustomCursor from "./CustomCursor";
import ProfilesSection from "./ProfilesSection";
import { usePathname } from "next/navigation";

export default function SharedWeddingLayout({ 
  showNavbar = true, 
  children 
}: { 
  showNavbar?: boolean;
  children?: React.ReactNode; 
}) {
  const { guest, loading } = useGuest();
  
  const [isMounted, setIsMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const [bgImageLoaded, setBgImageLoaded] = useState(false);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  
  const [greeting, setGreeting] = useState("Cześć");
  
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const handleBeforeUnload = () => {
      if (window.location.pathname === "/" || window.location.pathname === "/guest") {
        sessionStorage.removeItem("siteUnlocked");
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    const isStartPage = pathname === "/" || pathname === "/guest";

    if (!isStartPage) {
      setIsUnlocked(true);
      sessionStorage.setItem("siteUnlocked", "true");
    } else {
      if (sessionStorage.getItem("siteUnlocked") === "true") {
        setIsUnlocked(true);
      } else {
        setIsUnlocked(false);
      }
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [pathname]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 3 && hour < 18) {
      setGreeting("Dzień dobry");
    } else {
      setGreeting("Dobry wieczór");
    }
  }, []);

  useEffect(() => {
    if (isMounted && !loading) {
      const t = setTimeout(() => setReady(true), 300);
      
      const fallback = setTimeout(() => {
        setBgImageLoaded(true);
        setHeroImageLoaded(true);
      }, 5000);

      return () => {
        clearTimeout(t);
        clearTimeout(fallback);
      };
    }
  }, [isMounted, loading]);

  const handleUnlock = () => {
    setIsUnlocked(true);
    sessionStorage.setItem("siteUnlocked", "true");
  };

  const isAppLoading = !isMounted || loading || !ready || !bgImageLoaded || !heroImageLoaded;

  return (
    <>
      <CustomCursor />

      <AnimatePresence>
        {isAppLoading && (
          <motion.div
            key="global-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="flex items-center justify-center w-full h-[100svh] bg-[#FDF9EC] text-[#4E0113] text-lg fixed inset-0 z-[9999]"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
              className="font-serif tracking-widest"
            >
              Ładowanie strony...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showNavbar && isUnlocked && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 w-full z-[100]"
          >
            <Navbar />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed top-[72px] left-0 w-full h-[calc(100lvh-72px)] -z-20">
        <Image 
          src="/fotki/raczki.jpg" 
          alt="Tło szczeliny" 
          fill 
          priority 
          className="object-cover object-top md:object-center" 
          onLoad={() => setBgImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-black/20" /> 
      </div>

      <div className="fixed top-[72px] left-0 w-full h-[calc(100lvh-72px)] pointer-events-none z-[60]">
        <div className="absolute inset-0 bg-noise opacity-10 md:opacity-[0.6] md:mix-blend-overlay" />
      </div>

      <main className="relative z-10">
        <PageWrapper>
            
            <section 
              className={`relative w-full h-[100svh] flex flex-col items-center justify-center overflow-hidden ${!isUnlocked ? "cursor-pointer" : ""}`}
              onClick={() => !isUnlocked && handleUnlock()}
            >
              <Image 
                src="/fotki/gory_.jpg" 
                alt="Magdalena i Johny - Góry" 
                fill 
                priority
                className="object-cover object-center z-0" 
                onLoad={() => setHeroImageLoaded(true)}
              />
              
              <div className="absolute inset-0 bg-black/20 transition-opacity duration-1000 z-1" />

              <div className="absolute top-24 md:top-32 left-0 w-full z-50 flex flex-col items-center pointer-events-none gap-4">
                
                <AnimatePresence>
                  {isUnlocked && children && (
                    <motion.div 
                      key="guest-login-form"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.6 }}
                      className="pointer-events-auto w-full" 
                      onClick={(e) => e.stopPropagation()} 
                    >
                      {children}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {isUnlocked && guest && (
                    <motion.div 
                      key="guest-greeting-pill"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                      className="pointer-events-auto px-4 w-full max-w-[460px] md:max-w-[580px]"
                    >
                      <div className="relative overflow-hidden bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] flex flex-col justify-center w-full aspect-[3.87/1] min-h-[120px] md:min-h-[140px]">
                        
                        <div className="absolute inset-0 w-full h-full pointer-events-none opacity-90 z-0">
                          <Image 
                            src="/fotki/kawiatki4.png" 
                            alt="Kwiaty" 
                            fill 
                            className="object-cover object-center" 
                          />
                        </div>

                        <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
                          
                          <div className="absolute left-[45%] top-[27%] -translate-x-1/2 -translate-y-1/2">
                            <span className="text-2xl md:text-3xl font-serif text-[#FDF9EC] drop-shadow-md whitespace-nowrap">
                              {greeting},
                            </span>
                          </div>
                          
                          <div className="absolute left-[60%] top-[65%] -translate-x-1/2 -translate-y-1/2 text-center">
                            <span className="text-2xl md:text-3xl font-bold font-sans text-[#FDF9EC] drop-shadow-md tracking-wide whitespace-nowrap">
                              {guest.first_name} {guest.last_name}! 
                            </span>
                          </div>

                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait">
                {!isUnlocked ? (
                  <motion.div
                    key="prompt"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 text-[#FDF9EC] text-center px-4"
                  >
                    <p className="font-script animate-pulse text-5xl md:text-7xl drop-shadow-lg">
                      Kliknij
                    </p>
                  </motion.div>
                ) : (
                  //* ZMIANA: Tytuł odsuwa się na dół (y: 280) TYLKO na stronie logowania dla niezalogowanego gościa */}
                  <motion.div
                    key="title"
                    initial={{ opacity: 0, y: (pathname.includes("guest") && !guest) ? 280 : 0 }}
                    animate={{ opacity: 1, y: (pathname.includes("guest") && !guest) ? 280 : 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10 text-center text-[#FDF9EC] drop-shadow-2xl px-4 -mt-16 md:-mt-24 lg:-mt-32"
                  >
                    <div className="relative inline-block">
                      <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.6 }}
                        className="text-4xl md:text-5xl lg:text-7xl font-serif font-light tracking-widest uppercase z-10"
                      >
                        Magdalena <span className="whitespace-nowrap"><span className="italic pr-1">&amp;</span> Jan</span>
                      </motion.h1>
                      
                      <motion.p 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.0, ease: "easeOut", delay: 1.6 }}
                        className="absolute -bottom-12 md:-bottom-20 right-16 sm:right-20 md:right-24 lg:right-40 text-3xl md:text-4xl lg:text-5xl font-script text-[#FDF9EC] drop-shadow-md z-20 whitespace-nowrap"
                      >
                        Pobieramy się!
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {isUnlocked && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="relative w-full bg-gradient-to-b from-[#FDF9EC] via-[#F6EBE1] to-[#EBBFB8] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
                  
                  <div className="hidden md:block">
                    <OrganicGlassPattern part="top" />
                    <div className="absolute top-[0%] left-[-10%] w-[50%] h-[600px] bg-[#FDF9EC] blur-[100px] rounded-full mix-blend-overlay opacity-60 pointer-events-none z-0" />
                    <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[500px] bg-[#EBBFB8] blur-[120px] rounded-full opacity-60 pointer-events-none z-0" />
                    <div className="absolute top-[40%] left-[20%] w-[40%] h-[400px] bg-[#C97B78] blur-[150px] rounded-full opacity-20 mix-blend-multiply pointer-events-none z-0" />
                  </div>

                  <div className="relative z-10 w-full pt-16 md:pt-24 pb-8">
                    <AboutSection />
                    <ProfilesSection />
                    <PolaroidSection />
                  </div>
                </div>

                <Timer />

                <div className="relative w-full bg-gradient-to-b from-[#EBBFB8] from-[0%] via-[#C97B78] via-[45%] to-[#4E0113] to-[90%] overflow-hidden shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
                  
                  <div className="hidden md:block">
                    <OrganicGlassPattern part="bottom" />
                    <div className="absolute bottom-[25%] left-[-10%] w-[50%] h-[500px] bg-[#75897D] blur-[120px] rounded-full opacity-30 pointer-events-none z-0" />
                  </div>
                  
                  <div className="relative z-10">
                    <ChurchSection />
                    <MapSection />
                    <Footer />
                  </div>
                </div>
              </motion.div>
            )}

        </PageWrapper>
      </main>
    </>
  );
}
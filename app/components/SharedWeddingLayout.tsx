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

              {/* ZMIANA: Zamiast "absolute top-24" użyto elastycznego flex-boxa zajmującego całą wysokość, co pozwala na naturalne pozycjonowanie w pionie */}
              <div className="absolute inset-0 pt-24 pb-12 flex flex-col justify-between items-center pointer-events-none z-50 px-4">
                
                {/* GÓRNA CZĘŚĆ (Pigułka / Formularz) */}
                <div className="w-full flex flex-col items-center mt-2 lg:mt-8 shrink-0">
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
                        className="pointer-events-auto w-full max-w-[460px] md:max-w-[580px] flex justify-center"
                      >
                        <div className="relative overflow-hidden bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center w-full min-h-[140px] px-6 py-8 md:px-12 md:py-10">
                          
                          <Image 
                            src="/fotki/kwiatki1.png" 
                            alt="" 
                            width={400}
                            height={400}
                            className="absolute top-0 right-0 w-32 md:w-44 h-auto pointer-events-none z-0 -scale-y-100" 
                          />

                          <Image 
                            src="/fotki/kwiatki3.png" 
                            alt="" 
                            width={400}
                            height={400}
                            className="absolute bottom-0 left-0 w-36 md:w-48 h-auto pointer-events-none z-0 -scale-x-100 -scale-y-100" 
                          />

                         <div className="absolute left-[40%] top-[25%] -translate-x-1/2 -translate-y-1/2">
                              <span className="text-2xl md:text-3xl font-serif text-[#FDF9EC] drop-shadow-md whitespace-nowrap">
                                {greeting},
                              </span>
                            </div>
                            
                            <div className="absolute left-[58%] top-[65%] -translate-x-1/2 -translate-y-1/2 w-[240px] md:w-[320px]">
                              
                              <div className="md:hidden w-full">
                                {guest.first_name.length + guest.last_name.length > 11 ? (
                                  <div className="flex flex-col w-full text-center items-center">
                                    <span className="text-2xl font-bold font-sans text-[#FDF9EC] drop-shadow-md tracking-wide leading-tight -translate-x-4">
                                      {guest.first_name}
                                    </span>
                                    <span className="text-2xl font-bold font-sans text-[#FDF9EC] drop-shadow-md tracking-wide leading-tight mt-2 translate-x-4">
                                      {guest.last_name}!
                                    </span>
                                  </div>
                                ) : (
                                  <div className="text-center w-full">
                                    <span className="text-2xl font-bold font-sans text-[#FDF9EC] drop-shadow-md tracking-wide whitespace-nowrap">
                                      {guest.first_name} {guest.last_name}! 
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="hidden md:block w-full">
                                {guest.first_name.length + guest.last_name.length > 15 ? (
                                  <div className="flex flex-col w-full text-center items-center ">
                                    <span className="text-3xl font-bold font-sans text-[#FDF9EC] drop-shadow-md tracking-wide leading-tight -translate-x-6">
                                      {guest.first_name}
                                    </span>
                                    <span className="text-3xl font-bold font-sans text-[#FDF9EC] drop-shadow-md tracking-wide leading-tight mt-1 translate-x-6">
                                      {guest.last_name}!
                                    </span>
                                  </div>
                                ) : (
                                  <div className="text-center w-full">
                                    <span className="text-3xl font-bold font-sans text-[#FDF9EC] drop-shadow-md tracking-wide whitespace-nowrap">
                                      {guest.first_name} {guest.last_name}! 
                                    </span>
                                  </div>
                              )}
                            </div>

                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ŚRODKOWA CZĘŚĆ (Główny Napis) */}
                <div className="flex-1 flex flex-col justify-center shrink min-h-0 w-full max-w-7xl mx-auto">
                  <AnimatePresence mode="wait">
                    {!isUnlocked ? (
                      <motion.div
                        key="prompt"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                        className="text-[#FDF9EC] text-center"
                      >
                        <p className="font-script animate-pulse text-5xl md:text-7xl drop-shadow-lg">
                          Kliknij
                        </p>

                        </motion.div>

                        ) : (

                        <motion.div

                        key="title"

                        initial={{ opacity: 0, y: (pathname.includes("guest") && !guest) ? 280 : 0 }}

                        animate={{ opacity: 1, y: (pathname.includes("guest") && !guest) ? 280 : 0 }}

                        exit={{ opacity: 0 }}

                        transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}

                        className="relative z-10 text-center text-[#FDF9EC] drop-shadow-2xl px-4 -mt-16 md:-mt-24 lg:-mt-32"

                        >
                        <div className="relative inline-block -mt-40 -md:mt-0 ">
                          <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.6 }}
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-serif font-light tracking-widest uppercase z-10 break-words leading-tight px-2"
                          >
                            Magdalena <span className="whitespace-nowrap"><span className="italic pr-1">&amp;</span> Jan</span>
                          </motion.h1>
                          
                          <motion.p 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.0, ease: "easeOut", delay: 1.6 }}
                            // ZMIANA: Skorygowano pozycję napisu "Pobieramy się" dla lepszej elastyczności
                            className="absolute sm:-bottom-12 md:-bottom-16 right-[10%] sm:right-16 md:right-24 text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-script text-[#FDF9EC] drop-shadow-md z-20 whitespace-nowrap"
                          >
                            Pobieramy się!
                          </motion.p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* DOLNA CZĘŚĆ (pusta, by napisy nie spadały za nisko) */}
                <div className="h-16 shrink-0" />
              </div>
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
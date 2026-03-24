"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import PageWrapper from "@/app/components/PageWrapper";
import RequireGuest from "@/app/components/RequireGuest";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { HeartIcon } from "@heroicons/react/24/solid";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useGuest } from "@/app/context/GuestContext"; // Dodany import kontekstu
import { useRouter } from "next/navigation"; // Dodany import routera

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type HistoryEvent = {
  id: number;
  person: 'magda' | 'jan' | 'shared';
  year: string;
  title: string;
  description: string;
  img_url: string;
};

export default function HistoriaPage() {
  const { guest, loading: guestLoading } = useGuest();
  const router = useRouter();

  const [magdaHistory, setMagdaHistory] = useState<HistoryEvent[]>([]);
  const [janHistory, setJanHistory] = useState<HistoryEvent[]>([]);
  const [sharedHistory, setSharedHistory] = useState<HistoryEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // === STRAŻNIK DOSTĘPU (TYLKO VIP / ADMIN) ===
  useEffect(() => {
    if (!guestLoading && guest && guest.code !== "FC3818") {
      router.replace("/galeria"); // Natychmiast wyrzuca nieuprawnionych
    }
  }, [guest, guestLoading, router]);

  useEffect(() => {
    // Pobieramy dane TYLKO, gdy gość ma uprawnienia
    if (!guest || guest.code !== "FC3818") return;

    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from("history_events")
        .select("*")
        .order("year", { ascending: true }); 

      if (data) {
        setMagdaHistory(data.filter(item => item.person === 'magda'));
        setJanHistory(data.filter(item => item.person === 'jan'));
        setSharedHistory(data.filter(item => item.person === 'shared'));
      }
      setLoading(false);
    };

    fetchHistory();
  }, [guest]);

  const getImageUrl = (pathOrUrl: string) => {
    if (pathOrUrl.startsWith("http") || pathOrUrl.startsWith("/")) return pathOrUrl;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${pathOrUrl}`;
  };

  // Ukrywamy renderowanie podczas przekierowywania "nieproszonych" gości
  if (!guestLoading && guest && guest.code !== "FC3818") {
    return null; 
  }

  return (
    <RequireGuest>
      <div className="flex flex-col min-h-screen relative bg-[#FDF9EC]">
        <Navbar />

        <main className="flex-grow pt-24 md:pt-32 pb-32 overflow-hidden text-[#4c4a1e]">
          <PageWrapper className="max-w-6xl mx-auto w-full px-4 md:px-8">
            
            <div className="mb-8">
              <Link 
                href="/galeria" 
                className="inline-flex items-center gap-2 text-[#4E0113]/70 hover:text-[#4E0113] transition-colors font-serif italic text-lg"
              >
                <ChevronLeftIcon className="w-5 h-5" /> Wróć do Galerii
              </Link>
            </div>

            <header className="text-center mb-24">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-serif font-light text-4xl sm:text-5xl md:text-6xl text-[#4E0113] mb-4 uppercase tracking-widest"
              >
                Nasza Historia
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-sans font-light text-[#4c4a1e]/80 text-lg max-w-2xl mx-auto"
              >
                Zanim nasze drogi splotły się na zawsze, każdy z nas pisał własny scenariusz. Zobaczcie, jak to wszystko się zaczęło.
              </motion.p>
            </header>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-[3px] border-[#4c4a1e]/20 border-t-[#4c4a1e] rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <div className="relative w-full flex flex-col md:flex-row gap-16 md:gap-8 justify-between mb-24 z-10">
                  
                  {/* MAGDA */}
                  <div className="flex-1 relative">
                    <div className="text-center mb-12">
                      <h2 className="font-script text-5xl text-[#C97B78] mb-2">Magda</h2>
                      <div className="h-[1px] w-16 bg-[#C97B78]/40 mx-auto"></div>
                    </div>
                    
                    <div className="space-y-12">
                      {magdaHistory.map((item) => (
                        <motion.div 
                          key={item.id}
                          initial={{ opacity: 0, x: -30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          className="bg-white p-4 rounded-2xl shadow-md border border-[#4c4a1e]/5"
                        >
                          <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-4">
                            <Image src={getImageUrl(item.img_url)} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                          </div>
                          <h3 className="font-serif font-bold text-[#4E0113] text-xl">{item.year} - {item.title}</h3>
                          <p className="font-sans text-sm text-[#4c4a1e]/70 mt-2">{item.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="hidden md:block w-px border-l-2 border-dashed border-[#4E0113]/20 absolute left-1/2 top-16 bottom-0 -translate-x-1/2 -z-10" />

                  {/* JAN */}
                  <div className="flex-1 relative">
                    <div className="text-center mb-12">
                      <h2 className="font-script text-5xl text-[#4c4a1e] mb-2">Johny</h2>
                      <div className="h-[1px] w-16 bg-[#4c4a1e]/40 mx-auto"></div>
                    </div>
                    
                    <div className="space-y-12">
                      {janHistory.map((item) => (
                        <motion.div 
                          key={item.id}
                          initial={{ opacity: 0, x: 30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          className="bg-white p-4 rounded-2xl shadow-md border border-[#4c4a1e]/5"
                        >
                          <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-4">
                            <Image src={getImageUrl(item.img_url)} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                          </div>
                          <h3 className="font-serif font-bold text-[#4c4a1e] text-xl">{item.year} - {item.title}</h3>
                          <p className="font-sans text-sm text-[#4c4a1e]/70 mt-2">{item.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  className="flex justify-center relative z-20 -my-8"
                >
                  <div className="bg-[#FDF9EC] p-4 rounded-full">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#C97B78] to-[#4E0113] rounded-full flex items-center justify-center shadow-xl border-4 border-[#FDF9EC]">
                      <HeartIcon className="w-10 h-10 text-[#FDF9EC] animate-pulse" />
                    </div>
                  </div>
                </motion.div>

                {/* WSPÓLNA HISTORIA */}
                <div className="mt-20 relative max-w-3xl mx-auto">
                  <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-[#4E0113]/20 md:-translate-x-1/2 rounded-full" />

                  <div className="space-y-16">
                    {sharedHistory.map((item, index) => {
                      const isEven = index % 2 === 0;
                      
                      return (
                        <motion.div 
                          key={item.id}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          className={`relative flex flex-col md:flex-row items-center gap-8 ${isEven ? "md:flex-row-reverse" : ""}`}
                        >
                          <div className="absolute left-4 md:left-1/2 w-5 h-5 bg-[#4E0113] rounded-full md:-translate-x-1/2 z-10 border-4 border-[#FDF9EC] shadow-sm" />

                          <div className="hidden md:block flex-1" />

                          <div className="flex-1 w-full pl-12 md:pl-0">
                            <div className="bg-white p-5 md:p-6 rounded-2xl shadow-lg border border-[#4c4a1e]/5 hover:-translate-y-1 transition-transform">
                              <span className="font-serif italic font-bold text-[#C97B78] text-xl mb-2 block">{item.year}</span>
                              <div className="relative aspect-video sm:aspect-[4/3] w-full rounded-xl overflow-hidden mb-4 bg-black/5">
                                <Image src={getImageUrl(item.img_url)} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                              </div>
                              <h3 className="font-serif font-light uppercase tracking-widest text-[#4E0113] text-xl md:text-2xl mb-2">
                                {item.title}
                              </h3>
                              <p className="font-sans text-sm text-[#4c4a1e]/70 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

          </PageWrapper>
        </main>

        <Footer />
      </div>
    </RequireGuest>
  );
}
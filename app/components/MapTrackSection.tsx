"use client";

import { useState } from "react";

// Jeśli masz klucz do Maps Embed API, wrzuć go do env (np. NEXT_PUBLIC_GOOGLE_MAPS_KEY)
const GOOGLE_MAPS_EMBED_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

export default function MapTrackSection() {
  // Domyślnie: osadzamy samą lokalizację Starej Szwajcarii
  const [iframeSrc, setIframeSrc] = useState(
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2559.872844639911!2d18.62930407670107!3d50.30766837149274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4711319f8c6849b3%3A0xc58b39055c51c5d!2sStara%20Szwajcaria!5e0!3m2!1spl!2spl!4v1739386000000!5m2!1spl!2spl"
  );

  // Origin: Mikołów
  const origin = encodeURIComponent(
    "Kościół Rzymskokatolicki pw. św. Piotra i Pawła, Mikołów"
  );
  const destination = encodeURIComponent("Stara Szwajcaria, Gliwice");

  // Otwórz trasę w nowej karcie (pewne, bez klucza API)
  const openDirectionsInNewTab = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Osadź trasę w iframe — tylko jeśli masz klucz API (Maps Embed v1)
  const embedDirectionsWithApiKey = () => {
    if (!GOOGLE_MAPS_EMBED_KEY) {
      // Bez klucza: zostawiamy fallback na otwieranie w nowej karcie
      openDirectionsInNewTab();
      return;
    }
    const url = `https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_MAPS_EMBED_KEY}&origin=${origin}&destination=${destination}&mode=driving`;
    setIframeSrc(url);
  };

  return (
    <div className="flex flex-col items-center my-10">
      <div className="w-[100%] md:w-[1080px] h-[720px] rounded-2xl overflow-hidden shadow-lg border-8 border-[#4E0113]">
        <iframe
          src={iframeSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="mt-6 flex gap-4">
        <button
        onClick={openDirectionsInNewTab}
        className="px-5 py-3 bg-[#4E0113] text-white rounded-lg shadow hover:bg-[#6b1326] transition cursor-pointer"
        >
        wyznacz trasę z kościoła
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

const GOOGLE_MAPS_EMBED_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

export default function MapTrackSection() {
  const [iframeSrc, setIframeSrc] = useState(
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2559.872844639911!2d18.62930407670107!3d50.30766837149274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4711319f8c6849b3%3A0xc58b39055c51c5d!2sStara%20Szwajcaria!5e0!3m2!1spl!2spl!4v1739386000000!5m2!1spl!2spl"
  );

  const origin = encodeURIComponent(
    "Kościół Rzymskokatolicki pw. św. Piotra i Pawła, Mikołów"
  );
  const destination = encodeURIComponent("Stara Szwajcaria, Gliwice");

  const openDirectionsInNewTab = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const embedDirectionsWithApiKey = () => {
    if (!GOOGLE_MAPS_EMBED_KEY) {
      openDirectionsInNewTab();
      return;
    }
    const url = `https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_MAPS_EMBED_KEY}&origin=${origin}&destination=${destination}&mode=driving`;
    setIframeSrc(url);
  };

  return (
    <div className="flex flex-col items-center my-16 px-4">
      <div className="w-full md:w-[1080px] h-[500px] md:h-[720px] rounded-3xl overflow-hidden shadow-2xl border border-white/40 bg-white/20 backdrop-blur-md p-2">
        <iframe
          src={iframeSrc}
          width="100%"
          height="100%"
          className="rounded-2xl"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="mt-8 flex justify-center w-full">
        <button
          onClick={openDirectionsInNewTab}
          className="px-8 py-4 bg-[#2C2B14] text-[#FDF9EC] rounded-xl shadow-lg hover:bg-black transition-all font-serif uppercase tracking-widest font-bold hover:-translate-y-1"
        >
          Wyznacz trasę z kościoła
        </button>
      </div>
    </div>
  );
}
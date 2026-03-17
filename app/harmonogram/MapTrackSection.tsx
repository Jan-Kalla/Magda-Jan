"use client";

export default function MapTrackSection() {
  const destinationForEmbed = encodeURIComponent("Stara Szwajcaria, Łabędzka 6, Gliwice");
  const iframeSrc = `https://maps.google.com/maps?q=${destinationForEmbed}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const origin = encodeURIComponent(
    "Kościół Rzymskokatolicki pw. św. Piotra i Pawła, Mikołów"
  );
  const destination = encodeURIComponent("Stara Szwajcaria, Gliwice");

  const openDirectionsInNewTab = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    // ZMIANA: Klasa "mb-40 md:mb-64" dodaje ogromną przestrzeń pod przyciskiem, 
    // zmuszając jasne tło do ciągnięcia się daleko w dół.
    <div className="flex flex-col items-center mt-32 mb-80 md:mb-128 px-4">
      
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
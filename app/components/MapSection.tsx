export default function MapSection() {
  return (
    // ZMIANA: Usunięto bg-gradient... oraz overflow-hidden
    <section className="relative z-10 px-8 pt-10 pb-24 flex flex-col items-center gap-8 text-[#4E0113]">
      
      {/* --- MESH GRADIENT DLA MAPY --- */}
      <div className="absolute top-[50%] left-[-10%] w-[50%] h-[300px] bg-[#841D30] blur-[140px] rounded-full mix-blend-multiply opacity-40 pointer-events-none" />

      {/* MAPA */}
      <div className="w-full max-w-5xl h-96 rounded-xl overflow-hidden shadow-2xl border-4 border-white/10 relative z-10">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2567.435861597826!2d18.8195421!3d50.2111077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4716cb485ab357c1%3A0xfc642914f2d6cac0!2sKo%C5%9Bci%C3%B3%C5%82%20Rzymskokatolicki%20pw.%20%C5%9Bw.%20Piotra%20i%20Paw%C5%82a!5e0!3m2!1spl!2spl!4v1696600000000!5m2!1spl!2spl"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      
      <a
        href="https://www.google.com/maps/place/Kościół+Rzymskokatolicki+pw.+św.+Piotra+i+Pawła/@50.208576,18.8218448,17z/data=!4m6!3m5!1s0x4716cb485ab357c1:0xfc642914f2d6cac0!8m2!3d50.208576!4d18.8218448!16s%2Fg%2F122qyybm"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 px-8 py-4 bg-[#FAD6C8] text-[#4E0113] rounded-full text-lg font-bold shadow-lg hover:bg-white hover:scale-105 transition-all duration-300 relative z-10"
      >
        Otwórz w Google Maps
      </a>
    </section>
  );
}
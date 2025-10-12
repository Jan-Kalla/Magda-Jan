"use client";

import Navbar from "@/app/components/Navbar";
import { motion } from "framer-motion";

export default function HarmonogramPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAD6C8] to-[#4E0113]">
      <Navbar />

      {/* Sekcja opisu lokalu */}
      <section className="py-16 px-6 text-center text-[#4E0113]">
        <h1 className="text-4xl font-bold mb-6">
          Stara Szwajcaria – Gliwice
        </h1>
        <p className="max-w-3xl mx-auto text-lg opacity-90">
          Stara Szwajcaria lorem ipsum fifa rafa fifa rafa, wiszcy dobrze wiemy co oni tam mają. 
          Czy my to w ogóle musimy przedstawiać? 
          No nie no wiadomo, wypadało by, trzeba czymś zaintrygować gości.
          Powiemy coś o parku, placu zabaw, ale też o dużej sali dla dzieci i może o dwóchsalach do żarcia i tańców.
        </p>
      </section>

{/* Mapka w większym okienku */}
<div className="flex justify-center my-10">
  <div className="w-[100%] md:w-[1080px] h-[720px] rounded-2xl overflow-hidden shadow-lg border-8 border-[#4E0113]">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2560.123456789!2d18.662!3d50.297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471130123456789%3A0xabcdef!2sStara%20Szwajcaria%2C%20%C5%81ab%C4%99dzka%206%2C%20Gliwice!5e0!3m2!1spl!2spl!4v1690000000000"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  </div>
</div>


      {/* Harmonogram */}
      <section className="max-w-3xl mx-auto my-12 px-6 text-[#FAD6C8]">
        <h2 className="text-3xl font-bold text-center mb-8">
          Plan naszego wielkiego dnia
        </h2>
        <ul className="space-y-6 text-lg">
          <li>
            <span className="font-semibold">15:00</span> – Ceremonia w kościele pw. ...
          </li>
          <li>
            <span className="font-semibold">16:30</span> – Powitanie gości w Starej Szwajcarii
          </li>
          <li>
            <span className="font-semibold">17:00</span> – Uroczysty obiad
          </li>
          <li>
            <span className="font-semibold">19:00</span> – Pierwszy taniec
          </li>
          <li>
            <span className="font-semibold">20:00</span> – Zabawa do białego rana 🎉
          </li>
        </ul>
      </section>
    </div>
  );
}

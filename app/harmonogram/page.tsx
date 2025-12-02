"use client";

import Navbar from "@/app/components/Navbar"; 
import MapTrackSection from "./MapTrackSection"; 
import VenueHeroSection from "./VenueHeroSection"; 
import TimelineSection from "./TimelineSection";

export default function HarmonogramPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAD6C8] to-[#4E0113]">
      <Navbar />
      <VenueHeroSection />
      <MapTrackSection />
      <TimelineSection />
    </div>
  );
}
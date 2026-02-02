"use client";

import Navbar from "@/app/components/Navbar"; 
import MapTrackSection from "./MapTrackSection"; 
import VenueHeroSection from "./VenueHeroSection"; 
import TimelineSection from "./TimelineSection";
import Footer from "@/app/components/Footer";
import PageWrapper from "@/app/components/PageWrapper";

export default function HarmonogramPage() {
return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAD6C8] to-[#4E0113]">
      <Navbar />
      
      <PageWrapper>
          <VenueHeroSection />
          <MapTrackSection />
          <TimelineSection />
      </PageWrapper>
      
      <Footer />
    </div>
  );
}
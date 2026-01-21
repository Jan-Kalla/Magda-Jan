"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useGuest } from "@/app/context/GuestContext";
import { ALBUMS, ACCESS_WEIGHTS, Album, AccessLevel } from "./data";
import AlbumCard from "./components/AlbumCard";
import AlbumModal from "./components/AlbumModal";

export default function GalleryPage() {
  const { guest, loading } = useGuest();
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  // Funkcja filtrująca dostęp
  const hasAccess = (requiredLevel: AccessLevel) => {
    if (!guest) return false;
    const userLevel = (guest.access_level || 'basic') as AccessLevel;
    const userWeight = ACCESS_WEIGHTS[userLevel] || 1;
    const requiredWeight = ACCESS_WEIGHTS[requiredLevel];
    return userWeight >= requiredWeight;
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#fff0e6] flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20 px-4 max-w-6xl mx-auto w-full">
        
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#4E0113] mb-4 drop-shadow-sm">
            Galeria Wspomnień
          </h1>
          <p className="text-[#4E0113]/70 text-lg max-w-2xl mx-auto">
            Zbiór chwil, które nas ukształtowały i tych, które dopiero nadejdą.
          </p>
        </header>

        {/* GRID ALBUMÓW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ALBUMS.map((album) => {
            if (!hasAccess(album.requiredLevel)) return null;

            return (
              <AlbumCard 
                key={album.id} 
                album={album} 
                onClick={setSelectedAlbum} 
              />
            );
          })}
        </div>

        {/* MODAL */}
        <AlbumModal 
          album={selectedAlbum} 
          userAccessLevel={guest?.access_level || 'basic'}
          onClose={() => setSelectedAlbum(null)} 
        />

      </main>
      <Footer />
    </div>
  );
}
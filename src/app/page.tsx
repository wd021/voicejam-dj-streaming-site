"use client";

import Image from "next/image";
import { supabase } from "@/utils/supabaseClient";
import Player from "@/components/player";
import Promo from "@/components/promo";
import { useEffect, useState } from "react";

const SONGS = [
  108, 107, 106, 105, 104, 103, 102, 101, 100, 99, 98, 97, 96, 95, 94, 75, 74,
  73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61, 60, 59, 58, 57, 56, 55,
  54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37, 35,
  33, 30,
];

export default function Home() {
  const [songs, setSongs] = useState<any[] | null>([]);
  const [showPromo, setShowPromo] = useState(false);

  const fetchSongs = async () => {
    const { data, error } = await supabase
      .from("songs")
      .select("*, profiles!songs_user_id_fkey1 (*)")
      .in("id", SONGS);
    if (error) console.error("Error fetching songs:", error);

    setSongs(data);
  };

  // Effect to fetch rooms on mount
  useEffect(() => {
    fetchSongs();
  }, []);

  // Effect to handle the room playback loop
  useEffect(() => {
    if (showPromo) {
      setTimeout(() => {
        setShowPromo(false);
      }, 50000); // Show promo for 50 seconds
    }
  }, [showPromo]);

  // Trigger promo after room finishes
  const handleRoomFinish = () => {
    setShowPromo(true);
  };

  const renderContent = () => {
    // Check for promo display
    if (showPromo) {
      return <Promo />;
    }

    if (songs && songs.length > 0) {
      return (
        <Player
          // room={rooms[currentRoomIndex]}
          songs={songs}
          onFinish={handleRoomFinish}
        />
      );
    }

    // Default to Promo if other conditions aren't met
    return <Promo />;
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Image
        src="/background.jpg"
        alt="Cover Image"
        layout="fill"
        objectFit="cover"
        className="bg-img"
      />
      {renderContent()}
    </div>
  );
}

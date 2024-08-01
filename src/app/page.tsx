"use client";

import Image from "next/image";
import { supabase } from "@/utils/supabaseClient";
import Player from "@/components/player";
import Promo from "@/components/promo";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const [songs, setSongs] = useState<any[] | null>([]);
  const [showPromo, setShowPromo] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());

  const fetchSongs = useCallback(async () => {
    const { data, error } = await supabase
      .from("memesongs")
      .select("*, profiles!memesongs_user_id_fkey (*)")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) console.error("Error fetching songs:", error);

    setSongs(data);
    setLastRefreshTime(Date.now());
  }, []);

  // Effect to fetch songs on mount and set up hourly refresh
  useEffect(() => {
    fetchSongs();

    const refreshInterval = setInterval(() => {
      if (showPromo) {
        fetchSongs();
      }
    }, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(refreshInterval);
  }, [fetchSongs, showPromo]);

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

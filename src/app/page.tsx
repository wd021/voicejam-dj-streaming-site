"use client";

import Image from "next/image";
import { supabase } from "@/utils/supabaseClient";
import Player from "@/components/player";
import Promo from "@/components/promo";
import { useCallback, useEffect, useState } from "react";

// 1 day buffer
/*
const getCurrentWeekStart = () => {
  const currentDate = new Date();

  // Adjust the day of the week
  // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const currentDay = currentDate.getUTCDay();

  // Calculate the difference to last Monday
  // If it's Monday (1), we go back 7 days to get the previous week's Monday
  // For other days, we go back to the most recent Monday
  const diff =
    currentDate.getUTCDate() - currentDay + (currentDay <= 1 ? -6 : 1);

  const mondayDate = new Date(
    Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), diff)
  );

  return mondayDate.toISOString().split("T")[0];
};
*/

const currentDate = new Date();
const currentDay = currentDate.getUTCDay();
const diff =
  currentDate.getUTCDate() - currentDay + (currentDay === 0 ? -6 : 1);
const mondayDate = new Date(
  Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), diff)
);
const currentWeekStart = mondayDate.toISOString().split("T")[0];

const QUERY_LIMIT = 20;

export default function Home() {
  const [songs, setSongs] = useState<any[] | null>([]);
  const [showPromo, setShowPromo] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());

  const fetchSongs = useCallback(async () => {
    const { data, error } = await supabase
      .from("weekly_song_plays")
      .select(
        `song_id, play_count, memesongs!weekly_song_plays_song_id_fkey(*)`
      )
      .eq("week_start", currentWeekStart)
      .order("play_count", { ascending: false })
      .limit(QUERY_LIMIT);

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
      return <Player songs={songs} onFinish={handleRoomFinish} />;
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

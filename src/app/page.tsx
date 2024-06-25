"use client";

import Image from "next/image";
import { supabase } from "@/utils/supabaseClient";
import Player from "@/components/player";
import Promo from "@/components/promo";
import { useEffect, useState } from "react";

// const ROOMS = [1, 2, 3, 4];
// const ROOMS = null;
const ROOMS = [20, 3];

export default function Home() {
  const [rooms, setRooms] = useState<any>([]);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [currentSongs, setCurrentSongs] = useState<any[] | null>([]);
  const [nextSongs, setNextSongs] = useState<any[] | null>([]);
  const [showPromo, setShowPromo] = useState(false);

  // Fetch songs for a given room ID
  const fetchSongs = async (roomId: any) => {
    const { data, error } = await supabase
      .from("songs")
      .select("*, profiles!songs_user_id_fkey1 (*)")
      .eq("room_id", roomId)
      .order("like_count", { ascending: false });

    if (error) console.error("Error fetching songs:", error);
    return data;
  };

  // Function to fetch rooms
  const fetchRooms = async () => {
    let query = supabase.from("rooms").select("*");

    if (ROOMS && ROOMS.length > 0) {
      query = query.in("id", ROOMS);
    } else {
      query = query.order("id", { ascending: false });
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching rooms:", error);
    } else {
      setRooms(data);
    }
  };

  // Effect to fetch rooms on mount
  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (rooms.length > 0) {
      fetchSongs(rooms[currentRoomIndex].id).then(setCurrentSongs);
    }
  }, [currentRoomIndex, rooms]);

  // Effect to handle the room playback loop
  useEffect(() => {
    if (showPromo && rooms.length > 0) {
      const nextIndex = (currentRoomIndex + 1) % rooms.length;
      fetchSongs(rooms[nextIndex].id).then(setNextSongs);

      setTimeout(() => {
        setShowPromo(false);
        setCurrentRoomIndex(nextIndex);
        setCurrentSongs(nextSongs);
      }, 50000); // Show promo for 50 seconds
    }
  }, [showPromo, rooms, currentRoomIndex, nextSongs]);

  // Trigger promo after room finishes
  const handleRoomFinish = () => {
    setShowPromo(true);
  };

  const renderContent = () => {
    // Check for promo display
    if (showPromo) {
      return <Promo />;
    }

    // Check for current room and songs availability
    if (rooms[currentRoomIndex] && currentSongs && currentSongs.length > 0) {
      return (
        <Player
          room={rooms[currentRoomIndex]}
          songs={currentSongs}
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

import React, { useEffect, useRef, useState } from "react";
import Heart from "./heart";
import Music from "./music";

interface Props {
  room: any;
  songs: any[];
  onFinish: () => void;
}

const ASSETS_URL = "https://voicejam-assets.s3.amazonaws.com/";
const PROFILE_URL = "https://voicejam-profile-images.s3.amazonaws.com/";

export const MediaPlayer = ({ file }: { file: string }) => {
  return (
    <>
      {file.endsWith(".mp4") ? (
        <video
          muted
          loop
          className={`max-w-full w-[450px] h-[675px] lg:rounded-md object-cover flex`}
        >
          <source src={ASSETS_URL + file} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          src={ASSETS_URL + file}
          alt="Memesong"
          className={`max-w-full w-[450px] h-[675px] lg:rounded-md flex`}
        />
      )}
    </>
  );
};

export const Playlist = ({
  songs,
  currentSongId,
}: {
  songs: any[];
  currentSongId: number;
}) => {
  return (
    <div className="py-4 flex flex-col gap-y-4">
      {songs.map((song) => (
        <div
          data-id={song.id}
          className={`flex items-center px-4 py-2 ${
            song.id === currentSongId
              ? "opacity-100 bg-gray-800 text-white"
              : "opacity-65"
          }`}
          key={song.id}
        >
          <img
            src={PROFILE_URL + song.profiles.profile_pic}
            alt={song.title}
            width={65}
            height={65}
            className="rounded-full"
          />
          <div className="flex flex-col pl-3 text-sm">
            <div className="font-semibold">@{song.profiles.username}</div>
            <div className="">{song.title}</div>
          </div>
          <div
            className={`ml-auto flex py-2 px-3 rounded-full ${
              song.team === 2 ? "bg-[#4169E1]" : "bg-[#cf2724]"
            }`}
          >
            <Heart width="22" color="white" />
            <div className="ml-1 font-bold text-white text-xl">
              {song.like_count}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Player: React.FC<Props> = ({ room, songs, onFinish }) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentSongId, setCurrentSongId] = useState<number>(songs[0].id);
  const playlistRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentSongIndex >= songs.length) {
      onFinish();
    } else {
      setCurrentSongId(songs[currentSongIndex].id);
    }
  }, [currentSongIndex, songs, onFinish]);

  useEffect(() => {
    scrollToCurrentSong(); // Ensure this runs after the current song ID is updated.
  }, [currentSongId]);

  const handleMediaReady = () => {
    const audio = document.querySelector("audio");
    if (audio) {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleMediaReady);
    return () => window.removeEventListener("click", handleMediaReady);
  }, []);

  const handleMediaEnd = () => {
    if (currentSongIndex + 1 >= songs.length) {
      onFinish();
    } else {
      setCurrentSongIndex((currentIndex) => currentIndex + 1);
    }
  };

  const scrollToCurrentSong = () => {
    if (playlistRef.current) {
      const currentSongElement = playlistRef.current.querySelector(
        `[data-id='${currentSongId}']`
      ) as HTMLElement;

      if (currentSongElement) {
        playlistRef.current.scrollTop =
          currentSongElement.offsetTop -
          playlistRef.current.offsetTop -
          playlistRef.current.clientHeight / 2 +
          currentSongElement.clientHeight / 2;
      }
    }
  };

  return (
    <div>
      <div className="bg-white h-[100px] flex items-center px-2 font-semibold justify-between rounded-full shadow-xl">
        <img
          src={room.thumbnail}
          alt={room.title}
          width="90px"
          height="90px"
          className="rounded-full shrink-0"
        />
        {room.type === 1 ? (
          <div className="text-4xl underline decoration-8 decoration-[#cf2724] underline-offset-8">
            {room.title}
          </div>
        ) : (
          <div className="flex items-center gap-x-2 text-4xl">
            <div className="text-4xl underline decoration-8 decoration-[#cf2724] underline-offset-8">
              {room.team_a}
            </div>
            <div>vs.</div>
            <div className="text-4xl underline decoration-8 decoration-[#4169E1] underline-offset-8">
              {room.team_a}
            </div>
          </div>
        )}
        <img
          src={room.thumbnail}
          alt={room.title}
          width="90px"
          height="90px"
          className="rounded-full shrink-0"
        />
      </div>
      <div className="my-8 h-[550px] w-[800x] flex gap-x-6">
        <div
          ref={playlistRef}
          className="h-full bg-white w-[400px] rounded-[50px] overflow-hidden"
        >
          <Playlist songs={songs} currentSongId={currentSongId} />
        </div>
        <div className="h-full bg-white w-[400px] rounded-[50px] overflow-hidden">
          <div className="h-full w-full">
            {songs[currentSongIndex] && (
              <MediaPlayer file={songs[currentSongIndex].meme_file} />
            )}
            <audio
              src={ASSETS_URL + songs[currentSongIndex].audio_file}
              autoPlay
              onEnded={handleMediaEnd}
            />
          </div>
        </div>
      </div>
      <div className="bg-white h-[100px] rounded-full bangers-font text-7xl px-2 flex items-center justify-between shadow-xl">
        <Music />
        <div>VOICEJAM.XYZ</div>
        <Music />
      </div>
    </div>
  );
};

export default Player;

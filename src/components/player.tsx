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

export const MediaPlayer = ({
  file,
  audioCurrentTime,
  audioDuration,
}: {
  file: string;
  audioCurrentTime: number;
  audioDuration: number;
}) => {
  return (
    <>
      {file.endsWith(".mp4") ? (
        <video
          key={file}
          muted
          loop
          playsInline
          autoPlay
          webkit-playsinline="true"
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
      <div className="bg-white h-2 absolute bottom-4 left-10 right-10 rounded-full overflow-hidden">
        <div
          className="bg-black h-2"
          style={{ width: `${(audioCurrentTime / audioDuration) * 100}%` }}
        ></div>
      </div>
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
    <div className="py-4 flex flex-col">
      {songs.map((song) => (
        <div
          data-id={song.id}
          className={`flex items-center px-4 py-4 ${
            song.id === currentSongId ? "bg-black text-white" : ""
          }`}
          key={song.id}
        >
          <img
            src={PROFILE_URL + song.profiles.profile_pic}
            alt={song.title}
            width={50}
            height={50}
            className="rounded-full"
          />
          <div className="flex flex-col pl-3 mr-3">
            <div className="font-semibold text-sm">
              @{song.profiles.username}
            </div>
            <div className="text-xl">{song.title}</div>
          </div>
          <div
            className={`w-[65px] shrink-0 flex text-center items-center justify-center ml-auto flex py-1.5 rounded-full ${
              song.team === 2 ? "bg-[#4169E1]" : "bg-[#cf2724]"
            }`}
          >
            <Heart width="18" color="white" />
            <div className="ml-1.5 font-bold text-white text-lg">
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

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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

  useEffect(() => {
    const audio = document.querySelector("audio");

    if (audio) {
      audio.load();
      const setAudioData = () => {
        setDuration(audio.duration);
      };

      const setAudioTime = () => {
        setCurrentTime(audio.currentTime);
      };

      // Adding event listeners
      audio.addEventListener("loadedmetadata", setAudioData);
      audio.addEventListener("timeupdate", setAudioTime);

      // Cleanup function to remove event listeners
      return () => {
        if (audio) {
          audio.removeEventListener("loadedmetadata", setAudioData);
          audio.removeEventListener("timeupdate", setAudioTime);
        }
      };
    }
  }, [currentSongId]); // Reacting to changes in the 'song' which presumably changes the audio source

  const handleMediaReady = () => {
    const audio = document.querySelector("audio");
    const video = document.querySelector("video");

    if (audio) {
      if (audio.paused) {
        audio.play();
        video?.play();
      } else {
        audio.pause();
        video?.pause();
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

  const currentSongPosition = songs.findIndex(
    (song) => song.id === currentSongId
  );

  return (
    <div>
      <div className="bg-white h-[85px] lg:h-[100px] flex items-center px-2 font-semibold justify-between rounded-full shadow-xl">
        <img
          src={room.thumbnail}
          alt={room.title}
          className="rounded-full shrink-0 w-[60px] h-[60px] lg:w-[85px] lg:h-[85px]"
        />
        <div className="flex flex-col items-center">
          {room.type === 1 ? (
            <div className="text-2xl lg:text-4xl underline decoration-4 decoration-[#cf2724] underline-offset-4 lg:underline-offset-8">
              {room.title}
            </div>
          ) : (
            <div className="flex items-center gap-x-2 text-4xl">
              <div className="text-2xl lg:text-4xl underline decoration-4 decoration-[#cf2724] underline-offset-4 lg:underline-offset-8">
                {room.team_a}
              </div>
              <div>vs.</div>
              <div className="text-2xl lg:text-4xl underline decoration-4 decoration-[#4169E1] underline-offset-4 lg:underline-offset-8">
                {room.team_b}
              </div>
            </div>
          )}
          {songs && songs.length > 0 && (
            <div className="text-sm lg:text-lg mt-2 lg:mt-3 leading-tight">
              {songs.length} songs ({currentSongPosition + 1}/{songs.length})
            </div>
          )}
        </div>
        <img
          src={room.thumbnail}
          alt={room.title}
          className="rounded-full shrink-0 w-[60px] h-[60px] lg:w-[85px] lg:h-[85px]"
        />
      </div>
      <div className="my-8 h-[550px] w-[800x] flex gap-x-6 items-center justify-center">
        <div
          ref={playlistRef}
          className="hidden lg:flex h-full bg-white w-[400px] rounded-[50px] overflow-hidden"
        >
          <Playlist songs={songs} currentSongId={currentSongId} />
        </div>
        <div className="h-full bg-white w-[400px] rounded-[50px] overflow-hidden">
          <div className="h-full w-full relative bg-black">
            {songs[currentSongIndex] && (
              <MediaPlayer
                file={songs[currentSongIndex].meme_file}
                audioCurrentTime={currentTime}
                audioDuration={duration}
              />
            )}
            <audio onEnded={handleMediaEnd} autoPlay>
              <source
                src={ASSETS_URL + songs[currentSongIndex].audio_file}
                type="audio/mpeg"
              />
            </audio>
          </div>
        </div>
      </div>
      <div className="bg-white h-[85px] lg:h-[100px] rounded-full bangers-font text-5xl lg:text-7xl px-2 flex items-center justify-between shadow-xl">
        <Music />
        <div>VOICEJAM.XYZ</div>
        <Music />
      </div>
    </div>
  );
};

export default Player;

import React, { useEffect, useRef, useState } from "react";

interface GridVideoPlayerProps {
  number: number;
  leaderboardSong: any;
  onFinish: () => void;
  isActive: boolean;
}

const ASSETS_URL = "https://vj-memesongs-assets.s3.amazonaws.com/";
const ASSETS_COVERS_URL =
  "https://vj-memesongs-assets-snapshots.s3.amazonaws.com/";

const GridPlayer: React.FC<GridVideoPlayerProps> = ({
  number,
  leaderboardSong,
  onFinish,
  isActive,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const lastProgressRef = useRef(0);
  const playCountRef = useRef(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const song = leaderboardSong.memesongs;

  const handleTimeUpdate = () => {
    const mediaElement = song.compressed ? videoRef.current : audioRef.current;
    if (mediaElement) {
      const currentProgress =
        (mediaElement.currentTime / mediaElement.duration) * 100;
      setProgress(currentProgress);

      if (currentProgress < lastProgressRef.current) {
        playCountRef.current += 1;
      }
      lastProgressRef.current = currentProgress;

      if (currentProgress >= 100) {
        onFinish();
        setProgress(0);
      }
    }
  };

  useEffect(() => {
    const mediaElement = song.compressed ? videoRef.current : audioRef.current;
    if (mediaElement) {
      mediaElement.addEventListener("timeupdate", handleTimeUpdate);
      return () => {
        mediaElement.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [song, isPlaying]);

  useEffect(() => {
    if (isActive) {
      handlePlay();
    } else {
      handlePause();
    }
  }, [isActive]);

  const handlePlay = () => {
    setIsPlaying(true);
    playCountRef.current = 1;
    lastProgressRef.current = 0;
    if (song.compressed && videoRef.current) {
      videoRef.current.play();
    } else if (!song.compressed && audioRef.current) {
      audioRef.current.play();
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (song.compressed && videoRef.current) {
      videoRef.current.pause();
    } else if (!song.compressed && audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleClick = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const isCompressed = song.compressed ? true : false;

  const fileURL = isCompressed
    ? `${ASSETS_URL}video-o/${song.id}.mp4`
    : `${ASSETS_URL}video/${song.id}.${song.video_file_type}`;

  return (
    <div>
      <div className="relative w-full pb-[150%] overflow-hidden bg-black cursor-pointer">
        {isActive && (
          <div
            className="z-[2] top-2 left-2 absolute text-white w-[35px] h-[35px] font-semibold text-4xl flex items-center justify-center rounded-full"
            style={{ textShadow: "rgb(0 0 0) 0px 0px 8px" }}
          >
            {number}
          </div>
        )}
        <div
          className="absolute inset-0 flex items-center justify-center"
          onClick={handleClick}
        >
          <img
            src={ASSETS_COVERS_URL! + song.id + "_snap.jpg"}
            alt={song.title}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          {isPlaying && (
            <>
              <video
                ref={videoRef}
                key={song.id}
                className="absolute top-0 left-0 w-full h-full object-cover"
                src={fileURL}
                autoPlay
                playsInline
                muted={!isCompressed}
                webkit-playsinline="true"
                preload="auto"
              />
              {!isCompressed && (
                <audio ref={audioRef} autoPlay>
                  <source
                    src={`${ASSETS_URL}audio/${song.id}.${song.audio_file_type}`}
                    type="audio/mpeg"
                  />
                </audio>
              )}
            </>
          )}
          {!isActive && (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/50" />
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent">
            <div className="bg-black bg-opacity-50 h-1.5 overflow-hidden">
              <div
                className="bg-[#ffbe06] h-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridPlayer;

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from "react";
import Heart from "./heart";
import Music from "./music";

interface Props {
  songs: any[];
  onFinish: () => void;
}

const ASSETS_URL = "https://vj-memesongs-assets.s3.amazonaws.com/";
const ASSETS_COVERS_URL =
  "https://vj-memesongs-assets-snapshots.s3.amazonaws.com/";
const PROFILE_URL = "https://voicejam-profile-images.s3.amazonaws.com/";

export const MediaPlayer = ({
  title,
  file,
  audioCurrentTime,
  audioDuration,
}: {
  title: string;
  file: string;
  audioCurrentTime: number;
  audioDuration: number;
}) => {
  return (
    <>
      <div className="flex lg:hidden flex absolute w-full text-center rounded-full items-center justify-center">
        <div className="bg-white my-4 py-1 w-[75%] rounded-full font-semibold bg-opacity-75">
          {title}
        </div>
      </div>
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
          <source src={file} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          src={file}
          alt="Memesong"
          className={`max-w-full w-[450px] h-[675px] object-cover lg:rounded-md flex`}
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
    <div className="h-full flex flex-col">
      <div className="flex flex-col flex-1">
        {songs.length > 0 &&
          songs.map((song) => {
            const userInfo = song.profiles;
            return (
              <div
                data-id={song.id}
                className={`cursor-pointer flex items-center p-4 ${
                  song.id === currentSongId
                    ? "bg-[#f3e6ff]"
                    : "lg:hover:bg-[#f3e6ff]"
                }`}
                key={song.id}
              >
                <img
                  src={`${ASSETS_COVERS_URL}${song.id}_thumb.jpg`}
                  alt="Memesong Cover"
                  className="rounded-md h-[75px] w-[50px] object-cover"
                />
                <div className="flex flex-col ml-4">
                  <div className="flex items-center">
                    <img
                      src={`${PROFILE_URL}${userInfo?.profile_pic}`}
                      alt="Profile Pic"
                      className="rounded-full h-[20px] w-[20px] object-cover"
                    />
                    <div className="font-semibold text-sm ml-1">
                      {userInfo?.username}
                    </div>
                  </div>
                  <div className="mt-2">{song.title}</div>
                </div>
                <div className="ml-auto mr-2 text-right text-sm gap-y-1 flex flex-col">
                  <div>{song.duration}s</div>
                  <div className="flex">
                    <div className="mr-0.5 font-semibold">{song.likes}</div>
                    <Heart width="14px" color="black" />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

const Player: React.FC<Props> = ({ songs, onFinish }) => {
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

  const fileURL = `${ASSETS_URL}video/${songs[currentSongIndex].id}.${songs[currentSongIndex].video_file_type}`;
  const compressedURL = `${ASSETS_URL}video-o/${songs[currentSongIndex].id}.mp4`;
  const audioURL = `${ASSETS_URL}audio/${songs[currentSongIndex].id}.${songs[currentSongIndex].audio_file_type}`;

  return (
    <div>
      <div className="bg-white h-[85px] lg:h-[100px] rounded-full bangers-font text-5xl lg:text-7xl px-4 flex items-center justify-between shadow-xl">
        <Music />
        <div className="px-10">Featured Memesongs</div>
        <Music />
      </div>
      <div className="my-8 h-[550px] w-[800x] flex gap-x-6 items-center justify-center">
        <div
          ref={playlistRef}
          className="hidden lg:flex h-full bg-white w-[400px] rounded-xl overflow-hidden"
        >
          <Playlist songs={songs} currentSongId={currentSongId} />
        </div>
        <div className="h-full bg-white w-[400px] rounded-xl overflow-hidden">
          <div className="h-full w-full relative bg-black">
            {songs[currentSongIndex] && (
              <MediaPlayer
                title={songs[currentSongIndex].title}
                file={
                  songs[currentSongIndex].compressed ? compressedURL : fileURL
                }
                audioCurrentTime={currentTime}
                audioDuration={duration}
              />
            )}
            <audio onEnded={handleMediaEnd} autoPlay>
              <source src={audioURL} type="audio/mpeg" />
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

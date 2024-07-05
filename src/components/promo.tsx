import React, { useEffect, useRef } from "react";

const Promo: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Play the audio when the component mounts
    audioRef.current?.play();

    // Pause the audio and cleanup on component unmount
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <audio ref={audioRef} src="/voicejam_theme.mp3" preload="auto" />
      <div className="flex gap-x-6">
        <div className="bg-white h-[400px] w-[400px] opacity-90 rounded-[100px] flex items-center justify-center flex-col text-center">
          <img src="/logo.png" alt="Logo" width="350px" className="ml-4" />
        </div>
        <div className="hidden lg:flex h-[400px] bg-white opacity-90 flex flex-col items-center justify-center w-[400px] rounded-[100px] overflow-hidden text-center">
          <img src="/qrcode.png" alt="Cover Image" width="350px" />
        </div>
      </div>
      <div className="text-white text-center mt-12">
        <div className="text-6xl lg:text-8xl font-bold bangers-font">
          VOICEJAM.XYZ
        </div>
        <div className="mt-2 px-12 text-3xl lg:text-3xl text-shadow leading-tight">
          Music and memes.
          <br />
          The funnest place on the internet!
        </div>
      </div>
    </div>
  );
};

export default Promo;

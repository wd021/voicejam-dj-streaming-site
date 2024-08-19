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
    <div className="flex flex-col items-center justify-center h-full bg-white aspect-[2/3] text-center">
      <audio ref={audioRef} src="/voicejam_theme.mp3" preload="auto" />
      <div className="bg-white h-[300px] w-[300px] opacity-90 rounded-[100px] flex items-center justify-center flex-col text-center">
        <img src="/logo.png" alt="Logo" width="350px" className="ml-4" />
      </div>
      <div className="text-4xl mt-6 mb-2">JOIN FOR THE LULZ</div>
      <div className="text-4xl font-bold">VOICEJAM.XYZ</div>
    </div>
  );
};

export default Promo;

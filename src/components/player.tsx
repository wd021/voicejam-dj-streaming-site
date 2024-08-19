/* eslint-disable @next/next/no-img-element */
import React from "react";
import Star from "./star";
import Grid from "./grid";

interface Props {
  songs: any[];
  onFinish: () => void;
}

const Player: React.FC<Props> = ({ songs, onFinish }) => {
  return (
    <div className="flex flex-col h-full bg-white aspect-[2/3] text-center">
      <div className="px-4 h-[60px] bg-[#f9f9f9] flex items-center justify-between text-2xl font-bold">
        <div>
          <Star width="40px" />
        </div>
        <div>MEMESONG LEADERBOARD</div>
        <div>
          <Star width="40px" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <Grid items={songs} onFinish={onFinish} />
      </div>
      <div className="px-4 h-[60px] bg-[#f9f9f9] flex items-center justify-between text-2xl font-bold">
        <div>
          <Star width="40px" />
        </div>
        <div>VOICEJAM.XYZ</div>
        <div>
          <Star width="40px" />
        </div>
      </div>
    </div>
  );
};

export default Player;

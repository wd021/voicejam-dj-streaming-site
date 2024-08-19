import React, { useEffect, useRef, useState } from "react";

import GridPlayer from "./gridPlayer";

interface GridProps {
  items: any[];
  onFinish: () => void;
}

const Grid: React.FC<GridProps> = ({ items, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const gridRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Auto-play the first item when the component is loaded
    if (items.length > 0) {
      setCurrentIndex(0);
    }
  }, [items]);

  useEffect(() => {
    // Scroll the active item into view
    if (gridRefs.current[currentIndex]) {
      gridRefs.current[currentIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [currentIndex]);

  const handleFinish = () => {
    if (currentIndex < items.length - 1) {
      // Play the next item
      setCurrentIndex(currentIndex + 1);
    } else {
      // All items have been played
      onFinish();
    }
  };

  return (
    <div className="grid grid-cols-2 snap-y snap-mandatory overflow-y-auto hide-scrollbar h-screen">
      {items.map((item, index) => (
        <div
          key={index}
          ref={(el) => (gridRefs.current[index] = el as HTMLDivElement)}
          className="snap-center"
        >
          <GridPlayer
            number={index + 1}
            leaderboardSong={item}
            onFinish={handleFinish}
            isActive={index === currentIndex}
          />
        </div>
      ))}
    </div>
  );
};

export default Grid;

import React, { type SVGProps } from "react";

interface HeartProps extends SVGProps<SVGSVGElement> {
  color?: "red" | "blue" | "pink" | "white" | "black";
}

const Heart: React.FC<HeartProps> = ({ color = "red", ...props }) => {
  const colors = {
    red: "#cf2724",
    blue: "#4169E1",
    pink: "#cd3c8b",
    white: "#fff",
    black: "#000",
  };

  const fillColor = colors[color];
  const shadowStyle = {
    filter: "drop-shadow(0px 0px 2px rgba(255, 255, 255, 0.5))",
  };

  return (
    <svg
      viewBox="0 0 24 24"
      style={color !== "white" && color !== "black" ? shadowStyle : {}}
      {...props}
    >
      <path
        fill={fillColor}
        d="M12,22c8-4,11-9,11-14A6,6,0,0,0,12,4.686,6,6,0,0,0,1,8C1,13,4,18,12,22Z"
      />
    </svg>
  );
};

export default Heart;

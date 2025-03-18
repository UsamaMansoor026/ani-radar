import React from "react";
import bg from "../assets/bg.png";

const Background = () => {
  return (
    <div
      className="bg-midnight-blue h-[100vh] relative"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "fill",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* Mask */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-blue/50 via-midnight-blue/40 to-cyan-blue/40" />
    </div>
  );
};

export default Background;

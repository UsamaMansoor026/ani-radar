import React from "react";
import bg from "../assets/bg.png";

const Background = () => {
  return (
    <div
      className="bg-midnight-blue min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* Mask */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-blue/50 via-midnight-blue/40 to-cyan-blue/40" />
    </div>
  );
};

export default Background;

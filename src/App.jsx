import React from "react";
import Background from "./components/Background";
import AnimeFinder from "./components/AnimeFinder";

const App = () => {
  return (
    <div className="text-cyan-blue bg-midnight-blue relative">
      <Background />
      <AnimeFinder />
    </div>
  );
};

export default App;

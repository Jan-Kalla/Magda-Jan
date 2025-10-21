"use client";
import { togglePause, getIsPaused } from "./gameLogic";
import { useState, useEffect } from "react";

export default function PauseButton() {
  const [paused, setPaused] = useState(getIsPaused());

  const handleClick = () => {
    togglePause();
    setPaused(getIsPaused());
  };

  return (
    <button
      onClick={handleClick}
      className="mt-4 px-4 py-2 bg-[#4E0113] text-white rounded shadow"
    >
      {paused ? "Wznów" : "Pauza"}
    </button>
  );
}

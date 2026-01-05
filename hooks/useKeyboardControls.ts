"use client";

import { useEffect, useState } from "react";

export function useKeyboardControls() {
  const [controls, setControls] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    shift: false,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case "w":
        case "arrowup":
          setControls((prev) => ({ ...prev, forward: true }));
          break;
        case "s":
        case "arrowdown":
          setControls((prev) => ({ ...prev, backward: true }));
          break;
        case "a":
        case "arrowleft":
          setControls((prev) => ({ ...prev, left: true }));
          break;
        case "d":
        case "arrowright":
          setControls((prev) => ({ ...prev, right: true }));
          break;
        case " ":
          setControls((prev) => ({ ...prev, jump: true }));
          break;
        case "shift":
          setControls((prev) => ({ ...prev, shift: true }));
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case "w":
        case "arrowup":
          setControls((prev) => ({ ...prev, forward: false }));
          break;
        case "s":
        case "arrowdown":
          setControls((prev) => ({ ...prev, backward: false }));
          break;
        case "a":
        case "arrowleft":
          setControls((prev) => ({ ...prev, left: false }));
          break;
        case "d":
        case "arrowright":
          setControls((prev) => ({ ...prev, right: false }));
          break;
        case " ":
          setControls((prev) => ({ ...prev, jump: false }));
          break;
        case "shift":
          setControls((prev) => ({ ...prev, shift: false }));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return controls;
}
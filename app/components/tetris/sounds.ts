// app/tetris/sounds.ts
import { Howl } from "howler";

export const sounds = {
  hit1: new Howl({ src: ["/sounds/hit1.wav"], volume: 0.5 }),
  hit2: new Howl({ src: ["/sounds/hit2.wav"], volume: 0.5 }),
  line: new Howl({ src: ["/sounds/line.wav"], volume: 0.5 }),
  gameover: new Howl({ src: ["/sounds/gameover.wav"], volume: 0.7 }),
};

// Alternator uderzeń
let nextHit = 0; // 0 -> hit1, 1 -> hit2
export function playHitAlternating() {
  if (nextHit === 0) {
    sounds.hit1.play();
    nextHit = 1;
  } else {
    sounds.hit2.play();
    nextHit = 0;
  }
}

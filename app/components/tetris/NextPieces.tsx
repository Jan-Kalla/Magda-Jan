"use client";
import { useEffect, useRef, useState } from "react";
import { getNextPieces } from "./gameLogic";
import { renderPiece } from "./pieces";

const BLOCK_SIZE = 20;
const PREVIEW_SIZE = 5; // 5x5 mini-grid na każdy klocek

export default function NextPieces() {
  const [pieces, setPieces] = useState(getNextPieces());
  const canvasRefs = [useRef<HTMLCanvasElement | null>(null), useRef<HTMLCanvasElement | null>(null)];

  useEffect(() => {
    const renderPreviews = () => {
      const next = getNextPieces();
      setPieces([...next]);

      canvasRefs.forEach((ref, idx) => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, PREVIEW_SIZE * BLOCK_SIZE, PREVIEW_SIZE * BLOCK_SIZE);

        const piece = next[idx];
        if (piece) {
          const minX = Math.min(...piece.positions.map(p => p.x));
          const minY = Math.min(...piece.positions.map(p => p.y));

          // domyślne przesunięcie (centrowanie)
          let offsetX = 1;
          let offsetY = 1;

          // specjalny przypadek dla klocka I (1x4)
          if (piece.type === "I") {
            offsetX = 2; // przesuwamy o 1 w prawo względem reszty
          }

          renderPiece(
            {
              ...piece,
              positions: piece.positions.map(p => ({
                x: p.x - minX + offsetX,
                y: p.y - minY + offsetY,
              })),
            },
            ctx,
            BLOCK_SIZE
          );
        }
      });

      requestAnimationFrame(renderPreviews);
    };

    renderPreviews();
  }, []);

return (
  <div className="flex flex-col items-center">
    <p className="font-semibold text-[#4E0113] mb-2">Następne</p>
    <div className="flex flex-col gap-4">
      {canvasRefs.map((ref, idx) => (
    <canvas
      key={idx}
      ref={ref}
      width={PREVIEW_SIZE * BLOCK_SIZE}
      height={PREVIEW_SIZE * BLOCK_SIZE}
      className="tetris-canvas rounded"
    />
      ))}
    </div>
  </div>
);

}

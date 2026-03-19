"use client";
import { useEffect, useRef, useState } from "react";
import { getNextPieces } from "./gameLogic";
import { renderPiece } from "./pieces";

const BLOCK_SIZE = 20;
const PREVIEW_SIZE = 5; // 5x5 mini-grid na każdy klocek

export default function NextPieces() {
  const [pieces, setPieces] = useState(getNextPieces());
  // ZMIANA: Obsługa 3 canvasów
  const canvasRefs = [
    useRef<HTMLCanvasElement | null>(null), 
    useRef<HTMLCanvasElement | null>(null),
    useRef<HTMLCanvasElement | null>(null)
  ];

  useEffect(() => {
    const renderPreviews = () => {
      const next = getNextPieces();
      setPieces([...next]);

      canvasRefs.forEach((ref, idx) => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // ZMIANA: Odsłania CSS'owe tło tetris-canvas
        ctx.clearRect(0, 0, PREVIEW_SIZE * BLOCK_SIZE, PREVIEW_SIZE * BLOCK_SIZE);

        const piece = next[idx];
        if (piece) {
          const minX = Math.min(...piece.positions.map(p => p.x));
          const minY = Math.min(...piece.positions.map(p => p.y));

          let offsetX = 1;
          let offsetY = 1;
          if (piece.type === "I") offsetX = 2;

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* ZMIANA: Wymuszenie poziomego układu (flex-row) niezależnie od urządzenia */}
      <div className="flex flex-row gap-2 sm:gap-4 justify-center items-center">
        {canvasRefs.map((ref, idx) => (
          <canvas
            key={idx}
            ref={ref}
            width={PREVIEW_SIZE * BLOCK_SIZE}
            height={PREVIEW_SIZE * BLOCK_SIZE}
            className="tetris-canvas rounded shadow-md"
          />
        ))}
      </div>
    </div>
  );
}
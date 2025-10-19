"use client";
import { useEffect, useRef } from "react";
import { getNextPieces } from "./gameLogic";
import { renderPiece } from "./pieces";

const BLOCK_SIZE = 20;
const WIDTH = 4 * BLOCK_SIZE;
const HEIGHT = 8 * BLOCK_SIZE;

export default function NextPieces() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const renderPreview = () => {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      const pieces = getNextPieces();
      pieces.forEach((piece, i) => {
        const offsetY = i * 4 * BLOCK_SIZE;
        renderPiece(
          {
            ...piece,
            positions: piece.positions.map(p => ({
              x: p.x - piece.positions[0].x + 1,
              y: p.y - piece.positions[0].y + 1 + offsetY / BLOCK_SIZE,
            })),
          },
          ctx,
          BLOCK_SIZE
        );
      });

      requestAnimationFrame(renderPreview);
    };
    renderPreview();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <p className="font-semibold text-[#4E0113] mb-2">Następne</p>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        className="border-2 border-[#4E0113] bg-white shadow"
      />
    </div>
  );
}

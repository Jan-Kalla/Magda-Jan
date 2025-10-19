export type Position = { x: number; y: number };
export type Piece = { type: string; color: string; positions: Position[]; center: number };

const CENTER_X = 5;

// === Definicje klocków ===
export function createI(): Piece {
  return {
    type: "I",
    color: "cyan",
    positions: [
      { x: CENTER_X, y: 0 },
      { x: CENTER_X, y: 1 },
      { x: CENTER_X, y: 2 },
      { x: CENTER_X, y: 3 },
    ],
    center: 1,
  };
}

export function createJ(): Piece {
  return {
    type: "J",
    color: "blue",
    positions: [
      { x: CENTER_X - 1, y: 0 },
      { x: CENTER_X - 1, y: 1 },
      { x: CENTER_X, y: 1 },
      { x: CENTER_X + 1, y: 1 },
    ],
    center: 2,
  };
}

export function createL(): Piece {
  return {
    type: "L",
    color: "orange",
    positions: [
      { x: CENTER_X + 1, y: 0 },
      { x: CENTER_X - 1, y: 1 },
      { x: CENTER_X, y: 1 },
      { x: CENTER_X + 1, y: 1 },
    ],
    center: 2,
  };
}

export function createO(): Piece {
  return {
    type: "O",
    color: "yellow",
    positions: [
      { x: CENTER_X, y: 0 },
      { x: CENTER_X + 1, y: 0 },
      { x: CENTER_X, y: 1 },
      { x: CENTER_X + 1, y: 1 },
    ],
    center: -1,
  };
}

export function createS(): Piece {
  return {
    type: "S",
    color: "green",
    positions: [
      { x: CENTER_X, y: 0 },
      { x: CENTER_X + 1, y: 0 },
      { x: CENTER_X - 1, y: 1 },
      { x: CENTER_X, y: 1 },
    ],
    center: 0,
  };
}

export function createT(): Piece {
  return {
    type: "T",
    color: "purple",
    positions: [
      { x: CENTER_X - 1, y: 1 },
      { x: CENTER_X, y: 1 },
      { x: CENTER_X + 1, y: 1 },
      { x: CENTER_X, y: 0 },
    ],
    center: 1,
  };
}

export function createZ(): Piece {
  return {
    type: "Z",
    color: "red",
    positions: [
      { x: CENTER_X - 1, y: 0 },
      { x: CENTER_X, y: 0 },
      { x: CENTER_X, y: 1 },
      { x: CENTER_X + 1, y: 1 },
    ],
    center: 1,
  };
}

// === Losowanie klocka ===
const PIECES = [createI, createJ, createL, createO, createS, createT, createZ];

export function randomPiece(): Piece {
  const random = Math.floor(Math.random() * PIECES.length);
  return PIECES[random]();
}

// === Renderowanie ===
export function renderPiece(piece: Piece, ctx: CanvasRenderingContext2D, blockSize: number) {
  ctx.fillStyle = piece.color;
  for (const pos of piece.positions) {
    ctx.fillRect(pos.x * blockSize, pos.y * blockSize, blockSize, blockSize);
  }
}

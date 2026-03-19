import { randomPiece, renderPiece, Piece, Position } from "./pieces";
import { createClient } from "@supabase/supabase-js";

const WIDTH = 300;
const HEIGHT = 600;
const BLOCK_SIZE = 30;
const NO_COLS = WIDTH / BLOCK_SIZE;
const NO_ROWS = HEIGHT / BLOCK_SIZE;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- Stan gry ---
let field: (string | null)[][] = createEmptyField();
let activePiece: Piece = randomPiece();
let score = 0;
let gameOverCallback: ((score: number) => void) | null = null;
let levelCallback: ((level: number) => void) | null = null;
let scoreCallback: ((score: number) => void) | null = null;

let isGameOver = false;
let gameOverFrame = 0;
// ZMIANA: Zwiększono zapowiedzi z 2 na 3
let nextPieces: Piece[] = [randomPiece(), randomPiece(), randomPiece()]; 
let isPaused = false;

let level = 1;
let linesClearedTotal = 0;

let pieceLockCb: (() => void) | null = null;
let lineClearCb: ((count: number) => void) | null = null;

// --- Pomocnicze ---
function createEmptyField(): (string | null)[][] {
  return Array.from({ length: NO_ROWS }, () => Array(NO_COLS).fill(null));
}

function hasCollision(positions: Position[]): boolean {
  return positions.some(
    (p) =>
      p.x < 0 ||
      p.x >= NO_COLS ||
      p.y >= NO_ROWS ||
      (p.y >= 0 && field[p.y][p.x] !== null)
  );
}

function freezePiece(piece: Piece) {
  piece.positions.forEach((p) => {
    if (p.y >= 0) {
      field[p.y][p.x] = piece.color;
    }
  });

  if (pieceLockCb) {
    pieceLockCb();
  }

  clearLines();
}

function spawnPiece() {
  activePiece = nextPieces.shift()!; // weź pierwszy z kolejki
  nextPieces.push(randomPiece());    // dołóż nowy na końcu

  if (hasCollision(activePiece.positions)) {
    if (gameOverCallback) gameOverCallback(score);
    isGameOver = true;
  }
}

// --- API stanu ---
export function getLevel() { return level; }
export function getScore() { return score; }
export function togglePause() { isPaused = !isPaused; }
export function getIsPaused() { return isPaused; }
export function getIsGameOver() { return isGameOver; }
export function getNextPieces() { return nextPieces; }

export function setLevelCallback(cb: (level: number) => void) { levelCallback = cb; }
export function setGameOverCallback(cb: (score: number) => void) { gameOverCallback = cb; }
export function setScoreCallback(cb: (score: number) => void) { scoreCallback = cb; }
export function setPieceLockCallback(cb: () => void) { pieceLockCb = cb; }
export function setLineClearCallback(cb: (count: number) => void) { lineClearCb = cb; }

// --- Czyszczenie linii i punktacja ---
function clearLines() {
  let linesCleared = 0;

  for (let y = NO_ROWS - 1; y >= 0; y--) {
    if (field[y].every((cell) => cell !== null)) {
      field.splice(y, 1);
      field.unshift(Array(NO_COLS).fill(null));
      linesCleared++;
      y++; 
    }
  }

  if (linesCleared > 0) {
    if (lineClearCb) lineClearCb(linesCleared);

    const basePoints = [0, 40, 100, 300, 1200];
    score += (basePoints[linesCleared] ?? 0) * level;
    if (scoreCallback) scoreCallback(score);

    linesClearedTotal += linesCleared;
    while (linesClearedTotal >= level * 5) {
      level++;
      if (levelCallback) levelCallback(level);
    }
  }
}

// --- Sterowanie ---
export function moveLeft() {
  if (isGameOver || isPaused) return;
  const moved = activePiece.positions.map((p) => ({ x: p.x - 1, y: p.y }));
  if (!hasCollision(moved)) activePiece.positions = moved;
}

export function moveRight() {
  if (isGameOver || isPaused) return;
  const moved = activePiece.positions.map((p) => ({ x: p.x + 1, y: p.y }));
  if (!hasCollision(moved)) activePiece.positions = moved;
}

export function softDrop() {
  if (isGameOver || isPaused) return;
  const moved = activePiece.positions.map((p) => ({ x: p.x, y: p.y + 1 }));
  if (!hasCollision(moved)) {
    activePiece.positions = moved;
  } else {
    freezePiece(activePiece);
    spawnPiece();
  }
}

export function rotate() {
  if (isGameOver || isPaused) return;
  if (activePiece.type === "O") return;
  const center = activePiece.positions[activePiece.center];
  const rotated = activePiece.positions.map(({ x, y }) => {
    const dx = x - center.x;
    const dy = y - center.y;
    return { x: -dy + center.x, y: dx + center.y };
  });
  if (!hasCollision(rotated)) {
    activePiece.positions = rotated;
  }
}

export function hardDrop() {
  if (isGameOver || isPaused) return;
  let moved = activePiece.positions.map((p) => ({ x: p.x, y: p.y }));
  while (true) {
    const next = moved.map((p) => ({ x: p.x, y: p.y + 1 }));
    if (hasCollision(next)) break;
    moved = next;
  }
  activePiece.positions = moved;
  freezePiece(activePiece);
  spawnPiece();
}

// --- Aktualizacja gry ---
export function tick() {
  if (isGameOver || isPaused) {
    gameOverFrame++;
    return;
  }
  softDrop();
}

export function restartGame() {
  field = createEmptyField();
  score = 0;
  isGameOver = false;
  gameOverFrame = 0;

  // ZMIANA: Resetuje z uwzględnieniem 3 zapowiedzi
  nextPieces = [randomPiece(), randomPiece(), randomPiece()];
  activePiece = nextPieces.shift()!;
  nextPieces.push(randomPiece());

  level = 1;
  linesClearedTotal = 0;
  if (levelCallback) levelCallback(level);
  if (scoreCallback) scoreCallback(score);
}

// --- Renderowanie ---
export function render(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // ZMIANA: Rysowanie idealnej siatki pomocniczej (kratki) bezpośrednio na Canvasie
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  ctx.lineWidth = 1;
  
  for (let x = 0; x <= WIDTH; x += BLOCK_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, HEIGHT);
    ctx.stroke();
  }
  for (let y = 0; y <= HEIGHT; y += BLOCK_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
    ctx.stroke();
  }

  // pole gry
  for (let y = 0; y < NO_ROWS; y++) {
    for (let x = 0; x < NO_COLS; x++) {
      const color = field[y][x];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }

  // aktywny klocek
  if (!isGameOver) {
    renderPiece(activePiece, ctx, BLOCK_SIZE);
  }

  // komunikat Game Over
  if (isGameOver) {
    const alpha = Math.min(1, gameOverFrame / 60); 
    ctx.globalAlpha = alpha;

    ctx.fillStyle = "red";
    ctx.font = `bold ${40 + Math.sin(gameOverFrame / 10) * 5}px Arial`; 
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", WIDTH / 2, HEIGHT / 2);

    ctx.globalAlpha = 1;
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Press Enter to restart", WIDTH / 2, HEIGHT / 2 + 40);
  }

  // overlay pauzy
  if (isPaused && !isGameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "white";
    ctx.font = "bold 36px Arial";
    ctx.textAlign = "center";
    ctx.fillText("PAUSED", WIDTH / 2, HEIGHT / 2);
  }
}
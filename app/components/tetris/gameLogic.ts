import { randomPiece, renderPiece, Piece, Position } from "./pieces";
import { createClient } from "@supabase/supabase-js";

const WIDTH = 300;
const HEIGHT = 600;
const BLOCK_SIZE = 30;
const NO_COLS = WIDTH / BLOCK_SIZE;
const NO_ROWS = HEIGHT / BLOCK_SIZE;

// --- Stan gry ---
let field: (string | null)[][] = createEmptyField();
let activePiece: Piece = randomPiece();
let score = 0;
let gameOverCallback: ((score: number) => void) | null = null;
let levelCallback: ((level: number) => void) | null = null;
let scoreCallback: ((score: number) => void) | null = null;

let isGameOver = false;
let gameOverFrame = 0;
let nextPieces: Piece[] = [randomPiece(), randomPiece(), randomPiece()]; 
let isPaused = false;

let level = 1;
let linesClearedTotal = 0;

let pieceLockCb: (() => void) | null = null;
let lineClearCb: ((count: number) => void) | null = null;

// 🚨 TARCZA ABSOLUTNA: Radar Pamięci 🚨
let monitoredScore = 0;
let monitoredLevel = 1;
let hasCheated = false;
let actionsCount = 0;

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

  if (pieceLockCb) pieceLockCb();
  clearLines();
}

function spawnPiece() {
  activePiece = nextPieces.shift()!; 
  nextPieces.push(randomPiece());    

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

// ANTY-CHEAT
export function securityCheck() {
  const scoreJump = score - monitoredScore;
  const levelJump = level - monitoredLevel;

  // 1. Bezwzględna kontrola wyniku (pomysł użytkownika!)
  if (scoreJump > 2400 * monitoredLevel) {
    hasCheated = true;
    console.warn(`[Anti-Cheat] Niemożliwy skok wyniku: +${scoreJump}`);
  }

  // 2. Bezwzględna kontrola poziomu
  // Level może rosnąć tylko o 1 na raz
  if (levelJump > 1) {
    hasCheated = true;
    console.warn(`[Anti-Cheat] Niemożliwy skok levelu: +${levelJump}`);
  }

  monitoredScore = score;
  monitoredLevel = level;
}

export function verifyFairPlay(finalScore: number): boolean {
  securityCheck(); 

  // Drugi poziom zabezpieczeń (Obrona przed skryptami/botami, co do której się zgodziliśmy)
  if (finalScore > 1000 && actionsCount < 20) {
    return false;
  }

  return !hasCheated;
}

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

// --- Sterowanie (Wzbogacone o zliczanie akcji) ---
export function moveLeft() {
  if (isGameOver || isPaused) return;
  actionsCount++;
  const moved = activePiece.positions.map((p) => ({ x: p.x - 1, y: p.y }));
  if (!hasCollision(moved)) activePiece.positions = moved;
}

export function moveRight() {
  if (isGameOver || isPaused) return;
  actionsCount++;
  const moved = activePiece.positions.map((p) => ({ x: p.x + 1, y: p.y }));
  if (!hasCollision(moved)) activePiece.positions = moved;
}

export function softDrop() {
  if (isGameOver || isPaused) return;
  actionsCount++;
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
  actionsCount++;
  
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
  actionsCount++;
  
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
  // Grawitacja uderza sama - nie nabija to sztucznie akcji klawiatury gracza
  const moved = activePiece.positions.map((p) => ({ x: p.x, y: p.y + 1 }));
  if (!hasCollision(moved)) {
    activePiece.positions = moved;
  } else {
    freezePiece(activePiece);
    spawnPiece();
  }
}

export function restartGame() {
  field = createEmptyField();
  score = 0;
  isGameOver = false;
  gameOverFrame = 0;
  
  // ZMIANA: Resetujemy też tarczę anty-cheatową
  monitoredScore = 0;
  monitoredLevel = 1;
  hasCheated = false;
  actionsCount = 0;

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

  for (let y = 0; y < NO_ROWS; y++) {
    for (let x = 0; x < NO_COLS; x++) {
      const color = field[y][x];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }

  if (!isGameOver) {
    renderPiece(activePiece, ctx, BLOCK_SIZE);
  }

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

  if (isPaused && !isGameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "white";
    ctx.font = "bold 36px Arial";
    ctx.textAlign = "center";
    ctx.fillText("PAUSED", WIDTH / 2, HEIGHT / 2);
  }
}
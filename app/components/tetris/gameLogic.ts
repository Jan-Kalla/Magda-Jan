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

let field: (string | null)[][] = createEmptyField();
let activePiece: Piece = randomPiece();
let score = 0;
let gameOverCallback: ((score: number) => void) | null = null;
let isGameOver = false;
let gameOverFrame = 0;
let nextPieces: Piece[] = [randomPiece(), randomPiece()];

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
  clearLines(); // po zamrożeniu sprawdzamy linie
}

function spawnPiece() {
  activePiece = nextPieces.shift()!; // weź pierwszy z kolejki
  nextPieces.push(randomPiece());    // dołóż nowy na końcu

  if (hasCollision(activePiece.positions)) {
    if (gameOverCallback) gameOverCallback(score);
    isGameOver = true;
  }
}

export function getNextPieces() {
  return nextPieces;
}

// === Czyszczenie linii ===
function clearLines() {
  let linesCleared = 0;

  for (let y = NO_ROWS - 1; y >= 0; y--) {
    if (field[y].every((cell) => cell !== null)) {
      // usuń pełną linię
      field.splice(y, 1);
      // dodaj pustą linię na górze
      field.unshift(Array(NO_COLS).fill(null));
      linesCleared++;
      y++; // sprawdź ponownie ten sam wiersz (bo spadły nowe)
    }
  }

  if (linesCleared > 0) {
    // klasyczne punktowanie Tetrisa (proste)
    const points = [0, 100, 300, 500, 800];
    score += points[linesCleared] ?? linesCleared * 200;
  }
}

// === Sterowanie ===
export function moveLeft() {
  const moved = activePiece.positions.map((p) => ({ x: p.x - 1, y: p.y }));
  if (!hasCollision(moved)) activePiece.positions = moved;
}

export function moveRight() {
  const moved = activePiece.positions.map((p) => ({ x: p.x + 1, y: p.y }));
  if (!hasCollision(moved)) activePiece.positions = moved;
}

export function softDrop() {
  const moved = activePiece.positions.map((p) => ({ x: p.x, y: p.y + 1 }));
  if (!hasCollision(moved)) {
    activePiece.positions = moved;
  } else {
    freezePiece(activePiece);
    spawnPiece();
  }
}

export function rotate() {
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

// === Aktualizacja gry ===
export function tick() {
  if (isGameOver) {
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
  nextPieces = [randomPiece(), randomPiece()]; // reset preview queue
  activePiece = nextPieces.shift()!;
  nextPieces.push(randomPiece());
}


export function setGameOverCallback(cb: (score: number) => void) {
  gameOverCallback = cb;
}


// === Renderowanie ===
export function render(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

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

  // wynik
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 20);

  // komunikat Game Over
  if (isGameOver) {
    const alpha = Math.min(1, gameOverFrame / 60); // fade-in przez 1s
    ctx.globalAlpha = alpha;

    ctx.fillStyle = "red";
    ctx.font = `bold ${40 + Math.sin(gameOverFrame / 10) * 5}px Arial`; // lekkie pulsowanie
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", WIDTH / 2, HEIGHT / 2);

    ctx.globalAlpha = 1;
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Press Enter to restart", WIDTH / 2, HEIGHT / 2 + 40);
  }
}

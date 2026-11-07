"use client";
import { useEffect, useReducer, useRef } from "react";
import { Flame, Star } from "lucide-react";
import { addCoins } from "@/lib/crackers";

type Cell = "you" | "cpu" | null;
type Result = { who: "you" | "cpu" | "draw"; line?: number[] };
type Score = { you: number; cpu: number; draw: number };
type State = { board: Cell[]; turn: "you" | "cpu"; score: Score };
type Action = { type: "play"; index: number } | { type: "cpu"; index: number } | { type: "reset" };

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

const blank = (): Cell[] => Array<Cell>(9).fill(null);

function getResult(board: Cell[]): Result | null {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { who: board[a] as "you" | "cpu", line };
    }
  }
  return board.every(Boolean) ? { who: "draw" } : null;
}

function chooseMove(board: Cell[]): number {
  const free = board.reduce<number[]>((acc, cell, i) => (cell ? acc : [...acc, i]), []);
  const findWin = (who: "you" | "cpu") => free.find((i) => {
    const next = board.slice();
    next[i] = who;
    return getResult(next)?.who === who;
  });

  const win = findWin("cpu");
  if (win !== undefined) return win;
  const block = findWin("you");
  if (block !== undefined) return block;
  if (!board[4]) return 4;
  const corners = [0, 2, 6, 8].filter((i) => !board[i]);
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
  return free[Math.floor(Math.random() * free.length)];
}

function addScore(score: Score, who: Result["who"]): Score {
  return who === "you" ? { ...score, you: score.you + 1 } : who === "cpu" ? { ...score, cpu: score.cpu + 1 } : { ...score, draw: score.draw + 1 };
}

function reducer(state: State, action: Action): State {
  if (action.type === "reset") return { ...state, board: blank(), turn: "you" };
  if (getResult(state.board)) return state;

  if (action.type === "play") {
    if (state.turn !== "you" || state.board[action.index]) return state;
    const next = state.board.slice();
    next[action.index] = "you";
    const result = getResult(next);
    return { board: next, turn: result ? state.turn : "cpu", score: result ? addScore(state.score, result.who) : state.score };
  }

  if (state.turn !== "cpu" || state.board[action.index]) return state;
  const next = state.board.slice();
  next[action.index] = "cpu";
  const result = getResult(next);
  return { board: next, turn: "you", score: result ? addScore(state.score, result.who) : state.score };
}

const initial: State = { board: blank(), turn: "you", score: { you: 0, cpu: 0, draw: 0 } };

export default function TicTacToe() {
  const [state, dispatch] = useReducer(reducer, initial);
  const { board, turn, score } = state;
  const result = getResult(board);
  const awarded = useRef(false);

  useEffect(() => {
    if (result?.who === "you" && !awarded.current) {
      awarded.current = true;
      addCoins(50);
    }
    if (result?.who !== "you") awarded.current = false;
  }, [result]);

  useEffect(() => {
    if (turn !== "cpu") return;
    const t = setTimeout(() => dispatch({ type: "cpu", index: chooseMove(board) }), 420);
    return () => clearTimeout(t);
  }, [turn, board]);

  const status = result
    ? result.who === "you"
      ? "You win — the diya glows brighter!"
      : result.who === "cpu"
        ? "The star takes this round."
        : "A draw — light another round."
    : turn === "you"
      ? "Your turn — place a diya."
      : "The star is thinking…";

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--cream-dim)]">You are the diya · Three in a row</p>

      <div className="mx-auto mt-4 grid max-w-[300px] grid-cols-3 gap-2" role="grid" aria-label="Tic tac toe board">
        {board.map((cell, i) => {
          const winning = result?.line?.includes(i);
          return (
            <button
              key={i}
              onClick={() => dispatch({ type: "play", index: i })}
              disabled={!!cell || !!result || turn !== "you"}
              aria-label={`Row ${Math.floor(i / 3) + 1} column ${(i % 3) + 1}${cell ? `, ${cell === "you" ? "diya" : "star"}` : ", empty"}`}
              className={`grid aspect-square place-items-center rounded-xl border transition-all duration-200 ${
                winning
                  ? "border-[var(--gold)] bg-[var(--gold)]/15 shadow-[0_0_22px_rgba(245,192,74,.35)]"
                  : "border-[var(--line)] bg-[#111833] enabled:hover:border-[var(--gold)]/60"
              }`}
            >
              {cell === "you" && <Flame size={30} className="text-[var(--gold)]" style={{ filter: "drop-shadow(0 0 6px rgba(245,192,74,.6))" }} />}
              {cell === "cpu" && <Star size={28} className="text-[#a9b6e8]" style={{ filter: "drop-shadow(0 0 6px rgba(169,182,232,.5))" }} />}
              {!cell && <span className="h-2 w-2 rounded-full bg-white/10" />}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 text-xs">
        <span className="rounded-full bg-white/5 px-3 py-1">Diya {score.you}</span>
        <span className="rounded-full bg-white/5 px-3 py-1">Draws {score.draw}</span>
        <span className="rounded-full bg-white/5 px-3 py-1">Star {score.cpu}</span>
      </div>

      <p aria-live="polite" className={`mt-3 text-center text-sm ${result ? "text-[var(--gold-soft)]" : "text-[var(--cream-dim)]"}`}>{status}</p>

      <button onClick={() => dispatch({ type: "reset" })} className="mt-4 w-full rounded-full bg-[var(--gold)] px-4 py-2.5 text-sm font-semibold text-[#16121b] hover:bg-[var(--gold-soft)]">New round</button>
    </div>
  );
}

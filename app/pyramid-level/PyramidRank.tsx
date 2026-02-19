"use client";
import { useState, useRef, useCallback } from "react";
import html2canvas from "html2canvas";

declare global {
  interface Window {
    html2canvas?: (element: HTMLElement, options?: Record<string, unknown>) => Promise<HTMLCanvasElement>;
  }
}

const DEFAULT_PLAYERS: string[] = [
  "Shamir", "Giovanne", "Alan G", "Marc", "Lucian", "Noriva",
  "João Paulo", "Sérgio", "Bozzola", "Carlinha", "Paulo", "Estefânia",
  "Valdo", "Micael", "Thiago", "Daniel T", "Daniel F", "Thayana",
  "Alex", "Heitor", "Jimmy", "Anselmo", "Jéssica", "Joaquim",
  "Giovanna", "Rafael"
];

interface TierColor {
  gradient: string;
  border: string;
  text: string;
  shadow: string;
  label: string;
}

const TIER_COLORS: TierColor[] = [
  { gradient: "linear-gradient(135deg, #fbbf24, #f59e0b)", border: "#fcd34d", text: "#78350f", shadow: "rgba(251,191,36,0.6)", label: "🥇" },
  { gradient: "linear-gradient(135deg, #cbd5e1, #94a3b8)", border: "#cbd5e1", text: "#1e293b", shadow: "rgba(148,163,184,0.6)", label: "🥈" },
  { gradient: "linear-gradient(135deg, #fb923c, #fbbf24)", border: "#fdba74", text: "#7c2d12", shadow: "rgba(251,146,60,0.6)", label: "🥉" },
  { gradient: "linear-gradient(135deg, #10b981, #059669)", border: "#6ee7b7", text: "#ffffff", shadow: "rgba(16,185,129,0.6)", label: "" },
  { gradient: "linear-gradient(135deg, #0ea5e9, #2563eb)", border: "#7dd3fc", text: "#ffffff", shadow: "rgba(14,165,233,0.6)", label: "" },
  { gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)", border: "#c4b5fd", text: "#ffffff", shadow: "rgba(139,92,246,0.6)", label: "" },
  { gradient: "linear-gradient(135deg, #f43f5e, #dc2626)", border: "#fca5a5", text: "#ffffff", shadow: "rgba(244,63,94,0.6)", label: "" },
  { gradient: "linear-gradient(135deg, #14b8a6, #0e7490)", border: "#5eead4", text: "#ffffff", shadow: "rgba(20,184,166,0.6)", label: "" },
  { gradient: "linear-gradient(135deg, #ec4899, #c026d3)", border: "#f9a8d4", text: "#ffffff", shadow: "rgba(236,72,153,0.6)", label: "" },
];

function buildRows(players: string[]): string[][] {
  const rows: string[][] = [];
  if (players.length === 0) return rows;
  rows.push([players[0]]);
  if (players.length > 1) rows.push(players.slice(1, 3));
  let i = 3;
  while (i < players.length) {
    rows.push(players.slice(i, i + 3));
    i += 3;
  }
  return rows;
}

interface PlayerCardProps {
  name: string;
  rank: number;
  colorIdx: number;
  isFirst: boolean;
}

function PlayerCard({ name, rank, colorIdx, isFirst }: PlayerCardProps) {
  const color = TIER_COLORS[Math.min(colorIdx, TIER_COLORS.length - 1)];

  return (
    <div
      className={`
        relative flex flex-col items-center justify-center
        rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl
        cursor-default select-none
        ${isFirst ? "w-40 h-20 md:w-52 md:h-24" : "w-32 h-16 md:w-40 md:h-20"}
      `}
      style={{
        backgroundImage: color.gradient,
        border: `2px solid ${color.border}`,
        boxShadow: `0 4px 24px ${color.shadow}`,
        fontFamily: "'Bebas Neue', sans-serif",
      }}
    >
      <span
        style={{
          color: color.text,
          opacity: 0.8,
          fontWeight: 900,
          letterSpacing: "0.15em",
          fontSize: isFirst ? "1.25rem" : "1rem",
        }}
      >
        {rank}°
      </span>

      <span
        style={{
          color: color.text,
          fontWeight: 700,
          fontSize: isFirst ? "1.1rem" : "0.9rem",
          textAlign: "center",
          padding: "0 4px",
        }}
      >
        {name}
      </span>

      {color.label && (
        <span style={{ position: "absolute", top: -10, right: -10, fontSize: "1.25rem" }}>
          {color.label}
        </span>
      )}
    </div>
  );
}

function PyramidView({ players }: { players: string[] }) {
  const rows = buildRows(players);

  return (
    <div className="flex flex-col items-center gap-3 w-full py-4">
      {rows.map((row, rowIdx) => {
        const startRank = rows.slice(0, rowIdx).reduce((s, r) => s + r.length, 0) + 1;
        const colorIdx = rowIdx;
        const isFirst = rowIdx === 0;
        const maxWidth = Math.min(900, 320 + (rows.length - 1 - rowIdx) * 60);

        return (
          <div key={rowIdx} className="flex items-center justify-center gap-3 w-full" style={{ maxWidth }}>
            {row.map((name, i) => (
              <PlayerCard
                key={name + i}
                name={name}
                rank={startRank + i}
                colorIdx={colorIdx}
                isFirst={isFirst}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default function PyramidRanking() {
  const [players, setPlayers] = useState<string[]>(DEFAULT_PLAYERS);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);
  const pyramidRef = useRef<HTMLDivElement | null>(null);

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      const node = pyramidRef.current;
      if (!node) return;

      const canvas = await html2canvas(node, {
        backgroundColor: "#0f0f1a",
        scale: 2,
        useCORS: true
      });

      const link = document.createElement("a");
      link.download = "ranking_piramide.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      alert("Erro ao exportar.");
    } finally {
      setExporting(false);
    }
  }, []);

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;700;900&display=swap');
          body { margin: 0; background: #0f0f1a; }
        `}
      </style>

      <div
        className="min-h-screen"
        style={{
          backgroundImage: "linear-gradient(to bottom, #0a0a0f, #0f0f1a, #0a0a0f)"
        }}
      >
        {/* HEADER */}
        <div className="w-full flex flex-col items-center pt-10 pb-4 relative mx-auto">
          <h1
            className="text-transparent bg-clip-text uppercase"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: "0.25em",
              fontSize: "3.5rem",
              backgroundImage: "linear-gradient(to bottom, #fcd34d, #d97706)",
            }}
          >
            Classificação
          </h1>

          <div
            className="mt-1 h-1 w-48 rounded-full"
            style={{
              backgroundImage: "linear-gradient(to right, transparent, #fbbf24, transparent)"
            }}
          />

          <p
            style={{
              color: "#9ca3af",
              marginTop: "6px",
              fontSize: "0.75rem",
              letterSpacing: "0.25em",
              fontFamily: "'Barlow Condensed', sans-serif",
              textTransform: "uppercase",
            }}
          >
            {players.length} participantes
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex gap-3 mb-6 mt-2">
          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all text-sm tracking-wider"
            style={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              color: "#d1d5db",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
            }}
          >
            ✏️ EDITAR RANKING
          </button>

          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all text-sm tracking-wider disabled:opacity-60"
            style={{
              backgroundColor: "#fbbf24",
              border: "1px solid #fbbf24",
              color: "#000",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 900,
              boxShadow: "0 0 12px rgba(251,191,36,0.3)",
            }}
          >
            {exporting ? "⏳ EXPORTANDO..." : "📥 EXPORTAR PNG"}
          </button>
        </div>

        {/* PYRAMID */}
        <div ref={pyramidRef} className="w-full max-w-3xl flex flex-col items-center px-4">
          <div
            className="w-full rounded-3xl shadow-2xl p-6"
            style={{
              backgroundImage: "linear-gradient(to bottom, rgba(17,17,17,0.8), rgba(10,10,10,0.8))",
              border: "1px solid rgba(75,75,75,0.5)",
            }}
          >
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: "0.2em",
                fontSize: "1.5rem",
                fontWeight: 900,
                color: "#fcd34d",
                textShadow: "0px 2px 2px #d97706",
              }}
            >
              🏆 RANKING OFICIAL 🏆
            </div>

            <PyramidView players={players} />
          </div>
        </div>

        {/* LEGEND */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-xl px-4">
          {TIER_COLORS.slice(0, 6).map((c, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundImage: c.gradient }}
              />
              <span
                style={{
                  color: "#9ca3af",
                  fontSize: "0.75rem",
                  fontFamily: "'Barlow Condensed', sans-serif",
                }}
              >
                {i === 0 ? "1°" : i === 1 ? "2°–3°" : i === 2 ? "4°–6°" : "..."}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

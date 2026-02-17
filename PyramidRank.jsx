"use client";
import { useState, useRef, useCallback } from "react";

const DEFAULT_PLAYERS = [
  "Shamir", "Giovanne", "Alan G", "Marc", "Lucian", "Noriva",
  "João Paulo", "Sérgio", "Bozzola", "Carlinha", "Paulo", "Estefânia",
  "Valdo", "Micael", "Thiago", "Daniel T", "Daniel F", "Thayana",
  "Alex", "Heitor", "Jimmy", "Anselmo", "Jéssica", "Joaquim",
  "Giovanna", "Rafael"
];

const TIER_COLORS = [
  { bg: "from-amber-400 to-yellow-500", border: "border-amber-300", text: "text-amber-900", shadow: "shadow-amber-400/60", label: "🥇" },
  { bg: "from-slate-300 to-slate-400", border: "border-slate-200", text: "text-slate-800", shadow: "shadow-slate-400/60", label: "🥈" },
  { bg: "from-orange-400 to-amber-500", border: "border-orange-300", text: "text-orange-900", shadow: "shadow-orange-400/60", label: "🥉" },
  { bg: "from-emerald-500 to-green-600", border: "border-emerald-300", text: "text-white", shadow: "shadow-emerald-500/60", label: "" },
  { bg: "from-sky-500 to-blue-600", border: "border-sky-300", text: "text-white", shadow: "shadow-sky-500/60", label: "" },
  { bg: "from-violet-500 to-purple-600", border: "border-violet-300", text: "text-white", shadow: "shadow-violet-500/60", label: "" },
  { bg: "from-rose-500 to-red-600", border: "border-rose-300", text: "text-white", shadow: "shadow-rose-500/60", label: "" },
  { bg: "from-teal-500 to-cyan-600", border: "border-teal-300", text: "text-white", shadow: "shadow-teal-500/60", label: "" },
  { bg: "from-pink-500 to-fuchsia-600", border: "border-pink-300", text: "text-white", shadow: "shadow-pink-500/60", label: "" },
];

function buildRows(players) {
  const rows = [];
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

function PlayerCard({ name, rank, colorIdx, isFirst }) {
  const color = TIER_COLORS[Math.min(colorIdx, TIER_COLORS.length - 1)];
  return (
    <div
      className={`
        relative flex flex-col items-center justify-center
        bg-gradient-to-br ${color.bg}
        border-2 ${color.border}
        rounded-xl shadow-lg ${color.shadow}
        transition-all duration-300 hover:scale-105 hover:shadow-2xl
        ${isFirst ? "w-40 h-20 md:w-52 md:h-24 text-lg" : "w-32 h-16 md:w-40 md:h-20 text-sm"}
        cursor-default select-none
      `}
      style={{
        boxShadow: `0 4px 24px 0 var(--tw-shadow-color, rgba(0,0,0,0.3))`,
        fontFamily: "'Bebas Neue', 'Anton', sans-serif",
      }}
    >
      <span className={`font-black tracking-widest ${color.text} opacity-80 ${isFirst ? "text-xl" : "text-base"}`}>
        {rank}°
      </span>
      <span className={`font-bold ${color.text} ${isFirst ? "text-lg" : "text-sm"} text-center leading-tight px-1`}>
        {name}
      </span>
      {color.label && (
        <span className="absolute -top-3 -right-2 text-xl">{color.label}</span>
      )}
    </div>
  );
}

function PyramidView({ players }) {
  const rows = buildRows(players);

  return (
    <div className="flex flex-col items-center gap-3 w-full py-4">
      {rows.map((row, rowIdx) => {
        const startRank = rows.slice(0, rowIdx).reduce((s, r) => s + r.length, 0) + 1;
        const colorIdx = rowIdx;
        const isFirst = rowIdx === 0;

        // Pyramid taper: widest at bottom, narrowest at top
        const maxWidth = Math.min(900, 320 + (rows.length - 1 - rowIdx) * 60);

        return (
          <div
            key={rowIdx}
            className="flex items-center justify-center gap-3 w-full"
            style={{ maxWidth }}
          >
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

function EditModal({ players, onSave, onClose }) {
  const [text, setText] = useState(players.join("\n"));

  const handleSave = () => {
    const parsed = text
      .split("\n")
      .map(l => l.replace(/^\d+[°º.)\s]+/, "").trim())
      .filter(Boolean);
    onSave(parsed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 flex flex-col gap-4">
        <h2 className="text-xl font-black text-white tracking-widest uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          ✏️ Editar Ranking
        </h2>
        <p className="text-gray-400 text-sm">Um nome por linha. A posição é determinada pela ordem.</p>
        <textarea
          className="w-full h-72 bg-gray-800 text-white rounded-xl p-3 text-sm resize-none border border-gray-700 focus:outline-none focus:border-amber-400 font-mono"
          value={text}
          onChange={e => setText(e.target.value)}
          spellCheck={false}
        />
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-700 text-gray-300 font-bold hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-amber-500 text-black font-black tracking-wider hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/40"
          >
            SALVAR
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PyramidRanking() {
  const [players, setPlayers] = useState(DEFAULT_PLAYERS);
  const [editOpen, setEditOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const pyramidRef = useRef(null);

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      const node = pyramidRef.current;
      if (!node) return;

      // Use html2canvas via CDN script dynamically
      if (!window.html2canvas) {
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
          s.onload = resolve;
          s.onerror = reject;
          document.head.appendChild(s);
        });
      }
      const canvas = await window.html2canvas(node, {
        backgroundColor: "#0f0f1a",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = "ranking_piramide.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      alert("Erro ao exportar. Tente novamente.");
    } finally {
      setExporting(false);
    }
  }, []);

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;700;900&display=swap');
        body { margin: 0; background: #0f0f1a; }
      `}</style>

      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-[#0f0f1a] to-gray-950 text-white flex flex-col items-center pb-12">
        {/* Header */}
        <div className="w-full flex flex-col items-center pt-10 pb-4 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-amber-400/10 to-amber-500/5 pointer-events-none" />
          <h1
            className="text-5xl md:text-7xl tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-600 uppercase"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.25em" }}
          >
            Classificação
          </h1>
          <div className="mt-1 h-1 w-48 rounded-full bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
          <p className="text-gray-500 mt-2 text-sm tracking-widest uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            {players.length} participantes
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-3 mb-6 mt-2">
          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 font-bold hover:bg-gray-700 hover:border-gray-500 transition-all text-sm tracking-wider"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            <span>✏️</span> EDITAR RANKING
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 border border-amber-400 text-black font-black hover:bg-amber-400 transition-all text-sm tracking-wider shadow-lg shadow-amber-500/30 disabled:opacity-60"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            <span>{exporting ? "⏳" : "📥"}</span>
            {exporting ? "EXPORTANDO..." : "EXPORTAR PNG"}
          </button>
        </div>

        {/* Pyramid */}
        <div
          ref={pyramidRef}
          className="w-full max-w-3xl flex flex-col items-center px-4"
          style={{ background: "transparent" }}
        >
          {/* Inner decorative bg for export */}
          <div className="w-full rounded-3xl bg-gradient-to-b from-gray-900/80 to-gray-950/80 border border-gray-800/60 shadow-2xl p-6 backdrop-blur-sm">
            <div
              className="text-center text-3xl tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-600 mb-4 font-black"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              🏆 RANKING OFICIAL 🏆
            </div>
            <PyramidView players={players} />
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-xl px-4">
          {["1°", "2°-3°", "4°-6°", "7°-9°", "10°-12°", "..."].map((label, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-sm bg-gradient-to-br ${TIER_COLORS[i]?.bg || "from-gray-600 to-gray-700"}`} />
              <span className="text-gray-400 text-xs" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {editOpen && (
        <EditModal
          players={players}
          onSave={setPlayers}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  );
}

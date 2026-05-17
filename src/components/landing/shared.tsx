'use client';
import { useState, useEffect } from 'react';
import { CircuitBoard } from 'lucide-react';

export const DISPLAY = "var(--font-display)";
export const BODY = "var(--font-body)";
export const MONO = "var(--font-mono)";

export function useCountUp(to: number, duration = 1600) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let t0: number | null = null;
    const tick = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to, duration]);
  return v;
}

export function PulseDot({ active = true }: { active?: boolean }) {
  return (
    <span className="relative flex h-2 w-2 flex-shrink-0">
      {active && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />}
      <span className={`relative inline-flex rounded-full h-2 w-2 ${active ? "bg-teal-400" : "bg-slate-600"}`} />
    </span>
  );
}

export function Brackets({ c = "border-teal-500/30" }: { c?: string }) {
  const b = `absolute w-3 h-3 border-[1.5px] ${c}`;
  return (
    <>
      <span className={`${b} top-2 left-2 border-r-0 border-b-0`} />
      <span className={`${b} top-2 right-2 border-l-0 border-b-0`} />
      <span className={`${b} bottom-2 left-2 border-r-0 border-t-0`} />
      <span className={`${b} bottom-2 right-2 border-l-0 border-t-0`} />
    </>
  );
}

export function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const box = size === "sm" ? "w-6 h-6" : "w-8 h-8";
  const ico = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  const txt = size === "sm" ? "text-base" : "text-lg";
  return (
    <div className="flex items-center gap-2.5">
      <div className={`${box} rounded bg-teal-500/10 border border-teal-500/30 flex items-center justify-center`}>
        <CircuitBoard className={`${ico} text-teal-400`} />
      </div>
      <span className={`${txt} font-black tracking-tight`} style={{ fontFamily: DISPLAY }}>
        <span className="text-teal-400">Lab</span>
        <span className="text-white">Track</span>
      </span>
    </div>
  );
}

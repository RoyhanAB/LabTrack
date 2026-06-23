'use client';
import { useState, useEffect } from 'react';
import { CircuitBoard } from 'lucide-react';
import Image from 'next/image';

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
      {active && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1D4ED8] opacity-75" />}
      <span className={`relative inline-flex rounded-full h-2 w-2 ${active ? "bg-[#1D4ED8]" : "bg-slate-600"}`} />
    </span>
  );
}

export function Brackets({ c = "border-[#1D4ED8]/30" }: { c?: string }) {
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

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "sm" ? "h-10 w-auto" : size === "lg" ? "h-20 w-auto" : "h-14 w-auto";
  
  return (
    <div className="flex items-center">
      {/* Use fixed intrinsic width/height to avoid hydration mismatches; CSS controls visual size */}
      <Image 
        src="/logo.png" 
        alt="LabTrack Logo" 
        width={320} 
        height={80} 
        className={`object-contain ${sizeClass}`} 
        priority
      />
    </div>
  );
}

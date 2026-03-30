import React from 'react';
import { motion } from 'motion/react';

interface VoltageMeterProps {
  value: number;
  min?: number;
  max?: number;
}

export const VoltageMeter: React.FC<VoltageMeterProps> = ({ value, min = -100, max = 60 }) => {
  const radius = 80;
  const strokeWidth = 12;
  const normalizedValue = Math.min(Math.max(value, min), max);
  const percentage = (normalizedValue - min) / (max - min);
  const rotation = percentage * 180 - 90; // -90 to 90 degrees

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-[#151619] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 opacity-50" />
      
      <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-4">
        Membrane Potential
      </div>

      <svg width="200" height="120" viewBox="0 0 200 120" className="drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
        {/* Background Arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#2a2b2f"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        
        {/* Scale Ticks */}
        {[-100, -80, -60, -40, -20, 0, 20, 40, 60].map((tick) => {
          const tickPercentage = (tick - min) / (max - min);
          const tickRotation = tickPercentage * 180 - 180;
          const x1 = 100 + 70 * Math.cos((tickRotation * Math.PI) / 180);
          const y1 = 100 + 70 * Math.sin((tickRotation * Math.PI) / 180);
          const x2 = 100 + 85 * Math.cos((tickRotation * Math.PI) / 180);
          const y2 = 100 + 85 * Math.sin((tickRotation * Math.PI) / 180);
          
          return (
            <g key={tick}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4a4b4f" strokeWidth="1" />
              <text
                x={100 + 95 * Math.cos((tickRotation * Math.PI) / 180)}
                y={100 + 95 * Math.sin((tickRotation * Math.PI) / 180)}
                fill="#666"
                fontSize="8"
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="monospace"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Needle */}
        <motion.g
          initial={false}
          animate={{ rotate: rotation }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
          style={{ originX: "100px", originY: "100px" }}
        >
          {/* Invisible anchor to keep bounding box stable */}
          <rect x="0" y="0" width="200" height="120" fill="none" pointerEvents="none" />
          <line x1="100" y1="100" x2="100" y2="30" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
          <circle cx="100" cy="100" r="4" fill="#ef4444" />
        </motion.g>
      </svg>

      <div className="mt-4 flex flex-col items-center">
        <div className="text-4xl font-mono font-bold text-white tracking-tighter">
          {value.toFixed(1)}
          <span className="text-sm text-zinc-500 ml-1">mV</span>
        </div>
        <div className="mt-1 px-2 py-0.5 bg-zinc-800 rounded text-[10px] font-mono text-zinc-400 uppercase tracking-tighter">
          Resting State
        </div>
      </div>
    </div>
  );
};

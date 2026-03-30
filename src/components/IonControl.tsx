import React from 'react';
import { IonData } from '../types';
import { ION_RANGES } from '../constants';

interface IonControlProps {
  ion: IonData;
  onChange: (updates: Partial<IonData>) => void;
}

export const IonControl: React.FC<IonControlProps> = ({ ion, onChange }) => {
  const ranges = ION_RANGES[ion.id as keyof typeof ION_RANGES];

  return (
    <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ion.color }} />
          <span className="font-bold text-zinc-200">{ion.name}</span>
          <span className="text-xs text-zinc-500 font-mono">{ion.symbol}</span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Concentration In */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono uppercase text-zinc-500">
            <span>[In] (mM)</span>
            <span className="text-zinc-300">{ion.concentrationIn.toFixed(ion.id === 'ca' ? 5 : 1)}</span>
          </div>
          <input
            type="range"
            min={ranges.in[0]}
            max={ranges.in[1]}
            step={ion.id === 'ca' ? 0.00001 : 1}
            value={ion.concentrationIn}
            onChange={(e) => onChange({ concentrationIn: parseFloat(e.target.value) })}
            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-400"
          />
        </div>

        {/* Concentration Out */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono uppercase text-zinc-500">
            <span>[Out] (mM)</span>
            <span className="text-zinc-300">{ion.concentrationOut.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={ranges.out[0]}
            max={ranges.out[1]}
            step={0.1}
            value={ion.concentrationOut}
            onChange={(e) => onChange({ concentrationOut: parseFloat(e.target.value) })}
            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-400"
          />
        </div>

        {/* Permeability */}
        {ion.id !== 'anions' && (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono uppercase text-zinc-500">
              <span>Permeability (P)</span>
              <span className="text-zinc-300">{ion.permeability.toFixed(4)}</span>
            </div>
            <input
              type="range"
              min={ranges.p[0]}
              max={ranges.p[1]}
              step={0.0001}
              value={ion.permeability}
              onChange={(e) => onChange({ permeability: parseFloat(e.target.value) })}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-400"
            />
          </div>
        )}
      </div>
    </div>
  );
};

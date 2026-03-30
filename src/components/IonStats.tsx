import React from 'react';
import { IonResult } from '../types';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface IonStatsProps {
  results: IonResult[];
}

export const IonStats: React.FC<IonStatsProps> = ({ results }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {results.map((res) => {
        // Direction logic:
        // For positive ions: DF > 0 means outward, DF < 0 means inward
        // For negative ions: DF > 0 means inward, DF < 0 means outward
        // (Assuming DF = Vm - Eion)
        const isPositive = !res.symbol.includes('⁻');
        const direction = res.drivingForce > 0 
          ? (isPositive ? 'Outward' : 'Inward')
          : (isPositive ? 'Inward' : 'Outward');
        
        const isZero = Math.abs(res.drivingForce) < 0.1;

        return (
          <div key={res.id} className="p-3 bg-zinc-900/40 rounded-lg border border-white/5 flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-zinc-300">{res.symbol}</span>
              {!isZero && (
                <div className={`flex items-center gap-1 text-[10px] font-mono ${direction === 'Inward' ? 'text-blue-400' : 'text-orange-400'}`}>
                  {direction === 'Inward' ? <ArrowDown size={10} /> : <ArrowUp size={10} />}
                  {direction}
                </div>
              )}
            </div>
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>Eion:</span>
              <span className="text-zinc-400">{res.nernstPotential.toFixed(1)} mV</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>DF:</span>
              <span className="text-zinc-400">{res.drivingForce.toFixed(1)} mV</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

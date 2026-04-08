import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { IonResult } from '../types';
import { DEFAULT_IONS } from '../constants';

interface DrivingForceChartProps {
  results: IonResult[];
}

export const DrivingForceChart: React.FC<DrivingForceChartProps> = ({ results }) => {
  const data = results.map(r => ({
    name: r.symbol,
    df: r.drivingForce,
    color: DEFAULT_IONS.find(i => i.id === r.id)?.color || '#fff'
  }));

  return (
    <div className="h-[250px] w-full bg-zinc-900/30 p-4 rounded-xl border border-white/5 relative">
      <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-4 text-center">
        Driving Force (z * (Vm - Eion))
      </div>
      
      {/* Directional Labels */}
      <div className="absolute left-2 top-12 bottom-12 flex flex-col justify-between pointer-events-none z-10">
        <span className="text-[8px] font-mono text-zinc-600 uppercase vertical-text transform -rotate-90 origin-left">Outward</span>
        <span className="text-[8px] font-mono text-zinc-600 uppercase vertical-text transform -rotate-90 origin-left">Inward</span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2b2f" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#71717a', fontSize: 12, fontFamily: 'monospace' }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'monospace' }} 
            unit="mV"
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
            itemStyle={{ fontSize: '12px', fontFamily: 'monospace' }}
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          />
          <ReferenceLine y={0} stroke="#444" />
          <Bar dataKey="df" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
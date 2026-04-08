import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, Cell } from 'recharts';
import { IonResult } from '../types';
import { DEFAULT_IONS } from '../constants';

interface ForceDecompositionChartProps {
  results: IonResult[];
}

export const ForceDecompositionChart: React.FC<ForceDecompositionChartProps> = ({ results }) => {
  const data = results.map(r => ({
    id: r.id,
    name: r.symbol,
    electrical: r.electricalForce,
    chemical: r.chemicalForce,
    color: DEFAULT_IONS.find(i => i.id === r.id)?.color || '#fff'
  }));

  // Find max absolute value to sync axes
  const allValues = results.flatMap(r => [r.electricalForce, r.chemicalForce]);
  const maxAbs = Math.max(...allValues.map(Math.abs), 10);
  const domain = [-maxAbs * 1.1, maxAbs * 1.1];

  return (
    <div className="h-[250px] w-full bg-zinc-900/30 p-4 rounded-xl border border-white/5 relative">
      <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-4 text-center">
        Force Decomposition (Electrical vs Chemical)
      </div>

      {/* Directional Labels */}
      <div className="absolute left-2 top-12 bottom-12 flex flex-col justify-between pointer-events-none z-10">
        <span className="text-[8px] font-mono text-zinc-600 uppercase vertical-text transform -rotate-90 origin-left">Outward</span>
        <span className="text-[8px] font-mono text-zinc-600 uppercase vertical-text transform -rotate-90 origin-left">Inward</span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: -10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2b2f" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#71717a', fontSize: 12, fontFamily: 'monospace' }} 
          />
          {/* Left Y-Axis for Electrical Force - No Ticks */}
          <YAxis 
            yAxisId="left"
            orientation="left"
            axisLine={false} 
            tickLine={false} 
            tick={false}
            domain={domain}
          />
          {/* Right Y-Axis for Chemical Force - No Ticks */}
          <YAxis 
            yAxisId="right"
            orientation="right"
            axisLine={false} 
            tickLine={false} 
            tick={false}
            domain={domain}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
            itemStyle={{ fontSize: '11px', fontFamily: 'monospace' }}
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', paddingTop: '10px' }}
            formatter={(value) => <span className="text-zinc-400">{value}</span>}
          />
          <ReferenceLine y={0} stroke="#444" yAxisId="left" />
          
          {/* Electrical Force: Shaded (Solid) */}
          <Bar 
            yAxisId="left"
            dataKey="electrical" 
            name="ELECTRICAL (SHADED)" 
            barSize={15}
            fill="#fff"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-elec-${index}`} fill={entry.color} />
            ))}
          </Bar>

          {/* Chemical Force: Open (Outline) */}
          <Bar 
            yAxisId="right"
            dataKey="chemical" 
            name="CHEMICAL (UNSHADED)" 
            barSize={15}
            fill="transparent"
            stroke="#fff"
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-chem-${index}`} stroke={entry.color} fill="transparent" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
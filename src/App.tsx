import React, { useState, useMemo } from 'react';
import { DEFAULT_IONS, DEFAULT_TEMP } from './constants';
import { runSimulation } from './utils/physics';
import { VoltageMeter } from './components/VoltageMeter';
import { IonControl } from './components/IonControl';
import { DrivingForceChart } from './components/DrivingForceChart';
import { ForceDecompositionChart } from './components/ForceDecompositionChart';
import { Activity, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [ions, setIons] = useState(DEFAULT_IONS);
  const [temp, setTemp] = useState(DEFAULT_TEMP);
  const [injectedCurrent, setInjectedCurrent] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [confirmStudentId, setConfirmStudentId] = useState('');
  const [error, setError] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [personalizedDefaults, setPersonalizedDefaults] = useState(DEFAULT_IONS);

  const simulationResult = useMemo(() => {
    return runSimulation(ions, temp, injectedCurrent);
  }, [ions, temp, injectedCurrent]);

  const handleIonChange = (id: string, updates: any) => {
    setIons(prev => prev.map(ion => ion.id === id ? { ...ion, ...updates } : ion));
  };

  const handleRestoreDefaults = () => {
    setIons(personalizedDefaults);
    setTemp(DEFAULT_TEMP);
    setInjectedCurrent(0);
  };

  const generatePersonalizedIons = (seed: number) => {
    let s = seed;
    // Simple seeded random (LCG)
    const next = () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };

    const getVal = (min: number, max: number) => min + next() * (max - min);

    return DEFAULT_IONS.map(ion => {
      const newIon = { ...ion };
      if (ion.id === 'k') {
        newIon.concentrationIn = getVal(100, 200);
        newIon.concentrationOut = getVal(0.1, 24);
      } else if (ion.id === 'na') {
        newIon.concentrationIn = getVal(1, 45);
        newIon.concentrationOut = getVal(110, 200);
      } else if (ion.id === 'cl') {
        newIon.concentrationIn = getVal(1, 70);
        newIon.concentrationOut = getVal(110, 200);
      } else if (ion.id === 'ca') {
        newIon.concentrationIn = getVal(0.00001, 0.045);
        newIon.concentrationOut = getVal(5, 10);
      }
      return newIon;
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentId !== confirmStudentId) {
      setError('Student IDs do not match');
      return;
    }
    if (studentId.length === 9 && /^\d+$/.test(studentId)) {
      const seed = parseInt(studentId, 10);
      const pDefaults = generatePersonalizedIons(seed);
      setPersonalizedDefaults(pDefaults);
      setIons(pDefaults);
      setIsAuthorized(true);
      setError('');
    } else {
      setError('ID must be 9 digits');
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 bg-zinc-900 rounded-2xl border border-white/10 shadow-2xl space-y-8"
        >
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center border border-white/10 mx-auto mb-4">
              <Activity className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight uppercase">NeuroRest Access</h1>
            <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest">9-Digit Student ID</label>
                <input
                  type="text"
                  maxLength={9}
                  placeholder="000000000"
                  value={studentId}
                  onChange={(e) => {
                    setStudentId(e.target.value.replace(/\D/g, ''));
                    setError('');
                  }}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-center tracking-[0.5em] focus:outline-none focus:border-zinc-500 transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest">Confirm 9-Digit Student ID</label>
                <input
                  type="text"
                  maxLength={9}
                  placeholder="000000000"
                  value={confirmStudentId}
                  onChange={(e) => {
                    setConfirmStudentId(e.target.value.replace(/\D/g, ''));
                    setError('');
                  }}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-center tracking-[0.5em] focus:outline-none focus:border-zinc-500 transition-colors"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] text-red-500 font-mono uppercase text-center tracking-widest"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={studentId.length !== 9 || confirmStudentId.length !== 9}
              className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase text-xs tracking-widest"
            >
              Enter Simulator
            </button>
          </form>
          
          <p className="text-[9px] text-center text-zinc-600 font-mono uppercase tracking-tighter">
            Authorized Educational Use Only
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-zinc-700">
      {/* Header */}
      <header className="border-bottom border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center border border-white/10">
              <Activity className="text-white" size={18} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight uppercase">
                NeuroRest <span className="ml-2 font-black text-zinc-400">{studentId}</span>
              </h1>
              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Membrane Potential Simulator</p>
            </div>
          </div>
          
            <div className="flex items-center gap-6">
              <button 
                onClick={handleRestoreDefaults}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-mono uppercase tracking-widest rounded-lg border border-white/10 transition-colors"
              >
                Restore Defaults
              </button>
              <button 
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-500 hover:text-white"
              >
                <Info size={20} />
              </button>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500">Ion Parameters</h2>
          </div>
          <div className="space-y-4">
            {ions.map(ion => (
              <IonControl 
                key={ion.id} 
                ion={ion} 
                onChange={(updates) => handleIonChange(ion.id, updates)} 
              />
            ))}
          </div>
        </div>

        {/* Right Column: Visualization */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
            {/* Main Meter */}
            <div className="space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500">Live Meter</h2>
              <VoltageMeter value={simulationResult.membranePotential} />
              
              {/* Injected Current Slider */}
              <div className="p-6 bg-zinc-900/50 rounded-2xl border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Injected Current</h3>
                  <div className="flex items-center gap-4">
                    {injectedCurrent !== 0 && (
                      <motion.button 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => setInjectedCurrent(0)}
                        className="text-[9px] font-mono text-zinc-400 hover:text-white uppercase tracking-widest bg-zinc-800 px-2 py-1 rounded border border-white/5 transition-all"
                      >
                        Set to Zero
                      </motion.button>
                    )}
                    <span className="text-xs font-mono text-zinc-300">{injectedCurrent > 0 ? '+' : ''}{injectedCurrent.toFixed(1)} <span className="text-zinc-500">nA</span></span>
                  </div>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="100"
                  step="0.1"
                  value={injectedCurrent}
                  onChange={(e) => setInjectedCurrent(parseFloat(e.target.value))}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-400"
                />
                <div className="flex justify-between text-[8px] font-mono text-zinc-600 uppercase">
                  <span>Hyperpolarizing</span>
                  <span>Depolarizing</span>
                </div>
              </div>
            </div>

            {/* Charts Column */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500">Force Analysis</h2>
                <DrivingForceChart results={simulationResult.ionResults} />
                <ForceDecompositionChart results={simulationResult.ionResults} />
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="p-6 bg-zinc-900 border border-white/10 rounded-2xl space-y-4"
              >
                <h3 className="text-sm font-bold text-white uppercase tracking-tight">How it works</h3>
                <div className="text-xs leading-relaxed text-zinc-400 space-y-2">
                  <p>
                    This simulator uses the <strong>GHK Current Equation</strong> to find the membrane potential (Vm) where the sum of all ionic currents equals zero.
                  </p>
                  <p>
                    Unlike the standard GHK Voltage Equation, this approach correctly handles divalent ions like <strong>Calcium (Ca²⁺)</strong> by solving for the root of the total current function numerically.
                  </p>
                  <p>
                    <strong>Driving Force (DF)</strong> is calculated as <code>Vm - Eion</code>. 
                  </p>
                  <p>
                    The <strong>Force Decomposition</strong> chart breaks this down into:
                    <br />• <strong>Electrical Force:</strong> <code>z · Vm</code> (The push/pull from the membrane voltage)
                    <br />• <strong>Chemical Force:</strong> <code>-z · Eion</code> (The push/pull from the concentration gradient)
                  </p>
                  <p>
                    When an ion is at equilibrium (Vm = Eion), these two bars will be <strong>equal and opposite</strong>, resulting in a net driving force of zero.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
          <span>NeuroRest v1.0</span>
          <span>Physiological Simulation Engine</span>
        </div>
      </footer>
    </div>
  );
}

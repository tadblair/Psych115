import { IonData, SimulationResult, IonResult } from "../types";

const R = 8.314; // Universal gas constant (J/(mol*K))
const F = 96485; // Faraday constant (C/mol)

/**
 * Calculates Nernst Potential for a single ion
 */
export function calculateNernst(ion: IonData, tempCelsius: number): number {
  if (ion.concentrationIn === 0 || ion.concentrationOut === 0) return 0;
  const T = tempCelsius + 273.15;
  const z = ion.charge;
  // E = (RT/zF) * ln([out]/[in])
  // Convert to mV: * 1000
  return ( (R * T) / (z * F) ) * Math.log(ion.concentrationOut / ion.concentrationIn) * 1000;
}

/**
 * GHK Current Equation for a single ion
 * I = P * z^2 * (Vm * F^2 / RT) * ([in] - [out] * exp(-zVmF/RT)) / (1 - exp(-zVmF/RT))
 */
export function calculateIonCurrent(Vm: number, ion: IonData, tempCelsius: number): number {
  if (ion.permeability === 0) return 0;
  
  const T = tempCelsius + 273.15;
  const z = ion.charge;
  const VmVolts = Vm / 1000;
  
  // Constant factor: F^2 / RT
  const factor = (F * F) / (R * T);
  
  // Exponent term: -z * Vm * F / RT
  const expTerm = Math.exp((-z * VmVolts * F) / (R * T));
  
  // Handle Vm = 0 case to avoid division by zero
  if (Math.abs(VmVolts) < 1e-9) {
    // Limit as Vm -> 0: I = P * z * F * ([in] - [out])
    return ion.permeability * z * F * (ion.concentrationIn - ion.concentrationOut);
  }

  const numerator = ion.concentrationIn - ion.concentrationOut * expTerm;
  const denominator = 1 - expTerm;
  
  return ion.permeability * z * z * VmVolts * factor * (numerator / denominator);
}

/**
 * Finds the membrane potential Vm where total current is zero using Bisection method
 */
export function solveMembranePotential(ions: IonData[], tempCelsius: number, injectedCurrent: number = 0): number {
  let low = -250; // mV
  let high = 250; // mV
  const tolerance = 1e-5;
  const maxIterations = 100;

  const getTotalCurrent = (Vm: number) => {
    // Total current = sum of ionic currents + injected current
    // Note: Ionic currents calculated here are in arbitrary "GHK-units" 
    // based on relative permeability and mM concentrations.
    // We scale the injected current (nA) to be comparable to these units.
    const CURRENT_SCALE = 1e5; 
    return ions.reduce((sum, ion) => sum + calculateIonCurrent(Vm, ion, tempCelsius), 0) - (injectedCurrent * CURRENT_SCALE);
  };

  for (let i = 0; i < maxIterations; i++) {
    const mid = (low + high) / 2;
    const currentMid = getTotalCurrent(mid);
    
    if (Math.abs(currentMid) < tolerance || (high - low) / 2 < tolerance) {
      return mid;
    }

    // Current is monotonic with Vm
    if (currentMid > 0) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return (low + high) / 2;
}

export function runSimulation(ions: IonData[], tempCelsius: number, injectedCurrent: number = 0): SimulationResult {
  const Vm = solveMembranePotential(ions, tempCelsius, injectedCurrent);
  
  const ionResults: IonResult[] = ions.map(ion => {
    const E = calculateNernst(ion, tempCelsius);
    return {
      id: ion.id,
      name: ion.name,
      symbol: ion.symbol,
      nernstPotential: E,
      drivingForce: ion.charge * (Vm - E),
      electricalForce: ion.charge * Vm,
      chemicalForce: -ion.charge * E,
      current: calculateIonCurrent(Vm, ion, tempCelsius)
    };
  });

  return {
    membranePotential: Vm,
    ionResults
  };
}

export interface IonData {
  id: string;
  name: string;
  symbol: string;
  charge: number;
  concentrationIn: number; // mM
  concentrationOut: number; // mM
  permeability: number; // relative or absolute (cm/s)
  color: string;
}

export interface SimulationState {
  ions: IonData[];
  temperature: number; // Celsius
}

export interface IonResult {
  id: string;
  name: string;
  symbol: string;
  nernstPotential: number; // mV
  drivingForce: number; // mV
  electricalForce: number; // z * Vm (mV equivalent)
  chemicalForce: number; // -z * Eion (mV equivalent)
  current: number; // relative
}

export interface SimulationResult {
  membranePotential: number; // mV
  ionResults: IonResult[];
}

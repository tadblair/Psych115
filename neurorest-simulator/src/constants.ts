import { IonData } from "./types";

export const DEFAULT_IONS: IonData[] = [
  {
    id: "k",
    name: "Potassium",
    symbol: "K⁺",
    charge: 1,
    concentrationIn: 140,
    concentrationOut: 5,
    permeability: 1,
    color: "#4ade80", // green-400
  },
  {
    id: "na",
    name: "Sodium",
    symbol: "Na⁺",
    charge: 1,
    concentrationIn: 15,
    concentrationOut: 145,
    permeability: 0.04,
    color: "#f87171", // red-400
  },
  {
    id: "cl",
    name: "Chloride",
    symbol: "Cl⁻",
    charge: -1,
    concentrationIn: 10,
    concentrationOut: 110,
    permeability: 0.45,
    color: "#fbbf24", // amber-400
  },
  {
    id: "ca",
    name: "Calcium",
    symbol: "Ca²⁺",
    charge: 2,
    concentrationIn: 0.0001,
    concentrationOut: 2,
    permeability: 0.0001,
    color: "#60a5fa", // blue-400
  },
];

export const ION_RANGES = {
  k: { in: [1, 200], out: [0.1, 50], p: [0, 1] },
  na: { in: [1, 100], out: [10, 200], p: [0, 1] },
  cl: { in: [1, 150], out: [10, 200], p: [0, 1] },
  ca: { in: [0.00001, 0.1], out: [0.1, 10], p: [0, 0.01] },
};

export const DEFAULT_TEMP = 37; // Body temp in Celsius
export const TEMP_RANGE = [0, 50]; // Realistic range

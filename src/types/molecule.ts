export type Hybridization = 'sp' | 'sp2' | 'sp3' | 'sp3d' | 'sp3d2' | 's';
export type ViewMode = 'ball-stick' | 'space-filling' | 'wireframe' | 'cartoon';

export interface Atom {
  id: string;
  symbol: string;
  name: string;
  position: [number, number, number];
  atomicNumber: number;
  electronegativity: number;
  valenceElectrons: number;
  hybridization: Hybridization;
  color: string;
}

export interface Bond {
  atom1: string;
  atom2: string;
  order: 1 | 2 | 3;
  length: number;
}

export interface BondAngle {
  atom1: string;
  vertex: string;
  atom2: string;
  degrees: number;
}

export interface VibrationMode {
  id: number;
  name: string;
  frequency: number; // cm⁻¹
  intensity: number;
  displacements: {
    atomId: string;
    vector: [number, number, number];
  }[];
}

export interface Molecule {
  id: string;
  name: string;
  formula: string;
  molarMass: number;
  
  // 3D structure
  pdbFile: string;
  molFile?: string;
  
  // Chemistry data
  atoms: Atom[];
  bonds: Bond[];
  bondAngles: BondAngle[];
  
  // Advanced visualizations
  electronDensity?: {
    file: string;
    isoLevel: number;
  };
  
  vibrationModes?: VibrationMode[];
  
  // Metadata
  description: string;
  uses: string[];
  hazards?: string[];
}

import { Molecule } from '@/types/molecule';

export const molecules: Molecule[] = [
  {
    id: 'h2o',
    name: 'Water',
    formula: 'H₂O',
    molarMass: 18.015,
    pdbFile: '/molecules/h2o.pdb',
    atoms: [
      {
        id: 'O1',
        symbol: 'O',
        name: 'Oxygen',
        position: [0, 0, 0],
        atomicNumber: 8,
        electronegativity: 3.44,
        valenceElectrons: 6,
        hybridization: 'sp3',
        color: '#ff0000'
      },
      {
        id: 'H1',
        symbol: 'H',
        name: 'Hydrogen',
        position: [0.757, 0.586, 0],
        atomicNumber: 1,
        electronegativity: 2.20,
        valenceElectrons: 1,
        hybridization: 's',
        color: '#ffffff'
      },
      {
        id: 'H2',
        symbol: 'H',
        name: 'Hydrogen',
        position: [-0.757, 0.586, 0],
        atomicNumber: 1,
        electronegativity: 2.20,
        valenceElectrons: 1,
        hybridization: 's',
        color: '#ffffff'
      }
    ],
    bonds: [
      { atom1: 'O1', atom2: 'H1', order: 1, length: 0.96 },
      { atom1: 'O1', atom2: 'H2', order: 1, length: 0.96 }
    ],
    bondAngles: [
      {
        atom1: 'H1',
        vertex: 'O1',
        atom2: 'H2',
        degrees: 104.5
      }
    ],
    description: 'The universal solvent, essential for all known forms of life.',
    uses: ['Drinking', 'Cleaning', 'Chemical reactions'],
    hazards: []
  },
  {
    id: 'ch4',
    name: 'Methane',
    formula: 'CH₄',
    molarMass: 16.043,
    pdbFile: '/molecules/ch4.pdb',
    atoms: [
      {
        id: 'C1',
        symbol: 'C',
        name: 'Carbon',
        position: [0, 0, 0],
        atomicNumber: 6,
        electronegativity: 2.55,
        valenceElectrons: 4,
        hybridization: 'sp3',
        color: '#333333'
      },
      {
        id: 'H1',
        symbol: 'H',
        name: 'Hydrogen',
        position: [0.629, 0.629, 0.629],
        atomicNumber: 1,
        electronegativity: 2.20,
        valenceElectrons: 1,
        hybridization: 's',
        color: '#ffffff'
      },
      {
        id: 'H2',
        symbol: 'H',
        name: 'Hydrogen',
        position: [-0.629, -0.629, 0.629],
        atomicNumber: 1,
        electronegativity: 2.20,
        valenceElectrons: 1,
        hybridization: 's',
        color: '#ffffff'
      },
      {
        id: 'H3',
        symbol: 'H',
        name: 'Hydrogen',
        position: [-0.629, 0.629, -0.629],
        atomicNumber: 1,
        electronegativity: 2.20,
        valenceElectrons: 1,
        hybridization: 's',
        color: '#ffffff'
      },
      {
        id: 'H4',
        symbol: 'H',
        name: 'Hydrogen',
        position: [0.629, -0.629, -0.629],
        atomicNumber: 1,
        electronegativity: 2.20,
        valenceElectrons: 1,
        hybridization: 's',
        color: '#ffffff'
      }
    ],
    bonds: [
      { atom1: 'C1', atom2: 'H1', order: 1, length: 1.09 },
      { atom1: 'C1', atom2: 'H2', order: 1, length: 1.09 },
      { atom1: 'C1', atom2: 'H3', order: 1, length: 1.09 },
      { atom1: 'C1', atom2: 'H4', order: 1, length: 1.09 }
    ],
    bondAngles: [
      {
        atom1: 'H1',
        vertex: 'C1',
        atom2: 'H2',
        degrees: 109.5
      }
    ],
    description: 'A simple hydrocarbon and major component of natural gas.',
    uses: ['Fuel', 'Chemical synthesis'],
    hazards: ['Flammable', 'Asphyxiant']
  }
];

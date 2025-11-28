export interface Compound {
  id: string;
  formula: string;
  name: string;
  type: 'acid' | 'base' | 'salt' | 'metal' | 'nonmetal' | 'oxide' | 'gas';
  color: string;
  state: 'solid' | 'liquid' | 'gas' | 'aqueous';
  commonUses?: string[];
  hazards?: string[];
}

export const compounds: Compound[] = [
  // Acids
  { id: 'hcl', formula: 'HCl', name: 'Hydrochloric Acid', type: 'acid', color: '#ef4444', state: 'aqueous' },
  { id: 'h2so4', formula: 'H₂SO₄', name: 'Sulfuric Acid', type: 'acid', color: '#dc2626', state: 'liquid' },
  { id: 'hno3', formula: 'HNO₃', name: 'Nitric Acid', type: 'acid', color: '#f87171', state: 'aqueous' },
  
  // Bases
  { id: 'naoh', formula: 'NaOH', name: 'Sodium Hydroxide', type: 'base', color: '#3b82f6', state: 'aqueous' },
  { id: 'koh', formula: 'KOH', name: 'Potassium Hydroxide', type: 'base', color: '#60a5fa', state: 'aqueous' },
  { id: 'caoh2', formula: 'Ca(OH)₂', name: 'Calcium Hydroxide', type: 'base', color: '#93c5fd', state: 'aqueous' },
  
  // Salts
  { id: 'nacl', formula: 'NaCl', name: 'Sodium Chloride', type: 'salt', color: '#f5f5f5', state: 'solid' },
  { id: 'agno3', formula: 'AgNO₃', name: 'Silver Nitrate', type: 'salt', color: '#e5e5e5', state: 'aqueous' },
  { id: 'ki', formula: 'KI', name: 'Potassium Iodide', type: 'salt', color: '#fef3c7', state: 'aqueous' },
  { id: 'baso4', formula: 'BaSO₄', name: 'Barium Sulfate', type: 'salt', color: '#fff', state: 'solid' },
  { id: 'cuso4', formula: 'CuSO₄', name: 'Copper(II) Sulfate', type: 'salt', color: '#0ea5e9', state: 'aqueous' },
  { id: 'feso4', formula: 'FeSO₄', name: 'Iron(II) Sulfate', type: 'salt', color: '#d4d4d8', state: 'aqueous' },
  { id: 'caco3', formula: 'CaCO₃', name: 'Calcium Carbonate', type: 'salt', color: '#fff', state: 'solid' },
  
  // Metals
  { id: 'fe', formula: 'Fe', name: 'Iron', type: 'metal', color: '#71717a', state: 'solid' },
  { id: 'cu', formula: 'Cu', name: 'Copper', type: 'metal', color: '#f97316', state: 'solid' },
  { id: 'zn', formula: 'Zn', name: 'Zinc', type: 'metal', color: '#94a3b8', state: 'solid' },
  { id: 'mg', formula: 'Mg', name: 'Magnesium', type: 'metal', color: '#cbd5e1', state: 'solid' },
  { id: 'al', formula: 'Al', name: 'Aluminum', type: 'metal', color: '#e2e8f0', state: 'solid' },
  { id: 'ag', formula: 'Ag', name: 'Silver', type: 'metal', color: '#f1f5f9', state: 'solid' },
  { id: 'pb', formula: 'Pb', name: 'Lead', type: 'metal', color: '#52525b', state: 'solid' },
  
  // Nonmetals & Gases
  { id: 'h2', formula: 'H₂', name: 'Hydrogen Gas', type: 'gas', color: '#e0f2fe', state: 'gas' },
  { id: 'o2', formula: 'O₂', name: 'Oxygen Gas', type: 'gas', color: '#dbeafe', state: 'gas' },
  { id: 'cl2', formula: 'Cl₂', name: 'Chlorine Gas', type: 'gas', color: '#bef264', state: 'gas' },
  { id: 'n2', formula: 'N₂', name: 'Nitrogen Gas', type: 'gas', color: '#e0e7ff', state: 'gas' },
  
  // Water & Common Compounds
  { id: 'h2o', formula: 'H₂O', name: 'Water', type: 'oxide', color: '#06b6d4', state: 'liquid' },
  { id: 'co2', formula: 'CO₂', name: 'Carbon Dioxide', type: 'gas', color: '#cbd5e1', state: 'gas' },
  { id: 'nh3', formula: 'NH₃', name: 'Ammonia', type: 'gas', color: '#e0e7ff', state: 'gas' },
];

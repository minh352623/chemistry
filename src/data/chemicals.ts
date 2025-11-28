import { Chemical } from '@/types/chemistry';

export const chemicals: Chemical[] = [
  {
    id: 'hcl',
    name: 'Hydrochloric Acid',
    formula: 'HCl',
    type: 'acid',
    state: 'liquid',
    color: 'clear',
    description: 'A strong, corrosive acid commonly used in laboratories and industry.',
    hazard: 'Corrosive',
    molarMass: 36.46
  },
  {
    id: 'naoh',
    name: 'Sodium Hydroxide',
    formula: 'NaOH',
    type: 'base',
    state: 'solid',
    color: 'white',
    description: 'A strong base, also known as lye, used in soap making and drain cleaning.',
    hazard: 'Corrosive',
    molarMass: 40.00
  },
  {
    id: 'nacl',
    name: 'Sodium Chloride',
    formula: 'NaCl',
    type: 'salt',
    state: 'solid',
    color: 'white',
    description: 'Common table salt, essential for life.',
    hazard: 'None',
    molarMass: 58.44
  },
  {
    id: 'h2o',
    name: 'Water',
    formula: 'H2O',
    type: 'neutral',
    state: 'liquid',
    color: 'clear',
    description: 'The universal solvent, essential for all known forms of life.',
    hazard: 'None',
    molarMass: 18.015
  },
  {
    id: 'cuso4',
    name: 'Copper(II) Sulfate',
    formula: 'CuSO4',
    type: 'salt',
    state: 'solid',
    color: 'blue',
    description: 'A bright blue salt used as a fungicide and herbicide.',
    hazard: 'Toxic',
    molarMass: 159.609
  },
  {
    id: 'fe',
    name: 'Iron',
    formula: 'Fe',
    type: 'metal',
    state: 'solid',
    color: 'gray',
    description: 'A strong, magnetic metal used in construction and manufacturing.',
    hazard: 'None',
    molarMass: 55.845
  },
  {
    id: 'zn',
    name: 'Zinc',
    formula: 'Zn',
    type: 'metal',
    state: 'solid',
    color: 'gray',
    description: 'A bluish-white metal used in galvanizing iron and steel.',
    hazard: 'Flammable (powder)',
    molarMass: 65.38
  },
  {
    id: 'h2so4',
    name: 'Sulfuric Acid',
    formula: 'H2SO4',
    type: 'acid',
    state: 'liquid',
    color: 'clear',
    description: 'A strong mineral acid, widely used in chemical synthesis.',
    hazard: 'Corrosive',
    molarMass: 98.079
  },
  {
    id: 'mg',
    name: 'Magnesium',
    formula: 'Mg',
    type: 'metal',
    state: 'solid',
    color: 'silver',
    description: 'A light, shiny gray metal that burns with a bright white light.',
    hazard: 'Flammable',
    molarMass: 24.305
  },
  {
    id: 'o2',
    name: 'Oxygen',
    formula: 'O2',
    type: 'gas',
    state: 'gas',
    color: 'colorless',
    description: 'A gas essential for respiration and combustion.',
    hazard: 'Oxidizer',
    molarMass: 31.999
  },
  {
    id: 'h2',
    name: 'Hydrogen',
    formula: 'H2',
    type: 'gas',
    state: 'gas',
    color: 'colorless',
    description: 'The lightest element, highly flammable.',
    hazard: 'Flammable',
    molarMass: 2.016
  },
  {
    id: 'co2',
    name: 'Carbon Dioxide',
    formula: 'CO2',
    type: 'gas',
    state: 'gas',
    color: 'colorless',
    description: 'A colorless gas produced by respiration and combustion.',
    hazard: 'Asphyxiant',
    molarMass: 44.01
  }
];

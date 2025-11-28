import { ParsedFormula } from './formulaParser';
import { ChemicalEquation } from './equationBalancer';

export enum ReactionType {
  REDOX = 'redox',
  PRECIPITATION = 'precipitation',
  ACID_BASE = 'acid-base',
  SINGLE_DISPLACEMENT = 'single-displacement',
  DOUBLE_DISPLACEMENT = 'double-displacement',
  DECOMPOSITION = 'decomposition',
  SYNTHESIS = 'synthesis',
  COMBUSTION = 'combustion'
}

export interface ReactionAnalysis {
  types: ReactionType[];
  precipitate?: {
    compound: string;
    color: string;
    description: string;
  };
  gas?: {
    compound: string;
    description: string;
  };
  colorChange?: {
    from: string;
    to: string;
  };
  isExothermic?: boolean;
}

export class ReactionAnalyzer {
  static analyze(equation: ChemicalEquation): ReactionAnalysis {
    const types: ReactionType[] = [];
    
    // Detect reaction types
    if (this.isAcidBase(equation)) {
      types.push(ReactionType.ACID_BASE);
    }
    
    if (this.hasPrecipitate(equation)) {
      types.push(ReactionType.PRECIPITATION);
    }
    
    if (this.isSingleDisplacement(equation)) {
      types.push(ReactionType.SINGLE_DISPLACEMENT);
    } else if (this.isDoubleDisplacement(equation)) {
      types.push(ReactionType.DOUBLE_DISPLACEMENT);
    }
    
    if (this.isDecomposition(equation)) {
      types.push(ReactionType.DECOMPOSITION);
    } else if (this.isSynthesis(equation)) {
      types.push(ReactionType.SYNTHESIS);
    }
    
    if (this.isCombustion(equation)) {
      types.push(ReactionType.COMBUSTION);
    }
    
    // Detect products
    const precipitate = this.detectPrecipitate(equation);
    const gas = this.detectGas(equation);
    
    return {
      types,
      precipitate,
      gas
    };
  }

  private static isAcidBase(equation: ChemicalEquation): boolean {
    // Check for H+ transfer or acid + base → salt + water pattern
    const hasAcid = equation.reactants.some(r => this.isAcid(r));
    const hasBase = equation.reactants.some(r => this.isBase(r));
    const hasWater = equation.products.some(p => this.isWater(p));
    
    return hasAcid && hasBase && hasWater;
  }

  private static isAcid(compound: ParsedFormula): boolean {
    // Simple check: starts with H
    const formula = compound.originalFormula.toUpperCase();
    return formula.startsWith('H') && formula.length > 1;
  }

  private static isBase(compound: ParsedFormula): boolean {
    // Check for OH- or metal oxides
    const formula = compound.originalFormula.toUpperCase();
    return formula.includes('OH') || formula.endsWith('O');
  }

  private static isWater(compound: ParsedFormula): boolean {
    return compound.elements.get('H') === 2 && 
           compound.elements.get('O') === 1 &&
           compound.elements.size === 2;
  }

  private static hasPrecipitate(equation: ChemicalEquation): boolean {
    return equation.products.some(p => 
      p.state === 'solid' || this.isInsoluble(p)
    );
  }

  private static isInsoluble(compound: ParsedFormula): boolean {
    // Simplified solubility rules
    const formula = compound.originalFormula;
    
    // Most chlorides, bromides, iodides are soluble except AgCl, PbCl2, etc.
    if (formula.includes('AgCl') || formula.includes('PbCl')) return true;
    
    // Most carbonates are insoluble except Group 1
    if (formula.includes('CO3') && !formula.startsWith('Na') && !formula.startsWith('K')) {
      return true;
    }
    
    // Most hydroxides are insoluble except Group 1 and Ba(OH)2
    if (formula.includes('OH') && !formula.startsWith('Na') && !formula.startsWith('K')) {
      return true;
    }
    
    return false;
  }

  private static isSingleDisplacement(equation: ChemicalEquation): boolean {
    // A + BC → AC + B pattern
    return equation.reactants.length === 2 && 
           equation.products.length === 2 &&
           equation.reactants.some(r => r.elements.size === 1);
  }

  private static isDoubleDisplacement(equation: ChemicalEquation): boolean {
    // AB + CD → AD + CB pattern
    return equation.reactants.length === 2 && 
           equation.products.length === 2 &&
           equation.reactants.every(r => r.elements.size >= 2);
  }

  private static isDecomposition(equation: ChemicalEquation): boolean {
    return equation.reactants.length === 1 && equation.products.length >= 2;
  }

  private static isSynthesis(equation: ChemicalEquation): boolean {
    return equation.reactants.length >= 2 && equation.products.length === 1;
  }

  private static isCombustion(equation: ChemicalEquation): boolean {
    // Check for O2 reactant and CO2 + H2O products
    const hasO2 = equation.reactants.some(r => 
      r.elements.get('O') === 2 && r.elements.size === 1
    );
    const hasCO2 = equation.products.some(p => 
      p.elements.get('C') === 1 && p.elements.get('O') === 2 && p.elements.size === 2
    );
    const hasH2O = equation.products.some(p => this.isWater(p));
    
    return hasO2 && (hasCO2 || hasH2O);
  }

  private static detectPrecipitate(equation: ChemicalEquation): {
    compound: string;
    color: string;
    description: string;
  } | undefined {
    for (const product of equation.products) {
      if (product.state === 'solid' || this.isInsoluble(product)) {
        return {
          compound: product.originalFormula,
          color: this.getPrecipitateColor(product),
          description: `${this.getPrecipitateColor(product)} precipitate`
        };
      }
    }
    return undefined;
  }

  private static getPrecipitateColor(compound: ParsedFormula): string {
    const formula = compound.originalFormula;
    
    // Common precipitate colors
    if (formula.includes('AgCl')) return 'white';
    if (formula.includes('Cu(OH)')) return 'blue';
    if (formula.includes('Fe(OH)3')) return 'brown';
    if (formula.includes('CaCO3')) return 'white';
    if (formula.includes('BaSO4')) return 'white';
    
    return 'white'; // default
  }

  private static detectGas(equation: ChemicalEquation): {
    compound: string;
    description: string;
  } | undefined {
    const gasCompounds = ['CO2', 'H2', 'O2', 'NH3', 'SO2', 'Cl2', 'N2'];
    
    for (const product of equation.products) {
      if (product.state === 'gas' || gasCompounds.some(g => product.originalFormula.includes(g))) {
        return {
          compound: product.originalFormula,
          description: `${product.originalFormula} gas evolved`
        };
      }
    }
    
    return undefined;
  }
}

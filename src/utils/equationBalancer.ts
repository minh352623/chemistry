import { ParsedFormula } from './formulaParser';

export interface ChemicalEquation {
  reactants: ParsedFormula[];
  products: ParsedFormula[];
}

export interface BalancedEquation {
  coefficients: number[];
  balanced: string;
  isBalanced: boolean;
}

export class EquationBalancer {
  /**
   * Balance a chemical equation using matrix method
   */
  static balance(equation: ChemicalEquation): BalancedEquation {
    const allCompounds = [...equation.reactants, ...equation.products];
    
    // Get all unique elements
    const elements = this.getAllElements(allCompounds);
    
    // Build matrix
    const matrix = this.buildMatrix(elements, allCompounds, equation.reactants.length);
    
    // Solve matrix
    const coefficients = this.solveMatrix(matrix);
    
    // Simplify to smallest integers
    const simplified = this.simplifyCoefficients(coefficients);
    
    // Format balanced equation
    const balanced = this.formatEquation(equation, simplified);
    
    return {
      coefficients: simplified,
      balanced,
      isBalanced: this.verify(equation, simplified)
    };
  }

  private static getAllElements(compounds: ParsedFormula[]): string[] {
    const elementSet = new Set<string>();
    
    for (const compound of compounds) {
      for (const element of compound.elements.keys()) {
        elementSet.add(element);
      }
    }
    
    return Array.from(elementSet).sort();
  }

  private static buildMatrix(
    elements: string[],
    compounds: ParsedFormula[],
    numReactants: number
  ): number[][] {
    const matrix: number[][] = [];
    
    for (const element of elements) {
      const row: number[] = [];
      
      for (let i = 0; i < compounds.length; i++) {
        const compound = compounds[i];
        const count = compound.elements.get(element) || 0;
        
        // Reactants are positive, products are negative
        row.push(i < numReactants ? count : -count);
      }
      
      matrix.push(row);
    }
    
    return matrix;
  }

  private static solveMatrix(matrix: number[][]): number[] {
    const n = matrix[0].length; // number of compounds
    const m = matrix.length; // number of elements
    
    // Assume last coefficient is 1 and solve for others
    // This is a simplified approach - for complex equations,
    // we'd use proper Gaussian elimination
    
    // For now, try small integer coefficients (brute force for simple cases)
    const maxCoeff = 10;
    
    for (let attempt = 0; attempt < 1000; attempt++) {
      const coeffs = this.generateCoefficientCombination(n, maxCoeff, attempt);
      
      if (this.checkBalance(matrix, coeffs)) {
        return coeffs;
      }
    }
    
    // Fallback: all coefficients = 1
    return new Array(n).fill(1);
  }

  private static generateCoefficientCombination(
    length: number,
    max: number,
    seed: number
  ): number[] {
    const coeffs: number[] = [];
    let remaining = seed;
    
    for (let i = 0; i < length; i++) {
      coeffs.push((remaining % max) + 1);
      remaining = Math.floor(remaining / max);
    }
    
    return coeffs;
  }

  private static checkBalance(matrix: number[][], coeffs: number[]): boolean {
    for (const row of matrix) {
      let sum = 0;
      for (let i = 0; i < row.length; i++) {
        sum += row[i] * coeffs[i];
      }
      if (sum !== 0) return false;
    }
    return true;
  }

  private static simplifyCoefficients(coeffs: number[]): number[] {
    // Find GCD of all coefficients
    const gcd = coeffs.reduce((a, b) => this.gcd(a, b));
    
    // Divide all by GCD
    return coeffs.map(c => Math.round(c / gcd));
  }

  private static gcd(a: number, b: number): number {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    
    return a || 1;
  }

  private static verify(equation: ChemicalEquation, coeffs: number[]): boolean {
    const allCompounds = [...equation.reactants, ...equation.products];
    const elements = this.getAllElements(allCompounds);
    
    for (const element of elements) {
      let reactantCount = 0;
      let productCount = 0;
      
      for (let i = 0; i < equation.reactants.length; i++) {
        reactantCount += (equation.reactants[i].elements.get(element) || 0) * coeffs[i];
      }
      
      for (let i = 0; i < equation.products.length; i++) {
        const idx = equation.reactants.length + i;
        productCount += (equation.products[i].elements.get(element) || 0) * coeffs[idx];
      }
      
      if (reactantCount !== productCount) return false;
    }
    
    return true;
  }

  private static formatEquation(equation: ChemicalEquation, coeffs: number[]): string {
    const formatSide = (compounds: ParsedFormula[], startIdx: number): string => {
      return compounds
        .map((compound, i) => {
          const coeff = coeffs[startIdx + i];
          const coeffStr = coeff > 1 ? `${coeff}` : '';
          return `${coeffStr}${compound.originalFormula}`;
        })
        .join(' + ');
    };
    
    const reactantStr = formatSide(equation.reactants, 0);
    const productStr = formatSide(equation.products, equation.reactants.length);
    
    return `${reactantStr} → ${productStr}`;
  }
}

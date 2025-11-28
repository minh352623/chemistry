export interface ParsedFormula {
  elements: Map<string, number>;
  charge?: number;
  state?: 'solid' | 'liquid' | 'gas' | 'aqueous';
  originalFormula: string;
}

export class FormulaParser {
  /**
   * Parse a chemical formula like Ca(OH)₂, Fe₂(SO₄)₃, H₂O(l)
   */
  static parse(formula: string): ParsedFormula {
    // Convert subscript numbers to regular numbers
    const normalized = this.normalizeSubscripts(formula);
    
    // Extract state if present
    const { formulaWithoutState, state } = this.extractState(normalized);
    
    // Extract charge if present
    const { formulaWithoutCharge, charge } = this.extractCharge(formulaWithoutState);
    
    // Parse the formula into elements
    const elements = this.parseElements(formulaWithoutCharge);
    
    return {
      elements,
      charge,
      state,
      originalFormula: formula
    };
  }

  private static normalizeSubscripts(formula: string): string {
    // Convert subscript numbers to regular numbers
    const subscriptMap: { [key: string]: string } = {
      '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
      '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9'
    };
    
    return formula.replace(/[₀-₉]/g, (match) => subscriptMap[match] || match);
  }

  private static extractState(formula: string): { 
    formulaWithoutState: string; 
    state?: 'solid' | 'liquid' | 'gas' | 'aqueous' 
  } {
    const stateMatch = formula.match(/\((s|l|g|aq)\)$/);
    
    if (!stateMatch) {
      return { formulaWithoutState: formula };
    }
    
    const stateMap: { [key: string]: 'solid' | 'liquid' | 'gas' | 'aqueous' } = {
      's': 'solid',
      'l': 'liquid',
      'g': 'gas',
      'aq': 'aqueous'
    };
    
    return {
      formulaWithoutState: formula.replace(/\((s|l|g|aq)\)$/, ''),
      state: stateMap[stateMatch[1]]
    };
  }

  private static extractCharge(formula: string): { 
    formulaWithoutCharge: string; 
    charge?: number 
  } {
    const chargeMatch = formula.match(/(\d*)([+-])$/);
    
    if (!chargeMatch) {
      return { formulaWithoutCharge: formula };
    }
    
    const magnitude = chargeMatch[1] ? parseInt(chargeMatch[1]) : 1;
    const sign = chargeMatch[2] === '+' ? 1 : -1;
    
    return {
      formulaWithoutCharge: formula.replace(/\d*[+-]$/, ''),
      charge: magnitude * sign
    };
  }

  private static parseElements(formula: string): Map<string, number> {
    const elements = new Map<string, number>();
    
    // Process formula recursively to handle parentheses
    this.processFormulaPart(formula, 1, elements);
    
    return elements;
  }

  private static processFormulaPart(
    formula: string,
    multiplier: number,
    elements: Map<string, number>
  ): void {
    let i = 0;
    
    while (i < formula.length) {
      // Handle opening parenthesis
      if (formula[i] === '(') {
        const closingIndex = this.findClosingParenthesis(formula, i);
        const insideParens = formula.substring(i + 1, closingIndex);
        
        // Get multiplier after closing parenthesis
        let j = closingIndex + 1;
        let multiplierStr = '';
        while (j < formula.length && /\d/.test(formula[j])) {
          multiplierStr += formula[j];
          j++;
        }
        
        const parenMultiplier = multiplierStr ? parseInt(multiplierStr) : 1;
        this.processFormulaPart(insideParens, multiplier * parenMultiplier, elements);
        
        i = j;
      }
      // Handle element
      else if (/[A-Z]/.test(formula[i])) {
        let element = formula[i];
        i++;
        
        // Check for lowercase letter (e.g., Ca, Cl)
        if (i < formula.length && /[a-z]/.test(formula[i])) {
          element += formula[i];
          i++;
        }
        
        // Get count
        let countStr = '';
        while (i < formula.length && /\d/.test(formula[i])) {
          countStr += formula[i];
          i++;
        }
        
        const count = countStr ? parseInt(countStr) : 1;
        const totalCount = count * multiplier;
        
        elements.set(element, (elements.get(element) || 0) + totalCount);
      }
      // Skip other characters
      else {
        i++;
      }
    }
  }

  private static findClosingParenthesis(formula: string, openIndex: number): number {
    let depth = 1;
    let i = openIndex + 1;
    
    while (i < formula.length && depth > 0) {
      if (formula[i] === '(') depth++;
      if (formula[i] === ')') depth--;
      i++;
    }
    
    return i - 1;
  }

  /**
   * Convert ParsedFormula back to string
   */
  static toString(parsed: ParsedFormula, includeState: boolean = false): string {
    let result = '';
    
    // Sort elements alphabetically (C and H first if organic)
    const sortedElements = Array.from(parsed.elements.entries()).sort((a, b) => {
      // Carbon first
      if (a[0] === 'C') return -1;
      if (b[0] === 'C') return 1;
      // Hydrogen second
      if (a[0] === 'H') return -1;
      if (b[0] === 'H') return 1;
      // Alphabetical
      return a[0].localeCompare(b[0]);
    });
    
    for (const [element, count] of sortedElements) {
      result += element;
      if (count > 1) {
        result += count;
      }
    }
    
    if (parsed.charge) {
      const absCharge = Math.abs(parsed.charge);
      result += absCharge > 1 ? absCharge : '';
      result += parsed.charge > 0 ? '+' : '-';
    }
    
    if (includeState && parsed.state) {
      const stateMap = {
        'solid': 's',
        'liquid': 'l',
        'gas': 'g',
        'aqueous': 'aq'
      };
      result += `(${stateMap[parsed.state]})`;
    }
    
    return result;
  }
}

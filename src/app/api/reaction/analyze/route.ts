import { NextRequest, NextResponse } from 'next/server';
import { FormulaParser } from '@/utils/formulaParser';
import { EquationBalancer } from '@/utils/equationBalancer';
import { ReactionAnalyzer } from '@/utils/reactionAnalyzer';
import { ChatGPTService } from '@/services/chatgptService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reactants, products, locale } = body;

    // Validate input
    if (!reactants || !products || reactants.length === 0 || products.length === 0) {
      return NextResponse.json(
        { error: 'Both reactants and products are required' },
        { status: 400 }
      );
    }

    // Parse formulas
    const parsedReactants = reactants.map((formula: string) => 
      FormulaParser.parse(formula)
    );
    const parsedProducts = products.map((formula: string) => 
      FormulaParser.parse(formula)
    );

    // Balance equation
    const balancedResult = EquationBalancer.balance({
      reactants: parsedReactants,
      products: parsedProducts
    });

    // Analyze reaction
    const analysis = ReactionAnalyzer.analyze({
      reactants: parsedReactants,
      products: parsedProducts
    });

    // Get AI explanation
    const explanation = await ChatGPTService.getExplanation({
      balanced: balancedResult.balanced,
      types: analysis.types,
      precipitate: analysis.precipitate,
      gas: analysis.gas,
      locale: locale || 'en'
    });

    // Return comprehensive results
    return NextResponse.json({
      success: true,
      balanced: balancedResult.balanced,
      coefficients: balancedResult.coefficients,
      isBalanced: balancedResult.isBalanced,
      types: analysis.types,
      precipitate: analysis.precipitate,
      gas: analysis.gas,
      colorChange: analysis.colorChange,
      explanation,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Reaction analysis error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze reaction',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

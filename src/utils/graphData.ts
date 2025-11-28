import { chemicals } from '../data/chemicals';
import { Chemical } from '@/types/chemistry';
import reactionsData from '../data/reactions.json';

// Define types for our graph data
export interface GraphNode {
  data: {
    id: string;
    label: string;
    type: 'chemical' | 'reaction' | 'concept';
    color?: string;
    [key: string]: any;
  };
  position?: { x: number; y: number };
}

export interface GraphEdge {
  data: {
    id: string;
    source: string;
    target: string;
    label?: string;
    type?: 'reactant' | 'product' | 'related';
    color?: string;
  };
}

export const getGraphElements = () => {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const addedChemicals = new Set<string>();

  // 1. Add Chemical Nodes
  chemicals.forEach((chem: Chemical) => {
    nodes.push({
      data: {
        ...chem,
        id: chem.id,
        label: chem.name,
        type: 'chemical',
        color: getChemicalColor(chem.type),
      }
    });
    addedChemicals.add(chem.id);
  });

  // 2. Add Reaction Nodes and Edges
  // Cast to any to avoid strict type checking on JSON import
  const reactions = (reactionsData as any).reactions || [];
  
  reactions.forEach((reaction: any, index: number) => {
    const reactionNodeId = `reaction-${reaction.id}`;
    
    // Add Reaction Node
    nodes.push({
      data: {
        id: reactionNodeId,
        label: reaction.type.charAt(0).toUpperCase() + reaction.type.slice(1),
        type: 'reaction',
        color: '#94a3b8', // Slate-400
        ...reaction
      }
    });

    // Add Edges from Reactants -> Reaction Node
    reaction.reactants.forEach((reactantId: string) => {
      if (addedChemicals.has(reactantId)) {
        edges.push({
          data: {
            id: `${reactantId}-${reactionNodeId}`,
            source: reactantId,
            target: reactionNodeId,
            type: 'reactant',
            color: '#cbd5e1' // Slate-300
          }
        });
      }
    });

    // Add Edges from Reaction Node -> Products
    reaction.products.forEach((productId: string) => {
      // Note: Products in JSON might be names or IDs. 
      // For simplicity, we'll try to find the ID if it matches a chemical name
      let targetId = productId;
      const productChem = chemicals.find(c => c.name === productId || c.id === productId);
      if (productChem) {
        targetId = productChem.id;
      }

      if (addedChemicals.has(targetId)) {
        edges.push({
          data: {
            id: `${reactionNodeId}-${targetId}`,
            source: reactionNodeId,
            target: targetId,
            type: 'product',
            color: '#10b981' // Emerald-500 (Green for output)
          }
        });
      }
    });
  });

  return [...nodes, ...edges];
};

// Helper to get color based on chemical type
const getChemicalColor = (type: string) => {
  switch (type) {
    case 'acid': return '#ef4444'; // Red
    case 'base': return '#3b82f6'; // Blue
    case 'salt': return '#10b981'; // Green
    case 'metal': return '#eab308'; // Yellow
    case 'water': return '#06b6d4'; // Cyan
    case 'indicator': return '#a855f7'; // Purple
    default: return '#64748b'; // Slate
  }
};

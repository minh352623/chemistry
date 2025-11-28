'use client';

import React, { useEffect, useRef, useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import { getGraphElements } from '@/utils/graphData';

interface GraphCanvasProps {
  onNodeClick: (nodeData: any) => void;
}

export default function GraphCanvas({ onNodeClick }: GraphCanvasProps) {
  const [elements, setElements] = useState<any[]>([]);
  const cyRef = useRef<cytoscape.Core | null>(null);

  useEffect(() => {
    const graphElements = getGraphElements();
    setElements(graphElements);
  }, []);

  const layout = {
    name: 'cose', // Physics-based force-directed layout
    animate: true,
    animationDuration: 1000,
    fit: true, // Fit to viewport
    padding: 50,
    randomize: true, // Random initial positions
    nodeRepulsion: 8000, // How much nodes push away from each other
    idealEdgeLength: 100, // Preferred edge length
    edgeElasticity: 100,
    nestingFactor: 1.2,
    gravity: 1, // Pull towards center
    numIter: 1000,
    initialTemp: 200,
    coolingFactor: 0.95,
    minTemp: 1.0
  };

  const stylesheet: any[] = [
    {
      selector: 'node',
      style: {
        'label': 'data(label)',
        'text-valign': 'bottom',
        'text-halign': 'center',
        'text-margin-y': 8,
        'font-size': '12px',
        'font-family': 'Poppins, sans-serif',
        'color': '#475569', // Slate-600
        'background-color': 'data(color)',
        'width': 40,
        'height': 40,
        'border-width': 2,
        'border-color': '#fff',
        'overlay-opacity': 0,
        'transition-property': 'background-color, width, height, border-width',
        'transition-duration': 300,
      } as any
    },
    {
      selector: 'node[type="reaction"]',
      style: {
        'shape': 'round-rectangle',
        'width': 60,
        'height': 30,
        'font-size': '10px',
        'text-valign': 'center',
        'text-margin-y': 0,
        'color': '#fff',
        'background-opacity': 0.8,
      } as any
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#cbd5e1', // Slate-300
        'target-arrow-color': '#cbd5e1',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'arrow-scale': 1.2,
      } as any
    },
    {
      selector: 'edge[type="product"]',
      style: {
        'line-color': '#10b981', // Emerald-500
        'target-arrow-color': '#10b981',
      } as any
    },
    {
      selector: ':selected',
      style: {
        'border-width': 4,
        'border-color': '#6366f1', // Indigo-500
        'width': 50,
        'height': 50,
      } as any
    }
  ];

  const handleCy = (cy: cytoscape.Core) => {
    cyRef.current = cy;
    
    cy.on('tap', 'node', (event) => {
      const node = event.target;
      onNodeClick(node.data());
      
      // Center on clicked node
      cy.animate({
        center: { eles: node },
        zoom: 1.5,
        duration: 500
      });
    });

    cy.on('tap', (event) => {
      if (event.target === cy) {
        onNodeClick(null);
      }
    });
  };

  return (
    <div className="w-full h-full bg-slate-50">
      <CytoscapeComponent
        elements={elements}
        style={{ width: '100%', height: '100%' }}
        stylesheet={stylesheet}
        layout={layout}
        cy={handleCy}
        wheelSensitivity={0.2}
      />
    </div>
  );
}

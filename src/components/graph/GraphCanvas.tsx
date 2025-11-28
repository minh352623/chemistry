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
    console.log('Graph elements:', graphElements);
    if (graphElements && graphElements.length > 0) {
      setElements(graphElements);
    }
  }, []);

  const layout = {
    name: 'cose',
    animate: true,
    animationDuration: 1500,
    animationEasing: 'ease-out',
    fit: true,
    padding: 80,
    randomize: true,
    componentSpacing: 120,
    nodeRepulsion: 12000, // Increased for more spacing
    idealEdgeLength: 120, // Longer edges for better spread
    edgeElasticity: 150,
    nestingFactor: 1.5,
    gravity: 0.8, // Reduced gravity for wider spread
    numIter: 1500, // More iterations for better settling
    initialTemp: 250,
    coolingFactor: 0.98,
    minTemp: 1.0,
    // Add quality of life improvements
    nodeOverlap: 20,
    refresh: 20,
    boundingBox: undefined,
    avoidOverlap: true
  };

  const stylesheet: any[] = [
    {
      selector: 'node',
      style: {
        'label': 'data(label)',
        'text-valign': 'bottom',
        'text-halign': 'center',
        'text-margin-y': 10,
        'font-size': '13px',
        'font-family': 'Poppins, sans-serif',
        'font-weight': '500',
        'color': '#1e293b',
        'text-background-color': '#ffffff',
        'text-background-opacity': 0.9,
        'text-background-padding': '4px',
        'text-background-shape': 'roundrectangle',
        'background-color': 'data(color)',
        'width': 50,
        'height': 50,
        'border-width': 3,
        'border-color': '#fff',
        'border-opacity': 0.9,
        'overlay-opacity': 0,
        'transition-property': 'background-color, width, height, border-width',
        'transition-duration': 300,
        'box-shadow': '0 4px 6px rgba(0, 0, 0, 0.1)'
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

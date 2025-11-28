'use client';

import { useRef, useEffect, useState } from 'react';
import { ViewMode } from '@/types/molecule';

interface ViewerCanvasProps {
  moleculeId: string;
  viewMode: ViewMode;
  onAtomClick?: (atomData: any) => void;
  showAngles?: boolean;
  showHybridization?: boolean;
}

export default function ViewerCanvas({
  moleculeId,
  viewMode,
  onAtomClick,
  showAngles = false,
  showHybridization = false
}: ViewerCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Dynamically import 3Dmol to avoid SSR issues
    const init3DMol = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // @ts-ignore - 3Dmol types
        const $3Dmol = (await import('3dmol')).default;

        // Create viewer
        const config = {
          backgroundColor: 'rgba(10, 14, 39, 0.5)',
         };
        
        const viewer = $3Dmol.createViewer(containerRef.current, config);
        viewerRef.current = viewer;

        // Load PDB file
        const response = await fetch(`/molecules/${moleculeId}.pdb`);
        if (!response.ok) {
          throw new Error(`Failed to load molecule: ${moleculeId}`);
        }
        
        const pdbData = await response.text();
        
        // Add model
        viewer.addModel(pdbData, 'pdb');
        
        // Apply style based on view mode
        applyViewMode(viewer, viewMode);
        
        // Add click handler
        viewer.setClickable({}, true, (atom: any, viewer: any, event: any, container: any) => {
          if (onAtomClick) {
            onAtomClick({
              element: atom.elem,
              serial: atom.serial,
              position: atom,
              ...atom
            });
          }
        });

        // Auto-rotate
        viewer.rotate(1);
        viewer.zoom(1.2);
        viewer.render();
        
        // Start auto-spin animation
        let frame = 0;
        const animate = () => {
          if (viewerRef.current) {
            viewer.rotate(0.5, { x: 0, y: 1, z: 0 });
            viewer.render();
            frame = requestAnimationFrame(animate);
          }
        };
        animate();

        setIsLoading(false);

        // Cleanup
        return () => {
          cancelAnimationFrame(frame);
        };
      } catch (err) {
        console.error('3Dmol initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load molecule');
        setIsLoading(false);
      }
    };

    init3DMol();

    return () => {
      if (viewerRef.current) {
        viewerRef.current.clear();
      }
    };
  }, [moleculeId, onAtomClick]);

  // Update style when view mode changes
  useEffect(() => {
    if (viewerRef.current) {
      applyViewMode(viewerRef.current, viewMode);
      viewerRef.current.render();
    }
  }, [viewMode]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-900/50 rounded-lg">
        <div className="text-center p-6">
          <div className="text-red-400 text-xl mb-2">⚠️</div>
          <p className="text-red-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden border border-cyan-500/20 shadow-2xl">
      {/* 3Dmol.js Container */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 w-full h-full"
        style={{ width: '100%', height: '100%', position: 'relative' }}
      />
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="inline-block w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
            <p className="text-cyan-300">Loading molecule...</p>
          </div>
        </div>
      )}

      {/* Watermark */}
      <div className="absolute bottom-4 right-4 text-xs text-white/30 pointer-events-none">
        Powered by 3Dmol.js
      </div>
    </div>
  );
}

function applyViewMode(viewer: any, mode: ViewMode) {
  viewer.setStyle({}, {}); // Clear all styles first
  
  switch (mode) {
    case 'ball-stick':
      viewer.setStyle({}, {
        stick: { radius: 0.15, colorscheme: 'Jmol' },
        sphere: { scale: 0.3, colorscheme: 'Jmol' }
      });
      break;
    case 'space-filling':
      viewer.setStyle({}, {
        sphere: { scale: 1.0, colorscheme: 'Jmol' }
      });
      break;
    case 'wireframe':
      viewer.setStyle({}, {
        line: { colorscheme: 'Jmol' }
      });
      break;
    case 'cartoon':
      viewer.setStyle({}, {
        cartoon: { color: 'spectrum' }
      });
      break;
  }
}

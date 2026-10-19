import React, { useRef, useState, useEffect } from 'react';
import { useStudio } from '../context/StudioContext';
import { SceneNode } from '../types';

export const Canvas: React.FC = () => {
  const { 
    nodes, 
    selectedIds, 
    selectNode, 
    clearSelection, 
    updateNode, 
    activeTool, 
    zoom, 
    setZoom, 
    pan, 
    setPan 
  } = useStudio();

  const containerRef = useRef<HTMLDivElement>(null);
  
  // Dragging states
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [nodeInitialPos, setNodeInitialPos] = useState({ x: 0, y: 0 });

  // Resizing states
  const [resizingNodeId, setResizingNodeId] = useState<string | null>(null);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState({ mouseX: 0, mouseY: 0, w: 0, h: 0, x: 0, y: 0 });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === ' ' && !isPanning) {
        // Spacebar panning
        setIsPanning(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setIsPanning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPanning]);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      setZoom(z => Math.min(3, Math.max(0.2, Math.round(z * zoomFactor * 100) / 100)));
    } else {
      setPan(p => ({
        x: p.x - e.deltaX,
        y: p.y - e.deltaY
      }));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool === 'pan' || isPanning || e.button === 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }

    if (e.target === containerRef.current) {
      clearSelection();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
      return;
    }

    if (draggingNodeId) {
      const dx = (e.clientX - dragStartPos.x) / zoom;
      const dy = (e.clientY - dragStartPos.y) / zoom;
      updateNode(draggingNodeId, {
        x: Math.round(nodeInitialPos.x + dx),
        y: Math.round(nodeInitialPos.y + dy)
      });
      return;
    }

    if (resizingNodeId && resizeHandle) {
      const dx = (e.clientX - resizeStart.mouseX) / zoom;
      const dy = (e.clientY - resizeStart.mouseY) / zoom;

      let newW = resizeStart.w;
      let newH = resizeStart.h;
      let newX = resizeStart.x;
      let newY = resizeStart.y;

      if (resizeHandle.includes('e')) newW = Math.max(20, Math.round(resizeStart.w + dx));
      if (resizeHandle.includes('s')) newH = Math.max(20, Math.round(resizeStart.h + dy));
      if (resizeHandle.includes('w')) {
        const wCandidate = Math.max(20, Math.round(resizeStart.w - dx));
        newX = Math.round(resizeStart.x + (resizeStart.w - wCandidate));
        newW = wCandidate;
      }
      if (resizeHandle.includes('n')) {
        const hCandidate = Math.max(20, Math.round(resizeStart.h - dy));
        newY = Math.round(resizeStart.y + (resizeStart.h - hCandidate));
        newH = hCandidate;
      }

      updateNode(resizingNodeId, {
        x: newX,
        y: newY,
        width: newW,
        height: newH
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
    setResizingNodeId(null);
    setResizeHandle(null);
  };

  // Node selection and drag start
  const handleNodeMouseDown = (e: React.MouseEvent, node: SceneNode) => {
    if (activeTool === 'pan' || isPanning || e.button === 1) return;
    e.stopPropagation();

    selectNode(node.id, e.shiftKey);
    setDraggingNodeId(node.id);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    setNodeInitialPos({ x: node.x, y: node.y });
  };

  // Resize handle drag start
  const handleResizeHandleMouseDown = (e: React.MouseEvent, node: SceneNode, handle: string) => {
    e.stopPropagation();
    setResizingNodeId(node.id);
    setResizeHandle(handle);
    setResizeStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      w: node.width,
      h: node.height,
      x: node.x,
      y: node.y
    });
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`flex-1 relative overflow-hidden bg-studio-bg cursor-${
        isPanning || activeTool === 'pan' ? 'grab active:cursor-grabbing' : 'default'
      }`}
    >
      {/* Infinite Canvas Grid Layer */}
      <div 
        className="absolute inset-0 pointer-events-none canvas-grid opacity-70"
        style={{
          backgroundPosition: `${pan.x}px ${pan.y}px`,
          backgroundSize: `${24 * zoom}px ${24 * zoom}px`
        }}
      />

      {/* World Coordinates Container */}
      <div
        className="absolute top-0 left-0 origin-top-left transition-transform duration-75"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
        }}
      >
        {nodes.map(node => {
          const isSelected = selectedIds.includes(node.id);
          const isArtboard = node.type === 'artboard';

          return (
            <div
              key={node.id}
              id={`canvas-node-${node.id}`}
              onMouseDown={(e) => handleNodeMouseDown(e, node)}
              className={`absolute select-none cursor-pointer transition-shadow ${
                isSelected ? 'ring-2 ring-studio-accent shadow-xl z-20' : 'hover:ring-1 hover:ring-white/20'
              }`}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                width: `${node.width}px`,
                height: `${node.height}px`,
                backgroundColor: node.fill || 'transparent',
                borderColor: node.stroke || 'transparent',
                borderWidth: node.strokeWidth ? `${node.strokeWidth}px` : '0px',
                borderStyle: node.strokeWidth ? 'solid' : 'none',
                borderRadius: node.borderRadius ? `${node.borderRadius}px` : '0px',
                opacity: node.opacity ?? 1,
                boxShadow: node.shadow || 'none',
                zIndex: isArtboard ? 1 : isSelected ? 20 : 5
              }}
            >
              {/* Artboard or Component Tag Header */}
              {(isArtboard || node.isMasterComponent || node.transitionKey) && (
                <div 
                  className="absolute -top-6 right-0 flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium pointer-events-none select-none"
                  style={{
                    backgroundColor: isArtboard ? 'rgba(30, 30, 36, 0.9)' : 'rgba(255, 51, 102, 0.2)',
                    color: isArtboard ? '#8E8EA0' : '#FF3366',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  <span>{node.name}</span>
                  {node.isMasterComponent && <span className="text-[9px] px-1 bg-studio-accent text-white rounded">Master</span>}
                  {node.transitionKey && <span className="text-[9px] px-1 bg-cyan-500/20 text-cyan-400 rounded">Auto-Animate</span>}
                </div>
              )}

              {/* Node Internal Render according to type */}
              {node.type === 'text' && (
                <div 
                  className="w-full h-full flex items-center px-1 overflow-hidden pointer-events-none"
                  style={{
                    fontSize: `${node.fontSize || 14}px`,
                    fontWeight: node.fontWeight || 'normal',
                    color: node.textColor || '#FFFFFF',
                    textAlign: node.textAlign || 'left',
                    justifyContent: node.textAlign === 'center' ? 'center' : node.textAlign === 'right' ? 'flex-end' : 'flex-start'
                  }}
                >
                  {node.content || node.name}
                </div>
              )}

              {node.type === 'button' && (
                <div className="w-full h-full flex items-center justify-center font-medium pointer-events-none"
                  style={{
                    fontSize: `${node.fontSize || 14}px`,
                    fontWeight: node.fontWeight || '600',
                    color: node.textColor || '#FFFFFF'
                  }}
                >
                  {node.content || node.name}
                </div>
              )}

              {/* Selection Transform & Resize Handles (8 handles) */}
              {isSelected && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Outer glow line */}
                  <div className="absolute -inset-[2px] border border-studio-accent/70 pointer-events-none" />

                  {/* 8 Resize Handles */}
                  {[
                    { h: 'nw', cls: '-top-1.5 -left-1.5 cursor-nwse-resize' },
                    { h: 'n', cls: '-top-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize' },
                    { h: 'ne', cls: '-top-1.5 -right-1.5 cursor-nesw-resize' },
                    { h: 'e', cls: 'top-1/2 -right-1.5 -translate-y-1/2 cursor-ew-resize' },
                    { h: 'se', cls: '-bottom-1.5 -right-1.5 cursor-nwse-resize' },
                    { h: 's', cls: '-bottom-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize' },
                    { h: 'sw', cls: '-bottom-1.5 -left-1.5 cursor-nesw-resize' },
                    { h: 'w', cls: 'top-1/2 -left-1.5 -translate-y-1/2 cursor-ew-resize' }
                  ].map(({ h, cls }) => (
                    <div
                      key={h}
                      onMouseDown={(e) => handleResizeHandleMouseDown(e, node, h)}
                      className={`absolute w-2.5 h-2.5 bg-white border-2 border-studio-accent rounded-sm pointer-events-auto ${cls}`}
                    />
                  ))}

                  {/* Size HUD badge */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white pointer-events-none">
                    {Math.round(node.width)} × {Math.round(node.height)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Status / Coordinates in Canvas bottom corner */}
      <div className="absolute bottom-3 right-4 px-3 py-1.5 rounded-lg bg-studio-panel/90 border border-studio-border backdrop-blur-md text-[11px] font-mono text-studio-muted flex items-center gap-3 select-none z-10">
        <span>X: {Math.round(pan.x)} Y: {Math.round(pan.y)}</span>
        <span>•</span>
        <span>كائنات المتجهات: {nodes.length}</span>
        <span>•</span>
        <span className="text-studio-accent">InVision Engine: 60 FPS</span>
      </div>
    </div>
  );
};

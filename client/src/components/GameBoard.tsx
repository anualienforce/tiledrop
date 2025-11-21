import React, { useRef, useState, useEffect } from "react";
import Tile from "./Tile";

interface GameBoardProps {
  grid: (number | null)[][];
  onColumnClick: (col: number) => void;
  gameOver: boolean;
  isPaused?: boolean;
  clearingTiles?: Map<string, number>;
  hoveredColumn?: number | null;
  onColumnPositionsUpdate?: (positions: { col: number; left: number; right: number }[]) => void;
  justCompletedDrag?: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  grid, 
  onColumnClick, 
  gameOver, 
  isPaused = false, 
  clearingTiles = new Map(),
  hoveredColumn = null,
  onColumnPositionsUpdate,
  justCompletedDrag = false
}) => {
  const COLS = 6;
  const ROWS = 7;
  const previousGridValuesRef = useRef<(number | null)[][]>([]);
  const [animatingTiles, setAnimatingTiles] = useState<Set<string>>(new Set());
  const animationTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const gridRef = useRef<HTMLDivElement>(null);

  // Track new tiles for animation by comparing with previous grid values
  useEffect(() => {
    // Find tiles that appear in positions that were previously empty
    const newlyAdded = new Set<string>();
    grid.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value !== null) {
          const key = `${rowIndex}-${colIndex}`;
          // Only animate if this position was null (empty) in previous grid
          const wasEmpty = !previousGridValuesRef.current[rowIndex] || 
                          previousGridValuesRef.current[rowIndex][colIndex] === null;
          if (wasEmpty) {
            newlyAdded.add(key);
          }
        }
      });
    });
    
    // Set up per-tile animation timers
    if (newlyAdded.size > 0) {
      setAnimatingTiles(prev => {
        const updated = new Set(prev);
        newlyAdded.forEach(key => updated.add(key));
        return updated;
      });
      
      // Schedule individual removal for each new tile
      newlyAdded.forEach(key => {
        // Clear any existing timer for this tile
        if (animationTimersRef.current.has(key)) {
          clearTimeout(animationTimersRef.current.get(key)!);
        }
        
        // Set new timer to remove this specific tile from animation set
        const timer = setTimeout(() => {
          setAnimatingTiles(prev => {
            const updated = new Set(prev);
            updated.delete(key);
            return updated;
          });
          animationTimersRef.current.delete(key);
        }, 500);
        
        animationTimersRef.current.set(key, timer);
      });
    }
    
    // Clean up timers and animation state for tiles that become empty
    const keysToCleanup: string[] = [];
    animationTimersRef.current.forEach((timer, key) => {
      const [rowStr, colStr] = key.split('-');
      const row = parseInt(rowStr);
      const col = parseInt(colStr);
      const isEmpty = grid[row]?.[col] === null;
      if (isEmpty) {
        keysToCleanup.push(key);
      }
    });
    
    // Batch cleanup to avoid multiple state updates
    if (keysToCleanup.length > 0) {
      keysToCleanup.forEach(key => {
        const timer = animationTimersRef.current.get(key);
        if (timer) clearTimeout(timer);
        animationTimersRef.current.delete(key);
      });
      
      setAnimatingTiles(prev => {
        const updated = new Set(prev);
        keysToCleanup.forEach(key => updated.delete(key));
        return updated;
      });
    }
    
    // Update the reference for next comparison (deep copy of grid)
    previousGridValuesRef.current = grid.map(row => [...row]);
  }, [grid]);
  
  // Cleanup all timers on unmount only
  useEffect(() => {
    return () => {
      animationTimersRef.current.forEach(timer => clearTimeout(timer));
      animationTimersRef.current.clear();
    };
  }, []);

  // Calculate and expose column positions for drag detection
  useEffect(() => {
    if (!gridRef.current || !onColumnPositionsUpdate) return;
    
    const updatePositions = () => {
      if (!gridRef.current) return;
      
      const cells = gridRef.current.querySelectorAll('.cell');
      const positions: { col: number; left: number; right: number }[] = [];
      
      // Get positions from first row (top row) cells
      for (let col = 0; col < COLS; col++) {
        const cell = cells[col] as HTMLElement;
        if (cell) {
          const rect = cell.getBoundingClientRect();
          positions.push({
            col,
            left: rect.left,
            right: rect.right
          });
        }
      }
      
      onColumnPositionsUpdate(positions);
    };
    
    updatePositions();
    window.addEventListener('resize', updatePositions);
    
    return () => window.removeEventListener('resize', updatePositions);
  }, [COLS, onColumnPositionsUpdate]);

  const handleCellClick = (e: React.MouseEvent, row: number, col: number) => {
    if (gameOver || isPaused || justCompletedDrag) return;
    onColumnClick(col);
  };
  
  const handleTouchStart = (e: React.TouchEvent, col: number) => {
    if (gameOver || isPaused) return;
    onColumnClick(col);
  };

  return (
    <div className="grid-container" role="region" aria-label="Game board">
      <div 
        className="grid" 
        ref={gridRef} 
        role="grid" 
        aria-label={`Game grid with ${ROWS} rows and ${COLS} columns`}
      >
        {grid.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            const key = `${rowIndex}-${colIndex}`;
            const isNew = animatingTiles.has(key);
            const matchSize = clearingTiles.get(key);
            const isClearing = matchSize !== undefined;
            const isHovered = hoveredColumn === colIndex;
            
            return (
              <div
                key={key}
                className={`cell ${isHovered ? 'column-hovered' : ''}`}
                role="gridcell"
                onClick={(e) => handleCellClick(e, rowIndex, colIndex)}
                style={{
                  cursor: (gameOver || isPaused) ? "default" : "pointer",
                }}
                aria-label={value !== null ? `Cell row ${rowIndex + 1}, column ${colIndex + 1}: ${value}` : `Empty cell row ${rowIndex + 1}, column ${colIndex + 1}`}
              >
                {value !== null && <Tile value={value} isNew={isNew} isClearing={isClearing} matchSize={matchSize} />}
              </div>
            );
          })
        )}
      </div>
      
      {/* Column indicators for mobile - show which column will be filled */}
      <div className="column-indicators" role="group" aria-label="Column selectors">
        {Array.from({ length: COLS }, (_, i) => (
          <button
            key={i}
            className="column-indicator"
            onClick={() => !gameOver && !isPaused && onColumnClick(i)}
            onTouchStart={(e) => handleTouchStart(e, i)}
            disabled={gameOver || isPaused}
            aria-label={`Place tile in column ${i + 1}`}
          >
            ▼
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;

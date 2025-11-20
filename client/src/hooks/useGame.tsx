import { useState, useEffect, useCallback, useRef } from "react";
import { useAudio } from "../lib/stores/useAudio";

const ROWS = 7;
const COLS = 6;
const INITIAL_POWERUPS = 1;

interface PowerUp {
  type: "bomb" | "row" | "swap";
  count: number;
}

interface DailyChallenge {
  goal: number;
  progress: number;
  description: string;
  reward: string;
  rewardCoins: number;
  completed: boolean;
  date: string;
}

// Helper: Get today's date as YYYY-MM-DD string
const getTodayString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Helper: Generate a random daily challenge
const generateDailyChallenge = (): DailyChallenge => {
  const challenges = [
    { goal: 50, description: "Clear 50 tiles today", rewardCoins: 20 },
    { goal: 75, description: "Clear 75 tiles today", rewardCoins: 30 },
    { goal: 100, description: "Clear 100 tiles today", rewardCoins: 40 },
    { goal: 30, description: "Clear 30 tiles in one session", rewardCoins: 25 },
    { goal: 1000, description: "Score 1000 points today", rewardCoins: 35 },
  ];
  
  const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
  
  return {
    ...randomChallenge,
    progress: 0,
    reward: `+${randomChallenge.rewardCoins} coins`,
    completed: false,
    date: getTodayString()
  };
};

// Helper: Load or initialize daily challenge from localStorage
const loadDailyChallenge = (): DailyChallenge => {
  try {
    const saved = localStorage.getItem('dailyChallenge');
    if (saved) {
      const challenge: DailyChallenge = JSON.parse(saved);
      const today = getTodayString();
      
      // If the challenge is from today, return it
      if (challenge.date === today) {
        return challenge;
      }
    }
  } catch (err) {
    console.warn('Failed to load daily challenge from localStorage:', err);
  }
  
  // Generate new challenge if none exists or it's a new day
  const newChallenge = generateDailyChallenge();
  try {
    localStorage.setItem('dailyChallenge', JSON.stringify(newChallenge));
  } catch (err) {
    console.warn('Failed to save daily challenge to localStorage:', err);
  }
  return newChallenge;
};

export const useGame = (isPaused: boolean = false) => {
  const { playHit, playSuccess, playCombo } = useAudio();
  
  // Initialize empty grid
  const createEmptyGrid = (): (number | null)[][] => {
    return Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(null));
  };

  const [grid, setGrid] = useState<(number | null)[][]>(createEmptyGrid());
  const [score, setScore] = useState(0);
  const [currentTile, setCurrentTile] = useState<number | null>(null);
  const [nextTiles, setNextTiles] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([
    { type: "bomb", count: 0 },
    { type: "row", count: 0 },
    { type: "swap", count: 0 },
  ]);
  const [selectedPowerUp, setSelectedPowerUp] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [clearingTiles, setClearingTiles] = useState<Map<string, number>>(new Map()); // Track tiles being cleared for animation with match size
  
  // New features: combo, difficulty, challenges
  const [comboCount, setComboCount] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [comboStreak, setComboStreak] = useState(0); // Consecutive turns with matches
  const [maxTileNumber, setMaxTileNumber] = useState(10); // Start with tiles 1-10
  const [tilesPlaced, setTilesPlaced] = useState(0);
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge>(() => loadDailyChallenge());
  const [lastScoreGain, setLastScoreGain] = useState<{amount: number, multiplier: number} | null>(null);
  
  // Auto-drop timer state
  const [dropMs, setDropMs] = useState(4000); // Start at 4 seconds
  const [timeRemaining, setTimeRemaining] = useState(4000);
  const [isTimerFrozen, setIsTimerFrozen] = useState(false); // Timer frozen when power-up is selected
  const dropTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const freezeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const MIN_DROP_MS = 1500;
  
  // High score and statistics with error handling
  const [highScore, setHighScore] = useState(() => {
    try {
      const saved = localStorage.getItem('highScore');
      return saved ? parseInt(saved, 10) : 0;
    } catch (err) {
      console.warn('Failed to load high score from localStorage:', err);
      return 0;
    }
  });
  const [bestCombo, setBestCombo] = useState(() => {
    try {
      const saved = localStorage.getItem('bestCombo');
      return saved ? parseInt(saved, 10) : 0;
    } catch (err) {
      console.warn('Failed to load best combo from localStorage:', err);
      return 0;
    }
  });
  const [totalTilesCleared, setTotalTilesCleared] = useState(() => {
    try {
      const saved = localStorage.getItem('totalTilesCleared');
      return saved ? parseInt(saved, 10) : 0;
    } catch (err) {
      console.warn('Failed to load total tiles cleared from localStorage:', err);
      return 0;
    }
  });
  
  // Coins currency system
  const [coins, setCoins] = useState(() => {
    try {
      const saved = localStorage.getItem('coins');
      return saved ? parseInt(saved, 10) : 0;
    } catch (err) {
      console.warn('Failed to load coins from localStorage:', err);
      return 0;
    }
  });
  const [coinsEarned, setCoinsEarned] = useState(0); // Coins earned this game
  const [purchasedPowerUps, setPurchasedPowerUps] = useState<string[]>([]); // Track what's been bought this game
  const [hasUsedRevive, setHasUsedRevive] = useState(false); // Track if revive has been used this game
  const challengeCompletedRef = useRef(false); // Track if we've already awarded coins for this challenge

  // Generate a random tile value based on current difficulty
  const generateTile = (): number => {
    return Math.floor(Math.random() * maxTileNumber) + 1;
  };

  // Initialize game
  useEffect(() => {
    if (currentTile === null && nextTiles.length === 0) {
      setCurrentTile(generateTile());
      setNextTiles([generateTile()]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Adaptive difficulty: gradually increase tile numbers based on score
  useEffect(() => {
    if (score >= 4000 && maxTileNumber < 12) {
      setMaxTileNumber(12);
    } else if (score >= 2000 && maxTileNumber < 11) {
      setMaxTileNumber(11);
    }
  }, [score, maxTileNumber]);

  // Update high score when game ends
  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      try {
        localStorage.setItem('highScore', score.toString());
      } catch (err) {
        console.warn('Failed to save high score to localStorage:', err);
      }
    }
  }, [gameOver, score, highScore]);
  
  // Award coins when game ends
  useEffect(() => {
    if (gameOver && coinsEarned === 0) { // Only award once per game
      // Formula: 1 coin per 100 score + 5 base coins
      const earnedCoins = Math.floor(score / 100) + 5;
      setCoinsEarned(earnedCoins);
      const newTotal = coins + earnedCoins;
      setCoins(newTotal);
      try {
        localStorage.setItem('coins', newTotal.toString());
      } catch (err) {
        console.warn('Failed to save coins to localStorage:', err);
      }
      console.log(`Game over! Earned ${earnedCoins} coins. Total: ${newTotal}`);
    }
  }, [gameOver, score, coins, coinsEarned]);

  // Daily challenge system: save state and award coins when completed
  useEffect(() => {
    // Save daily challenge state whenever it changes
    try {
      localStorage.setItem('dailyChallenge', JSON.stringify(dailyChallenge));
    } catch (err) {
      console.warn('Failed to save daily challenge to localStorage:', err);
    }

    // Check if challenge is newly completed and award coins (only once per challenge)
    if (!dailyChallenge.completed && dailyChallenge.progress >= dailyChallenge.goal && !challengeCompletedRef.current) {
      challengeCompletedRef.current = true;
      
      const updatedChallenge = { ...dailyChallenge, completed: true };
      
      // Award coins
      const newCoinTotal = coins + dailyChallenge.rewardCoins;
      setCoins(newCoinTotal);
      setDailyChallenge(updatedChallenge);
      
      try {
        localStorage.setItem('coins', newCoinTotal.toString());
        localStorage.setItem('dailyChallenge', JSON.stringify(updatedChallenge));
      } catch (err) {
        console.warn('Failed to save after completing daily challenge:', err);
      }
      
      console.log(`🎉 Daily challenge completed! Earned ${dailyChallenge.rewardCoins} coins. Total: ${newCoinTotal}`);
    }
    
    // Reset the ref if it's a new day or challenge was reset
    if (dailyChallenge.progress === 0 && challengeCompletedRef.current) {
      challengeCompletedRef.current = false;
    }
  }, [dailyChallenge, coins]);

  // Check for date change and reset challenge at midnight
  useEffect(() => {
    const checkDateChange = () => {
      const today = getTodayString();
      if (dailyChallenge.date !== today) {
        console.log('New day detected! Resetting daily challenge...');
        const newChallenge = generateDailyChallenge();
        setDailyChallenge(newChallenge);
        challengeCompletedRef.current = false;
        try {
          localStorage.setItem('dailyChallenge', JSON.stringify(newChallenge));
        } catch (err) {
          console.warn('Failed to save new daily challenge:', err);
        }
      }
    };

    // Check immediately on mount
    checkDateChange();

    // Check every minute for date changes (catches midnight rollover)
    const intervalId = setInterval(checkDateChange, 60000);

    // Also check when window regains focus (catches user leaving tab open overnight)
    const handleFocus = () => {
      checkDateChange();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
    };
  }, [dailyChallenge.date]);

  // Auto-drop timer: start countdown when tile is ready
  useEffect(() => {
    // Clear existing timers
    if (dropTimerRef.current) clearTimeout(dropTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    
    // Don't start timer if game is over, paused, frozen, no tile, or haven't placed first tile yet
    if (gameOver || isPaused || isTimerFrozen || currentTile === null || isProcessing || tilesPlaced === 0) {
      return;
    }
    
    // Reset time remaining
    setTimeRemaining(dropMs);
    
    // Countdown interval (update every 100ms for smooth UI)
    countdownIntervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 100;
        if (newTime <= 0) {
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          return 0;
        }
        return newTime;
      });
    }, 100);
    
    // Auto-drop timer
    dropTimerRef.current = setTimeout(() => {
      // Find worst column and place tile there
      const worstCol = findWorstColumn(grid);
      console.log('Auto-dropping tile in worst column:', worstCol);
      
      // Reset combo on auto-drop
      setComboCount(0);
      setComboMultiplier(1);
      
      // Trigger a column click programmatically
      const clickEvent = new Event('auto-drop');
      handleColumnClick(worstCol);
    }, dropMs);
    
    // Cleanup
    return () => {
      if (dropTimerRef.current) clearTimeout(dropTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTile, gameOver, isPaused, isTimerFrozen, isProcessing, dropMs, grid, tilesPlaced]);

  // Decrease drop time every 5 tiles placed (faster difficulty ramp)
  useEffect(() => {
    if (tilesPlaced > 0 && tilesPlaced % 5 === 0) {
      setDropMs(prev => Math.max(MIN_DROP_MS, prev - 150));
    }
  }, [tilesPlaced, MIN_DROP_MS]);

  // Check for matches and clear them
  const checkAndClearMatches = useCallback((currentGrid: (number | null)[][]): { 
    newGrid: (number | null)[][], 
    clearedCount: number 
  } => {
    const gridCopy = currentGrid.map(row => [...row]);
    const toRemove = new Set<string>();

    // Check horizontal matches
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS - 2; col++) {
        const value = gridCopy[row][col];
        if (value === null) continue;

        let matchLength = 1;
        for (let k = col + 1; k < COLS && gridCopy[row][k] === value; k++) {
          matchLength++;
        }

        if (matchLength >= 3) {
          for (let k = 0; k < matchLength; k++) {
            toRemove.add(`${row}-${col + k}`);
          }
        }
      }
    }

    // Check vertical matches
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS - 2; row++) {
        const value = gridCopy[row][col];
        if (value === null) continue;

        let matchLength = 1;
        for (let k = row + 1; k < ROWS && gridCopy[k][col] === value; k++) {
          matchLength++;
        }

        if (matchLength >= 3) {
          for (let k = 0; k < matchLength; k++) {
            toRemove.add(`${row + k}-${col}`);
          }
        }
      }
    }

    // Check cluster matches (adjacent same numbers)
    const visited = new Set<string>();
    const findCluster = (row: number, col: number, value: number, cluster: string[]) => {
      const key = `${row}-${col}`;
      if (visited.has(key)) return;
      if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return;
      if (gridCopy[row][col] !== value) return;

      visited.add(key);
      cluster.push(key);

      // Check all 4 directions
      findCluster(row - 1, col, value, cluster);
      findCluster(row + 1, col, value, cluster);
      findCluster(row, col - 1, value, cluster);
      findCluster(row, col + 1, value, cluster);
    };

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const value = gridCopy[row][col];
        if (value === null || visited.has(`${row}-${col}`)) continue;

        const cluster: string[] = [];
        findCluster(row, col, value, cluster);

        if (cluster.length >= 3) {
          cluster.forEach(key => toRemove.add(key));
        }
      }
    }

    // Remove matched tiles
    toRemove.forEach(key => {
      const [row, col] = key.split("-").map(Number);
      gridCopy[row][col] = null;
    });

    return { newGrid: gridCopy, clearedCount: toRemove.size };
  }, []);

  // Apply gravity to make tiles fall
  const applyGravity = useCallback((currentGrid: (number | null)[][]): (number | null)[][] => {
    const gridCopy = currentGrid.map(row => [...row]);

    for (let col = 0; col < COLS; col++) {
      // Collect all non-null values in this column
      const values: number[] = [];
      for (let row = ROWS - 1; row >= 0; row--) {
        if (gridCopy[row][col] !== null) {
          values.push(gridCopy[row][col]!);
        }
      }

      // Fill column from bottom with values, rest with null
      for (let row = ROWS - 1; row >= 0; row--) {
        const valueIndex = ROWS - 1 - row;
        gridCopy[row][col] = valueIndex < values.length ? values[valueIndex] : null;
      }
    }

    return gridCopy;
  }, []);

  // Process matches recursively until no more matches
  const processMatches = useCallback(async (currentGrid: (number | null)[][]): Promise<{
    finalGrid: (number | null)[][],
    totalScore: number,
    matchCount: number,
    totalCleared: number
  }> => {
    let workingGrid = currentGrid;
    let totalCleared = 0;
    let matchCount = 0;

    while (true) {
      // First, find matches without clearing
      const gridCopy = workingGrid.map(row => [...row]);
      const matchGroups: Array<{tiles: string[], size: number}> = [];
      const processedTiles = new Set<string>();

      // Check horizontal matches
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS - 2; col++) {
          const value = gridCopy[row][col];
          if (value === null) continue;
          let matchLength = 1;
          for (let k = col + 1; k < COLS && gridCopy[row][k] === value; k++) {
            matchLength++;
          }
          if (matchLength >= 3) {
            const matchTiles: string[] = [];
            for (let k = 0; k < matchLength; k++) {
              const key = `${row}-${col + k}`;
              if (!processedTiles.has(key)) {
                matchTiles.push(key);
                processedTiles.add(key);
              }
            }
            if (matchTiles.length > 0) {
              matchGroups.push({ tiles: matchTiles, size: matchLength });
            }
          }
        }
      }

      // Check vertical matches
      for (let col = 0; col < COLS; col++) {
        for (let row = 0; row < ROWS - 2; row++) {
          const value = gridCopy[row][col];
          if (value === null) continue;
          let matchLength = 1;
          for (let k = row + 1; k < ROWS && gridCopy[k][col] === value; k++) {
            matchLength++;
          }
          if (matchLength >= 3) {
            const matchTiles: string[] = [];
            for (let k = 0; k < matchLength; k++) {
              const key = `${row + k}-${col}`;
              if (!processedTiles.has(key)) {
                matchTiles.push(key);
                processedTiles.add(key);
              }
            }
            if (matchTiles.length > 0) {
              matchGroups.push({ tiles: matchTiles, size: matchLength });
            }
          }
        }
      }

      // Check cluster matches
      const visited = new Set<string>();
      const findCluster = (row: number, col: number, value: number, cluster: string[]) => {
        const key = `${row}-${col}`;
        if (visited.has(key)) return;
        if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return;
        if (gridCopy[row][col] !== value) return;
        visited.add(key);
        cluster.push(key);
        findCluster(row - 1, col, value, cluster);
        findCluster(row + 1, col, value, cluster);
        findCluster(row, col - 1, value, cluster);
        findCluster(row, col + 1, value, cluster);
      };

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const value = gridCopy[row][col];
          if (value === null || visited.has(`${row}-${col}`)) continue;
          const cluster: string[] = [];
          findCluster(row, col, value, cluster);
          if (cluster.length >= 3) {
            const matchTiles: string[] = [];
            cluster.forEach(key => {
              if (!processedTiles.has(key)) {
                matchTiles.push(key);
                processedTiles.add(key);
              }
            });
            if (matchTiles.length > 0) {
              matchGroups.push({ tiles: matchTiles, size: cluster.length });
            }
          }
        }
      }
      
      if (matchGroups.length === 0) break;

      // Build clearing tiles map with match sizes
      const clearingMap = new Map<string, number>();
      matchGroups.forEach(group => {
        group.tiles.forEach(tileKey => {
          // If tile is in multiple matches, use the largest match size
          const currentSize = clearingMap.get(tileKey) || 0;
          clearingMap.set(tileKey, Math.max(currentSize, group.size));
        });
      });

      // Show clearing animation
      setClearingTiles(clearingMap);
      await new Promise(resolve => setTimeout(resolve, 400)); // Wait for clear animation
      
      // Now actually remove the tiles
      clearingMap.forEach((_, key) => {
        const [row, col] = key.split("-").map(Number);
        gridCopy[row][col] = null;
      });
      
      setClearingTiles(new Map()); // Clear animation state

      matchCount++;
      totalCleared += clearingMap.size;
      workingGrid = applyGravity(gridCopy);
      
      // Small delay before checking for cascades
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Calculate combo multiplier (1x for 1 match, 2x for 2, 3x for 3, etc.)
    const currentMultiplier = Math.max(1, matchCount);
    const scoreGained = totalCleared * 100 * currentMultiplier;
    
    return { finalGrid: workingGrid, totalScore: scoreGained, matchCount, totalCleared };
  }, [applyGravity]);

  // Find the lowest empty row in a column
  const findLowestEmptyRow = (grid: (number | null)[][], col: number): number => {
    for (let row = ROWS - 1; row >= 0; row--) {
      if (grid[row][col] === null) {
        return row;
      }
    }
    return -1; // Column is full
  };

  // Check if board is completely full (game over)
  const isBoardFull = (grid: (number | null)[][]): boolean => {
    for (let col = 0; col < COLS; col++) {
      if (findLowestEmptyRow(grid, col) !== -1) {
        return false; // Found an empty spot
      }
    }
    return true; // No empty spots
  };

  // Find the worst column (highest fill) for auto-drop
  const findWorstColumn = (grid: (number | null)[][]): number => {
    let worstCol = 0;
    let highestFill = -1;
    
    for (let col = 0; col < COLS; col++) {
      const emptyRow = findLowestEmptyRow(grid, col);
      if (emptyRow === -1) continue; // Skip full columns
      
      const fillHeight = ROWS - 1 - emptyRow;
      if (fillHeight > highestFill) {
        highestFill = fillHeight;
        worstCol = col;
      }
    }
    
    return worstCol;
  };

  // Handle column click to place tile
  const handleColumnClick = useCallback(async (col: number) => {
    if (gameOver || currentTile === null || isProcessing) return;

    setIsProcessing(true);

    // Handle power-up usage
    if (selectedPowerUp) {
      handlePowerUpAction(col);
      setIsProcessing(false);
      return;
    }

    const row = findLowestEmptyRow(grid, col);

    if (row === -1) {
      // Column is full, game over
      setGameOver(true);
      setIsProcessing(false);
      return;
    }

    // Place the tile
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = currentTile;

    setGrid(newGrid);
    playHit(); // Play tile drop sound

    // Small delay for drop animation
    await new Promise(resolve => setTimeout(resolve, 200));

    // Process matches
    const { finalGrid, totalScore, matchCount, totalCleared} = await processMatches(newGrid);
    
    setGrid(finalGrid);
    setScore(prev => prev + totalScore);
    setTilesPlaced(prev => prev + 1);

    // Update combo tracking
    if (matchCount > 0) {
      playSuccess(); // Play match success sound
      setComboCount(prev => prev + matchCount);
      setComboMultiplier(matchCount);
      setComboStreak(prev => {
        const newStreak = prev + 1;
        // Play combo sound if streak is 2 or higher
        if (newStreak >= 2) {
          playCombo(newStreak);
        }
        return newStreak;
      });
      setLastScoreGain({ amount: totalScore, multiplier: matchCount });
      
      // Update best combo if current is better
      if (matchCount > bestCombo) {
        setBestCombo(matchCount);
        try {
          localStorage.setItem('bestCombo', matchCount.toString());
        } catch (err) {
          console.warn('Failed to save best combo to localStorage:', err);
        }
      }
      
      // Update total tiles cleared
      setTotalTilesCleared(prev => {
        const newTotal = prev + totalCleared;
        try {
          localStorage.setItem('totalTilesCleared', newTotal.toString());
        } catch (err) {
          console.warn('Failed to save total tiles cleared to localStorage:', err);
        }
        return newTotal;
      });
      
      // Update daily challenge progress based on challenge type
      setDailyChallenge(prev => {
        // Check if this is a score-based challenge
        const isScoreChallenge = prev.description.toLowerCase().includes('score') || prev.description.toLowerCase().includes('points');
        const progressIncrement = isScoreChallenge ? totalScore : totalCleared;
        
        return {
          ...prev,
          progress: Math.min(prev.goal, prev.progress + progressIncrement)
        };
      });
      
      // Clear score popup after delay
      setTimeout(() => setLastScoreGain(null), 2000);
    } else {
      setComboMultiplier(1);
      setComboStreak(0); // Reset streak when no matches
    }

    // Check if board is completely full after processing matches
    if (isBoardFull(finalGrid)) {
      setGameOver(true);
      setIsProcessing(false);
      return;
    }

    // Move to next tile
    setCurrentTile(nextTiles[0]);
    setNextTiles([generateTile()]);

    setIsProcessing(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver, currentTile, grid, nextTiles, selectedPowerUp, isProcessing, processMatches]);

  // Handle power-up actions
  const handlePowerUpAction = (col: number) => {
    if (!selectedPowerUp) return;

    const newGrid = grid.map(row => [...row]);

    switch (selectedPowerUp) {
      case "bomb":
        // Clear 3x3 area around clicked cell
        const row = findLowestEmptyRow(grid, col);
        if (row === -1) return;

        for (let r = Math.max(0, row - 1); r <= Math.min(ROWS - 1, row + 1); r++) {
          for (let c = Math.max(0, col - 1); c <= Math.min(COLS - 1, col + 1); c++) {
            newGrid[r][c] = null;
          }
        }
        break;

      case "row":
        // Clear entire row
        const targetRow = findLowestEmptyRow(grid, col);
        if (targetRow === -1) return;

        for (let c = 0; c < COLS; c++) {
          newGrid[targetRow][c] = null;
        }
        break;

      case "swap":
        // Swap current tile with a random one
        setCurrentTile(generateTile());
        setSelectedPowerUp(null);
        return;
    }

    const finalGrid = applyGravity(newGrid);
    setGrid(finalGrid);

    // Deduct power-up
    setPowerUps(prev =>
      prev.map(p =>
        p.type === selectedPowerUp
          ? { ...p, count: Math.max(0, p.count - 1) }
          : p
      )
    );

    setSelectedPowerUp(null);
  };

  // Handle power-up selection
  const handlePowerUpUse = useCallback((type: string) => {
    if (gameOver) return;
    
    const powerUp = powerUps.find(p => p.type === type);
    if (!powerUp || powerUp.count === 0) return;

    // Freeze timer for 10 seconds when power-up is clicked
    if (freezeTimerRef.current) clearTimeout(freezeTimerRef.current);
    setIsTimerFrozen(true);
    freezeTimerRef.current = setTimeout(() => {
      setIsTimerFrozen(false);
    }, 10000); // 10 seconds

    if (type === "swap") {
      setCurrentTile(generateTile());
      setPowerUps(prev =>
        prev.map(p =>
          p.type === type
            ? { ...p, count: Math.max(0, p.count - 1) }
            : p
        )
      );
    } else {
      setSelectedPowerUp(selectedPowerUp === type ? null : type);
    }
  }, [gameOver, powerUps, selectedPowerUp]);

  // Purchase power-up from shop
  const purchasePowerUp = useCallback((type: string, cost: number) => {
    // Check if already purchased this game
    if (purchasedPowerUps.includes(type)) {
      console.log(`${type} already purchased this game`);
      return false;
    }
    
    // Check if enough coins
    if (coins < cost) {
      console.log(`Not enough coins. Need ${cost}, have ${coins}`);
      return false;
    }
    
    // Deduct coins
    const newCoins = coins - cost;
    setCoins(newCoins);
    try {
      localStorage.setItem('coins', newCoins.toString());
    } catch (err) {
      console.warn('Failed to save coins to localStorage:', err);
    }
    
    // Add power-up
    setPowerUps(prev =>
      prev.map(p =>
        p.type === type ? { ...p, count: p.count + 1 } : p
      )
    );
    
    // Mark as purchased this game
    setPurchasedPowerUps(prev => [...prev, type]);
    
    console.log(`Purchased ${type} for ${cost} coins. Remaining: ${newCoins}`);
    return true;
  }, [coins, purchasedPowerUps]);

  // Clear top 3 rows
  const clearTopRows = useCallback(() => {
    setGrid(prevGrid => {
      const newGrid = [...prevGrid];
      // Clear the top 3 rows (indices 0, 1, 2)
      for (let row = 0; row < 3; row++) {
        newGrid[row] = Array(COLS).fill(null);
      }
      return newGrid;
    });
    playSuccess();
  }, [playSuccess]);

  // Revive game after watching ad
  const reviveGame = useCallback(() => {
    if (hasUsedRevive) return; // Can only revive once per game
    
    clearTopRows();
    setGameOver(false);
    setHasUsedRevive(true);
    
    // Reset the timer to give player breathing room (slightly more time after revive)
    setDropMs(3500);
    setTimeRemaining(3500);
    
    console.log('Game revived! Top 3 rows cleared.');
  }, [hasUsedRevive, clearTopRows]);

  // Restart game
  const restartGame = useCallback(() => {
    const INITIAL_MAX_TILE = 10;
    const INITIAL_DROP_MS = 4000; // Start at 4 seconds
    const genInitialTile = () => Math.floor(Math.random() * INITIAL_MAX_TILE) + 1;
    
    // Clear any active timers first
    if (dropTimerRef.current) clearTimeout(dropTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    if (freezeTimerRef.current) clearTimeout(freezeTimerRef.current);
    
    setGrid(createEmptyGrid());
    setScore(0);
    setCurrentTile(genInitialTile());
    setNextTiles([genInitialTile()]);
    setGameOver(false);
    setPowerUps([
      { type: "bomb", count: 0 },
      { type: "row", count: 0 },
      { type: "swap", count: 0 },
    ]);
    setSelectedPowerUp(null);
    setComboCount(0);
    setComboMultiplier(1);
    setComboStreak(0);
    setMaxTileNumber(INITIAL_MAX_TILE);
    setTilesPlaced(0);
    setLastScoreGain(null);
    setDropMs(INITIAL_DROP_MS);
    setTimeRemaining(INITIAL_DROP_MS);
    setIsTimerFrozen(false); // Unfreeze timer for new game
    setCoinsEarned(0); // Reset coins earned for new game
    setPurchasedPowerUps([]); // Reset purchased power-ups tracking
    setHasUsedRevive(false); // Reset revive for new game
  }, []);

  return {
    grid,
    score,
    nextTiles,
    currentTile,
    gameOver,
    powerUps,
    selectedPowerUp,
    handleColumnClick,
    handlePowerUpUse,
    restartGame,
    reviveGame,
    hasUsedRevive,
    comboCount,
    comboMultiplier,
    comboStreak,
    maxTileNumber,
    dailyChallenge,
    lastScoreGain,
    tilesPlaced,
    highScore,
    bestCombo,
    totalTilesCleared,
    timeRemaining,
    dropMs,
    coins,
    coinsEarned,
    purchasedPowerUps,
    purchasePowerUp,
    clearingTiles,
  };
};

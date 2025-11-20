import { useState, useEffect, useRef } from "react";
import GameBoard from "./components/GameBoard";
import HUD from "./components/HUD";
import PowerUps from "./components/PowerUps";
import GameOver from "./components/GameOver";
import HowToPlay from "./components/HowToPlay";
import Settings from "./components/Settings";
import WelcomeScreen from "./components/WelcomeScreen";
import Shop from "./components/Shop";
import SplashScreen from "./components/SplashScreen";
import { RatePrompt, incrementGamesPlayed } from "./components/RatePrompt";
import { useGame } from "./hooks/useGame";
import { useGameScale } from "./hooks/useGameScale";
import { useAudio } from "./lib/stores/useAudio";
import { useAnalytics } from "./hooks/useAnalytics";
import { HelpCircle, Settings as SettingsIcon, Pause, Play, ShoppingBag, CircleDollarSign } from "lucide-react";
import { useAccessibility } from "./lib/stores/useAccessibility";
import { adMobService } from "./services/admob";
import { App as CapApp } from "@capacitor/app";
import "./styles/game.css?v=20251001w";

function App() {
  const { highContrastMode, reducedMotion } = useAccessibility();
  const { setBackgroundMusic, setHitSound, setSuccessSound, toggleMute, isMuted } = useAudio();
  const { trackEvent } = useAnalytics();
  const scale = useGameScale();
  
  const [isShaking, setIsShaking] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showRatePrompt, setShowRatePrompt] = useState(false);
  
  // Store audio references for cleanup
  const audioRefs = useRef<{
    bgMusic: HTMLAudioElement | null;
    hit: HTMLAudioElement | null;
    success: HTMLAudioElement | null;
  }>({
    bgMusic: null,
    hit: null,
    success: null,
  });
  
  // Drag-and-drop state
  const gameBoardRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const [columnPositions, setColumnPositions] = useState<{ col: number; left: number; right: number }[]>([]);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null);
  const [justCompletedDrag, setJustCompletedDrag] = useState(false);
  
  const {
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
    comboMultiplier,
    comboStreak,
    dailyChallenge,
    lastScoreGain,
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
  } = useGame(isPaused);

  // Check if first visit with error handling
  useEffect(() => {
    try {
      const hasVisited = localStorage.getItem('hasVisited');
      if (!hasVisited) {
        setShowWelcome(true);
        localStorage.setItem('hasVisited', 'true');
      }
    } catch (err) {
      console.warn('localStorage not available:', err);
      // Show welcome screen by default if localStorage fails
      setShowWelcome(true);
    }
  }, []);

  // Trigger screen shake for big combos
  useEffect(() => {
    if (comboMultiplier >= 3) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 500);
      return () => clearTimeout(timer);
    }
  }, [comboMultiplier]);

  // Initialize audio with error handling
  useEffect(() => {
    try {
      // Use absolute URLs for better loading in Capacitor
      const baseUrl = window.location.origin;
      const bgMusic = new Audio(`${baseUrl}/sounds/background.mp3`);
      const hit = new Audio(`${baseUrl}/sounds/hit.mp3`);
      const success = new Audio(`${baseUrl}/sounds/success.mp3`);
      
      // Store references for cleanup
      audioRefs.current = { bgMusic, hit, success };
      
      // Force preload and configure
      bgMusic.preload = 'auto';
      hit.preload = 'auto';
      success.preload = 'auto';
      
      // Add error handlers for audio files
      [bgMusic, hit, success].forEach(audio => {
        audio.addEventListener('error', (e) => {
          console.error('Audio file failed to load:', audio.src, e);
        });
        
        audio.addEventListener('loadedmetadata', () => {
          console.log('Audio loaded:', audio.src, 'Duration:', audio.duration);
        });
      });
      
      setBackgroundMusic(bgMusic);
      setHitSound(hit);
      setSuccessSound(success);
      
      // Cleanup function - stops all audio when component unmounts
      return () => {
        console.log('Cleaning up audio...');
        [bgMusic, hit, success].forEach(audio => {
          audio.pause();
          audio.currentTime = 0;
          audio.src = ''; // Release the audio resource
        });
      };
    } catch (err) {
      console.warn('Audio initialization failed:', err);
      // Game continues without audio
    }
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  // Handle app state changes (background/foreground) for Capacitor
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    CapApp.addListener('appStateChange', (state) => {
      const bgMusic = audioRefs.current.bgMusic;
      
      if (!state.isActive && bgMusic) {
        // App went to background - pause music
        console.log('App backgrounded - pausing music');
        bgMusic.pause();
      } else if (state.isActive && bgMusic && !isMuted) {
        // App came to foreground - resume music if not muted
        console.log('App foregrounded - resuming music');
        bgMusic.play().catch(error => {
          console.log("Background music resume prevented:", error);
        });
      }
    }).then((handle) => {
      unsubscribe = () => handle.remove();
    });

    // Cleanup listener on unmount
    return () => {
      unsubscribe?.();
    };
  }, [isMuted]);

  // Handle hardware back button press
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    CapApp.addListener('backButton', () => {
      // If on welcome screen, close the app
      if (showWelcome) {
        CapApp.exitApp();
      }
    }).then((handle) => {
      unsubscribe = () => handle.remove();
    });

    // Cleanup listener on unmount
    return () => {
      unsubscribe?.();
    };
  }, [showWelcome]);

  // Pause music when page visibility changes (for web)
  useEffect(() => {
    const handleVisibilityChange = () => {
      const bgMusic = audioRefs.current.bgMusic;
      
      if (document.hidden && bgMusic) {
        console.log('Page hidden - pausing music');
        bgMusic.pause();
      } else if (!document.hidden && bgMusic && !isMuted) {
        console.log('Page visible - resuming music');
        bgMusic.play().catch(error => {
          console.log("Background music resume prevented:", error);
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isMuted]);

  // Initialize AdMob
  useEffect(() => {
    adMobService.initialize();
    
    // Show banner ad when game starts
    if (!gameOver) {
      adMobService.showBanner();
    }
    
    return () => {
      adMobService.removeBanner();
    };
  }, [gameOver]);

  // Track game end and show rate prompt
  useEffect(() => {
    if (gameOver) {
      incrementGamesPlayed();
      trackEvent('game_end', { score, highScore, bestCombo });
      
      if (score >= highScore && score > 0) {
        trackEvent('high_score_achieved', { score });
      }
      
      // Show interstitial ad on game over
      adMobService.showInterstitial();
      
      setTimeout(() => setShowRatePrompt(true), 1000);
    }
  }, [gameOver, score, highScore, bestCombo, trackEvent]);

  // Track combo achievements
  useEffect(() => {
    if (comboMultiplier >= 3) {
      trackEvent('combo_achieved', { multiplier: comboMultiplier });
    }
  }, [comboMultiplier, trackEvent]);

  // Wrap restart and power-up functions with analytics
  const handleRestartWithAnalytics = () => {
    trackEvent('game_start');
    setShowRatePrompt(false);
    restartGame();
  };

  const handlePowerUpWithAnalytics = (type: string) => {
    trackEvent('power_up_used', { type });
    handlePowerUpUse(type);
  };

  // Drag-and-drop handlers - spawn tile at cursor position
  const handleDragStart = (e: React.PointerEvent) => {
    if (gameOver || isPaused || !currentTile) return;
    
    const startX = e.clientX;
    const startY = e.clientY;
    
    setDragStartPos({ x: startX, y: startY });
    setDragPosition({ x: startX, y: startY });
    
    let hasMoved = false;
    const MOVE_THRESHOLD = 5; // pixels
    
    // Set up window-level listeners for drag
    const handleMove = (moveEvent: PointerEvent) => {
      const deltaX = Math.abs(moveEvent.clientX - startX);
      const deltaY = Math.abs(moveEvent.clientY - startY);
      
      // Only start showing drag if moved beyond threshold
      if (deltaX > MOVE_THRESHOLD || deltaY > MOVE_THRESHOLD) {
        hasMoved = true;
        setIsDragging(true);
      }
      
      setDragPosition({ x: moveEvent.clientX, y: moveEvent.clientY });
      
      // Calculate which column the pointer is over using grid bounds
      const gridElement = document.querySelector('.grid') as HTMLElement;
      if (gridElement) {
        const boardRect = gridElement.getBoundingClientRect();
        const relativeX = moveEvent.clientX - boardRect.left;
        const columnWidth = boardRect.width / 6;
        
        // Be more lenient with vertical bounds (allow some margin)
        const verticalMargin = 50; // pixels above/below grid
        if (relativeX >= 0 && relativeX <= boardRect.width &&
            moveEvent.clientY >= (boardRect.top - verticalMargin) && 
            moveEvent.clientY <= (boardRect.bottom + verticalMargin)) {
          const col = Math.floor(relativeX / columnWidth);
          setHoveredColumn(Math.max(0, Math.min(5, col)));
        } else {
          setHoveredColumn(null);
        }
      }
    };
    
    const handleEnd = (endEvent: PointerEvent) => {
      setIsDragging(false);
      setDragPosition(null);
      setDragStartPos(null);
      
      // Only handle placement if user actually dragged
      if (hasMoved) {
        // Calculate column from the actual grid element
        let column: number | null = null;
        
        // Query for the actual grid element
        const gridElement = document.querySelector('.grid') as HTMLElement;
        if (gridElement) {
          const boardRect = gridElement.getBoundingClientRect();
          const relativeX = endEvent.clientX - boardRect.left;
          const columnWidth = boardRect.width / 6; // 6 columns
          
          // Be more lenient with vertical bounds (allow dropping above/below grid)
          const verticalMargin = 50; // pixels above/below grid
          if (relativeX >= 0 && relativeX <= boardRect.width &&
              endEvent.clientY >= (boardRect.top - verticalMargin) && 
              endEvent.clientY <= (boardRect.bottom + verticalMargin)) {
            column = Math.floor(relativeX / columnWidth);
            column = Math.max(0, Math.min(5, column)); // Clamp to 0-5
          }
        }
        
        // If over a valid column, place the tile
        if (column !== null) {
          handleColumnClick(column);
          setJustCompletedDrag(true);
          setTimeout(() => setJustCompletedDrag(false), 100);
        }
      }
      
      setHoveredColumn(null);
      
      // Clean up listeners
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleEnd);
      window.removeEventListener('pointercancel', handleEnd);
    };
    
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleEnd);
    window.addEventListener('pointercancel', handleEnd);
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className={`app-container ${highContrastMode ? 'high-contrast' : ''} ${reducedMotion ? 'reduced-motion' : ''}`}>
      <div 
        className="mobile-scale-wrapper"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: '100%',
          maxWidth: '100vw',
          margin: '0 auto',
        }}
      >
        {/* Top Button Bar */}
        <div className="button-bar">
          <h1 className="game-title">TileDrop</h1>
          <div className="button-group">
            <div className="coin-display" onClick={() => setShowShop(true)}>
              <CircleDollarSign size={18} className="coin-icon" aria-hidden="true" />
              <span className="coin-amount">{coins}</span>
            </div>
            <button 
              className="icon-button"
              onClick={() => setShowShop(true)}
              aria-label="Shop"
            >
              <ShoppingBag size={20} aria-hidden="true" />
            </button>
            {!gameOver && (
              <button 
                className="icon-button"
                onClick={() => setIsPaused(!isPaused)}
                role="switch"
                aria-checked={isPaused}
                aria-label="Pause"
              >
                {isPaused ? <Play size={20} aria-hidden="true" /> : <Pause size={20} aria-hidden="true" />}
              </button>
            )}
            <button 
              className="icon-button"
              onClick={toggleMute}
              role="switch"
              aria-checked={!isMuted}
              aria-label="Sound"
            >
              <span aria-hidden="true">{isMuted ? "🔇" : "🔊"}</span>
            </button>
          </div>
        </div>

        <div 
          className={`game-wrapper ${isShaking ? 'shake' : ''} ${isPaused ? 'paused' : ''}`}
          onPointerDown={(e) => {
            // Only ignore actual interactive elements (buttons, inputs, links)
            const target = e.target as HTMLElement;
            if (target.tagName === 'BUTTON' || 
                target.tagName === 'INPUT' || 
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('input') ||
                target.closest('a')) {
              return;
            }
            handleDragStart(e);
          }}
          style={{ touchAction: 'none' }}
        >
        <HUD 
          score={score}
          highScore={highScore}
          currentTile={currentTile} 
          nextTiles={nextTiles}
          comboMultiplier={comboMultiplier}
          comboStreak={comboStreak}
          dailyChallenge={dailyChallenge}
          timeRemaining={timeRemaining}
          dropMs={dropMs}
          isDragging={isDragging}
        />
        
        <div ref={gameBoardRef}>
          <GameBoard 
            grid={grid} 
            onColumnClick={handleColumnClick}
            gameOver={gameOver}
            isPaused={isPaused}
            clearingTiles={clearingTiles}
            hoveredColumn={hoveredColumn}
            onColumnPositionsUpdate={setColumnPositions}
            justCompletedDrag={justCompletedDrag}
          />
        </div>
        
        <PowerUps 
          powerUps={powerUps}
          onPowerUpUse={handlePowerUpWithAnalytics}
          gameOver={gameOver}
          selectedPowerUp={selectedPowerUp}
        />

        {lastScoreGain && (
          <div className="score-popup">
            +{lastScoreGain.amount.toLocaleString()}
            {lastScoreGain.multiplier > 1 && (
              <span className="multiplier-text"> ({lastScoreGain.multiplier}x COMBO!)</span>
            )}
          </div>
        )}

        {gameOver && (
          <GameOver 
            score={score}
            highScore={highScore}
            bestCombo={bestCombo}
            totalTilesCleared={totalTilesCleared}
            coinsEarned={coinsEarned}
            hasUsedRevive={hasUsedRevive}
            onRestart={handleRestartWithAnalytics}
            onRevive={reviveGame}
          />
        )}

        {isPaused && !gameOver && (
          <div className="pause-overlay">
            <div className="pause-content">
              <h2 className="pause-title">Game Paused</h2>
              <div className="pause-buttons">
                <button 
                  className="resume-button"
                  onClick={() => setIsPaused(false)}
                >
                  <Play size={24} />
                  Resume Game
                </button>
                <button 
                  className="restart-button-pause"
                  onClick={() => {
                    setIsPaused(false);
                    handleRestartWithAnalytics();
                  }}
                >
                  Restart Game
                </button>
                <button 
                  className="help-button-pause"
                  onClick={() => setShowHowToPlay(true)}
                >
                  <HelpCircle size={24} />
                  How to Play
                </button>
                <button 
                  className="settings-button-pause"
                  onClick={() => setShowSettings(true)}
                >
                  <SettingsIcon size={24} />
                  Settings
                </button>
                <button 
                  className="close-app-button-pause"
                  onClick={() => CapApp.exitApp()}
                >
                  Close App
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Drag Ghost - follows pointer during drag - OUTSIDE scaled wrapper */}
      {isDragging && dragPosition && currentTile !== null && (
        <div 
          style={{
            position: 'fixed',
            left: `${dragPosition.x}px`,
            top: `${dragPosition.y}px`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 9999,
            opacity: 0.95,
            filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.4))',
            transition: 'none'
          }}
        >
          <div className={`tile big`} style={{ transform: 'scale(1.1)' }}>
            <div className={`tile-content c${currentTile} ${highContrastMode ? 'colorblind-mode' : ''}`}>
              <div className="tile-number">{currentTile}</div>
              {highContrastMode && (
                <div className="tile-symbol">
                  {(() => {
                    const symbols: { [key: number]: string } = {
                      1: "●", 2: "■", 3: "▲", 4: "★", 5: "◆", 6: "▼",
                      7: "◉", 8: "◈", 9: "✦", 10: "⬟", 11: "◘"
                    };
                    return symbols[currentTile] || "◆";
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showHowToPlay && <HowToPlay onClose={() => setShowHowToPlay(false)} />}
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
      {showWelcome && <WelcomeScreen onClose={() => setShowWelcome(false)} onShowHelp={() => { setShowWelcome(false); setShowHowToPlay(true); }} />}
      {showShop && (
        <Shop 
          onClose={() => setShowShop(false)}
          coins={coins}
          purchasedPowerUps={purchasedPowerUps}
          onPurchase={purchasePowerUp}
        />
      )}
      {showRatePrompt && gameOver && (
        <RatePrompt 
          score={score}
          highScore={highScore}
          onClose={() => setShowRatePrompt(false)}
        />
      )}
    </div>
  );
}

export default App;
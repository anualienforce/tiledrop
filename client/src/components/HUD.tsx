import React from "react";
import { Target } from "lucide-react";
import { useAccessibility } from "../lib/stores/useAccessibility";

interface HUDProps {
  score: number;
  highScore: number;
  currentTile: number | null;
  nextTiles: number[];
  comboMultiplier: number;
  comboStreak: number;
  dailyChallenge: {
    goal: number;
    progress: number;
    description: string;
    completed: boolean;
  };
  timeRemaining: number;
  dropMs: number;
  isDragging?: boolean;
}

const HUD: React.FC<HUDProps> = ({ 
  score, 
  highScore, 
  currentTile, 
  nextTiles, 
  comboMultiplier, 
  comboStreak, 
  dailyChallenge, 
  timeRemaining, 
  dropMs,
  isDragging = false
}) => {
  const { colorBlindMode } = useAccessibility();
  const getColorClass = (value: number) => `c${value}`;
  
  const timePercent = (timeRemaining / dropMs) * 100;

  const getTileSymbol = (val: number): string => {
    const symbols: { [key: number]: string } = {
      1: "●",
      2: "■",
      3: "▲",
      4: "★",
      5: "◆",
      6: "▼",
      7: "◉",
      8: "◈",
      9: "✦",
      10: "⬟",
      11: "◘"
    };
    return symbols[val] || "◆";
  };

  return (
    <>
      <div className="hud" role="region" aria-label="Game information">
        <div className="card score-card" aria-label="Score card">
          <div className="score-label" id="score-label">SCORE</div>
          <div className="score-value" aria-live="polite" aria-atomic="true" aria-labelledby="score-label">
            {score.toLocaleString()}
          </div>
          {comboStreak > 0 && (
            <div className="combo-indicator" aria-live="assertive" role="status">
              COMBO {comboStreak}
            </div>
          )}
          <div className="high-score-display" aria-label={`High score: ${highScore}`}>
            <span className="high-score-label">Best:</span> {highScore.toLocaleString()}
          </div>
        </div>

        <div className="card next-card" aria-label="Next tiles">
          <div className="score-label" id="next-label">NEXT</div>
          <div className="next-tile" aria-labelledby="next-label" aria-live="polite">
            {currentTile !== null && (
              <div 
                className={`tile big ${isDragging ? 'dragging' : ''}`}
                aria-label={`Next tile: ${currentTile}`}
              >
                <div className={`tile-content ${getColorClass(currentTile)} ${colorBlindMode ? 'colorblind-mode' : ''}`}>
                  <div className="tile-number">{currentTile}</div>
                  {colorBlindMode && (
                    <div className="tile-symbol">{getTileSymbol(currentTile)}</div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="score-label" style={{ marginTop: "8px" }} id="upcoming-label">
            UPCOMING
          </div>
          <div className="upcoming-tiles" aria-labelledby="upcoming-label">
            {nextTiles.slice(0, 1).map((tile, index) => (
              <div key={index} className={`tile small`} aria-label={`Upcoming tile: ${tile}`}>
                <div className={`tile-content ${getColorClass(tile)} ${colorBlindMode ? 'colorblind-mode' : ''}`}>
                  <div className="tile-number">{tile}</div>
                  {colorBlindMode && (
                    <div className="tile-symbol" style={{ fontSize: '10px' }}>{getTileSymbol(tile)}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Auto-drop Countdown Timer */}
          <div className="timer-container" style={{ marginTop: '12px' }}>
            <div className="score-label" style={{ fontSize: '10px', marginBottom: '4px' }}>TIME</div>
            <div className="timer-bar" role="progressbar" 
                 aria-valuenow={Math.ceil(timeRemaining / 1000)} 
                 aria-valuemin={0} 
                 aria-valuemax={Math.ceil(dropMs / 1000)}
                 aria-label={`Time remaining: ${Math.ceil(timeRemaining / 1000)} seconds`}>
              <div 
                className="timer-fill"
                style={{ 
                  width: `${timePercent}%`,
                  backgroundColor: timePercent > 50 ? '#4ECDC4' : timePercent > 25 ? '#FFA34D' : '#FF6B6B'
                }}
              />
            </div>
            <div className="timer-text" style={{ fontSize: '11px', textAlign: 'center', marginTop: '2px', opacity: 0.8 }}>
              {(timeRemaining / 1000).toFixed(1)}s
            </div>
          </div>
        </div>
      </div>
      
      {/*
        Daily Challenge Bar (commented out)
        <div className="daily-challenge" role="region" aria-label="Daily challenge progress">
          <div className="challenge-text" id="challenge-desc">
            <Target size={16} className="challenge-icon" aria-hidden="true" />
            <span>{dailyChallenge.description}</span>
            {dailyChallenge.completed && <span style={{ fontSize: '16px' }}>✅</span>}
          </div>
          <div className="challenge-progress-bar" role="progressbar" 
               aria-valuenow={dailyChallenge.progress} 
               aria-valuemin={0} 
               aria-valuemax={dailyChallenge.goal}
               aria-labelledby="challenge-desc">
            <div 
              className="challenge-progress-fill"
              style={{ 
                width: `${Math.min(100, (dailyChallenge.progress / dailyChallenge.goal) * 100)}%`,
                background: dailyChallenge.completed 
                  ? 'linear-gradient(90deg, #4ade80 0%, #22c55e 50%, #16a34a 100%)' 
                  : undefined
              }}
            />
          </div>
          <div className="challenge-count" aria-label={`Challenge progress: ${dailyChallenge.progress} of ${dailyChallenge.goal}`}>
            {dailyChallenge.completed ? (
              <span style={{ 
                background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                ✨ Completed! +{(dailyChallenge as any).rewardCoins} coins
              </span>
            ) : (
              `${dailyChallenge.progress} / ${dailyChallenge.goal}`
            )}
          </div>
        </div>
      */}
    </>
  );
};

export default HUD;

import React, { useState } from "react";
import { Share2, Check, Play } from "lucide-react";
import { ReviveAd } from "./ReviveAd";

interface GameOverProps {
  score: number;
  highScore: number;
  bestCombo: number;
  totalTilesCleared: number;
  coinsEarned: number;
  hasUsedRevive: boolean;
  onRestart: () => void;
  onRevive: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, highScore, bestCombo, totalTilesCleared, coinsEarned, hasUsedRevive, onRestart, onRevive }) => {
  const isNewHighScore = score === highScore && score > 0;
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [showReviveAd, setShowReviveAd] = useState(false);

  const handleShare = async () => {
    const shareText = `🎮 I scored ${score.toLocaleString()} points in TileDrop! ${isNewHighScore ? '🎉 NEW HIGH SCORE! ' : ''}Best combo: ${bestCombo}x\n\nCan you beat my score?`;
    
    // Try to use Web Share API (works on mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TileDrop Score',
          text: shareText,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fall back to clipboard
      }
    }
    
    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      setShareStatus('copied');
      setTimeout(() => setShareStatus('idle'), 2000);
    } catch (err) {
      alert('Could not copy score. Please try again.');
    }
  };

  const handleAdComplete = () => {
    setShowReviveAd(false);
    onRevive();
  };

  const handleAdCancel = () => {
    setShowReviveAd(false);
  };
  
  return (
    <div className="game-over-overlay" role="dialog" aria-modal="true" aria-labelledby="game-over-title">
      <div className="game-over-modal">
        <h1 className="game-over-title" id="game-over-title">Game Over!</h1>
        
        <div className="final-score" role="status" aria-live="polite">
          <div className="final-score-label">Final Score</div>
          <div className="final-score-value" aria-label={`Final score: ${score.toLocaleString()}`}>{score.toLocaleString()}</div>
          {isNewHighScore && <div className="new-record" role="status">🎉 NEW HIGH SCORE!</div>}
        </div>

        {coinsEarned > 0 && (
          <div className="coins-earned" role="status" aria-live="polite">
            <span className="coins-icon">🪙</span>
            <span className="coins-text">+{coinsEarned} coins earned!</span>
          </div>
        )}

        <div className="stats-container" role="region" aria-label="Game statistics">
          <div className="stat-item">
            <div className="stat-label">High Score</div>
            <div className="stat-value" aria-label={`High score: ${highScore.toLocaleString()}`}>{highScore.toLocaleString()}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Best Combo</div>
            <div className="stat-value" aria-label={`Best combo: ${bestCombo} times`}>{bestCombo}x</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Total Tiles Cleared</div>
            <div className="stat-value" aria-label={`Total tiles cleared: ${totalTilesCleared.toLocaleString()}`}>{totalTilesCleared.toLocaleString()}</div>
          </div>
        </div>

        <div className="game-over-actions">
          {!hasUsedRevive && (
            <button 
              className="revive-button" 
              onClick={() => setShowReviveAd(true)} 
              aria-label="Watch ad to revive and clear top 3 rows"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                color: 'white',
                padding: '16px 24px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                marginBottom: '12px',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.4)';
              }}
            >
              <Play size={20} aria-hidden="true" />
              Watch Ad to Revive
            </button>
          )}
          
          <button className="share-button" onClick={handleShare} aria-label={shareStatus === 'copied' ? 'Score copied to clipboard' : 'Share your score'}>
            {shareStatus === 'copied' ? (
              <>
                <Check size={20} aria-hidden="true" />
                Copied!
              </>
            ) : (
              <>
                <Share2 size={20} aria-hidden="true" />
                Share Score
              </>
            )}
          </button>
          
          <button className="restart-button" onClick={onRestart} aria-label="Play again">
            Play Again
          </button>
        </div>
      </div>
      
      {showReviveAd && (
        <ReviveAd onComplete={handleAdComplete} onCancel={handleAdCancel} />
      )}
    </div>
  );
};

export default GameOver;

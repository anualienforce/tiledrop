import React from "react";

interface PowerUp {
  type: "bomb" | "row" | "swap";
  count: number;
}

interface PowerUpsProps {
  powerUps: PowerUp[];
  onPowerUpUse: (type: string) => void;
  gameOver: boolean;
  selectedPowerUp: string | null;
}

const PowerUps: React.FC<PowerUpsProps> = ({ powerUps, onPowerUpUse, gameOver, selectedPowerUp }) => {
  const getPowerUpIcon = (type: string) => {
    switch (type) {
      case "bomb":
        return "💣";
      case "row":
        return "➡️";
      case "swap":
        return "🔄";
      default:
        return "?";
    }
  };

  const getPowerUpLabel = (type: string) => {
    switch (type) {
      case "bomb":
        return "Bomb";
      case "row":
        return "Row";
      case "swap":
        return "Swap";
      default:
        return "?";
    }
  };

  const handleTouchStart = (e: React.TouchEvent, type: string, count: number) => {
    if (gameOver || count === 0) return;
    e.preventDefault(); // Prevent delay from touch
    onPowerUpUse(type);
  };

  return (
    <div className="powerups" role="group" aria-label="Power-ups">
      {powerUps.map((powerUp) => (
        <button
          key={powerUp.type}
          className={`powerup-container ${
            powerUp.count === 0 || gameOver ? "disabled" : ""
          } ${selectedPowerUp === powerUp.type ? "selected" : ""}`}
          onClick={() => !gameOver && powerUp.count > 0 && onPowerUpUse(powerUp.type)}
          onTouchStart={(e) => handleTouchStart(e, powerUp.type, powerUp.count)}
          disabled={gameOver || powerUp.count === 0}
          aria-label={`${getPowerUpLabel(powerUp.type)} power-up, ${powerUp.count} remaining${selectedPowerUp === powerUp.type ? ', currently selected' : ''}`}
          aria-pressed={selectedPowerUp === powerUp.type}
        >
          <div className="powerup" aria-hidden="true">{getPowerUpIcon(powerUp.type)}</div>
          <div className="powerup-label" aria-hidden="true">{getPowerUpLabel(powerUp.type)}</div>
          <div className="powerup-count" aria-hidden="true">×{powerUp.count}</div>
        </button>
      ))}
    </div>
  );
};

export default PowerUps;

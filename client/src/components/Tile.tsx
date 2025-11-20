import React from "react";
import { useAccessibility } from "../lib/stores/useAccessibility";

interface TileProps {
  value: number;
  isNew?: boolean;
  isClearing?: boolean;
  matchSize?: number;
}

const Tile: React.FC<TileProps> = ({ value, isNew = false, isClearing = false, matchSize }) => {
  const { colorBlindMode } = useAccessibility();
  const getColorClass = (val: number) => `c${val}`;

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
      11: "◘",
      12: "⬢"
    };
    return symbols[val] || "◆";
  };

  // PLACEMENT ANIMATION
  const placementAnimation = 'tile-glow';

  // CLEARING ANIMATION - Select based on match size
  // 3-match: tile-clear-spin (standard spin animation)
  // 4-match: tile-clear-power (bigger explosion effect)
  // 5+ match: tile-clear-uber (huge explosive effect with burst)
  const getClearingAnimation = () => {
    if (!isClearing || !matchSize) return '';
    
    if (matchSize >= 5) {
      return 'tile-clear-uber'; // Epic 5+ match animation
    } else if (matchSize === 4) {
      return 'tile-clear-power'; // Powerful 4-match animation
    } else {
      return 'tile-clear-spin'; // Standard 3-match animation
    }
  };

  return (
    <div className={`tile-content ${getColorClass(value)} ${colorBlindMode ? 'colorblind-mode' : ''} ${isNew ? placementAnimation : ''} ${getClearingAnimation()}`}>
      <div className="tile-number">{value}</div>
      {colorBlindMode && (
        <div className="tile-symbol">{getTileSymbol(value)}</div>
      )}
    </div>
  );
};

export default Tile;

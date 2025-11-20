import { useEffect, useState } from 'react';
import { Play, X } from 'lucide-react';
import { adMobService } from '../services/admob';

interface ReviveAdProps {
  onComplete: () => void;
  onCancel: () => void;
}

export function ReviveAd({ onComplete, onCancel }: ReviveAdProps) {
  const [countdown, setCountdown] = useState(5);
  const [isWatching, setIsWatching] = useState(false);

  useEffect(() => {
    if (isWatching && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isWatching && countdown === 0) {
      onComplete();
    }
  }, [countdown, isWatching, onComplete]);

  const handleWatchAd = async () => {
    // Show actual rewarded ad on mobile
    const reward = await adMobService.showRewardedAd();
    
    if (reward) {
      // Ad was watched successfully, grant revive
      onComplete();
    } else {
      // Ad failed or was skipped, show simulated ad for web
      setIsWatching(true);
    }
  };

  if (!isWatching) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl p-6 max-w-md w-full border-2 border-purple-500/50 shadow-2xl">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Watch Ad to Revive?</h2>
            <p className="text-gray-300">
              Watch a video to clear the top 3 rows and continue playing!
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleWatchAd}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-6 text-lg rounded-xl border-none cursor-pointer transition-all"
              >
                Watch Ad
              </button>
              <button
                onClick={onCancel}
                className="px-6 py-3 border-2 border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent rounded-xl cursor-pointer transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border-2 border-purple-500 shadow-2xl text-center space-y-6">
        <div className="relative w-full aspect-video bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg flex items-center justify-center border border-purple-500/30">
          <div className="text-center">
            <Play className="w-16 h-16 text-purple-400 mx-auto mb-2 animate-pulse" />
            <p className="text-gray-400 text-sm">Simulated Ad Playing...</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-5xl font-bold text-white tabular-nums">
            {countdown}
          </div>
          <p className="text-gray-400">seconds remaining</p>
        </div>

        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-1000"
            style={{ width: `${((5 - countdown) / 5) * 100}%` }}
          />
        </div>

        <p className="text-xs text-gray-500">
          Note: In the mobile app, this will show a real rewarded video ad
        </p>
      </div>
    </div>
  );
}

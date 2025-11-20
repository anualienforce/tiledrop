import { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';

interface RatePromptProps {
  score: number;
  highScore: number;
  onClose: () => void;
}

export function RatePrompt({ score, highScore, onClose }: RatePromptProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const shouldShow = checkShouldShowRating(score, highScore);
    setShow(shouldShow);
  }, [score, highScore]);

  const handleRate = () => {
    markRatingShown();
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isIOS) {
      window.open('https://apps.apple.com/app/tiledrop/id[YOUR_APP_ID]?action=write-review', '_blank');
    } else if (isAndroid) {
      window.open('https://play.google.com/store/apps/details?id=com.tpgames.tiledrop&reviewId=0', '_blank');
    } else {
      alert('Please rate us on the App Store or Google Play!');
    }
    
    setShow(false);
    onClose();
  };

  const handleLater = () => {
    markRatingPrompted();
    setShow(false);
    onClose();
  };

  const handleNever = () => {
    markRatingDeclined();
    setShow(false);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleLater}
      />
      
      <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300">
        <button
          onClick={handleLater}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X size={20} className="text-gray-500" />
        </button>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={32}
                className="text-yellow-400 fill-yellow-400 mx-1"
              />
            ))}
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Enjoying TileDrop?
          </h3>
          
          <p className="text-gray-600">
            Your feedback helps us improve and reach more puzzle enthusiasts!
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleRate}
            className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            ⭐ Rate 5 Stars
          </button>
          
          <button
            onClick={handleLater}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Maybe Later
          </button>
          
          <button
            onClick={handleNever}
            className="w-full text-gray-500 text-sm py-2 hover:text-gray-700 transition-colors"
          >
            Don't ask again
          </button>
        </div>
      </div>
    </div>
  );
}

function checkShouldShowRating(score: number, highScore: number): boolean {
  try {
    const ratingStatus = localStorage.getItem('rating_status');
    
    if (ratingStatus === 'declined' || ratingStatus === 'completed') {
      return false;
    }
    
    const gamesPlayed = parseInt(localStorage.getItem('games_played') || '0');
    const lastPrompt = localStorage.getItem('last_rating_prompt');
    
    if (lastPrompt) {
      const daysSincePrompt = (Date.now() - parseInt(lastPrompt)) / (1000 * 60 * 60 * 24);
      if (daysSincePrompt < 7) {
        return false;
      }
    }
    
    if (score > 1000 && gamesPlayed >= 5) {
      return true;
    }
    
    if (score >= highScore && highScore > 500 && gamesPlayed >= 3) {
      return true;
    }
    
    if (gamesPlayed >= 10 && !lastPrompt) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking rating status:', error);
    return false;
  }
}

function markRatingPrompted() {
  try {
    localStorage.setItem('last_rating_prompt', Date.now().toString());
  } catch (error) {
    console.error('Error marking rating prompted:', error);
  }
}

function markRatingShown() {
  try {
    localStorage.setItem('rating_status', 'completed');
    localStorage.setItem('last_rating_prompt', Date.now().toString());
  } catch (error) {
    console.error('Error marking rating shown:', error);
  }
}

function markRatingDeclined() {
  try {
    localStorage.setItem('rating_status', 'declined');
  } catch (error) {
    console.error('Error marking rating declined:', error);
  }
}

export function incrementGamesPlayed() {
  try {
    const current = parseInt(localStorage.getItem('games_played') || '0');
    localStorage.setItem('games_played', (current + 1).toString());
  } catch (error) {
    console.error('Error incrementing games played:', error);
  }
}

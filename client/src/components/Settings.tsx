import { X, Volume2, VolumeX, Trash2, Eye, Contrast, Wind, Music, Zap, CheckCircle, Star, ZoomOut } from 'lucide-react';
import { useAudio } from '../lib/stores/useAudio';
import { useAccessibility } from '../lib/stores/useAccessibility';
import { useDisplay } from '../lib/stores/useDisplay';

interface SettingsProps {
  onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const { 
    isMuted, 
    toggleMute, 
    musicVolume, 
    hitVolume, 
    successVolume, 
    comboVolume,
    setMusicVolume,
    setHitVolume,
    setSuccessVolume,
    setComboVolume,
    playHit,
    playSuccess,
    playCombo
  } = useAudio();
  const { colorBlindMode, highContrastMode, reducedMotion, toggleColorBlindMode, toggleHighContrastMode, toggleReducedMotion } = useAccessibility();
  const { zoomLevel, setZoomLevel } = useDisplay();

  const handleResetStats = () => {
    if (confirm('Are you sure you want to reset all your statistics? This cannot be undone.')) {
      try {
        localStorage.removeItem('highScore');
        localStorage.removeItem('bestCombo');
        localStorage.removeItem('totalTilesCleared');
        alert('Statistics have been reset!');
        window.location.reload();
      } catch (err) {
        console.warn('Failed to reset statistics:', err);
        alert('Failed to reset statistics. Please try again.');
      }
    }
  };

  const handleResetFirstVisit = () => {
    try {
      localStorage.removeItem('hasVisited');
      alert('First visit flag reset. Reload to see welcome screen again.');
    } catch (err) {
      console.warn('Failed to reset first visit flag:', err);
      alert('Failed to reset. Please try again.');
    }
  };

  const handleResetCoins = () => {
    if (confirm('Are you sure you want to reset your coins to 0? This cannot be undone.')) {
      try {
        localStorage.setItem('coins', '0');
        alert('Coins have been reset to 0!');
        window.location.reload();
      } catch (err) {
        console.warn('Failed to reset coins:', err);
        alert('Failed to reset coins. Please try again.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <section className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">📐 Display</h3>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ZoomOut size={16} className="text-indigo-500" />
                  <span className="text-sm font-semibold text-gray-700">Zoom Level</span>
                </div>
                <span className="text-xs text-gray-500">{Math.round(zoomLevel * 100)}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="100"
                value={zoomLevel * 100}
                onChange={(e) => setZoomLevel(parseInt(e.target.value) / 100)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                Adjust if the game doesn't fit your screen. Lower values zoom out to show more.
              </p>
            </div>
          </section>

          <section className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">🔊 Audio</h3>
            <button
              onClick={toggleMute}
              className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-300 hover:border-purple-500 transition-colors mb-3"
            >
              <span className="font-semibold text-gray-700">Master Volume</span>
              <div className="flex items-center gap-2">
                {isMuted ? (
                  <>
                    <VolumeX size={20} className="text-red-500" />
                    <span className="text-sm text-red-500 font-medium">Muted</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={20} className="text-green-500" />
                    <span className="text-sm text-green-500 font-medium">On</span>
                  </>
                )}
              </div>
            </button>

            {/* Individual Volume Controls */}
            <div className="space-y-3">
              {/* Background Music */}
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Music size={16} className="text-purple-500" />
                    <span className="text-sm font-semibold text-gray-700">Background Music</span>
                  </div>
                  <span className="text-xs text-gray-500">{Math.round(musicVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={musicVolume * 100}
                  onChange={(e) => setMusicVolume(parseInt(e.target.value) / 100)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  disabled={isMuted}
                />
              </div>

              {/* Tile Drop Sound */}
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-blue-500" />
                    <span className="text-sm font-semibold text-gray-700">Tile Drop</span>
                  </div>
                  <span className="text-xs text-gray-500">{Math.round(hitVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hitVolume * 100}
                  onChange={(e) => {
                    setHitVolume(parseInt(e.target.value) / 100);
                    if (!isMuted) playHit();
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  disabled={isMuted}
                />
              </div>

              {/* Match Success Sound */}
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm font-semibold text-gray-700">Match Success</span>
                  </div>
                  <span className="text-xs text-gray-500">{Math.round(successVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={successVolume * 100}
                  onChange={(e) => {
                    setSuccessVolume(parseInt(e.target.value) / 100);
                    if (!isMuted) playSuccess();
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                  disabled={isMuted}
                />
              </div>

              {/* Combo Sound */}
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-orange-500" />
                    <span className="text-sm font-semibold text-gray-700">Combo Sound</span>
                  </div>
                  <span className="text-xs text-gray-500">{Math.round(comboVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={comboVolume * 100}
                  onChange={(e) => {
                    setComboVolume(parseInt(e.target.value) / 100);
                    if (!isMuted) playCombo(2);
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  disabled={isMuted}
                />
              </div>
            </div>
          </section>

          <section className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">♿ Accessibility</h3>
            <div className="space-y-2">
              <button
                onClick={toggleColorBlindMode}
                className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-300 hover:border-purple-500 transition-colors"
                role="switch"
                aria-checked={colorBlindMode}
                aria-label={`Color-Blind Mode: ${colorBlindMode ? 'On' : 'Off'}`}
              >
                <div className="flex items-center gap-2">
                  <Eye size={18} className={colorBlindMode ? "text-purple-600" : "text-gray-500"} aria-hidden="true" />
                  <span className="font-semibold text-gray-700">Color-Blind Mode</span>
                </div>
                <div className="flex items-center gap-2" aria-hidden="true">
                  {colorBlindMode ? (
                    <span className="text-sm text-purple-600 font-medium">On</span>
                  ) : (
                    <span className="text-sm text-gray-500 font-medium">Off</span>
                  )}
                </div>
              </button>
              
              <button
                onClick={toggleHighContrastMode}
                className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-300 hover:border-purple-500 transition-colors"
                role="switch"
                aria-checked={highContrastMode}
                aria-label={`High Contrast Mode: ${highContrastMode ? 'On' : 'Off'}`}
              >
                <div className="flex items-center gap-2">
                  <Contrast size={18} className={highContrastMode ? "text-purple-600" : "text-gray-500"} aria-hidden="true" />
                  <span className="font-semibold text-gray-700">High Contrast</span>
                </div>
                <div className="flex items-center gap-2" aria-hidden="true">
                  {highContrastMode ? (
                    <span className="text-sm text-purple-600 font-medium">On</span>
                  ) : (
                    <span className="text-sm text-gray-500 font-medium">Off</span>
                  )}
                </div>
              </button>
              
              <button
                onClick={toggleReducedMotion}
                className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-300 hover:border-purple-500 transition-colors"
                role="switch"
                aria-checked={reducedMotion}
                aria-label={`Reduced Motion: ${reducedMotion ? 'On' : 'Off'}`}
              >
                <div className="flex items-center gap-2">
                  <Wind size={18} className={reducedMotion ? "text-purple-600" : "text-gray-500"} aria-hidden="true" />
                  <span className="font-semibold text-gray-700">Reduced Motion</span>
                </div>
                <div className="flex items-center gap-2" aria-hidden="true">
                  {reducedMotion ? (
                    <span className="text-sm text-purple-600 font-medium">On</span>
                  ) : (
                    <span className="text-sm text-gray-500 font-medium">Off</span>
                  )}
                </div>
              </button>
            </div>
          </section>

          <section className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">📊 Data Management</h3>
            <div className="space-y-2">
              <button
                onClick={handleResetStats}
                className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-red-300 hover:border-red-500 hover:bg-red-50 transition-colors group"
              >
                <span className="font-semibold text-gray-700 group-hover:text-red-700">Reset Statistics</span>
                <Trash2 size={20} className="text-red-500" />
              </button>
              
              <button
                onClick={handleResetCoins}
                className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-orange-300 hover:border-orange-500 hover:bg-orange-50 transition-colors group"
              >
                <span className="font-semibold text-gray-700 group-hover:text-orange-700">Reset Coins to 0</span>
                <Trash2 size={20} className="text-orange-500" />
              </button>
              
              <button
                onClick={handleResetFirstVisit}
                className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-300 hover:border-purple-500 hover:bg-purple-50 transition-colors text-sm"
              >
                <span className="font-medium text-gray-600">Show Welcome Screen Again</span>
                <span className="text-purple-600">↻</span>
              </button>
            </div>
          </section>

          <section className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-200">
            <h3 className="text-sm font-bold text-gray-900 mb-2">ℹ️ About TileDrop</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              A mobile-optimized puzzle game with continuous difficulty progression. 
              Match tiles, create combos, and beat your high score!
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Version 1.0.0
            </p>
            <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-purple-200">
              Music: "Quirky Puzzler" by Eric Matyas (soundimage.org)
            </p>
          </section>
        </div>

        <div className="bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
}

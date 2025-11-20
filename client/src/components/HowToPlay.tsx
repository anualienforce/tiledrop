import { X, Target, Gamepad2, Timer, Zap, Flame, ShoppingBag, Tv, Calendar, Lightbulb } from 'lucide-react';

interface HowToPlayProps {
  onClose: () => void;
}

export default function HowToPlay({ onClose }: HowToPlayProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white via-gray-50 to-purple-50/30 rounded-3xl max-w-lg w-full max-h-[90vh] shadow-2xl border border-white/20 flex flex-col overflow-hidden">
        {/* Header with glassmorphism effect */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-purple-200/50 px-6 py-5 flex justify-between items-center z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
              <Gamepad2 size={20} className="text-white" />
            </div>
            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              How to Play
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-purple-100 transition-all duration-200 flex items-center justify-center group"
            aria-label="Close"
          >
            <X size={22} className="text-gray-600 group-hover:text-purple-600 transition-colors" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Goal Section */}
          <section className="bg-gradient-to-br from-purple-50 to-blue-50 p-5 rounded-2xl border border-purple-200/50 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                <Target size={18} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Goal</h3>
            </div>
            <p className="text-gray-700 leading-relaxed pl-12">
              Match 3 or more tiles with the same number to clear them and score points. The game gets progressively harder as you score more!
            </p>
          </section>

          {/* How to Play Section */}
          <section className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                <Gamepad2 size={18} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Gameplay</h3>
            </div>
            <ol className="space-y-3 pl-12">
              {[
                'Tap a column to drop the next tile',
                'Match 3 or more tiles horizontally or vertically',
                'Matched tiles clear automatically',
                'Chain reactions give combo multipliers!',
                'Game ends when the board fills completely'
              ].map((text, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold text-sm flex items-center justify-center shadow-md">
                    {i + 1}
                  </span>
                  <span className="text-gray-700 pt-0.5">{text}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Timer Challenge */}
          <section className="bg-gradient-to-br from-orange-50 to-yellow-50 p-5 rounded-2xl border border-orange-200/50 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-md">
                <Timer size={18} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Timer Challenge</h3>
            </div>
            <p className="text-gray-700 leading-relaxed mb-3 pl-12">
              You have limited time to place each tile! After placing your first tile:
            </p>
            <ul className="space-y-2 pl-12">
              {[
                'Timer starts at 4 seconds per tile',
                'Gets 0.1s faster every 10 tiles (down to 1.2s)',
                'If time runs out, tile auto-drops in the worst spot!',
                'Watch the timer bar to see remaining time'
              ].map((text, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gradient-to-br from-orange-500 to-red-500 mt-2"></span>
                  <span className="text-gray-700">{text}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Power-Ups */}
          <section className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-md">
                <Zap size={18} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Power-Ups</h3>
            </div>
            <div className="space-y-3 pl-12">
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 p-4 rounded-xl border border-red-300/30 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">💣</span>
                  <span className="font-bold text-gray-900 text-lg">Bomb</span>
                </div>
                <p className="text-sm text-gray-600 pl-11">
                  Clear all tiles of the same number across the entire board
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4 rounded-xl border border-blue-300/30 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">➡️</span>
                  <span className="font-bold text-gray-900 text-lg">Clear Row</span>
                </div>
                <p className="text-sm text-gray-600 pl-11">
                  Remove an entire row of your choice
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 rounded-xl border border-purple-300/30 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">🔄</span>
                  <span className="font-bold text-gray-900 text-lg">Shuffle</span>
                </div>
                <p className="text-sm text-gray-600 pl-11">
                  Randomly rearrange all tiles on the board
                </p>
              </div>
            </div>
          </section>

          {/* Combos */}
          <section className="bg-gradient-to-br from-red-50 to-orange-50 p-5 rounded-2xl border border-red-200/50 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-md">
                <Flame size={18} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Combos</h3>
            </div>
            <p className="text-gray-700 leading-relaxed mb-3 pl-12">
              When tiles clear and cause a chain reaction, you earn combo multipliers:
            </p>
            <div className="space-y-2 pl-12">
              <div className="flex gap-3 items-center">
                <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold flex items-center justify-center shadow-md">2x</span>
                <span className="text-gray-700">Second cascade</span>
              </div>
              <div className="flex gap-3 items-center">
                <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 text-white font-bold flex items-center justify-center shadow-md">3x+</span>
                <span className="text-gray-700">Third cascade and beyond (with screen shake!)</span>
              </div>
            </div>
          </section>

          {/* Shop */}
          <section className="bg-gradient-to-br from-yellow-50 to-amber-50 p-5 rounded-2xl border border-yellow-200/50 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center shadow-md">
                <ShoppingBag size={18} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Shop</h3>
            </div>
            <p className="text-gray-700 leading-relaxed mb-3 pl-12">
              Earn coins by playing and use them to purchase power-ups:
            </p>
            <ul className="space-y-2 pl-12">
              {[
                'Earn coins: Score ÷ 100 + 5 bonus coins per game',
                'Bomb: 50 coins | Clear Row: 40 coins | Shuffle: 30 coins',
                'Limited to 1 of each power-up type per game'
              ].map((text, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gradient-to-br from-yellow-500 to-amber-500 mt-2"></span>
                  <span className="text-gray-700">{text}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Watch Ad to Revive */}
          <section className="bg-gradient-to-br from-pink-50 to-rose-50 p-5 rounded-2xl border border-pink-200/50 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-md">
                <Tv size={18} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Watch Ad to Revive</h3>
            </div>
            <p className="text-gray-700 leading-relaxed mb-3 pl-12">
              When the game ends, you get one chance to keep playing:
            </p>
            <ul className="space-y-2 pl-12">
              {[
                'Watch a 5-second ad to revive your game',
                'Clears the top 3 rows, giving you more room to play',
                'Can only be used once per game',
                'Timer resets to 4 seconds after revival'
              ].map((text, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 mt-2"></span>
                  <span className="text-gray-700">{text}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Daily Challenge */}
          <section className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border border-green-200/50 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-md">
                <Calendar size={18} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Daily Challenge</h3>
            </div>
            <p className="text-gray-700 leading-relaxed pl-12">
              Complete the daily goal to earn achievements! The challenge resets at midnight.
            </p>
          </section>

          {/* Pro Tips */}
          <section className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[2px] rounded-2xl shadow-lg">
            <div className="bg-white p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                  <Lightbulb size={18} className="text-white" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Pro Tips</h3>
              </div>
              <ul className="space-y-2 pl-12">
                {[
                  'Plan ahead - check the next tile before placing',
                  'Save power-ups for emergency situations',
                  'Try to create chain reactions for higher scores',
                  'Keep columns balanced to avoid filling up'
                ].map((text, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 mt-2"></span>
                    <span className="text-gray-700 font-medium">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Footer Button */}
        <div className="sticky bottom-0 bg-white/90 backdrop-blur-xl border-t border-purple-200/50 px-6 py-5 z-10 shadow-lg">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-purple-500/30"
          >
            Got it! Let's Play 🎮
          </button>
        </div>
      </div>
    </div>
  );
}

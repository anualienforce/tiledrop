import { Sparkles, Trophy, Zap, Target } from 'lucide-react';

interface WelcomeScreenProps {
  onClose: () => void;
  onShowHelp: () => void;
}

export default function WelcomeScreen({ onClose, onShowHelp }: WelcomeScreenProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 sm:hidden flex items-center justify-center z-50 p-4">
      <div
        className="
          bg-gradient-to-br from-white via-gray-50 to-purple-50/30
          rounded-2xl w-full shadow-xl overflow-hidden animate-scale-in border border-white/20
          max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl
          scale-90 sm:scale-95 md:scale-100
        "
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 p-4 text-center overflow-hidden">
          <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl -translate-x-6 -translate-y-6"></div>
          <div className="absolute bottom-0 right-0 w-28 h-28 bg-white/10 rounded-full blur-2xl translate-x-8 translate-y-8"></div>

          <div className="relative inline-block mb-1">
            <div className="absolute inset-0 bg-white/30 rounded-xl blur-lg"></div>
            <div className="relative p-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
              <Sparkles size={32} className="text-white" strokeWidth={2} />
            </div>
          </div>

          <h1 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-0 tracking-tight drop-shadow-lg">
            TileDrop
          </h1>
          <p className="relative text-white/90 font-semibold text-xs sm:text-sm md:text-base lg:text-lg tracking-wide">
            Match, Clear, Score!
          </p>

          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
        </div>

        <div className="p-3 sm:p-5 md:p-8 lg:p-10 space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8">
          <div className="text-center space-y-1">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Welcome! 👋
            </h2>
            <p className="text-gray-600 leading-snug text-xs sm:text-sm md:text-base lg:text-lg">
              Drop numbered tiles into columns and match 3 or more to clear them. The game gets progressively harder as you score more points!
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-3 lg:gap-4">
            <div className="group hover:scale-105 transition-transform duration-200">
              <div className="text-center p-2 sm:p-3 md:p-4 lg:p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-300/30 shadow-sm hover:shadow-md">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 mx-auto mb-1 md:mb-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                  <Trophy size={16} className="text-white sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                </div>
                <div className="text-[9px] sm:text-xs md:text-sm lg:text-base font-bold text-gray-700">High Scores</div>
              </div>
            </div>
            <div className="group hover:scale-105 transition-transform duration-200">
              <div className="text-center p-2 sm:p-3 md:p-4 lg:p-5 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-300/30 shadow-sm hover:shadow-md">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 mx-auto mb-1 md:mb-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
                  <Zap size={16} className="text-white sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                </div>
                <div className="text-[9px] sm:text-xs md:text-sm lg:text-base font-bold text-gray-700">Power-Ups</div>
              </div>
            </div>
            <div className="group hover:scale-105 transition-transform duration-200">
              <div className="text-center p-2 sm:p-3 md:p-4 lg:p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl border border-orange-300/30 shadow-sm hover:shadow-md">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 mx-auto mb-1 md:mb-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-md">
                  <Target size={16} className="text-white sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                </div>
                <div className="text-[9px] sm:text-xs md:text-sm lg:text-base font-bold text-gray-700">Combos</div>
              </div>
            </div>
          </div>

          {/* Power-ups Preview */}
          <div className="bg-white p-2 sm:p-3 md:p-3 lg:p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-[9px] sm:text-xs md:text-xs lg:text-base font-semibold text-gray-500 mb-1 md:mb-1.5 lg:mb-2 text-center uppercase tracking-wider">Available Power-Ups</p>
            <div className="grid grid-cols-3 gap-1 md:gap-2 lg:gap-3">
              <div className="text-center p-1 md:p-1.5 lg:p-3 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-lg border border-red-300/30 hover:shadow-md">
                <div className="text-lg sm:text-xl md:text-xl lg:text-3xl mb-0.5">💣</div>
                <div className="text-[9px] sm:text-xs md:text-xs lg:text-base font-semibold text-gray-700">Bomb</div>
              </div>
              <div className="text-center p-1 md:p-1.5 lg:p-3 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-300/30 hover:shadow-md">
                <div className="text-lg sm:text-xl md:text-xl lg:text-3xl mb-0.5">➡️</div>
                <div className="text-[9px] sm:text-xs md:text-xs lg:text-base font-semibold text-gray-700">Clear Row</div>
              </div>
              <div className="text-center p-1 md:p-1.5 lg:p-3 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-300/30 hover:shadow-md">
                <div className="text-lg sm:text-xl md:text-xl lg:text-3xl mb-0.5">🔄</div>
                <div className="text-[9px] sm:text-xs md:text-xs lg:text-base font-semibold text-gray-700">Shuffle</div>
              </div>
            </div>
          </div>

          {/* Pro Tip */}
          <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[1px] rounded-xl">
            <div className="bg-white p-2 sm:p-3 md:p-4 lg:p-5 rounded-xl text-center text-[10px] sm:text-xs md:text-sm lg:text-base text-gray-700 font-semibold">
              <span className="inline-block mr-1">💡</span>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">Tip:</span>
              <span className="ml-1">Chain combos for higher scores!</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 sm:space-y-3 md:space-y-4 pt-1">
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white font-bold py-2 sm:py-3 md:py-4 lg:py-5 rounded-lg hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md text-xs sm:text-sm md:text-base lg:text-lg"
            >
              Start Playing! 🎮
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
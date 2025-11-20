import { X, Bomb, ArrowRight, RefreshCw, CircleDollarSign } from 'lucide-react';

interface ShopProps {
  onClose: () => void;
  coins: number;
  purchasedPowerUps: string[];
  onPurchase: (type: string, cost: number) => boolean;
}

const POWERUP_PRICES = {
  bomb: 50,
  row: 40,
  swap: 30,
};

export default function Shop({ onClose, coins, purchasedPowerUps, onPurchase }: ShopProps) {
  const handlePurchase = (type: string, cost: number) => {
    const success = onPurchase(type, cost);
    if (!success) {
      // Could add toast notification here
      console.log('Purchase failed');
    }
  };

  const isPurchased = (type: string) => purchasedPowerUps.includes(type);
  const canAfford = (cost: number) => coins >= cost;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Power-Up Shop
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Coin Balance */}
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-xl shadow-lg">
            <div className="flex items-center justify-center gap-2 text-white">
              <CircleDollarSign size={28} className="animate-pulse" />
              <div className="text-center">
                <div className="text-sm font-semibold opacity-90">Your Balance</div>
                <div className="text-3xl font-bold">{coins}</div>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900 text-center">
              ⚡ You can purchase <strong>one of each</strong> power-up per game
            </p>
          </div>

          {/* Power-Up Items */}
          <div className="grid grid-cols-3 gap-3">
            {/* Bomb Power-Up */}
            <div className="bg-gray-50 p-3 rounded-xl border-2 border-gray-200 flex flex-col">
              <div className="flex flex-col items-center mb-2">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-2">
                  <Bomb size={24} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-center text-sm">Bomb</h3>
                <p className="text-xs text-gray-600 text-center">Clear 3x3</p>
              </div>
              <div className="flex items-center justify-center gap-1 font-bold text-orange-600 mb-2">
                <CircleDollarSign size={14} />
                <span>{POWERUP_PRICES.bomb}</span>
              </div>
              {isPurchased('bomb') ? (
                <div className="w-full py-2 bg-green-100 text-green-700 rounded-lg font-semibold text-center text-xs">
                  ✓ Purchased
                </div>
              ) : (
                <button
                  onClick={() => handlePurchase('bomb', POWERUP_PRICES.bomb)}
                  disabled={!canAfford(POWERUP_PRICES.bomb)}
                  className={`w-full py-2 rounded-lg font-semibold transition-colors text-xs ${
                    canAfford(POWERUP_PRICES.bomb)
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canAfford(POWERUP_PRICES.bomb) ? 'Buy' : 'No Coins'}
                </button>
              )}
            </div>

            {/* Row Clear Power-Up */}
            <div className="bg-gray-50 p-3 rounded-xl border-2 border-gray-200 flex flex-col">
              <div className="flex flex-col items-center mb-2">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-2">
                  <ArrowRight size={24} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-center text-sm">Row Clear</h3>
                <p className="text-xs text-gray-600 text-center">Clear row</p>
              </div>
              <div className="flex items-center justify-center gap-1 font-bold text-orange-600 mb-2">
                <CircleDollarSign size={14} />
                <span>{POWERUP_PRICES.row}</span>
              </div>
              {isPurchased('row') ? (
                <div className="w-full py-2 bg-green-100 text-green-700 rounded-lg font-semibold text-center text-xs">
                  ✓ Purchased
                </div>
              ) : (
                <button
                  onClick={() => handlePurchase('row', POWERUP_PRICES.row)}
                  disabled={!canAfford(POWERUP_PRICES.row)}
                  className={`w-full py-2 rounded-lg font-semibold transition-colors text-xs ${
                    canAfford(POWERUP_PRICES.row)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canAfford(POWERUP_PRICES.row) ? 'Buy' : 'No Coins'}
                </button>
              )}
            </div>

            {/* Swap Power-Up */}
            <div className="bg-gray-50 p-3 rounded-xl border-2 border-gray-200 flex flex-col">
              <div className="flex flex-col items-center mb-2">
                <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mb-2">
                  <RefreshCw size={24} className="text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-center text-sm">Swap</h3>
                <p className="text-xs text-gray-600 text-center">New tile</p>
              </div>
              <div className="flex items-center justify-center gap-1 font-bold text-orange-600 mb-2">
                <CircleDollarSign size={14} />
                <span>{POWERUP_PRICES.swap}</span>
              </div>
              {isPurchased('swap') ? (
                <div className="w-full py-2 bg-green-100 text-green-700 rounded-lg font-semibold text-center text-xs">
                  ✓ Purchased
                </div>
              ) : (
                <button
                  onClick={() => handlePurchase('swap', POWERUP_PRICES.swap)}
                  disabled={!canAfford(POWERUP_PRICES.swap)}
                  className={`w-full py-2 rounded-lg font-semibold transition-colors text-xs ${
                    canAfford(POWERUP_PRICES.swap)
                      ? 'bg-gradient-to-r from-teal-500 to-green-500 text-white hover:from-teal-600 hover:to-green-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canAfford(POWERUP_PRICES.swap) ? 'Buy' : 'No Coins'}
                </button>
              )}
            </div>
          </div>

          {/* Earn More Info */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <p className="text-sm text-purple-900 text-center">
              💡 <strong>Earn coins</strong> by playing! Higher scores = more coins
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

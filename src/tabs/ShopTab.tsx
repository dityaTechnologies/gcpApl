import { useState } from 'react';
import { shopProducts } from '../data/players';
import { useGame } from '../context/GameContext';

export default function ShopTab() {
  const { stats, addCoins, addToast } = useGame();
  const [bought, setBought] = useState<Set<number>>(new Set());
  const [timeLeft] = useState('14:32');

  const handleBuy = (id: number, price: number) => {
    if (bought.has(id)) return;
    setBought(prev => new Set([...prev, id]));
    // Give small coin cashback
    const cashback = Math.floor(price * 0.05);
    addCoins(cashback);
    addToast(`🛍️ Added to cart! +${cashback} CC cashback`);
  };

  return (
    <div className="animate-fade-in pb-2">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-black text-white">🛍️ Flash Sale!</h2>
            <p className="text-slate-400 text-xs mt-0.5">Use CrickCoins for extra discounts!</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-full font-bold animate-pulse">
              🔥 Timeout Deal
            </span>
            <span className="text-xs text-slate-400 font-mono">⏱️ {timeLeft}</span>
          </div>
        </div>
      </div>

      {/* Coins display */}
      <div className="mx-4 mb-3 glass p-3 flex items-center gap-2">
        <span className="text-xl">🪙</span>
        <p className="text-sm font-semibold text-yellow-400">{stats.coins} CrickCoins available</p>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 gap-3 px-4">
        {shopProducts.map(p => {
          const isBought = bought.has(p.id);
          return (
            <div key={p.id} className={`glass flex flex-col transition-all duration-200 ${isBought ? 'border-teal-500/30' : ''}`}>
              {/* Emoji */}
              <div className="flex items-center justify-center py-5 text-4xl bg-slate-700/20 rounded-t-2xl">
                {p.emoji}
              </div>

              <div className="p-3 flex flex-col gap-2">
                <p className="font-heading text-xs font-bold text-white leading-tight">{p.name}</p>

                <div className="flex items-center gap-1">
                  <span className="font-heading text-sm font-black text-white">₹{p.salePrice}</span>
                  <span className="text-xs text-slate-500 line-through">₹{p.originalPrice}</span>
                </div>

                <span className="text-xs text-teal-400 font-bold w-fit bg-teal-500/10 px-1.5 py-0.5 rounded-lg">
                  {p.discount}% OFF
                </span>

                <button
                  onClick={() => handleBuy(p.id, p.salePrice)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
                    isBought
                      ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                      : 'gradient-bg text-white shadow-teal-500/20 shadow-md'
                  }`}
                >
                  {isBought ? '✅ Added' : 'Buy Now'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

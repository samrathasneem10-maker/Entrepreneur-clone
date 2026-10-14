import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { MARKET_TICKERS } from '@/data/newsData';

export const MarketTicker: React.FC = () => {
  return (
    <div className="w-full bg-slate-900 text-slate-100 text-xs py-2.5 px-5 lg:px-10 border-b border-slate-800 overflow-x-auto no-scrollbar">
      <div className="w-full flex items-center justify-between min-w-max gap-6 sm:gap-8">
        
        <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider text-[11px] flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Markets Ticker
        </div>

        <div className="flex items-center gap-6 sm:gap-10 overflow-x-auto no-scrollbar">
          {MARKET_TICKERS.map((item) => (
            <div key={item.symbol} className="flex items-center gap-2.5 whitespace-nowrap">
              <span className="font-semibold text-slate-300">{item.name}</span>
              <span className="font-mono text-slate-100">{item.price}</span>
              
              <div
                className={`flex items-center font-mono text-[11px] font-bold ${
                  item.isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {item.isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5 inline" />
                )}
                <span>{item.changePercent}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

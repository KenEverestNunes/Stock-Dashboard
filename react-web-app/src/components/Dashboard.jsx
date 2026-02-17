import React, { useEffect, useState } from 'react';
import { useStockStore } from '../store/stockStore';
import CandleChart from './CandleChart';
import { X } from 'lucide-react'; // Import X icon for the close button

export default function Dashboard() {
  const { coins, updateCoinData } = useStockStore();
  const [selectedCoin, setSelectedCoin] = useState(null);

  useEffect(() => {
    // Connecting to your FastAPI backend
    const socket = new WebSocket('ws://localhost:8000/ws/stats');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      updateCoinData(data);
    };

    socket.onopen = () => console.log("Connected to Market Stream");
    socket.onerror = (err) => console.error("WebSocket Error:", err);

    return () => socket.close();
  }, [updateCoinData]);

  // Helper to close modal when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedCoin(null);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 relative">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Market Overview</h1>
          <p className="text-gray-400 mt-1">Real-time crypto asset monitoring</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-green-500 uppercase tracking-widest">Live</span>
        </div>
      </div>

      {/* Scrollable Table Container */}
      <div className="glass-card rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-[#0f172a] shadow-md">
              <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Asset</th>
                <th className="px-6 py-4 font-semibold text-right">Price (USD)</th>
                <th className="px-6 py-4 font-semibold text-right">24h Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {Object.entries(coins).map(([symbol, data]) => {
                const isPositive = parseFloat(data.change) >= 0;
                
                return (
                  <tr 
                    key={symbol} 
                    onClick={() => setSelectedCoin(symbol)} 
                    className="cursor-pointer transition-all duration-200 hover:bg-white/5 active:bg-white/10"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center font-bold text-xs text-gray-400">
                          {symbol[0]}
                        </div>
                        <div>
                          <div className="font-bold text-lg text-white">
                            {symbol.replace("USDT", "")}
                          </div>
                          <div className="text-[10px] text-gray-500 font-bold tracking-widest">USDT</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="font-mono text-xl tabular-nums tracking-tighter text-white">
                        ${parseFloat(data.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className={`px-6 py-5 text-right font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-sm">{isPositive ? '▲' : '▼'}</span>
                        <span className="tabular-nums text-lg">{Math.abs(data.change).toFixed(2)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL OVERLAY --- */}
      {selectedCoin && (
        <div 
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        >
          {/* Modal Content */}
          <div className="glass-card w-full max-w-4xl p-6 rounded-3xl border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200 relative">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-orange-500 rounded-xl flex items-center justify-center text-xl font-black">
                  {selectedCoin[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedCoin.replace("USDT", "")} / USDT</h3>
                  <p className="text-gray-400 text-xs">Live Market Data</p>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedCoin(null)}
                className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            {/* Chart Area */}
            <div className="rounded-xl overflow-hidden bg-black/20 border border-white/5">
              {/* Pass the symbol prop to your CandleChart component */}
              <CandleChart symbol={selectedCoin} />
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useEffect } from 'react';
import { useStockStore } from '../store/stockStore';

export default function Dashboard() {
  const { btcPrice, btcChange, setBtcData } = useStockStore();
  const isPositive = parseFloat(btcChange) >= 0;

  useEffect(() => {
  const socket = new WebSocket('ws://localhost:8000/ws/stats');
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // This calls the Zustand action to update the global state
    setBtcData(data); 
  };
  // Log to console so you can see the data hitting the browser
  socket.onopen = () => console.log("WebSocket Connected to FastAPI");
  return () => socket.close();
}, [setBtcData]);

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="glass-card p-10 rounded-3xl w-full max-w-md text-center transition-all hover:scale-[1.02]">
        <div className="flex justify-between items-center mb-8">
          <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-bold uppercase tracking-widest">
            Live Market
          </span>
          <div className={`h-2 w-2 rounded-full animate-pulse ${isPositive ? 'bg-green-400' : 'bg-red-400'}`} />
        </div>

        <h1 className="text-gray-400 text-lg font-medium mb-2">Bitcoin (BTC/USDT)</h1>
        
        {/* Tabular-nums prevents the price from "jittering" as digits change */}
        <div className="text-6xl font-bold tabular-nums tracking-tighter mb-4">
          ${parseFloat(btcPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>

        <div className={`text-lg font-semibold flex items-center justify-center gap-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          <span>{isPositive ? '▲' : '▼'}</span>
          <span>{Math.abs(btcChange).toFixed(2)}%</span>
          <span className="text-gray-500 text-sm font-normal">(24h)</span>
        </div>

        <button className="mt-8 w-full py-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors font-semibold border border-white/10">
          View Detailed Analytics
        </button>
      </div>
    </div>
  );
}
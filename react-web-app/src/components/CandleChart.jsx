import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import { useStockStore } from '../store/stockStore'; // Import your store

export default function CandleChart({ symbol }) {
  const chartContainerRef = useRef();
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  
  // SDE 2 Pattern: Subscribe to the store that is already being updated by the Dashboard
  const livePrice = useStockStore((state) => state.coins[symbol]?.price);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Initialize Chart
    const chart = createChart(chartContainerRef.current, {
      layout: { background: { type: ColorType.Solid, color: 'transparent' }, textColor: '#d1d5db' },
      grid: { vertLines: { color: 'rgba(51, 65, 85, 0.2)' }, horzLines: { color: 'rgba(51, 65, 85, 0.2)' } },
      width: chartContainerRef.current.offsetWidth,
      height: 400,
      timeScale: { timeVisible: true },
    });
    chartRef.current = chart;

    // Correct API for v5: addSeries(CandlestickSeries)
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e', downColor: '#ef4444', borderVisible: false,
      wickUpColor: '#22c55e', wickDownColor: '#ef4444',
    });
    seriesRef.current = candleSeries;

    // Fetch actual historical data so the chart isn't empty
    const fetchHistory = async () => {
      try {
        // Use api.binance.us to match your location and main.py configuration
const res = await fetch(`https://api.binance.us/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=1m&limit=100`);
        const data = await res.json();
        const formatted = data.map(d => ({
          time: d[0] / 1000,
          open: parseFloat(d[1]), high: parseFloat(d[2]),
          low: parseFloat(d[3]), close: parseFloat(d[4])
        }));
        candleSeries.setData(formatted);
      } catch (err) { console.error("History fetch error:", err); }
    };

    fetchHistory();

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.offsetWidth });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [symbol]);

  // SDE 2 Tip: Reactively update the chart whenever the store's price changes
  useEffect(() => {
    if (livePrice && seriesRef.current) {
      const price = parseFloat(livePrice);
      seriesRef.current.update({
        time: Math.floor(Date.now() / 1000),
        open: price, high: price, low: price, close: price,
      });
    }
  }, [livePrice]);

  return <div ref={chartContainerRef} className="w-full h-[400px]" />;
}
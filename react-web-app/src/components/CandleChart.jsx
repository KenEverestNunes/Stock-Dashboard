import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, AreaSeries } from 'lightweight-charts'; // 1. Import AreaSeries
import { useStockStore } from '../store/stockStore';

export default function CandleChart({ symbol }) {
  const chartContainerRef = useRef();
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const livePrice = useStockStore((state) => state.coins[symbol]?.price);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 1. Setup Chart
    const chart = createChart(chartContainerRef.current, {
      layout: { 
        background: { type: ColorType.Solid, color: 'transparent' }, 
        textColor: '#9ca3af', 
        attributionLogo: false 
      },
      grid: { 
        vertLines: { visible: false }, 
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' } 
      },
      width: chartContainerRef.current.offsetWidth,
      height: 400,
      timeScale: { 
        timeVisible: true, 
        secondsVisible: false,
        borderVisible: false 
      },
      rightPriceScale: {
        borderVisible: false,
      },
      crosshair: {
        vertLine: {
          labelBackgroundColor: '#f97316', 
        },
        horzLine: {
          labelBackgroundColor: '#f97316',
        }
      }
    });
    chartRef.current = chart;

    // 2. Correct Method for v5: addSeries(AreaSeries, options)
    const areaSeries = chart.addSeries(AreaSeries, {
      topColor: 'rgba(249, 115, 22, 0.56)', 
      bottomColor: 'rgba(249, 115, 22, 0.0)', 
      lineColor: '#f97316', 
      lineWidth: 2,
    });
    seriesRef.current = areaSeries;

    // 3. Fetch History
    const fetchHistory = async () => {
      try {
        const res = await fetch(`https://api.binance.us/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=1m&limit=100`);
        const data = await res.json();
        
        const formatted = data.map(d => ({
          time: d[0] / 1000,
          value: parseFloat(d[4]) 
        }));
        
        areaSeries.setData(formatted);
        chart.timeScale().fitContent();
        setIsLoading(false);
      } catch (err) { 
        console.error("History fetch error:", err);
        setIsLoading(false);
      }
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

  // 4. Live Updates
  useEffect(() => {
    if (livePrice && seriesRef.current) {
      const price = parseFloat(livePrice);
      const currentTime = Math.floor(Date.now() / 1000);

      seriesRef.current.update({
        time: currentTime,
        value: price,
      });
    }
  }, [livePrice]);

  return (
    <div className="relative w-full h-[400px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-900/50 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      )}
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
}
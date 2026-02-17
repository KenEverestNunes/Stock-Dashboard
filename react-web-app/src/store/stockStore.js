import { create } from 'zustand';

const initialCoins = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "ADAUSDT", "DOTUSDT", "POLUSDT", "DOGEUSDT", "LINKUSDT", "AVAXUSDT"];

export const useStockStore = create((set) => ({
  coins: initialCoins.reduce((acc, symbol) => {
    acc[symbol] = { price: "0.00", change: "0.00" };
    return acc;
  }, {}),
  updateCoinData: (data) => set((state) => ({
    coins: {
      ...state.coins,
      [data.symbol]: { price: data.price, change: data.change }
    }
  })),
}));
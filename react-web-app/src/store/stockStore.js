import { create } from 'zustand';

export const useStockStore = create((set) => ({
  btcPrice: "0.00",
  btcChange: "0.00",
  setBtcData: (data) => set({ 
    btcPrice: data.price, 
    btcChange: data.change 
  }),
}));
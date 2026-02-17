import asyncio
import json
import websockets
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for React (port 5173 for Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws/stats")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    # 10 Coins to match your stockStore.js
    coins = ["btc", "eth", "sol", "bnb", "ada", "dot", "pol", "doge", "link", "avax"]
    streams = "/".join([f"{coin}usdt@ticker" for coin in coins])
    
    binance_uri = f"wss://stream.binance.us:9443/stream?streams={streams}"
    
    try:
        async with websockets.connect(binance_uri) as binance_ws:
            while True:
                data = await binance_ws.recv()
                msg = json.loads(data)
                raw_data = msg['data']
                
                payload = {
                    "symbol": raw_data['s'], 
                    "price": raw_data['c'],
                    "change": raw_data['P']
                }
                await websocket.send_json(payload)
    except Exception as e:
        print(f"Error: {e}")
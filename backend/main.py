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
    # Free Public Binance Stream for BTC/USDT
    binance_uri = "wss://stream.binance.us:9443/ws/btcusdt@ticker"
    
    try:
        async with websockets.connect(binance_uri) as binance_ws:
            while True:
                # 1. Listen to Binance
                data = await binance_ws.recv()
                msg = json.loads(data)
                
                # 2. Extract only what we need (SDE 2 optimization)
                payload = {
                    "symbol": msg['s'],
                    "price": msg['c'],     # 'c' = Current Price
                    "change": msg['P']     # 'P' = Percentage Change (Uppercase P!)
                }
                
                # 3. Send to our React Frontend
                await websocket.send_json(payload)
                
    except WebSocketDisconnect:
        print("React Client disconnected")
    except Exception as e:
        print(f"Error: {e}")
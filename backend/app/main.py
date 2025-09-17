from fastapi import FastAPI, UploadFile, File, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import asyncio
from . import services, schemas

app = FastAPI(title="Matsya Ocean Insights - Backend")

# Allow local frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory WebSocket manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        to_remove = []
        for connection in list(self.active_connections):
            try:
                await connection.send_json(message)
            except Exception:
                to_remove.append(connection)
        for c in to_remove:
            self.disconnect(c)

manager = ConnectionManager()


@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.get("/api/species", response_model=list[schemas.SpeciesOccurrence])
async def list_species():
    """Return a short list of species occurrences (mock/memory)."""
    data = await services.get_species_list()
    return data


@app.post("/api/obis/sync")
async def obis_sync():
    """Trigger an OBIS fetch/sync job (mock). Returns the number of records fetched."""
    count = await services.fetch_obis_data()
    # notify websocket clients about sync
    asyncio.create_task(manager.broadcast({"type": "obis_sync", "count": count}))
    return {"synced": count}


@app.post("/api/classify")
async def classify(file: UploadFile = File(...)):
    """Accept an image and return a mock classification result."""
    try:
        payload = await file.read()
        result = await services.classify_image(payload, filename=file.filename)
        # broadcast a small event
        asyncio.create_task(manager.broadcast({"type": "classification", "result": result}))
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.websocket("/ws/updates")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # send a welcome message
        await websocket.send_json({"type": "welcome", "message": "connected to Matsya backend"})
        while True:
            # keep connection alive; receive pings from client
            data = await websocket.receive_text()
            # echo for now
            await websocket.send_json({"type": "echo", "message": data})
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)

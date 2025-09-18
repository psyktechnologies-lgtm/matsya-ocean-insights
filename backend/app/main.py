from fastapi import FastAPI, UploadFile, File, WebSocket, WebSocketDisconnect, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import asyncio
from typing import Optional
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


@app.post("/api/edna-samples")
async def upload_edna_sample(
    file: UploadFile = File(...),
    sample_id: str = Form(...),
    location_name: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    collection_date: str = Form(...),
    depth_meters: Optional[float] = Form(None),
    notes: Optional[str] = Form(None)
):
    """Upload and process eDNA sample files (FASTA/FASTQ)."""
    try:
        # Validate file type
        allowed_extensions = ['fasta', 'fa', 'fastq', 'fq', 'txt']
        file_extension = file.filename.lower().split('.')[-1] if file.filename else ''
        
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid file type. Allowed: {', '.join(allowed_extensions)}"
            )
        
        # Check file size (max 100MB)
        max_size = 100 * 1024 * 1024  # 100MB
        content = await file.read()
        
        if len(content) > max_size:
            raise HTTPException(status_code=400, detail="File size exceeds 100MB limit")
        
        # Process file content
        content_str = content.decode('utf-8')
        file_analysis = services.process_edna_file(content_str, file.filename or 'unknown')
        
        # Create sample record with analysis results
        sample_data = {
            "id": sample_id,
            "sample_id": sample_id,
            "location_name": location_name,
            "latitude": latitude,
            "longitude": longitude,
            "collection_date": collection_date,
            "depth_meters": depth_meters,
            "notes": notes,
            "file_name": file.filename,
            "file_size": len(content),
            "file_type": file.content_type,
            "status": "uploaded",
            "processing_status": "completed",
            **file_analysis  # Include sequence analysis results
        }
        
        # Broadcast upload notification
        asyncio.create_task(manager.broadcast({
            "type": "edna_upload", 
            "sample_id": sample_id,
            "analysis": file_analysis
        }))
        
        return JSONResponse(content=sample_data)
        
    except HTTPException:
        raise
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="File must be text-based (FASTA/FASTQ)")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload processing failed: {str(e)}")


@app.post("/api/taxonomy/upload")
async def upload_taxonomy_data(
    file: UploadFile = File(...),
    dataset_name: str = Form(...),
    data_format: str = Form(...),
    source: str = Form(...),
    description: Optional[str] = Form(None)
):
    """Upload taxonomy database files (Darwin Core, CSV, TSV, Excel)."""
    try:
        # Validate file type for taxonomy data
        allowed_extensions = ['csv', 'tsv', 'txt', 'xlsx', 'dwc', 'xml', 'json']
        file_extension = file.filename.lower().split('.')[-1] if file.filename else ''
        
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid file type for taxonomy. Allowed: {', '.join(allowed_extensions)}"
            )
        
        # Check file size (max 500MB for taxonomy databases)
        max_size = 500 * 1024 * 1024  # 500MB
        content = await file.read()
        
        if len(content) > max_size:
            raise HTTPException(status_code=400, detail="File size exceeds 500MB limit")
        
        # Process taxonomy file content
        taxonomy_analysis = await services.process_taxonomy_file(
            content, file.filename or 'unknown', data_format
        )
        
        # Create taxonomy dataset record
        dataset_data = {
            "id": f"taxonomy_{dataset_name.replace(' ', '_').lower()}",
            "dataset_name": dataset_name,
            "data_format": data_format,
            "source": source,
            "description": description,
            "file_name": file.filename,
            "file_size": len(content),
            "file_type": file.content_type,
            "upload_date": "2024-01-15T10:30:00Z",
            "status": "uploaded",
            "processing_status": "completed",
            **taxonomy_analysis  # Include taxonomy analysis results
        }
        
        # Broadcast taxonomy upload notification
        asyncio.create_task(manager.broadcast({
            "type": "taxonomy_upload", 
            "dataset_name": dataset_name,
            "analysis": taxonomy_analysis
        }))
        
        return JSONResponse(content=dataset_data)
        
    except HTTPException:
        raise
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="File must be text-based")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Taxonomy upload failed: {str(e)}")


@app.get("/api/taxonomy/datasets")
async def list_taxonomy_datasets():
    """List uploaded taxonomy datasets."""
    # Mock taxonomy datasets
    return [
        {
            "id": "taxonomy_worms_2024",
            "dataset_name": "WoRMS Marine Taxa 2024",
            "data_format": "darwin_core",
            "source": "World Register of Marine Species",
            "description": "Comprehensive marine species taxonomy database",
            "upload_date": "2024-01-15T10:30:00Z",
            "status": "active",
            "record_count": 245892,
            "species_count": 180543,
            "kingdoms": ["Animalia", "Plantae", "Chromista"],
            "file_size": 125000000
        },
        {
            "id": "taxonomy_fishbase_2024",
            "dataset_name": "FishBase Taxonomy",
            "data_format": "csv",
            "source": "FishBase",
            "description": "Global fish species database with taxonomic hierarchy",
            "upload_date": "2024-01-12T14:20:00Z",
            "status": "active",
            "record_count": 34567,
            "species_count": 34567,
            "kingdoms": ["Animalia"],
            "file_size": 45000000
        }
    ]


@app.get("/api/edna-samples")
async def list_edna_samples():
    """List uploaded eDNA samples."""
    # This would normally query a database
    # For now, return mock data
    return [{
        "id": "sample_001",
        "sample_id": "sample_001",
        "location_name": "Great Barrier Reef",
        "latitude": -16.2839,
        "longitude": 145.7781,
        "collection_date": "2024-01-15",
        "depth_meters": 10,
        "status": "uploaded",
        "sequence_count": 1247,
        "avg_length": 150.5,
        "file_format": "fastq",
        "quality_score": 95.2
    }]


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

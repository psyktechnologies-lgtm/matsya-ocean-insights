from fastapi import FastAPI, UploadFile, File, WebSocket, WebSocketDisconnect, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import asyncio
import json
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


@app.get("/api/capabilities")
async def get_backend_capabilities():
    """Get comprehensive overview of backend capabilities and service classes."""
    return {
        "backend_info": {
            "title": "Matsya Ocean Insights - Advanced Marine Research Backend",
            "version": "2.0.0",
            "description": "Comprehensive marine research platform with 6 major service classes",
            "total_methods": "30+ specialized methods",
            "scientific_computing": True,
            "ml_capabilities": True,
            "real_time_processing": True
        },
        "service_classes": {
            "1_darwin_core_validator": {
                "name": "DarwinCoreValidator",
                "description": "Advanced taxonomy validation following Darwin Core standards",
                "capabilities": [
                    "40+ validation rules for taxonomic data",
                    "Required/optional field checking",
                    "Scientific name format validation",
                    "Coordinate and date validation",
                    "Taxonomic hierarchy verification"
                ],
                "endpoints": ["/api/taxonomy/validate", "/api/taxonomy/upload"]
            },
            "2_phylogenetic_analyzer": {
                "name": "PhylogeneticAnalyzer", 
                "description": "Taxonomic tree building and biodiversity analysis",
                "capabilities": [
                    "Taxonomic tree construction",
                    "Shannon diversity calculation",
                    "Simpson diversity metrics",
                    "Species richness analysis",
                    "Taxonomic rank distribution"
                ],
                "endpoints": ["/api/taxonomy/analyze"]
            },
            "3_taxonomic_enricher": {
                "name": "TaxonomicEnricher",
                "description": "External API integration for species data enrichment", 
                "capabilities": [
                    "GBIF API integration",
                    "FishBase database connectivity", 
                    "Species data enrichment",
                    "Conservation status lookup",
                    "Geographic distribution analysis"
                ],
                "endpoints": ["/api/taxonomy/enrich"]
            },
            "4_otolith_analyzer": {
                "name": "OtolithAnalyzer",
                "description": "ML-based fish age determination from otolith images",
                "capabilities": [
                    "OpenCV image processing",
                    "Growth ring detection algorithms",
                    "Age estimation with confidence scoring",
                    "Growth pattern analysis",
                    "Image quality assessment"
                ],
                "endpoints": ["/api/otolith/analyze"],
                "ml_features": [
                    "HoughCircles for ring detection",
                    "CLAHE contrast enhancement", 
                    "Morphometric measurements",
                    "Confidence interval calculation"
                ]
            },
            "5_edna_analyzer": {
                "name": "EDNAAnalyzer",
                "description": "Environmental DNA sequencing and metabarcoding analysis",
                "capabilities": [
                    "FASTA/FASTQ sequence processing",
                    "Quality control metrics",
                    "Species identification algorithms",
                    "Biodiversity assessment",
                    "Environmental correlation analysis"
                ],
                "endpoints": ["/api/edna/analyze", "/api/edna-samples"],
                "analysis_features": [
                    "Sequence quality scoring",
                    "GC content analysis",
                    "Homopolymer detection",
                    "Species database matching",
                    "Shannon diversity calculation"
                ]
            },
            "6_research_publisher": {
                "name": "ResearchPublisher",
                "description": "Manuscript management and peer review system",
                "capabilities": [
                    "Manuscript content analysis",
                    "Readability scoring",
                    "Citation analysis",
                    "Peer reviewer matching",
                    "Collaboration tracking"
                ],
                "endpoints": ["/api/research/manuscript", "/api/research/peer-review"],
                "publishing_features": [
                    "Publication readiness assessment",
                    "Journal targeting suggestions",
                    "Impact potential scoring",
                    "Editorial workflow management"
                ]
            },
            "7_marine_data_processor": {
                "name": "MarineDataProcessor", 
                "description": "Real-time marine sensor data processing and analysis",
                "capabilities": [
                    "Multi-parameter data processing",
                    "Quality control assessment",
                    "Anomaly detection algorithms",
                    "Environmental correlation analysis",
                    "Risk assessment and alerting"
                ],
                "endpoints": ["/api/marine-data/process"],
                "real_time_features": [
                    "Oceanographic parameter analysis",
                    "Critical alert generation",
                    "Ecosystem health scoring",
                    "Temporal pattern analysis"
                ]
            }
        },
        "technical_specifications": {
            "programming_languages": ["Python 3.12"],
            "frameworks": ["FastAPI", "Pydantic", "Uvicorn"],
            "scientific_libraries": ["NumPy", "OpenCV", "Pillow"],
            "data_formats": ["Darwin Core", "FASTA", "FASTQ", "CSV", "JSON", "Images"],
            "api_integrations": ["GBIF", "FishBase", "OBIS"],
            "validation_standards": ["Darwin Core Archive", "Marine biodiversity standards"],
            "ml_algorithms": ["HoughCircles", "CLAHE", "Statistical analysis", "Pattern recognition"]
        },
        "research_workflows": [
            "Taxonomic data validation and enrichment",
            "Fish age determination through otolith analysis", 
            "Environmental DNA biodiversity assessment",
            "Research manuscript preparation and peer review",
            "Real-time marine environmental monitoring",
            "Species occurrence data processing",
            "Geographic distribution analysis",
            "Conservation status assessment"
        ],
        "quality_assurance": {
            "data_validation": "Comprehensive error handling and quality scoring",
            "confidence_metrics": "All analyses include confidence/reliability scores",
            "professional_standards": "Following marine research best practices",
            "error_handling": "Detailed error reporting and recovery mechanisms"
        }
    }


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


@app.post("/api/taxonomy/validate")
async def validate_taxonomy_data(file: UploadFile = File(...)):
    """Validate taxonomy data using Darwin Core standards."""
    try:
        content = await file.read()
        content_str = content.decode('utf-8')
        
        # Use the DarwinCoreValidator class
        validation_result = services.analyze_darwin_core(content_str)
        
        return JSONResponse(content={
            "status": "success",
            "validation_result": validation_result,
            "file_info": {
                "filename": file.filename,
                "size": len(content),
                "type": file.content_type
            }
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Validation failed: {str(e)}")


@app.post("/api/otolith/analyze")
async def analyze_otolith_image(file: UploadFile = File(...)):
    """Analyze otolith images for age determination using ML."""
    try:
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        content = await file.read()
        
        # Use the OtolithAnalyzer class
        analysis_result = services.OtolithAnalyzer.analyze_otolith_image(
            content, file.filename or 'unknown'
        )
        
        return JSONResponse(content={
            "status": "success",
            "analysis": analysis_result,
            "file_info": {
                "filename": file.filename,
                "size": len(content),
                "type": file.content_type
            }
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Otolith analysis failed: {str(e)}")


@app.post("/api/edna/analyze")
async def analyze_edna_sequences(
    sequences: list[str],
    metadata: Optional[dict] = None
):
    """Analyze eDNA sequences for species identification and biodiversity."""
    try:
        # Use the EDNAAnalyzer class
        analysis_result = services.EDNAAnalyzer.analyze_edna_sequences(
            sequences, metadata or {}
        )
        
        return JSONResponse(content={
            "status": "success",
            "analysis": analysis_result
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"eDNA analysis failed: {str(e)}")


@app.post("/api/research/manuscript")
async def create_manuscript(
    title: str = Form(...),
    authors: str = Form(...),  # Comma-separated
    abstract: str = Form(...),
    content: str = Form(...),
    metadata: Optional[str] = Form(None)
):
    """Create and analyze research manuscript."""
    try:
        authors_list = [author.strip() for author in authors.split(',')]
        metadata_dict = json.loads(metadata) if metadata else {}
        
        # Use the ResearchPublisher class
        manuscript = services.ResearchPublisher.create_manuscript(
            title, authors_list, abstract, content, metadata_dict
        )
        
        return JSONResponse(content={
            "status": "success",
            "manuscript": manuscript
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Manuscript creation failed: {str(e)}")


@app.post("/api/research/peer-review")
async def initiate_peer_review(
    manuscript_id: str = Form(...),
    reviewer_criteria: Optional[str] = Form(None)
):
    """Initiate peer review process."""
    try:
        criteria = json.loads(reviewer_criteria) if reviewer_criteria else {}
        
        # Use the ResearchPublisher class
        review_process = services.ResearchPublisher.initiate_peer_review(
            manuscript_id, criteria
        )
        
        return JSONResponse(content={
            "status": "success",
            "review_process": review_process
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Peer review initiation failed: {str(e)}")


@app.post("/api/marine-data/process")
async def process_marine_sensor_data(
    sensor_data: list[dict],
    data_type: str = "mixed"
):
    """Process real-time marine sensor data."""
    try:
        # Use the MarineDataProcessor class
        processing_result = services.MarineDataProcessor.process_realtime_data(
            sensor_data, data_type
        )
        
        return JSONResponse(content={
            "status": "success",
            "processing_result": processing_result
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Marine data processing failed: {str(e)}")


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

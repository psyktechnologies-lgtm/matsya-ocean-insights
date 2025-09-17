from pydantic import BaseModel, Field
from typing import Optional, Dict, List, Tuple


class SpeciesOccurrence(BaseModel):
    id: str
    scientificName: str
    commonName: Optional[str] = None
    latitude: float
    longitude: float
    depth: Optional[float] = None
    temperature: Optional[float] = None
    habitat: Optional[str] = None
    conservationStatus: Optional[str] = None
    dataSource: str


class MLClassificationResult(BaseModel):
    predictions: Dict[str, float]
    topPrediction: Tuple[str, float]
    confidence: float
    processingTime: float


class AnalysisConfig(BaseModel):
    type: str
    region: Optional[str] = None
    dateRange: Optional[List[str]] = None
    species: Optional[List[str]] = None
    parameters: Optional[Dict[str, str]] = None


class AnalysisResult(BaseModel):
    summary: str
    metrics: Dict[str, float]
    chartData: List[Dict]

import asyncio
import random
from typing import List
from .schemas import SpeciesOccurrence, MLClassificationResult


# Mock database / cache
_mock_species: List[SpeciesOccurrence] = [
    SpeciesOccurrence(
        id="1",
        scientificName="Lutjanus campechanus",
        commonName="Red Snapper",
        latitude=22.5,
        longitude=91.8,
        depth=30,
        conservationStatus="Least Concern",
        dataSource="OBIS",
    ),
    SpeciesOccurrence(
        id="2",
        scientificName="Scomberomorus commerson",
        commonName="Narrow-barred Spanish mackerel",
        latitude=21.9,
        longitude=90.5,
        depth=15,
        conservationStatus="Vulnerable",
        dataSource="GBIF",
    ),
]


async def get_species_list() -> List[SpeciesOccurrence]:
    # in production this would query a DB
    await asyncio.sleep(0.05)
    return _mock_species


async def fetch_obis_data() -> int:
    # mock fetching from OBIS API - append random items
    await asyncio.sleep(0.5)
    n = random.randint(1, 10)
    base_id = len(_mock_species) + 1
    for i in range(n):
        _mock_species.append(
            SpeciesOccurrence(
                id=str(base_id + i),
                scientificName=f"MockSpecies {base_id + i}",
                latitude=20.0 + random.random() * 10,
                longitude=85.0 + random.random() * 10,
                dataSource="OBIS",
            )
        )
    return n


async def classify_image(payload: bytes, filename: str = "unknown") -> dict:
    # Simulate ML processing
    await asyncio.sleep(1.2)
    species = [
        "Rui", "Katla", "Ilish", "Magur", "Pabda", "Puti", "Boal", "Koi",
    ]
    scores = [random.random() for _ in species]
    total = sum(scores)
    normalized = [s / total for s in scores]
    preds = {s: float(f"{score:.4f}") for s, score in zip(species, normalized)}
    top_index = int(max(range(len(normalized)), key=lambda i: normalized[i]))
    result = {
        "predictions": preds,
        "topPrediction": [species[top_index], preds[species[top_index]]],
        "confidence": preds[species[top_index]],
        "processingTime": 1.2,
        "filename": filename,
    }
    return result

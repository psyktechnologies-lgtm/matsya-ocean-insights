# Matsya Backend (FastAPI)

This folder contains a small FastAPI backend skeleton used for development and integration with the React frontend.

Quickstart (local):

1. Create a virtualenv (recommended):

   python -m venv .venv; .\.venv\Scripts\activate

2. Install dependencies:

   pip install -r backend/requirements.txt

3. Run development server:

   uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000

API Endpoints:

- GET /api/health - health check
- GET /api/species - returns a mock list of species occurrences
- POST /api/obis/sync - trigger a mocked OBIS sync job
- POST /api/classify - upload image file to classify (multipart/form-data)
- WebSocket /ws/updates - real-time events

Notes:

This backend is intentionally minimal and uses in-memory mock data. Replace service implementations in `backend/app/services.py` with real OBIS/ML integrations and database access for production use.

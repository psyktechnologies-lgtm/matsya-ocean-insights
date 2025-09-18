# MATSYA Ocean Insights - Local Hosting Guide

## Prerequisites

### System Requirements
- **Node.js**: v18.0.0 or higher
- **Python**: 3.8 or higher
- **Git**: Latest version
- **Web Browser**: Chrome, Firefox, or Edge (latest versions)

### Check Prerequisites
```powershell
# Check Node.js version
node --version

# Check Python version
python --version

# Check Git version
git --version
```

## 🚀 Quick Start (Recommended)

### Option 1: Using NPM/Node.js (Frontend Only)
```powershell
# 1. Navigate to project directory
cd C:\Users\abhin\Desktop\matsya-ocean-insights

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser to:
# http://localhost:5173
```

### Option 2: Full Stack (Frontend + Backend)

#### Terminal 1 - Frontend
```powershell
# Navigate to project root
cd C:\Users\abhin\Desktop\matsya-ocean-insights

# Install frontend dependencies
npm install

# Start frontend development server
npm run dev
```

#### Terminal 2 - Backend
```powershell
# Navigate to project root
cd C:\Users\abhin\Desktop\matsya-ocean-insights

# Create Python virtual environment
python -m venv .venv

# Activate virtual environment
.\.venv\Scripts\activate

# Install backend dependencies
pip install -r backend/requirements.txt

# Start backend server
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 🔧 Detailed Setup Instructions

### 1. Frontend Setup (React + Vite)

```powershell
# Install Node.js dependencies
npm install

# Available scripts:
npm run dev        # Start development server (http://localhost:5173)
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run test       # Run tests
```

### 2. Backend Setup (FastAPI)

```powershell
# Create isolated Python environment
python -m venv matsya-env
matsya-env\Scripts\activate

# Install Python dependencies
pip install -r backend/requirements.txt

# Start FastAPI server
cd backend
uvicorn app.main:app --reload --port 8000

# Backend will be available at:
# http://localhost:8000
# API docs: http://localhost:8000/docs
```

### 3. Using Conda (Alternative)

```powershell
# Create conda environment
conda create -n matsya python=3.11
conda activate matsya

# Install backend dependencies
pip install -r backend/requirements.txt

# Start backend
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

## 🌐 Access URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | Main MATSYA application |
| **Backend API** | http://localhost:8000 | FastAPI backend |
| **API Documentation** | http://localhost:8000/docs | Interactive API docs |
| **Alternative API Docs** | http://localhost:8000/redoc | ReDoc API documentation |

## 🔨 Development Commands

### Frontend Commands
```powershell
# Development with hot reload
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Run tests
npm run test

# Lint code
npm run lint
```

### Backend Commands
```powershell
# Development server with auto-reload
uvicorn app.main:app --reload

# Production-like server
uvicorn app.main:app --host 0.0.0.0 --port 8000

# With specific workers (production)
uvicorn app.main:app --workers 4
```

## 🐳 Docker Setup (Optional)

### Using Docker Compose
```powershell
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down
```

## 🔧 Configuration

### Environment Variables
Create `.env` file in project root:
```env
# Frontend Environment Variables
VITE_API_BASE_URL=http://localhost:8000
VITE_USE_SUPABASE=false
VITE_CESIUM_ACCESS_TOKEN=your_cesium_token_here

# Optional API Keys (for live data)
VITE_OPENWEATHER_API_KEY=your_openweather_key
VITE_NOAA_API_KEY=your_noaa_key
```

### Backend Configuration
The backend is configured to work with mock data by default. No additional configuration needed for local development.

## 🌊 Features Available Locally

### ✅ Working Features
- **Dashboard**: Marine analytics and statistics
- **Species Explorer**: Browse marine species data
- **3D Marine Map**: Interactive Cesium globe
- **Real-time Analytics**: Live charts and data
- **Research Hub**: Research tools and datasets
- **Community Features**: User profiles and collaboration
- **AI Assistant**: Marine life chatbot
- **Dark/Light Theme**: Theme switching

### 🔌 API Integrations
- **OBIS**: Ocean Biogeographic Information System
- **Mock Data**: Comprehensive sample datasets
- **WebSocket**: Real-time updates
- **File Upload**: Image classification and eDNA analysis

## 🚨 Troubleshooting

### Common Issues

#### Frontend Won't Start
```powershell
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### Backend Issues
```powershell
# Check Python version
python --version

# Reinstall dependencies
pip uninstall -r backend/requirements.txt -y
pip install -r backend/requirements.txt

# Check if port is in use
netstat -ano | findstr :8000
```

#### Port Conflicts
```powershell
# Change frontend port (if 5173 is busy)
npm run dev -- --port 3000

# Change backend port
uvicorn app.main:app --reload --port 8001
```

#### Node.js Memory Issues
```powershell
# Increase Node.js memory limit
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run dev
```

### Performance Optimization

#### Frontend
```powershell
# Use production build for better performance
npm run build
npm run preview
```

#### Backend
```powershell
# Use multiple workers
uvicorn app.main:app --workers 2 --host 0.0.0.0 --port 8000
```

## 📱 Mobile/Remote Access

### Access from Other Devices
```powershell
# Find your local IP address
ipconfig

# Start frontend with host binding
npm run dev -- --host 0.0.0.0

# Start backend with host binding (already configured)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Access from other devices:
# http://YOUR_LOCAL_IP:5173 (frontend)
# http://YOUR_LOCAL_IP:8000 (backend)
```

## 🔐 Security Notes

- The local setup uses development servers
- CORS is enabled for localhost
- No authentication required for local development
- API keys in `.env` are for development only

## 📋 Quick Checklist

- [ ] Node.js 18+ installed
- [ ] Python 3.8+ installed
- [ ] Project dependencies installed (`npm install`)
- [ ] Backend dependencies installed (`pip install -r backend/requirements.txt`)
- [ ] Frontend running on http://localhost:5173
- [ ] Backend running on http://localhost:8000
- [ ] Both services communicating properly

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure ports 5173 and 8000 are available
4. Check the browser console for frontend errors
5. Check the terminal for backend errors

---

**Happy Coding! 🌊🐟🔬**
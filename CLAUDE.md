# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VandVoyage is a full-stack travel and transit mapping application built with a React frontend and Express.js backend. The application displays Canadian transit systems (GO Transit, TTC, VIA Rail, Waterloo ION, Amtrak) on an interactive Leaflet map with real-time data integration.

## Architecture

### Monorepo Structure
- `backend/` - Express.js REST API with MongoDB (Node 18, ES modules)
- `frontend/` - React 17 with Redux Toolkit, Create React App, Leaflet maps
- `docker-compose.yml` - Multi-container orchestration with Traefik reverse proxy

### Backend (Express.js)
- **Entry point**: `backend/index.js`
- **Pattern**: MVC architecture with routers, controllers, models
- **Database**: MongoDB via Mongoose ODM
  - Connection: `backend/db/index.js` - Supports both MongoDB Atlas (cloud) and local MongoDB
  - Connection string uses `mongodb+srv://` for Atlas, `mongodb://` for local
- **Models**: Mongoose schemas in `backend/models/` (stations, lines, bike routes)
- **Controllers**: Business logic in `backend/controllers/`
- **Routers**: All route definitions centralized in `backend/router/index.js`
- **Module system**: ES modules (`"type": "module"` in package.json)

### Frontend (React + Redux)
- **Entry point**: `frontend/src/index.js` → `App.js`
- **State management**: Redux Toolkit with feature-based slices
  - Store config: `frontend/src/app/store.js`
  - Slices organized by feature in `frontend/src/features/`
- **Mapping**: React-Leaflet with OpenStreetMap tiles
  - Transit lines in `frontend/src/features/lines/` (TTC, GO Transit, VIA Rail, etc.)
  - Station markers in `frontend/src/features/markers/`
- **UI Components**: Material-UI v4 and v5 mix, custom components in `frontend/src/components/`

### Docker Architecture
Three-service stack orchestrated with Traefik:
1. **vandvoyage-nodejs-frontend** (Nginx serving React build)
   - Multi-stage build: Node builder → Nginx runtime
   - Requires `ajv@8` workaround for webpack compatibility
   - Exposes port 80
2. **vandvoyage-nodejs-backend** (Node.js Express API)
   - Single-stage Node 18 Alpine
   - Exposes port 5000
   - Connects to MongoDB service
3. **vandvoyage-mongo** (MongoDB latest)
   - Data persisted in `./mongo_data/`
   - Uses `MONGO_ROOT_USERNAME` and `MONGO_ROOT_PASSWORD`

Networks:
- `backnet` - Backend-MongoDB communication
- `traefik` (external) - Reverse proxy for frontend/backend

## Environment Configuration

The application supports two MongoDB deployment modes:

### Docker Mode (Local MongoDB)
```bash
MONGO_DBNAME=travelhub
MONGO_ROOT_USERNAME=root
MONGO_ROOT_PASSWORD=<password>
TZ=America/Toronto
```

### External/Atlas Mode (Cloud MongoDB)
```bash
DATABASE_URL=<atlas-cluster-url>  # Without mongodb+srv:// prefix
DATABASE_USER=<username>
DATABASE_PASSWORD=<password>
DATABASE_NAME=<dbname>
PORT=5000
```

Copy `.env.dist` to `.env` and configure for your deployment.

## Common Commands

### Development (without Docker)

**Backend:**

IMPORTANT: Port 5000 is used by macOS Control Center. Use port 5001 instead.

**Option 1 - With environment variables (Recommended):**
```bash
cd backend
npm install
DATABASE_USER=testuser DATABASE_PASSWORD=testpass123 DATABASE_URL=transeuntium.w3581.mongodb.net DATABASE_NAME=transeuntium PORT=5001 node index.js
```

**Option 2 - With .env file:**
```bash
cd backend
npm install
# Ensure backend/.env has correct credentials (DATABASE_USER, DATABASE_PASSWORD, etc.)
# Note: Multiple .env files exist in the project tree which can cause conflicts
npm start  # Runs install + node index.js
```

**Test backend is running:**
```bash
curl http://localhost:5001/stations
```

**Frontend:**
```bash
cd frontend
npm install
npm start  # Runs install + react-scripts start on port 3000
npm run build  # Production build
npm test  # Run tests in watch mode
```

### Docker Deployment

**Start all services:**
```bash
docker-compose up -d
```

**View logs:**
```bash
docker-compose logs -f
docker-compose logs -f vandvoyage-nodejs-backend
docker-compose logs -f vandvoyage-nodejs-frontend
```

**Rebuild after code changes:**
```bash
docker-compose up -d --build
```

**Stop and remove:**
```bash
docker-compose down
```

## API Endpoints

All endpoints defined in `backend/router/index.js`:

**Stations:**
- `GET /stations` - All transit stations
- `GET /stations/:id` - Specific station
- `PUT /stations/:id` - Update station info

**Transit Lines:**
- `GET /ttclineone`, `/ttclinetwo`, `/ttclinethree`, `/ttclinefour` - TTC subway lines
- `GET /golinesbarrie`, `/golineskitchener`, `/golineslakeshoreeast`, `/golineslakeshorewest`, `/golinesmilton`, `/golinesrichmondhill`, `/golinesstouffville`, `/golinesunionpearson` - GO Transit commuter rail
- `GET /waterlooion`, `/waterlooionstagetwo` - Waterloo LRT
- `GET /viarail` - VIA Rail intercity routes
- `GET /bikeroutes` - Toronto bike infrastructure

**Live Data:**
- `GET /live` - Real-time transit information

## Redux State Structure

The Redux store (`frontend/src/app/store.js`) organizes state by transit system:

- `lines` - Toronto bike routes
- `ttcLineOne/Two/Three/Four` - TTC subway lines
- `goLineBarrie/Kitchener/LakeshoreEast/LakeshoreWest/Milton/RichmondHill/Stouffville/UnionPearson` - GO Transit
- `waterlooIonCurrent/Stage2` - Waterloo ION LRT
- `viaRailLines` - VIA Rail routes
- `stations` - All transit stations
- `stationForm` - Station editing form state

Each feature slice follows Redux Toolkit patterns with async thunks for API calls.

## Key Technical Notes

- **Node version**: 18 (specified in backend package.json engines)
- **React version**: 17 (not 18, affects concurrent features)
- **Frontend build workaround**: The Dockerfile installs `ajv@8` explicitly to resolve webpack codegen errors
- **Database connection**: `backend/db/index.js` automatically detects Atlas vs local MongoDB based on connection string format
- **Environment variables**: `dotenv/config` MUST be imported first in `backend/index.js` before database connections
- **All routers** are defined centrally in `backend/router/index.js` and imported in `backend/index.js`
- **CORS is enabled** globally on the backend
- **Map center**: [49.095, -89.78] (Ontario, Canada region)
- **Live data fetching**: `backend/controllers/live.controller.js` auto-fetches from external APIs (GO Transit, VIA Rail, Amtrak) on server start. These calls are currently commented out to prevent startup failures when external APIs are unavailable

## Working with Transit Data

When adding new transit systems or routes:

1. Create Mongoose model in `backend/models/<system>.model.js`
2. Create controller in `backend/controllers/<system>.controller.js`
3. Add router in `backend/router/index.js`
4. Register route in `backend/index.js`
5. Create Redux slice in `frontend/src/features/lines/<system>/`
6. Add reducer to `frontend/src/app/store.js`
7. Create React component to render on map
8. Add LayersControl.Overlay in `frontend/src/App.js`

Example pattern can be seen in GO Transit lines (8 separate routes with consistent structure).
- actualiza en ingles el problema con Go Transit devolviendo 403 y como funciona ahora
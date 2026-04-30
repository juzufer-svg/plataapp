#!/bin/bash

# Script para iniciar backend y frontend en paralelo

echo "🚀 Iniciando Full Stack App..."

# Checks
if [ ! -d "backend/venv" ]; then
    echo "❌ Entorno virtual de Python no encontrado. Ejecuta ./setup.sh primero"
    exit 1
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "❌ dependencias de Node no encontradas. Ejecuta ./setup.sh primero"
    exit 1
fi

# Traps to kill both processes on exit
trap 'kill %1 %2 2>/dev/null' EXIT

# Start Backend
echo "Starting Backend (FastAPI)..."
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

cd ..

# Start Frontend
echo "Starting Frontend (Next.js)..."
cd frontend
npm run dev &
FRONTEND_PID=$!

cd ..

echo ""
echo "✅ Backend running on http://localhost:8000"
echo "✅ Frontend running on http://localhost:3000"
echo "📖 API Docs on http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

wait

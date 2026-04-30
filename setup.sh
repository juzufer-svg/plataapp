#!/bin/bash

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Full Stack Setup Script ===${NC}\n"

# Check dependencies
echo -e "${YELLOW}Verificando dependencias...${NC}"

if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instálalo desde https://nodejs.org"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 no está instalado. Por favor instálalo desde https://python.org"
    exit 1
fi

echo -e "${GREEN}✅ Node.js y Python 3 detectados${NC}\n"

# Setup Backend
echo -e "${BLUE}=== Configurando Backend ===${NC}"
cd backend

# Copy .env
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ .env creado. Por favor complétalo con tus credenciales de Supabase${NC}"
else
    echo -e "${GREEN}✅ .env ya existe${NC}"
fi

# Create venv
if [ ! -d "venv" ]; then
    echo "Creando entorno virtual..."
    python3 -m venv venv
    echo -e "${GREEN}✅ Entorno virtual creado${NC}"
fi

# Activate venv
source venv/bin/activate

# Install dependencies
echo "Instalando dependencias de Python..."
pip install -r requirements.txt
echo -e "${GREEN}✅ Dependencias instaladas${NC}\n"

# Go back to root
cd ..

# Setup Frontend
echo -e "${BLUE}=== Configurando Frontend ===${NC}"
cd frontend

# Copy .env.local
if [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    echo -e "${GREEN}✅ .env.local creado${NC}"
else
    echo -e "${GREEN}✅ .env.local ya existe${NC}"
fi

# Install dependencies
echo "Instalando dependencias de Node..."
npm install
echo -e "${GREEN}✅ Dependencias instaladas${NC}\n"

cd ..

echo -e "${GREEN}========== Setup Completado ==========${NC}"
echo -e "\n${BLUE}Próximos pasos:${NC}"
echo "1. Completa tus credenciales de Supabase en backend/.env"
echo "2. En terminal 1: cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo "3. En terminal 2: cd frontend && npm run dev"
echo "4. Abre http://localhost:3000 en tu navegador"
echo -e "\n${YELLOW}O ejecuta con Docker:${NC}"
echo "   docker-compose up --build"

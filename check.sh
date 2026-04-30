#!/bin/bash

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

check_env() {
    local file=$1
    local name=$2
    
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ $file no encontrado${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ $name está configurado${NC}"
    return 0
}

echo -e "${BLUE}=== Full Stack Health Check ===${NC}\n"

# Check Node.js
if command -v node &> /dev/null; then
    VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js $VERSION${NC}"
else
    echo -e "${RED}❌ Node.js no instalado${NC}"
fi

# Check Python
if command -v python3 &> /dev/null; then
    VERSION=$(python3 --version)
    echo -e "${GREEN}✅ $VERSION${NC}"
else
    echo -e "${RED}❌ Python 3 no instalado${NC}"
fi

# Check Docker
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker instalado${NC}"
else
    echo -e "${YELLOW}⚠️  Docker no instalado (opcional para desarrollo local)${NC}"
fi

echo ""

# Check configuration files
echo -e "${BLUE}=== Archivos de Configuración ===${NC}\n"
check_env "backend/.env" "Backend .env"
check_env "frontend/.env.local" "Frontend .env.local"
check_env ".env" "Root .env"

echo ""

# Check directories
echo -e "${BLUE}=== Estructura del Proyecto ===${NC}\n"

DIRS=("backend/app" "backend/app/api/routes" "frontend/app/auth" "frontend/app/dashboard" "frontend/lib" "frontend/store")

for dir in "${DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✅ $dir${NC}"
    else
        echo -e "${RED}❌ $dir no encontrado${NC}"
    fi
done

echo ""
echo -e "${BLUE}========== Verificación Completada ==========${NC}"

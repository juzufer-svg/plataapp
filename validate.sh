#!/bin/bash

# Full Stack Health Check Script

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║          🔍 VALIDACIÓN DE ESTRUCTURA FULL STACK 🔍             ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

ERRORS=0
WARNINGS=0

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

check_file() {
    local file=$1
    local name=$2
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $name"
        return 0
    else
        echo -e "${RED}❌${NC} FALTA: $name"
        ((ERRORS++))
        return 1
    fi
}

check_dir() {
    local dir=$1
    local name=$2
    
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✅${NC} $name"
        return 0
    else
        echo -e "${RED}❌${NC} FALTA: $name"
        ((ERRORS++))
        return 1
    fi
}

echo -e "${BLUE}━━━ BACKEND (FastAPI) ━━━${NC}"
check_dir "backend" "Directorio backend/"
check_dir "backend/app" "Directorio backend/app/"
check_dir "backend/app/api" "Directorio backend/app/api/"
check_dir "backend/app/api/routes" "Directorio backend/app/api/routes/"
check_dir "backend/app/core" "Directorio backend/app/core/"
check_dir "backend/app/models" "Directorio backend/app/models/"
check_dir "backend/app/schemas" "Directorio backend/app/schemas/"
check_file "backend/app/main.py" "app/main.py (FastAPI app)"
check_file "backend/app/core/config.py" "app/core/config.py (Config)"
check_file "backend/app/core/security.py" "app/core/security.py (JWT/Hash)"
check_file "backend/app/core/supabase.py" "app/core/supabase.py (Supabase client)"
check_file "backend/app/api/routes/auth.py" "app/api/routes/auth.py"
check_file "backend/app/api/routes/users.py" "app/api/routes/users.py"
check_file "backend/app/models/user.py" "app/models/user.py"
check_file "backend/app/schemas/auth.py" "app/schemas/auth.py"
check_file "backend/requirements.txt" "requirements.txt"
check_file "backend/Dockerfile" "Dockerfile"
check_file "backend/.env.example" ".env.example"

echo ""
echo -e "${BLUE}━━━ FRONTEND (Next.js) ━━━${NC}"
check_dir "frontend" "Directorio frontend/"
check_dir "frontend/app" "Directorio frontend/app/"
check_dir "frontend/app/auth" "Directorio frontend/app/auth/"
check_dir "frontend/app/dashboard" "Directorio frontend/app/dashboard/"
check_dir "frontend/lib" "Directorio frontend/lib/"
check_dir "frontend/store" "Directorio frontend/store/"
check_file "frontend/app/page.tsx" "app/page.tsx (Home)"
check_file "frontend/app/layout.tsx" "app/layout.tsx"
check_file "frontend/app/auth/login/page.tsx" "app/auth/login/page.tsx"
check_file "frontend/app/auth/register/page.tsx" "app/auth/register/page.tsx"
check_file "frontend/app/dashboard/page.tsx" "app/dashboard/page.tsx"
check_file "frontend/app/dashboard/profile/page.tsx" "app/dashboard/profile/page.tsx"
check_file "frontend/lib/api-client.ts" "lib/api-client.ts"
check_file "frontend/store/auth.ts" "store/auth.ts"
check_file "frontend/package.json" "package.json"
check_file "frontend/next.config.js" "next.config.js"
check_file "frontend/tailwind.config.ts" "tailwind.config.ts"
check_file "frontend/tsconfig.json" "tsconfig.json"
check_file "frontend/.env.example" ".env.example"
check_file "frontend/Dockerfile" "Dockerfile"
check_file "frontend/Dockerfile.dev" "Dockerfile.dev"

echo ""
echo -e "${BLUE}━━━ CONFIGURACIÓN Y SCRIPTS ━━━${NC}"
check_file "docker-compose.yml" "docker-compose.yml"
check_file ".env.example" ".env.example"
check_file "README.md" "README.md"
check_file "QUICKSTART.md" "QUICKSTART.md"
check_file "STRUCTURE.md" "STRUCTURE.md"
check_file "setup.sh" "setup.sh (ejecutable)"
check_file "check.sh" "check.sh (ejecutable)"
check_file "dev.sh" "dev.sh (ejecutable)"

echo ""
echo -e "${BLUE}━━━ VERIFICACIÓN DE VARIABLES DE ENTORNO ━━━${NC}"

# Check Backend .env
if [ -f "backend/.env" ]; then
    if grep -q "SUPABASE_URL" "backend/.env"; then
        echo -e "${GREEN}✅${NC} backend/.env contiene SUPABASE_URL"
    else
        echo -e "${YELLOW}⚠️${NC} backend/.env NO contiene SUPABASE_URL (requerido)"
        ((WARNINGS++))
    fi
else
    echo -e "${YELLOW}⚠️${NC} backend/.env no encontrado (crear desde .env.example)"
    ((WARNINGS++))
fi

# Check Frontend .env.local
if [ -f "frontend/.env.local" ]; then
    if grep -q "NEXT_PUBLIC_API_URL" "frontend/.env.local"; then
        echo -e "${GREEN}✅${NC} frontend/.env.local contiene NEXT_PUBLIC_API_URL"
    else
        echo -e "${YELLOW}⚠️${NC} frontend/.env.local NO contiene NEXT_PUBLIC_API_URL"
        ((WARNINGS++))
    fi
else
    echo -e "${YELLOW}⚠️${NC} frontend/.env.local no encontrado (crear desde .env.example)"
    ((WARNINGS++))
fi

echo ""
echo -e "${BLUE}━━━ DEPENDENCIAS ━━━${NC}"

if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✅${NC} Frontend: node_modules instalados"
else
    echo -e "${YELLOW}⚠️${NC} Frontend: Ejecuta 'npm install' en frontend/"
    ((WARNINGS++))
fi

if [ -d "backend/venv" ]; then
    echo -e "${GREEN}✅${NC} Backend: Entorno virtual creado"
else
    echo -e "${YELLOW}⚠️${NC} Backend: Ejecuta 'python -m venv venv' en backend/"
    ((WARNINGS++))
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}║              ✅ TODO CORRECTO - LISTO PARA DESARROLLAR ✅               ║${NC}"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}║           ⚠️  COMPLETADO CON ADVERTENCIAS (Ver arriba) ⚠️              ║${NC}"
else
    echo -e "${RED}║         ❌ HAY ERRORES - REVISA LA LISTA ARRIBA ❌                    ║${NC}"
fi
echo "╚════════════════════════════════════════════════════════════════╝"

echo ""
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}Resumen: Todas las carpetas y archivos están en su lugar ✅${NC}"
    echo ""
    echo "Próximos pasos:"
    echo "  1. Completa credenciales de Supabase en backend/.env"
    echo "  2. Ejecuta: ./dev.sh"
    echo "  3. Accede a http://localhost:3000"
else
    echo -e "${YELLOW}Resumen: Hay $ERRORS errores y $WARNINGS advertencias${NC}"
    echo ""
    if [ $ERRORS -gt 0 ]; then
        echo "Para arreglarlo:"
        echo "  1. Ejecuta: ./setup.sh"
        echo "  2. Completa variables de entorno"
        echo "  3. Vuelve a ejecutar este script"
    fi
fi

exit $ERRORS

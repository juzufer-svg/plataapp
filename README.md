# 🚀 Full Stack Application - Next.js + FastAPI + Supabase

Estructura profesional de monorepo para construir aplicaciones web modernas con autenticación JWT integrada.

## 🎯 Stack Tecnológico

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS + Zustand
- **Backend**: FastAPI + Python + JWT Authentication
- **Base de Datos**: Supabase (PostgreSQL)
- **Contenedores**: Docker & Docker Compose
- **Deploy**: Vercel (Frontend) + Railway/Render (Backend)

---

## 📋 Requisitos Previos

- Node.js 18+ y npm/yarn
- Python 3.11+
- Docker & Docker Compose
- Cuenta en Supabase
- Cuenta en Vercel (para frontend)
- Cuenta en Railway o Render (para backend)

---

## 🔧 Configuración Inicial Rápida

### 1. Clonar variables de entorno

```bash
# En la raíz
cp .env.example .env

# Frontend
cd frontend && cp .env.example .env.local && cd ..

# Backend
cd backend && cp .env.example .env && cd ..
```

### 2. Obtener credenciales de Supabase

1. Ir a [supabase.com](https://supabase.com)
2. Crear proyecto
3. Copiar en `.env`:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `SUPABASE_ANON_KEY`

### 3. Crear tabla de usuarios (SQL en Supabase)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  hashed_password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_email ON users(email);
```

---

## 💻 Desarrollo Local (Recomendado)

### Terminal 1: Backend FastAPI

```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar .env (rellenar con credenciales de Supabase)
# Luego correr:
uvicorn app.main:app --reload
```

✅ API disponible en: http://localhost:8000
📖 Docs automáticos: http://localhost:8000/docs

### Terminal 2: Frontend Next.js

```bash
cd frontend

npm install
npm run dev
```

✅ App disponible en: http://localhost:3000

---

## 🐳 Desarrollo con Docker Compose

```bash
# En la raíz del proyecto
docker-compose up --build

# Esperar a que estén listos los 3 servicios (postgres, backend, frontend)
```

### URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Docs: http://localhost:8000/docs

### Parar

```bash
docker-compose down
```

---

## 📁 Estructura del Proyecto

```
/
├── frontend/                    # Next.js + TypeScript
│   ├── app/
│   │   ├── auth/               # Login & Register
│   │   ├── dashboard/          # Rutas protegidas
│   │   └── page.tsx            # Home
│   ├── lib/
│   │   └── api-client.ts       # Cliente HTTP con interceptores
│   ├── store/
│   │   └── auth.ts             # Zustand auth store
│   └── package.json
│
├── backend/                     # FastAPI + Python
│   ├── app/
│   │   ├── main.py             # App FastAPI
│   │   ├── core/
│   │   │   ├── config.py       # Configuración
│   │   │   ├── security.py     # JWT & Hash
│   │   │   └── supabase.py     # Cliente Supabase
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── auth.py     # Login, Register
│   │   │       └── users.py    # User data
│   │   ├── models/
│   │   │   └── user.py         # DB operations
│   │   └── schemas/
│   │       └── auth.py         # Pydantic models
│   └── requirements.txt
│
├── docker-compose.yml          # Orquestación local
├── .env.example                # Variables de entorno
└── README.md                   # Este archivo
```

---

## 🔐 API Endpoints

### Autenticación

```
POST   /api/v1/auth/register    Crear cuenta
POST   /api/v1/auth/login       Iniciar sesión
GET    /api/v1/users/me         Obtener usuario (requiere token JWT)
```

### Health

```
GET    /health                  Verificar estado
GET    /                        Info de API
```

---

## 🧑‍💻 Flujo de Autenticación

1. Usuario se registra en `/auth/register`
2. Backend crea usuario en Supabase
3. Auto-login y genera JWT token
4. Token se almacena en localStorage
5. Se incluye en headers: `Authorization: Bearer <token>`
6. Interceptor Axios maneja errores 401

---

## 🚀 Deploy Producción

### Frontend en Vercel

```bash
# 1. Conectar repo en https://vercel.com
# 2. Variables de entorno:
NEXT_PUBLIC_API_URL=https://your-api.railway.app
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# 3. Deploy automático en cada push a main
```

### Backend en Railway (Recomendado)

```bash
# 1. Conectar repo en https://railway.app
# 2. Root Directory: backend
# 3. Variables de entorno:
SECRET_KEY=<openssl rand -hex 32>
SUPABASE_URL=...
SUPABASE_KEY=...
ENVIRONMENT=production
DEBUG=False

# 4. Deploy automático
```

---

## 🛠️ Comandos Útiles

### Backend

```bash
cd backend

# Desarrollo
uvicorn app.main:app --reload

# Tests
pytest

# Generar SECRET_KEY seguro
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Frontend

```bash
cd frontend

# Desarrollo
npm run dev

# Build producción
npm run build
npm start

# Lint
npm run lint
```

### Docker

```bash
# Build y ejecutar
docker-compose up --build

# Logs de un servicio
docker-compose logs -f backend

# Ejecutar comando en contenedor
docker-compose exec backend bash

# Parar
docker-compose down
```

---

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [Supabase Docs](https://supabase.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)

---

## ✅ Checklist Pre-Deploy

- [ ] Variables de entorno configuradas en Vercel
- [ ] Variables de entorno configuradas en Railway/Render
- [ ] Tabla de usuarios creada en Supabase
- [ ] SECRET_KEY diferente en producción
- [ ] CORS configurado correctamente
- [ ] Tests pasando
- [ ] Build de Next.js sin errores

---

## 💡 Notas Importantes

- **Nunca commitear `.env`** (usar `.env.example`)
- **SECRET_KEY diferente** en dev y producción
- **CORS_ORIGINS** debe incluir tu dominio de Vercel
- Usa Supabase en producción, PostgreSQL local en desarrollo
- Los interceptores de Axios manejan automáticamente errores 401

---

**¡Tu aplicación está lista para desarrollar y desplegar profesionalmente! 🎉**

# 📚 API Endpoints Reference

> Guía completa de endpoints disponibles en FastAPI backend

## 🌐 Base URL

```
Development:  http://localhost:8000
Production:   https://your-api.railway.app
```

---

## 🏥 Health Check

### GET `/health`

Verificar estado de la API.

**Request:**
```bash
curl http://localhost:8000/health
```

**Response:** `200 OK`
```json
{
  "status": "healthy"
}
```

---

### GET `/`

Información de la API.

**Request:**
```bash
curl http://localhost:8000/
```

**Response:** `200 OK`
```json
{
  "message": "Bienvenido a tu API Full Stack",
  "version": "1.0.0",
  "docs": "/docs"
}
```

---

## 🔐 Autenticación (Authentication)

### POST `/api/v1/auth/register`

Crear nueva cuenta.

**Request:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "SecurePassword123",
    "full_name": "Juan Pérez"
  }'
```

**Request Body Schema:**
```json
{
  "email": "string (required, valid email)",
  "password": "string (required, min 8 chars recommended)",
  "full_name": "string (required)"
}
```

**Response:** `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@example.com",
  "full_name": "Juan Pérez"
}
```

**Response:** `409 Conflict`
```json
{
  "detail": "Email already registered"
}
```

---

### POST `/api/v1/auth/login`

Iniciar sesión y obtener JWT token.

**Request:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "SecurePassword123"
  }'
```

**Request Body Schema:**
```json
{
  "email": "string (required, valid email)",
  "password": "string (required)"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response:** `401 Unauthorized`
```json
{
  "detail": "Invalid credentials"
}
```

**Guardar token en frontend:**
```javascript
localStorage.setItem('token', response.data.access_token)
```

---

### POST `/api/v1/auth/refresh`

Refrescar JWT token (próximamente).

---

## 👤 Usuarios (Users)

### GET `/api/v1/users/me`

Obtener datos del usuario autenticado.

**Requiere:** JWT token en header

**Request:**
```bash
curl http://localhost:8000/api/v1/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Response:** `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@example.com",
  "full_name": "Juan Pérez"
}
```

**Response:** `401 Unauthorized` (Token inválido/expirado)
```json
{
  "detail": "Not authenticated"
}
```

---

## 📡 Códigos HTTP

| Código | Significado | Cuando |
|--------|------------|--------|
| 200 | OK | Request exitoso |
| 201 | Created | Recurso creado |
| 400 | Bad Request | Datos inválidos |
| 401 | Unauthorized | Token faltante o inválido |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Email duplicado |
| 500 | Server Error | Error en servidor |

---

## 🔑 Autenticación con JWT

### En Headers

Todos los endpoints protegidos requieren:

```
Authorization: Bearer <token>
```

### Ejemplo completo:

```bash
curl -X GET http://localhost:8000/api/v1/users/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJleHAiOjE2ODk5NDU2MDB9.sZg4T1IGK8vr3Z2G4Q9L5F6X8Z9W2K3M5N6O7P8Q9R0"
```

---

## 🧪 Testing con REST Client

### Extension en VS Code: REST Client

Crear archivo `requests.http`:

```http
### Health Check
GET http://localhost:8000/health

### API Info
GET http://localhost:8000/

### Register User
POST http://localhost:8000/api/v1/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "TestPassword123",
  "full_name": "Test User"
}

### Login
POST http://localhost:8000/api/v1/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "TestPassword123"
}

### Get Current User
GET http://localhost:8000/api/v1/users/me
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📖 Documentación Interactiva

FastAPI genera documentación automática:

### Swagger UI
```
http://localhost:8000/docs
```

### ReDoc
```
http://localhost:8000/redoc
```

---

## 🐍 Ejemplo Python (httpx)

```python
import httpx

BASE_URL = "http://localhost:8000"

# Register
async with httpx.AsyncClient() as client:
    response = await client.post(
        f"{BASE_URL}/api/v1/auth/register",
        json={
            "email": "user@example.com",
            "password": "Password123",
            "full_name": "Test User"
        }
    )
    print(response.json())

# Login
async with httpx.AsyncClient() as client:
    response = await client.post(
        f"{BASE_URL}/api/v1/auth/login",
        json={
            "email": "user@example.com",
            "password": "Password123"
        }
    )
    token = response.json()["access_token"]
    
    # Get user
    response = await client.get(
        f"{BASE_URL}/api/v1/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    print(response.json())
```

---

## 🟦 Ejemplo JavaScript/TypeScript

```typescript
// Ya está configurado en frontend/lib/api-client.ts
import apiClient from '@/lib/api-client'

// Register
const response = await apiClient.post('/api/v1/auth/register', {
  email: 'user@example.com',
  password: 'Password123',
  full_name: 'Test User'
})

// Login
const loginResponse = await apiClient.post('/api/v1/auth/login', {
  email: 'user@example.com',
  password: 'Password123'
})

localStorage.setItem('token', loginResponse.data.access_token)

// Get user (automáticamente incluye token)
const userResponse = await apiClient.get('/api/v1/users/me')
console.log(userResponse.data)
```

---

## 🔄 Flujo Típico de Uso

```mermaid
1. GET /health
   ↓
2. POST /api/v1/auth/register
   { email, password, full_name }
   ↓
3. POST /api/v1/auth/login
   { email, password }
   ↓ (obtener token)
4. GET /api/v1/users/me
   (con Authorization header)
   ↓ (obtener datos del usuario)
```

---

## ⚙️ Agregar Nuevo Endpoint

### Paso 1: Crear schema (backend/app/schemas/)

```python
# backend/app/schemas/posts.py
from pydantic import BaseModel

class PostCreate(BaseModel):
    title: str
    content: str

class PostResponse(BaseModel):
    id: str
    title: str
    content: str
```

### Paso 2: Crear modelo (backend/app/models/)

```python
# backend/app/models/post.py
from app.core.supabase import get_supabase

class PostDB:
    TABLE_NAME = "posts"
    
    @staticmethod
    async def create(title: str, content: str, user_id: str):
        supabase = get_supabase()
        response = supabase.table(PostDB.TABLE_NAME).insert({
            "title": title,
            "content": content,
            "user_id": user_id
        }).execute()
        return response.data[0]
```

### Paso 3: Crear ruta (backend/app/api/routes/)

```python
# backend/app/api/routes/posts.py
from fastapi import APIRouter, Depends
from app.schemas.posts import PostCreate, PostResponse
from app.models.post import PostDB

router = APIRouter()

@router.post("/", response_model=PostResponse)
async def create_post(post: PostCreate, user_id: str):
    return await PostDB.create(post.title, post.content, user_id)
```

### Paso 4: Registrar ruta (backend/app/main.py)

```python
from app.api.routes import posts

app.include_router(posts.router, prefix="/api/v1/posts", tags=["posts"])
```

---

## 💾 Variables de Entorno

Necesarias para conectar APIs resueltas:

```env
# Backend
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-key

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
```

---

## 🚨 Errores Comunes

### 401 Unauthorized
- **Causa**: Token faltante o inválido
- **Solución**: 
  ```bash
  # Verificar token en localStorage
  localStorage.getItem('token')
  
  # O verificar header
  curl -H "Authorization: Bearer $(cat token.txt)" http://localhost:8000/api/v1/users/me
  ```

### CORS Error
- **Causa**: Origen no permitido
- **Solución**: Verificar `CORS_ORIGINS` en `backend/app/core/config.py`

### 422 Unprocessable Entity
- **Causa**: Validación de Pydantic fallida
- **Solución**: Revisar los datos enviados coincidan con el schema

---

## 📞 Soporte

- Documentación Swagger: http://localhost:8000/docs
- Documentación ReDoc: http://localhost:8000/redoc
- FastAPI Docs: https://fastapi.tiangolo.com
- Supabase Docs: https://supabase.com/docs

---

**¡Happy API Testing! 🚀**

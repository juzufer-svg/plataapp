# 🚀 Guía Rápida de Inicio

## 1️⃣ Setup Inicial (Una sola vez)

```bash
# Hacer scripts ejecutables
chmod +x setup.sh check.sh dev.sh

# Ejecutar setup
./setup.sh
```

Esto va a:
- ✅ Crear venv de Python
- ✅ Instalar dependencias de FastAPI
- ✅ Instalar dependencias de Next.js
- ✅ Copiar archivos .env

---

## 2️⃣ Configurar Credenciales de Supabase

Abre `backend/.env` y completa:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-key-aqui
SUPABASE_ANON_KEY=tu-anon-key-aqui
```

Obtén estas en: https://app.supabase.com/project/_/settings/api

---

## 3️⃣ Crear Tabla de Usuarios

En tu dashboard de Supabase (SQL Editor):

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

## 4️⃣ Iniciar Desarrollo

### Opción A: Script automático

```bash
./dev.sh
```

### Opción B: Manual (2 terminales)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Opción C: Docker Compose

```bash
docker-compose up --build
```

---

## 5️⃣ Verificar Conexión

✅ **Frontend**: http://localhost:3000
✅ **Backend API**: http://localhost:8000
📖 **API Docs**: http://localhost:8000/docs

---

## 🧪 Prueba Rápida

1. Ve a http://localhost:3000
2. Click en "Registrarse"
3. Completa el formulario
4. ¡Bienvenido al dashboard! 🎉

---

## 📝 Siguiente: Agregar Funcionalidades

Una vez que tengas corriendo localmente, puedes:

- Agregar más endpoints en `backend/app/api/routes/`
- Crear nuevas páginas en `frontend/app/`
- Agregar más modelos de datos en Supabase
- Personalizarlo según tus necesidades

---

## ❓ Troubleshooting

### CORS Error
- Verifica que `http://localhost:3000` esté en `CORS_ORIGINS` (backend/app/core/config.py)

### Token Inválido
- Limpia localStorage: F12 → Application → Clear all

### Base de datos no conecta
- Verifica tus credenciales de Supabase en `.env`
- Crea la tabla de usuarios con el SQL arriba

### Puerto 3000/8000 en uso
```bash
# Cambiar puertos en los comandos
uvicorn app.main:app --port 8001 --reload
npm run dev -- -p 3001
```

---

## 🎯 ¿Cuál es el siguiente paso?

1. Explora la API en http://localhost:8000/docs
2. Intenta agregar un nuevo endpoint en FastAPI
3. Crea una nueva página en Next.js
4. Lee la documentación completa en [README.md](./README.md)

---

**¡Felicidades! Tu full-stack está listo! 🚀**

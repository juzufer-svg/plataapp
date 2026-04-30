# 📁 Estructura Completa del Proyecto

```
/workspaces/codespaces-nextjs/
│
│── 📂 backend/                         # 🐍 FastAPI + Python
│   ├── 📂 app/                         # Código principal
│   │   ├── 📂 api/                     # Rutas y endpoints
│   │   │   └── 📂 routes/
│   │   │       ├── auth.py             # Autenticación: register, login
│   │   │       └── users.py            # Usuario: obtener perfil
│   │   │
│   │   ├── 📂 core/                    # Configuración y seguridad
│   │   │   ├── config.py               # Configuración desde .env
│   │   │   ├── security.py             # JWT, hash de contraseñas
│   │   │   └── supabase.py             # Cliente Supabase
│   │   │
│   │   ├── 📂 models/                  # Operaciones de base de datos
│   │   │   └── user.py                 # CRUD usuario en Supabase
│   │   │
│   │   ├── 📂 schemas/                 # Pydantic validación
│   │   │   └── auth.py                 # Schemas: UserRegistration, Token
│   │   │
│   │   ├── 📂 utils/                   # Utilidades compartidas
│   │   │
│   │   ├── __init__.py
│   │   └── main.py                     # FastAPI app + CORS + rutas
│   │
│   ├── 📂 tests/                       # Tests unitarios
│   │
│   ├── .env                            # Variables de entorno (NO commitar)
│   ├── .env.example                    # Plantilla de variables
│   ├── .gitignore                      # Ignorar archivos Python
│   ├── requirements.txt                # Dependencias Python
│   └── Dockerfile                      # Docker production
│
│── 📂 frontend/                        # ⚛️ Next.js + TypeScript + Tailwind
│   ├── 📂 app/                         # App router (Next.js 14)
│   │   ├── 📂 auth/                    # Rutas de autenticación
│   │   │   ├── layout.tsx              # Auth layout centered
│   │   │   ├── 📂 login/
│   │   │   │   └── page.tsx            # Página login
│   │   │   └── 📂 register/
│   │   │       └── page.tsx            # Página registro
│   │   │
│   │   ├── 📂 dashboard/               # Rutas protegidas
│   │   │   ├── layout.tsx              # Dashboard layout (sidebar)
│   │   │   ├── page.tsx                # Dashboard home
│   │   │   └── 📂 profile/
│   │   │       └── page.tsx            # Perfil de usuario
│   │   │
│   │   ├── layout.tsx                  # Layout raíz
│   │   ├── page.tsx                    # Home pública
│   │
│   ├── 📂 lib/                         # Utilidades
│   │   └── api-client.ts               # Axios + interceptores JWT
│   │
│   ├── 📂 store/                       # Estado global (Zustand)
│   │   └── auth.ts                     # Estado: token, usuario, isAuthenticated
│   │
│   ├── .env.local                      # Variables frontend (NO commitar)
│   ├── .env.example                    # Plantilla
│   ├── .eslintrc.json                  # Linting
│   ├── .gitignore                      # Ignorar archivos Node
│   ├── middleware.ts                   # Middleware para rutas protegidas
│   ├── next.config.js                  # Configuración Next.js
│   ├── package.json                    # Scripts y dependencias
│   ├── postcss.config.js               # PostCSS + Tailwind
│   ├── tailwind.config.ts              # Configuración Tailwind
│   ├── tsconfig.json                   # Configuración TypeScript
│   ├── Dockerfile                      # Docker production
│   ├── Dockerfile.dev                  # Docker development
│   └── 📂 public/                      # Archivos estáticos (favicon, etc)
│
│── 📂 .devcontainer/                   # Configuración Codespaces
│
│── 📂 .git/                            # Git repository
│
│── 📂 .vscode/                         # Configuración editor
│
│── 📜 docker-compose.yml               # Orquestación: postgres, backend, frontend
│── 📜 .env                             # Variables root (NO commitar)
│── 📜 .env.example                     # Plantilla root
│── 📜 .gitignore                       # Ignorar global
│── 📜 setup.sh                         # Script setup inicial
│── 📜 dev.sh                           # Script para iniciar todo
│── 📜 check.sh                         # Script verificación health
│── 📜 README.md                        # Documentación principal
│── 📜 QUICKSTART.md                    # Guía de inicio rápido
└── 📜 STRUCTURE.md                     # Este archivo
```

---

## 📊 Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                     USUARIO (Navegador)                      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ↓ http://localhost:3000
        ┌───────────────────────────────────┐
        │   FRONTEND (Next.js)              │
        │  ┌─────────────────────────────┐  │
        │  │ app/auth/login/page.tsx     │  │ ← Usuario login
        │  │ app/dashboard/page.tsx      │  │ ← Dashboard protegido
        │  │ store/auth.ts               │  │ ← Zustand state
        │  │ lib/api-client.ts           │  │ ← Axios HTTP client
        │  └─────────────────────────────┘  │
        └───────────────────┬────────────────┘
                            │
                            ↓ API Call (JWT token en header)
                            │ http://localhost:8000/api/v1/*
        ┌───────────────────────────────────┐
        │   BACKEND (FastAPI)               │
        │  ┌─────────────────────────────┐  │
        │  │ app/main.py                 │  │ ← App + CORS
        │  │ app/api/routes/auth.py      │  │ ← Login/Register
        │  │ app/api/routes/users.py     │  │ ← Get user
        │  │ app/core/security.py        │  │ ← JWT validation
        │  │ app/models/user.py          │  │ ← DB queries
        │  └─────────────────────────────┘  │
        └───────────────────┬────────────────┘
                            │
                            ↓ Supabase HTTP API
        ┌───────────────────────────────────┐
        │   SUPABASE (PostgreSQL)           │
        │  ┌─────────────────────────────┐  │
        │  │ Table: users                │  │
        │  │  - id (UUID)                │  │
        │  │  - email                    │  │
        │  │  - hashed_password          │  │
        │  │  - full_name                │  │
        │  │  - created_at               │  │
        │  └─────────────────────────────┘  │
        └───────────────────────────────────┘
```

---

## 🔄 Flujo de Autenticación

```
1. REGISTRO
   User → Frontend (register form)
      ↓
   Frontend → Backend POST /api/v1/auth/register
   { email, password, full_name }
      ↓
   Backend → Supabase INSERT users
      ↓
   Backend ← Supabase (user created, id: UUID)
      ↓
   Backend → Frontend (user data)
      ↓
   Frontend → localStorage.setItem('token', jwt)
      ↓
   Frontend → Redirect /dashboard ✅

2. LOGIN
   User → Frontend (login form)
      ↓
   Frontend → Backend POST /api/v1/auth/login
   { email, password }
      ↓
   Backend → Supabase SELECT * FROM users WHERE email = x
      ↓
   Backend ← Supabase (user data + hashed_password)
      ↓
   Backend → Verify password (bcrypt)
      ↓
   Backend → Generate JWT token
      ↓
   Backend → Frontend { access_token, token_type: "bearer" }
      ↓
   Frontend → localStorage.setItem('token', access_token)
      ↓
   Frontend → Redirect /dashboard ✅

3. RUTAS PROTEGIDAS
   Frontend → Include header: Authorization: Bearer <token>
      ↓
   Backend (middleware) → Decode JWT
      ↓
   Backend → Extract user_id from token
      ↓
   Backend → Supabase SELECT * FROM users WHERE id = x
      ↓
   Backend → Return user data + status 200 ✅
   
   (Si token inválido o expirado)
      ↓
   Backend → status 401 Unauthorized
      ↓
   Frontend (interceptor) → localStorage.clear()
      ↓
   Frontend → Redirect /auth/login ⚠️
```

---

## 🛠️ Stack de Tecnologías

### Frontend
| Tech | Uso |
|------|-----|
| Next.js 14 | Framework React moderno |
| TypeScript | Type safety |
| Tailwind CSS | Estilos utility-first |
| Zustand | State management global |
| Axios | HTTP client |
| React Hooks | Lógica de componentes |

### Backend
| Tech | Uso |
|------|-----|
| FastAPI | Framework web rápido |
| Uvicorn | Servidor ASGI |
| Pydantic | Validación de datos |
| python-jose | JWT tokens |
| passlib | Hash de contraseñas |
| Supabase.py | Cliente PostgreSQL |

### Base de Datos
| Tech | Uso |
|------|-----|
| PostgreSQL | Base de datos relacional |
| Supabase | Backend como servicio |
| SQL | Definición de esquema |

### DevOps
| Tech | Uso |
|------|-----|
| Docker | Contenedores |
| Docker Compose | Orquestación local |
| Vercel | Deploy frontend |
| Railway/Render | Deploy backend |
| GitHub | Version control |

---

## 📝 Variables de Entorno

### Backend (.env)
```
ENVIRONMENT=development
DEBUG=True
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
SUPABASE_URL=https://...
SUPABASE_KEY=...
CORS_ORIGINS=[...]
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## 🚀 Deploy Architecture

```
┌─────────────────────────────────────────┐
│          DNS: your-domain.com           │
└────────────────┬────────────────────────┘
                 │
         ┌───────┴────────┐
         ↓                ↓
    ┌────────────┐  ┌──────────────┐
    │   Vercel   │  │ Railway/     │
    │ (Frontend) │  │ Render       │
    │ Next.js    │  │ (Backend)    │
    │ TypeScript │  │ FastAPI      │
    │ Tailwind   │  │ Python       │
    └────┬───────┘  └──────┬───────┘
         │                 │
         │                 ↓
         │          ┌──────────────┐
         │          │  Supabase    │
         │          │  PostgreSQL  │
         │          │  Auth        │
         └──────────→              │
                    └──────────────┘
```

---

## ✅ Checklist Desarrollo

- [ ] Setup inicial ejecutado (`./setup.sh`)
- [ ] Credenciales de Supabase en `.env`
- [ ] Tabla de usuarios creada en Supabase
- [ ] Backend corriendo en port 8000
- [ ] Frontend corriendo en port 3000
- [ ] Registro y login funcionando
- [ ] Dashboard protegido accesible con JWT

---

## 🎯 Próximos Pasos

1. **Agregar más endpoints** en `backend/app/api/routes/`
2. **Crear nuevas páginas** en `frontend/app/`
3. **Agregar validaciones** en Pydantic schemas
4. **Implementar tests** en `backend/tests/`
5. **Deploy en Vercel y Railway**

---

**Happy Coding! 🚀**

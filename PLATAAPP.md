# 🚀 PlataApp - Guía Completa

**PlataApp** es una aplicación web full-stack para gestión de finanzas personales, inspirada en **AI Money**. Te permite gestionar gastos, ingresos, presupuestos y metas de ahorro de forma inteligente.

**Stack:** Next.js 14 + FastAPI + Supabase

---

## ✨ Funcionalidades Principales

### 1. **📊 Dashboard**
- Resumen mensual de ingresos y gastos
- Balance disponible
- Navegación por meses
- Transacciones recientes
- Accesos rápidos a todas las secciones

### 2. **📝 Gestión de Transacciones**
- Registrar gastos e ingresos
- Categorizar transacciones
- Ver historial completo
- Filtrar por mes
- Eliminar transacciones

### 3. **💳 Presupuestos Mensuales**
- Establecer límites de gasto por categoría
- Visualizar progreso en tiempo real
- Alertas de presupuesto excedido
- Seguimiento de gastos vs límite

### 4. **🎯 Metas de Ahorro**
- Crear objetivos de ahorro
- Registrar progreso
- Visualizar porcentaje completado
- Fechas objetivo
- Recordatorios automáticos

### 5. **📈 Reportes y Análisis**
- Estadísticas mensuales
- Categoría con más gasto
- Promedio diario de gastos
- Análisis de patrones
- Exportación de datos

### 6. **🔐 Autenticación JWT**
- Registro seguro de usuarios
- Login con JWT
- Contraseñas encriptadas con bcrypt
- Token refresh automático

---

## 📚 Estructura de Base de Datos

### `users`
```sql
id (UUID)
email (VARCHAR) - Único
hashed_password (VARCHAR)
full_name (VARCHAR)
is_active (BOOLEAN)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### `transacciones`
```sql
id (UUID)
usuario_id (UUID) - FK users
categoria_id (UUID) - FK categorias
monto (NUMERIC)
descripcion (TEXT)
fecha (DATE)
tipo (VARCHAR) - 'ingreso' o 'gasto'
```

### `categorias`
```sql
id (UUID)
usuario_id (UUID) - FK users
nombre (VARCHAR)
icono (VARCHAR) - Emoji
tipo (VARCHAR) - 'ingreso' o 'gasto'
```

### `presupuestos`
```sql
id (UUID)
usuario_id (UUID) - FK users
categoria_id (UUID) - FK categorias
limite_mensual (NUMERIC)
mes_ano (VARCHAR) - YYYY-MM
```

### `metas`
```sql
id (UUID)
usuario_id (UUID) - FK users
nombre (VARCHAR)
monto_objetivo (NUMERIC)
monto_actual (NUMERIC)
fecha_objetivo (DATE)
```

---

## 🔌 API Endpoints

### Autenticación
```
POST   /api/v1/auth/register          - Registrar usuario
POST   /api/v1/auth/login             - Login
GET    /api/v1/users/me               - Obtener perfil
```

### Transacciones
```
POST   /api/v1/transacciones          - Crear transacción
GET    /api/v1/transacciones          - Listar transacciones
GET    /api/v1/transacciones/:id      - Obtener transacción
PUT    /api/v1/transacciones/:id      - Actualizar transacción
DELETE /api/v1/transacciones/:id      - Eliminar transacción
GET    /api/v1/transacciones/resumen/:mes - Resumen del mes
```

### Categorías
```
POST   /api/v1/categorias             - Crear categoría
GET    /api/v1/categorias             - Listar categorías
```

### Presupuestos
```
POST   /api/v1/presupuestos           - Crear presupuesto
GET    /api/v1/presupuestos/:mes_ano  - Listar presupuestos
```

### Metas
```
POST   /api/v1/metas                  - Crear meta
GET    /api/v1/metas                  - Listar metas
PUT    /api/v1/metas/:id              - Actualizar meta
DELETE /api/v1/metas/:id              - Eliminar meta
```

---

## 🎨 Componentes Frontend

### `TransactionForm`
Formulario para registrar nuevas transacciones con:
- Selector de tipo (gasto/ingreso)
- Selector de categoría
- Input de monto
- Selector de fecha
- Área de descripción

### `TransactionList`
Tabla que muestra:
- Categoría con icono
- Descripción
- Monto formateado
- Fecha
- Tipo (badge coloreado)
- Botón eliminar

### `BudgetCard`
Tarjeta con visualización de presupuesto:
- Nombre de categoría
- Límite establecido
- Monto gastado
- Barra de progreso
- Color según estado (OK/Advertencia/Excedido)

### `GoalProgressCard`
Tarjeta de meta de ahorro con:
- Nombre de meta
- Días restantes
- Barra de progreso
- Monto ahorrado vs objetivo
- Botón para agregar fondos

### `DashboardSummary`
Resumen de 3 tarjetas:
- Ingresos totales
- Gastos totales
- Balance (diferencia)

---

## 🚀 Características de Seguridad

- ✅ **JWT Tokens**: Autenticación stateless
- ✅ **Bcrypt**: Password hashing seguro
- ✅ **CORS**: Control de origen cruzado
- ✅ **Environment Variables**: Credenciales protegidas
- ✅ **Token Expiration**: Tokens con tiempo límite
- ✅ **Validación Pydantic**: Validación de datos en backend

---

## 📱 Flujo de Usuario

1. **Registrarse** → Email + Contraseña
2. **Login** → Obtener JWT token
3. **Dashboard** → Ver resumen financiero
4. **Registrar Transacción** → Agregar gasto/ingreso
5. **Gestionar Presupuesto** → Establecer límites
6. **Crear Meta** → Definir objetivo de ahorro
7. **Ver Reportes** → Análisis de gastos
8. **Logout** → Salir de la aplicación

---

## 🔧 Primeros Pasos

### Backend
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
# API en http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# App en http://localhost:3000
```

---

## 📊 Ejemplo de Uso

### 1. Registrar Usuario
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepass123",
    "full_name": "Juan Pérez"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepass123"
  }'
# Retorna: {"access_token": "eyJ0eXA..."}
```

### 3. Registrar Transacción
```bash
curl -X POST http://localhost:8000/api/v1/transacciones \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "categoria_id": "cat-123",
    "monto": 50.00,
    "descripcion": "Comida en restaurante",
    "fecha": "2024-04-29",
    "tipo": "gasto"
  }'
```

---

## 🎯 Próximo Pasos

- [ ] Agregar gráficos con Chart.js
- [ ] AI análisis de gastos (patrones)
- [ ] Notificaciones push
- [ ] Exportar a PDF/Excel
- [ ] Soporte multi-moneda
- [ ] Integración banco automática
- [ ] Modo oscuro
- [ ] App mobile (React Native)

---

## 📞 Soporte

Para problemas, contacta a través de Issues en GitHub o email.

---

**¡Disfruta gestionar tus finanzas con PlataApp! 💰✨**

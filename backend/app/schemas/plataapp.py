"""
Pydantic schemas for PlataApp
"""
from pydantic import BaseModel
from typing import Optional
from datetime import date


# Transacciones
class TransaccionCreate(BaseModel):
    """Crear transacción"""
    categoria_id: str
    monto: float
    descripcion: str
    fecha: str
    tipo: str  # 'ingreso' o 'gasto'


class TransaccionResponse(BaseModel):
    """Respuesta de transacción"""
    id: str
    usuario_id: str
    categoria_id: str
    monto: float
    descripcion: str
    fecha: str
    tipo: str


class ResumenTransacciones(BaseModel):
    """Resumen de transacciones"""
    ingresos: float
    gastos: float
    balance: float
    total_transacciones: int


# Categorías
class CategoriaCreate(BaseModel):
    """Crear categoría"""
    nombre: str
    icono: str
    tipo: str  # 'ingreso' o 'gasto'


class CategoriaResponse(BaseModel):
    """Respuesta de categoría"""
    id: str
    usuario_id: str
    nombre: str
    icono: str
    tipo: str


# Presupuestos
class PresupuestoCreate(BaseModel):
    """Crear presupuesto"""
    categoria_id: str
    limite_mensual: float
    mes_ano: str


class PresupuestoResponse(BaseModel):
    """Respuesta de presupuesto"""
    id: str
    usuario_id: str
    categoria_id: str
    limite_mensual: float
    mes_ano: str


# Presupuestos (update)
class PresupuestoUpdate(BaseModel):
    """Actualizar presupuesto"""
    limite_mensual: float


# Metas
class MetaCreate(BaseModel):
    """Crear meta"""
    nombre: str
    monto_objetivo: float
    fecha_objetivo: str


class MetaResponse(BaseModel):
    """Respuesta de meta"""
    id: str
    usuario_id: str
    nombre: str
    monto_objetivo: float
    monto_actual: float
    fecha_objetivo: str
    porcentaje_completado: Optional[float] = None


class ActualizarMeta(BaseModel):
    """Actualizar meta (todos los campos opcionales)"""
    nombre: Optional[str] = None
    monto_objetivo: Optional[float] = None
    monto_actual: Optional[float] = None
    fecha_objetivo: Optional[str] = None

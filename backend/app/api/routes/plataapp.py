"""
PlataApp routes - Transacciones, Categorías, Presupuestos, Metas
"""
from fastapi import APIRouter, HTTPException, Header
from app.schemas.plataapp import (
    TransaccionCreate, TransaccionResponse, ResumenTransacciones,
    CategoriaCreate, CategoriaResponse,
    PresupuestoCreate, PresupuestoResponse, PresupuestoUpdate,
    MetaCreate, MetaResponse, ActualizarMeta
)
from app.models.plataapp import TransaccionDB, CategoriaDB, PresupuestoDB, MetaDB
from app.core.security import decode_token
from typing import Optional

router = APIRouter()


def get_user_id(authorization: str) -> str:
    """Extrae el usuario_id del token Bearer."""
    try:
        token = authorization.split(" ")[1]
    except (IndexError, AttributeError):
        raise HTTPException(status_code=401, detail="Token inválido")
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido")
    return payload.get("sub")


# ==================== TRANSACCIONES ====================

@router.post("/transacciones", response_model=TransaccionResponse)
async def crear_transaccion(transaccion: TransaccionCreate, authorization: str = Header(...)):
    usuario_id = get_user_id(authorization)
    nueva = await TransaccionDB.crear(
        usuario_id=usuario_id,
        categoria_id=transaccion.categoria_id,
        monto=transaccion.monto,
        descripcion=transaccion.descripcion,
        fecha=transaccion.fecha,
        tipo=transaccion.tipo
    )
    return nueva


@router.get("/transacciones", response_model=list[TransaccionResponse])
async def obtener_transacciones(authorization: str = Header(...), mes: Optional[str] = None):
    usuario_id = get_user_id(authorization)
    return await TransaccionDB.obtener_por_usuario(usuario_id, mes)


@router.get("/transacciones/resumen/{mes}")
async def obtener_resumen(mes: str, authorization: str = Header(...)):
    usuario_id = get_user_id(authorization)
    return await TransaccionDB.obtener_resumen(usuario_id, mes)


@router.get("/transacciones/{transaccion_id}", response_model=TransaccionResponse)
async def obtener_transaccion(transaccion_id: str, authorization: str = Header(...)):
    get_user_id(authorization)  # valida token
    transaccion = await TransaccionDB.obtener_por_id(transaccion_id)
    if not transaccion:
        raise HTTPException(status_code=404, detail="Transacción no encontrada")
    return transaccion


@router.put("/transacciones/{transaccion_id}", response_model=TransaccionResponse)
async def actualizar_transaccion(transaccion_id: str, transaccion: TransaccionCreate, authorization: str = Header(...)):
    get_user_id(authorization)
    actualizada = await TransaccionDB.actualizar(transaccion_id, **transaccion.dict())
    return actualizada


@router.delete("/transacciones/{transaccion_id}")
async def eliminar_transaccion(transaccion_id: str, authorization: str = Header(...)):
    get_user_id(authorization)
    await TransaccionDB.eliminar(transaccion_id)
    return {"message": "Transacción eliminada"}


# ==================== CATEGORÍAS ====================

@router.post("/categorias", response_model=CategoriaResponse)
async def crear_categoria(categoria: CategoriaCreate, authorization: str = Header(...)):
    usuario_id = get_user_id(authorization)
    nueva = await CategoriaDB.crear(
        usuario_id=usuario_id,
        nombre=categoria.nombre,
        icono=categoria.icono,
        tipo=categoria.tipo
    )
    return nueva


@router.get("/categorias", response_model=list[CategoriaResponse])
async def obtener_categorias(authorization: str = Header(...)):
    usuario_id = get_user_id(authorization)
    return await CategoriaDB.obtener_por_usuario(usuario_id)


# ==================== PRESUPUESTOS ====================

@router.post("/presupuestos", response_model=PresupuestoResponse)
async def crear_presupuesto(presupuesto: PresupuestoCreate, authorization: str = Header(...)):
    usuario_id = get_user_id(authorization)
    nuevo = await PresupuestoDB.crear(
        usuario_id=usuario_id,
        categoria_id=presupuesto.categoria_id,
        limite_mensual=presupuesto.limite_mensual,
        mes_ano=presupuesto.mes_ano
    )
    return nuevo


@router.get("/presupuestos/{mes_ano}", response_model=list[PresupuestoResponse])
async def obtener_presupuestos(mes_ano: str, authorization: str = Header(...)):
    usuario_id = get_user_id(authorization)
    return await PresupuestoDB.obtener_por_usuario_mes(usuario_id, mes_ano)


@router.put("/presupuestos/{presupuesto_id}", response_model=PresupuestoResponse)
async def actualizar_presupuesto(presupuesto_id: str, datos: PresupuestoUpdate, authorization: str = Header(...)):
    get_user_id(authorization)
    actualizado = await PresupuestoDB.actualizar(presupuesto_id, datos.limite_mensual)
    if not actualizado:
        raise HTTPException(status_code=404, detail="Presupuesto no encontrado")
    return actualizado


@router.delete("/presupuestos/{presupuesto_id}")
async def eliminar_presupuesto(presupuesto_id: str, authorization: str = Header(...)):
    get_user_id(authorization)
    await PresupuestoDB.eliminar(presupuesto_id)
    return {"message": "Presupuesto eliminado"}


# ==================== METAS ====================

@router.post("/metas", response_model=MetaResponse)
async def crear_meta(meta: MetaCreate, authorization: str = Header(...)):
    usuario_id = get_user_id(authorization)
    nueva = await MetaDB.crear(
        usuario_id=usuario_id,
        nombre=meta.nombre,
        monto_objetivo=meta.monto_objetivo,
        fecha_objetivo=meta.fecha_objetivo
    )
    return {**nueva, "porcentaje_completado": 0}


@router.get("/metas", response_model=list[MetaResponse])
async def obtener_metas(authorization: str = Header(...)):
    usuario_id = get_user_id(authorization)
    metas = await MetaDB.obtener_por_usuario(usuario_id)
    for meta in metas:
        meta["porcentaje_completado"] = (
            meta["monto_actual"] / meta["monto_objetivo"] * 100
            if meta["monto_objetivo"] > 0 else 0
        )
    return metas


@router.put("/metas/{meta_id}", response_model=MetaResponse)
async def actualizar_meta(meta_id: str, actualizacion: ActualizarMeta, authorization: str = Header(...)):
    get_user_id(authorization)
    updates = {k: v for k, v in actualizacion.dict().items() if v is not None}
    meta = await MetaDB.actualizar_progreso(meta_id, updates)
    if not meta:
        raise HTTPException(status_code=404, detail="Meta no encontrada")
    return {
        **meta,
        "porcentaje_completado": (
            meta["monto_actual"] / meta["monto_objetivo"] * 100
            if meta["monto_objetivo"] > 0 else 0
        )
    }


@router.delete("/metas/{meta_id}")
async def eliminar_meta(meta_id: str, authorization: str = Header(...)):
    get_user_id(authorization)
    await MetaDB.eliminar(meta_id)
    return {"message": "Meta eliminada"}

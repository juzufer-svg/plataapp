"""
Database models for PlataApp - Supabase with Demo DB fallback
"""
from typing import Optional
import uuid
from datetime import date as date_type
from app.core.supabase import SupabaseDB
from app.core.config import settings
from app.models.demo_db import (
    DemoTransaccionDB,
    DemoCategoriaDB,
    DemoPresupuestoDB,
    DemoMetaDB
)

def _supabase_ok() -> bool:
    return bool(settings.SUPABASE_URL and settings.SUPABASE_KEY)


def _mes_rango(mes: str):
    """Devuelve (first_day, next_month_first_day) para filtrar por mes en Supabase."""
    year, month = int(mes[:4]), int(mes[5:7])
    first = date_type(year, month, 1).isoformat()
    if month == 12:
        nxt = date_type(year + 1, 1, 1).isoformat()
    else:
        nxt = date_type(year, month + 1, 1).isoformat()
    return first, nxt


class TransaccionDB:

    @staticmethod
    async def crear(usuario_id: str, categoria_id: str, monto: float,
                    descripcion: str, fecha: str, tipo: str) -> dict:
        if not _supabase_ok():
            return await DemoTransaccionDB.crear(usuario_id, categoria_id, monto, descripcion, fecha, tipo)
        try:
            client = SupabaseDB.get_client()
            row = {
                "id": str(uuid.uuid4()),
                "usuario_id": usuario_id,
                "categoria_id": categoria_id if categoria_id else None,
                "monto": monto,
                "descripcion": descripcion,
                "fecha": fecha,
                "tipo": tipo,
            }
            result = client.table("transacciones").insert(row).execute()
            return result.data[0]
        except Exception as e:
            print(f"[Supabase] transacciones.crear error: {e}")
            return await DemoTransaccionDB.crear(usuario_id, categoria_id, monto, descripcion, fecha, tipo)

    @staticmethod
    async def obtener_por_usuario(usuario_id: str, mes: Optional[str] = None) -> list:
        if not _supabase_ok():
            return await DemoTransaccionDB.obtener_por_usuario(usuario_id, mes)
        try:
            client = SupabaseDB.get_client()
            q = client.table("transacciones").select("*").eq("usuario_id", usuario_id).order("fecha", desc=True)
            if mes:
                first, nxt = _mes_rango(mes)
                q = q.gte("fecha", first).lt("fecha", nxt)
            result = q.execute()
            return result.data
        except Exception as e:
            print(f"[Supabase] transacciones.obtener error: {e}")
            return await DemoTransaccionDB.obtener_por_usuario(usuario_id, mes)

    @staticmethod
    async def obtener_por_id(transaccion_id: str) -> dict:
        if not _supabase_ok():
            return await DemoTransaccionDB.obtener_por_id(transaccion_id)
        try:
            client = SupabaseDB.get_client()
            result = client.table("transacciones").select("*").eq("id", transaccion_id).limit(1).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"[Supabase] transacciones.obtener_por_id error: {e}")
            return await DemoTransaccionDB.obtener_por_id(transaccion_id)

    @staticmethod
    async def actualizar(transaccion_id: str, **kwargs) -> dict:
        if not _supabase_ok():
            return await DemoTransaccionDB.actualizar(transaccion_id, **kwargs)
        try:
            allowed = {'categoria_id', 'monto', 'descripcion', 'fecha', 'tipo'}
            updates = {k: v for k, v in kwargs.items() if k in allowed and v is not None}
            client = SupabaseDB.get_client()
            result = client.table("transacciones").update(updates).eq("id", transaccion_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"[Supabase] transacciones.actualizar error: {e}")
            return await DemoTransaccionDB.actualizar(transaccion_id, **kwargs)

    @staticmethod
    async def eliminar(transaccion_id: str) -> bool:
        if not _supabase_ok():
            return await DemoTransaccionDB.eliminar(transaccion_id)
        try:
            client = SupabaseDB.get_client()
            client.table("transacciones").delete().eq("id", transaccion_id).execute()
            return True
        except Exception as e:
            print(f"[Supabase] transacciones.eliminar error: {e}")
            return await DemoTransaccionDB.eliminar(transaccion_id)

    @staticmethod
    async def obtener_resumen(usuario_id: str, mes: str) -> dict:
        transacciones = await TransaccionDB.obtener_por_usuario(usuario_id, mes)
        ingresos = sum(float(t["monto"]) for t in transacciones if t["tipo"] == "ingreso")
        gastos = sum(float(t["monto"]) for t in transacciones if t["tipo"] == "gasto")
        return {
            "ingresos": ingresos,
            "gastos": gastos,
            "balance": ingresos - gastos,
            "total_transacciones": len(transacciones),
        }


class CategoriaDB:

    _DEFAULT_SEED = [
        {"nombre": "Salario",        "icono": "💼", "tipo": "ingreso"},
        {"nombre": "Freelance",      "icono": "💻", "tipo": "ingreso"},
        {"nombre": "Comida",         "icono": "🍔", "tipo": "gasto"},
        {"nombre": "Transporte",     "icono": "🚗", "tipo": "gasto"},
        {"nombre": "Hogar",          "icono": "🏠", "tipo": "gasto"},
        {"nombre": "Salud",          "icono": "💊", "tipo": "gasto"},
        {"nombre": "Entretenimiento","icono": "🎮", "tipo": "gasto"},
    ]

    @staticmethod
    async def crear(usuario_id: str, nombre: str, icono: str, tipo: str) -> dict:
        if not _supabase_ok():
            return await DemoCategoriaDB.crear(usuario_id, nombre, icono, tipo)
        try:
            client = SupabaseDB.get_client()
            row = {"id": str(uuid.uuid4()), "usuario_id": usuario_id, "nombre": nombre, "icono": icono, "tipo": tipo}
            result = client.table("categorias").insert(row).execute()
            return result.data[0]
        except Exception as e:
            print(f"[Supabase] categorias.crear error: {e}")
            return await DemoCategoriaDB.crear(usuario_id, nombre, icono, tipo)

    @staticmethod
    async def obtener_por_usuario(usuario_id: str) -> list:
        if not _supabase_ok():
            return await DemoCategoriaDB.obtener_por_usuario(usuario_id)
        try:
            client = SupabaseDB.get_client()
            result = client.table("categorias").select("*").eq("usuario_id", usuario_id).execute()
            cats = result.data
            # Seed default categories for new user if none exist
            if not cats:
                seed = [{"id": str(uuid.uuid4()), "usuario_id": usuario_id, **c} for c in CategoriaDB._DEFAULT_SEED]
                cats = []
                for item in seed:
                    try:
                        seeded = client.table("categorias").insert(item).execute()
                        if seeded.data:
                            cats.extend(seeded.data)
                    except Exception as seed_err:
                        print(f"[Supabase] categorias.seed error: {seed_err}")
                if not cats:
                    # seed falló completamente, devolver defaults sin persistir
                    cats = seed
            return cats
        except Exception as e:
            print(f"[Supabase] categorias.obtener error: {e}")
            return await DemoCategoriaDB.obtener_por_usuario(usuario_id)

    @staticmethod
    async def obtener_por_id(categoria_id: str) -> dict:
        if not _supabase_ok():
            return await DemoCategoriaDB.obtener_por_id(categoria_id)
        try:
            client = SupabaseDB.get_client()
            result = client.table("categorias").select("*").eq("id", categoria_id).limit(1).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"[Supabase] categorias.obtener_por_id error: {e}")
            return await DemoCategoriaDB.obtener_por_id(categoria_id)

    @staticmethod
    async def actualizar(categoria_id: str, nombre: str, icono: str, tipo: str) -> dict:
        if not _supabase_ok():
            return await DemoCategoriaDB.actualizar(categoria_id, nombre, icono, tipo)
        try:
            client = SupabaseDB.get_client()
            result = client.table("categorias").update({"nombre": nombre, "icono": icono, "tipo": tipo}).eq("id", categoria_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"[Supabase] categorias.actualizar error: {e}")
            return await DemoCategoriaDB.actualizar(categoria_id, nombre, icono, tipo)

    @staticmethod
    async def eliminar(categoria_id: str) -> bool:
        if not _supabase_ok():
            return await DemoCategoriaDB.eliminar(categoria_id)
        try:
            client = SupabaseDB.get_client()
            client.table("categorias").delete().eq("id", categoria_id).execute()
            return True
        except Exception as e:
            print(f"[Supabase] categorias.eliminar error: {e}")
            return await DemoCategoriaDB.eliminar(categoria_id)


class PresupuestoDB:

    @staticmethod
    async def crear(usuario_id: str, categoria_id: str, limite_mensual: float, mes_ano: str) -> dict:
        if not _supabase_ok():
            return await DemoPresupuestoDB.crear(usuario_id, categoria_id, limite_mensual, mes_ano)
        try:
            client = SupabaseDB.get_client()
            row = {
                "id": str(uuid.uuid4()),
                "usuario_id": usuario_id,
                "categoria_id": categoria_id,
                "limite_mensual": limite_mensual,
                "mes_ano": mes_ano,
            }
            result = client.table("presupuestos").insert(row).execute()
            return result.data[0]
        except Exception as e:
            print(f"[Supabase] presupuestos.crear error: {e}")
            return await DemoPresupuestoDB.crear(usuario_id, categoria_id, limite_mensual, mes_ano)

    @staticmethod
    async def obtener_por_usuario_mes(usuario_id: str, mes_ano: str) -> list:
        if not _supabase_ok():
            return await DemoPresupuestoDB.obtener_por_usuario_mes(usuario_id, mes_ano)
        try:
            client = SupabaseDB.get_client()
            result = client.table("presupuestos").select("*")\
                .eq("usuario_id", usuario_id).eq("mes_ano", mes_ano).execute()
            return result.data
        except Exception as e:
            print(f"[Supabase] presupuestos.obtener error: {e}")
            return await DemoPresupuestoDB.obtener_por_usuario_mes(usuario_id, mes_ano)

    @staticmethod
    async def actualizar(presupuesto_id: str, limite_mensual: float) -> dict:
        if not _supabase_ok():
            return await DemoPresupuestoDB.actualizar(presupuesto_id, limite_mensual)
        try:
            client = SupabaseDB.get_client()
            result = client.table("presupuestos").update({"limite_mensual": limite_mensual})\
                .eq("id", presupuesto_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"[Supabase] presupuestos.actualizar error: {e}")
            return await DemoPresupuestoDB.actualizar(presupuesto_id, limite_mensual)

    @staticmethod
    async def eliminar(presupuesto_id: str) -> bool:
        if not _supabase_ok():
            return await DemoPresupuestoDB.eliminar(presupuesto_id)
        try:
            client = SupabaseDB.get_client()
            client.table("presupuestos").delete().eq("id", presupuesto_id).execute()
            return True
        except Exception as e:
            print(f"[Supabase] presupuestos.eliminar error: {e}")
            return await DemoPresupuestoDB.eliminar(presupuesto_id)


class MetaDB:

    @staticmethod
    async def crear(usuario_id: str, nombre: str, monto_objetivo: float, fecha_objetivo: str) -> dict:
        if not _supabase_ok():
            return await DemoMetaDB.crear(usuario_id, nombre, monto_objetivo, fecha_objetivo)
        try:
            client = SupabaseDB.get_client()
            row = {
                "id": str(uuid.uuid4()),
                "usuario_id": usuario_id,
                "nombre": nombre,
                "monto_objetivo": monto_objetivo,
                "monto_actual": 0,
                "fecha_objetivo": fecha_objetivo,
            }
            result = client.table("metas").insert(row).execute()
            return result.data[0]
        except Exception as e:
            print(f"[Supabase] metas.crear error: {e}")
            return await DemoMetaDB.crear(usuario_id, nombre, monto_objetivo, fecha_objetivo)

    @staticmethod
    async def obtener_por_usuario(usuario_id: str) -> list:
        if not _supabase_ok():
            return await DemoMetaDB.obtener_por_usuario(usuario_id)
        try:
            client = SupabaseDB.get_client()
            result = client.table("metas").select("*").eq("usuario_id", usuario_id).execute()
            return result.data
        except Exception as e:
            print(f"[Supabase] metas.obtener error: {e}")
            return await DemoMetaDB.obtener_por_usuario(usuario_id)

    @staticmethod
    async def actualizar_progreso(meta_id: str, updates: dict) -> dict:
        if not _supabase_ok():
            return await DemoMetaDB.actualizar_progreso(meta_id, updates)
        try:
            allowed = {'nombre', 'monto_objetivo', 'monto_actual', 'fecha_objetivo'}
            data = {k: v for k, v in updates.items() if k in allowed and v is not None}
            client = SupabaseDB.get_client()
            result = client.table("metas").update(data).eq("id", meta_id).execute()
            return result.data[0] if result.data else None
        except Exception as e:
            print(f"[Supabase] metas.actualizar error: {e}")
            return await DemoMetaDB.actualizar_progreso(meta_id, updates)

    @staticmethod
    async def eliminar(meta_id: str) -> bool:
        if not _supabase_ok():
            return await DemoMetaDB.eliminar(meta_id)
        try:
            client = SupabaseDB.get_client()
            client.table("metas").delete().eq("id", meta_id).execute()
            return True
        except Exception as e:
            print(f"[Supabase] metas.eliminar error: {e}")
            return await DemoMetaDB.eliminar(meta_id)

"""
In-memory demo database for testing without Supabase
Use this when real Supabase credentials are not available
"""
from typing import Optional, Dict, List
import uuid


class DemoUserDB:
    """In-memory user database for demo/testing"""
    
    _users: Dict[str, dict] = {}
    
    @staticmethod
    async def get_by_username(username: str) -> Optional[dict]:
        """Get user by username"""
        for user in DemoUserDB._users.values():
            if user.get("username") == username:
                return user
        return None
    
    @staticmethod
    async def get_by_id(user_id: str) -> Optional[dict]:
        """Get user by ID"""
        return DemoUserDB._users.get(user_id)
    
    @staticmethod
    async def create(username: str, password: str) -> dict:
        """Create a new user"""
        from app.core.security import get_password_hash
        
        user_id = str(uuid.uuid4())
        user = {
            "id": user_id,
            "username": username,
            "hashed_password": get_password_hash(password),
            "is_active": True
        }
        DemoUserDB._users[user_id] = user
        return user


class DemoTransaccionDB:
    """In-memory transacciones database"""
    
    _transacciones: Dict[str, dict] = {}
    
    @staticmethod
    async def crear(usuario_id: str, categoria_id: str, monto: float, 
                    descripcion: str, fecha: str, tipo: str) -> dict:
        """Create transaction"""
        trans_id = str(uuid.uuid4())
        transaccion = {
            "id": trans_id,
            "usuario_id": usuario_id,
            "categoria_id": categoria_id,
            "monto": monto,
            "descripcion": descripcion,
            "fecha": fecha,
            "tipo": tipo
        }
        DemoTransaccionDB._transacciones[trans_id] = transaccion
        return transaccion
    
    @staticmethod
    async def obtener_por_usuario(usuario_id: str, mes: Optional[str] = None) -> list:
        """Get user transactions"""
        transacciones = [t for t in DemoTransaccionDB._transacciones.values() 
                        if t["usuario_id"] == usuario_id]
        
        if mes:
            transacciones = [t for t in transacciones if t["fecha"].startswith(mes)]
        
        return transacciones
    
    @staticmethod
    async def obtener_resumen(usuario_id: str, mes: str) -> dict:
        """Get transactions summary"""
        transacciones = await DemoTransaccionDB.obtener_por_usuario(usuario_id, mes)
        
        ingresos = sum(t["monto"] for t in transacciones if t["tipo"] == "ingreso")
        gastos = sum(t["monto"] for t in transacciones if t["tipo"] == "gasto")
        
        return {
            "ingresos": ingresos,
            "gastos": gastos,
            "balance": ingresos - gastos,
            "total_transacciones": len(transacciones)
        }
    
    @staticmethod
    async def obtener_por_id(transaccion_id: str):
        """Get transaction by ID"""
        return DemoTransaccionDB._transacciones.get(transaccion_id)

    @staticmethod
    async def actualizar(transaccion_id: str, **kwargs) -> dict:
        """Update transaction"""
        if transaccion_id in DemoTransaccionDB._transacciones:
            allowed = {'categoria_id', 'monto', 'descripcion', 'fecha', 'tipo'}
            for k, v in kwargs.items():
                if k in allowed:
                    DemoTransaccionDB._transacciones[transaccion_id][k] = v
            return DemoTransaccionDB._transacciones[transaccion_id]
        return None

    @staticmethod
    async def eliminar(transaccion_id: str) -> bool:
        """Delete transaction"""
        if transaccion_id in DemoTransaccionDB._transacciones:
            del DemoTransaccionDB._transacciones[transaccion_id]
            return True
        return False


class DemoCategoriaDB:
    """In-memory categorias database"""

    # Categorías por defecto visibles para todos los usuarios
    _categorias: Dict[str, dict] = {
        "cat-salario": {"id": "cat-salario", "usuario_id": "global", "nombre": "Salario", "icono": "💼", "tipo": "ingreso"},
        "cat-freelance": {"id": "cat-freelance", "usuario_id": "global", "nombre": "Freelance", "icono": "💻", "tipo": "ingreso"},
        "cat-comida": {"id": "cat-comida", "usuario_id": "global", "nombre": "Comida", "icono": "🍔", "tipo": "gasto"},
        "cat-transporte": {"id": "cat-transporte", "usuario_id": "global", "nombre": "Transporte", "icono": "🚗", "tipo": "gasto"},
        "cat-hogar": {"id": "cat-hogar", "usuario_id": "global", "nombre": "Hogar", "icono": "🏠", "tipo": "gasto"},
        "cat-salud": {"id": "cat-salud", "usuario_id": "global", "nombre": "Salud", "icono": "💊", "tipo": "gasto"},
        "cat-entretenimiento": {"id": "cat-entretenimiento", "usuario_id": "global", "nombre": "Entretenimiento", "icono": "🎮", "tipo": "gasto"},
    }
    
    @staticmethod
    async def crear(usuario_id: str, nombre: str, icono: str, tipo: str) -> dict:
        """Create category"""
        cat_id = str(uuid.uuid4())
        categoria = {
            "id": cat_id,
            "usuario_id": usuario_id,
            "nombre": nombre,
            "icono": icono,
            "tipo": tipo
        }
        DemoCategoriaDB._categorias[cat_id] = categoria
        return categoria
    
    @staticmethod
    async def obtener_por_usuario(usuario_id: str) -> list:
        """Get user categories (global + user-specific)"""
        return [c for c in DemoCategoriaDB._categorias.values()
                if c["usuario_id"] in (usuario_id, "global")]
    
    @staticmethod
    async def obtener_por_id(categoria_id: str) -> dict:
        """Get category by ID"""
        return DemoCategoriaDB._categorias.get(categoria_id)


class DemoPresupuestoDB:
    """In-memory presupuestos database"""
    
    _presupuestos: Dict[str, dict] = {}
    
    @staticmethod
    async def crear(usuario_id: str, categoria_id: str, limite_mensual: float, mes_ano: str) -> dict:
        """Create budget"""
        pres_id = str(uuid.uuid4())
        presupuesto = {
            "id": pres_id,
            "usuario_id": usuario_id,
            "categoria_id": categoria_id,
            "limite_mensual": limite_mensual,
            "mes_ano": mes_ano
        }
        DemoPresupuestoDB._presupuestos[pres_id] = presupuesto
        return presupuesto
    
    @staticmethod
    async def obtener_por_usuario_mes(usuario_id: str, mes_ano: str) -> list:
        """Get user budgets for month"""
        return [p for p in DemoPresupuestoDB._presupuestos.values()
                if p["usuario_id"] == usuario_id and p["mes_ano"] == mes_ano]

    @staticmethod
    async def actualizar(presupuesto_id: str, limite_mensual: float) -> dict:
        """Update budget limit"""
        if presupuesto_id in DemoPresupuestoDB._presupuestos:
            DemoPresupuestoDB._presupuestos[presupuesto_id]["limite_mensual"] = limite_mensual
            return DemoPresupuestoDB._presupuestos[presupuesto_id]
        return None

    @staticmethod
    async def eliminar(presupuesto_id: str) -> bool:
        """Delete budget"""
        if presupuesto_id in DemoPresupuestoDB._presupuestos:
            del DemoPresupuestoDB._presupuestos[presupuesto_id]
            return True
        return False


class DemoMetaDB:
    """In-memory metas database"""
    
    _metas: Dict[str, dict] = {}
    
    @staticmethod
    async def crear(usuario_id: str, nombre: str, monto_objetivo: float, fecha_objetivo: str) -> dict:
        """Create goal"""
        meta_id = str(uuid.uuid4())
        meta = {
            "id": meta_id,
            "usuario_id": usuario_id,
            "nombre": nombre,
            "monto_objetivo": monto_objetivo,
            "monto_actual": 0,
            "fecha_objetivo": fecha_objetivo
        }
        DemoMetaDB._metas[meta_id] = meta
        return meta
    
    @staticmethod
    async def obtener_por_usuario(usuario_id: str) -> list:
        """Get user goals"""
        return [m for m in DemoMetaDB._metas.values() if m["usuario_id"] == usuario_id]
    
    @staticmethod
    async def actualizar_progreso(meta_id: str, updates: dict) -> dict:
        """Update goal fields"""
        if meta_id in DemoMetaDB._metas:
            for k, v in updates.items():
                if v is not None:
                    DemoMetaDB._metas[meta_id][k] = v
            return DemoMetaDB._metas[meta_id]
        return None

    @staticmethod
    async def eliminar(meta_id: str) -> bool:
        """Delete goal"""
        if meta_id in DemoMetaDB._metas:
            del DemoMetaDB._metas[meta_id]
            return True
        return False

-- PlataApp Database Schema for Supabase
-- Ejecuta estos queries en Supabase SQL Editor

-- Crear tabla users (si no existe)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  hashed_password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla categorias
CREATE TABLE IF NOT EXISTS categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  icono VARCHAR(10),
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('ingreso', 'gasto')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla transacciones
CREATE TABLE IF NOT EXISTS transacciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  monto NUMERIC(12,2) NOT NULL,
  descripcion TEXT,
  fecha DATE NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('ingreso', 'gasto')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla presupuestos
CREATE TABLE IF NOT EXISTS presupuestos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  categoria_id UUID REFERENCES categorias(id) ON DELETE CASCADE NOT NULL,
  limite_mensual NUMERIC(12,2) NOT NULL,
  mes_ano VARCHAR(7) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla metas
CREATE TABLE IF NOT EXISTS metas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  monto_objetivo NUMERIC(12,2) NOT NULL,
  monto_actual NUMERIC(12,2) DEFAULT 0,
  fecha_objetivo DATE NOT NULL,
  estado VARCHAR(20) DEFAULT 'en_progreso' CHECK (estado IN ('en_progreso', 'completada', 'cancelada')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_transacciones_usuario ON transacciones(usuario_id);
CREATE INDEX idx_transacciones_fecha ON transacciones(fecha);
CREATE INDEX idx_categorias_usuario ON categorias(usuario_id);
CREATE INDEX idx_presupuestos_usuario ON presupuestos(usuario_id);
CREATE INDEX idx_presupuestos_mes ON presupuestos(mes_ano);
CREATE INDEX idx_metas_usuario ON metas(usuario_id);

-- Insertar categorías de ejemplo
INSERT INTO categorias (usuario_id, nombre, icono, tipo) VALUES
  ('00000000-0000-0000-0000-000000000000', 'Salario', '💼', 'ingreso'),
  ('00000000-0000-0000-0000-000000000000', 'Comida', '🍔', 'gasto'),
  ('00000000-0000-0000-0000-000000000000', 'Transporte', '🚌', 'gasto'),
  ('00000000-0000-0000-0000-000000000000', 'Entretenimiento', '🎬', 'gasto'),
  ('00000000-0000-0000-0000-000000000000', 'Utilidades', '⚡', 'gasto'),
  ('00000000-0000-0000-0000-000000000000', 'Freelance', '💻', 'ingreso');

-- Crear función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para updated_at
CREATE TRIGGER update_transacciones_updated_at BEFORE UPDATE ON transacciones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_presupuestos_updated_at BEFORE UPDATE ON presupuestos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_metas_updated_at BEFORE UPDATE ON metas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Crear vista para reportes rápidos
CREATE OR REPLACE VIEW v_resumen_mensual AS
SELECT 
  u.id as usuario_id,
  DATE_TRUNC('month', t.fecha)::date as mes,
  SUM(CASE WHEN t.tipo = 'ingreso' THEN t.monto ELSE 0 END) as total_ingresos,
  SUM(CASE WHEN t.tipo = 'gasto' THEN t.monto ELSE 0 END) as total_gastos,
  SUM(CASE WHEN t.tipo = 'ingreso' THEN t.monto ELSE -t.monto END) as balance
FROM users u
LEFT JOIN transacciones t ON u.id = t.usuario_id
GROUP BY u.id, DATE_TRUNC('month', t.fecha);

-- Habilitar RLS (Row Level Security) si es necesario
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE presupuestos ENABLE ROW LEVEL SECURITY;
ALTER TABLE metas ENABLE ROW LEVEL SECURITY;

-- Crear políticas de RLS (cada usuario solo ve sus datos)
CREATE POLICY "Users can only read their own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can only read their own transactions" ON transacciones
  FOR SELECT USING (auth.uid()::text = usuario_id::text);

CREATE POLICY "Users can insert their own transactions" ON transacciones
  FOR INSERT WITH CHECK (auth.uid()::text = usuario_id::text);

CREATE POLICY "Users can update their own transactions" ON transacciones
  FOR UPDATE USING (auth.uid()::text = usuario_id::text);

CREATE POLICY "Users can delete their own transactions" ON transacciones
  FOR DELETE USING (auth.uid()::text = usuario_id::text);

-- Similar políticas para otras tablas...

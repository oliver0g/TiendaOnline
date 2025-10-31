import { createClient } from '@supabase/supabase-js'

// ⚙️ Leer las variables de entorno del archivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 🧩 Crear el cliente de conexión a Supabase
export const supabase = createClient(supabaseUrl, supabaseKey)

// ✅ (Opcional) Mensaje en consola para confirmar conexión
console.log('🔗 Conectado a Supabase:', supabaseUrl)

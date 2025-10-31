# 🛒 Tienda Online - React + Supabase

##1️⃣ Descripción

Proyecto de tienda online con React + Vite y Supabase.

Funcionalidades principales:

-Registro e inicio de sesión (email/password y Google OAuth)
-Perfil de usuario editable (nombre, teléfono, dirección)
-Carrito persistente
-Checkout simulado con historial de pedidos
-Panel de administración (gestión de productos)
-Roles: admin y customer
-Políticas de RLS para seguridad

##2️⃣ Requisitos

-Node.js >= 18
-npm >= 9
-Cuenta en Supabase
-Git

##3️⃣ Configuración local

###Clonar repositorio:

git clone https://github.com/tuUsuario/TiendaOnline.git
cd TiendaOnline


###Instalar dependencias:

npm install


###Crear archivo .env a partir de .env.example:

VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxx


###Ejecutar proyecto:

npm run dev


La app estará disponible en http://localhost:5173.

##4️⃣ Arquitectura del proyecto

TiendaOnline/
├─ src/
│  ├─ components/
│  │  ├─ ProductList.jsx
│  │  ├─ Profile.jsx
│  │  ├─ Cart.jsx
│  │  ├─ Orders.jsx
│  │  └─ AdminPanel.jsx
│  ├─ App.jsx
│  ├─ index.jsx
│  └─ index.css
├─ supabaseClient.js
├─ scripts-sql/
│  ├─ 001_create_tables.sql
│  └─ 002_seed_data.sql
├─ vite.config.js
├─ package.json
└─ README.md

-components/: UI de cada sección
-supabaseClient.js: conexión a Supabase
-scripts-sql/: scripts de creación y semilla de tablas
-App.jsx: lógica principal y navegación

##5️⃣ Tablas y roles
###Tablas clave

profiles: información del usuario

id uuid PRIMARY KEY REFERENCES auth.users(id),
full_name text,
phone text,
address text,
role text NOT NULL DEFAULT 'customer' CHECK (role IN ('admin','customer'))


products: productos de la tienda

cart_items: carrito de cada usuario

orders y order_items: pedidos y detalles

###Roles

admin	CRUD de productos, ver todos los pedidos
customer	Editar perfil, agregar al carrito, checkout, ver sus pedidos

###Políticas RLS clave

profiles:

Usuarios solo pueden leer/editar su propio perfil.

orders:

Usuarios solo pueden leer/editar sus propios pedidos.

products:

Público puede leer; admin puede CRUD.

cart_items:

Solo el usuario dueño puede modificar.

##6️⃣ Variables de entorno
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_URL: URL del proyecto Supabase

VITE_SUPABASE_ANON_KEY: clave pública anónima

⚠️ No subir este archivo al repositorio.

##7️⃣ Usuarios de prueba
| Usuario                                       | Contraseña | Rol      |
| --------------------------------------------- | ---------- | -------- |
| [oliverki---@gmail.com](mailto:admin@example.com) | admin123   | admin    |
| [user1@example.com](mailto:user1@example.com) | user123    | customer |
| [user2@example.com](mailto:user2@example.com) | user123    | customer |

##8️⃣ Scripts SQL
001_create_tables.sql: crear tablas

002_seed_data.sql: datos de ejemplo (productos, perfiles, categorías)

###Ejemplo de producto:

insert into products (name, category, price, image_url)
values ('Playera React', 'Playera', 250, 'https://example.com/playera.png');

##9️⃣ Flujo de uso
-Registrar usuario o iniciar sesión
-Editar perfil
-Ver productos y agregarlos al carrito
-Checkout simulado → genera pedido
-Consultar historial de pedidos
-Admin puede gestionar productos desde AdminPanel

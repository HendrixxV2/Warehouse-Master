# 🏢 Warehouse Master

**Sistema de Gestión de Almacenes (WMS) — aplicación full-stack**

Warehouse Master es un mini-WMS que permite administrar el catálogo de productos, controlar el stock en tiempo real mediante movimientos de entrada/salida, gestionar pedidos y sus líneas de detalle, y consultar un dashboard con KPIs operativos. Está pensado como proyecto académico y de portafolio: cubre el ciclo completo de un CRUD profesional con validaciones, migraciones versionadas y una interfaz moderna con tema claro/oscuro.

---

## 📋 Tabla de contenidos

1. [Qué hace el sistema](#1-qué-hace-el-sistema)
2. [Stack tecnológico](#2-stack-tecnológico)
3. [Estructura del proyecto](#3-estructura-del-proyecto)
4. [Requisitos previos](#4-requisitos-previos)
5. [Instalación paso a paso](#5-instalación-paso-a-paso)
6. [Verificación de autenticación con Postman](#6-verificación-de-autenticación-con-postman)

---

## 1. Qué hace el sistema

- **CRUD completo** sobre 8 entidades relacionadas: usuarios, proveedores, categorías, almacenes, productos, movimientos de stock, pedidos y detalles de pedido.
- **Validación obligatoria en backend**: toda petición pasa por un `validator` antes de llegar al controller. Las peticiones inválidas devuelven `400` con un array `errores[]` y **no tocan la base de datos**.
- **Sesiones JWT persistentes**: la sesión se conserva al recargar la aplicación y expira 10 minutos después de iniciar sesión.
- **Control de stock transaccional**: crear un movimiento de `entrada` incrementa `productos.stock_actual`; uno de `salida` lo decrementa. Si el stock resultante sería negativo, la operación hace `rollback` y responde `400`.
- **Dashboard ejecutivo** con 4 KPIs (total de productos, stock total, pedidos pendientes, productos con stock bajo), feed de actividad reciente y alertas de stock.
- **Interfaz React** con sidebar fija oscura, tema claro/oscuro persistido, y componentes reutilizables (tabla, modal, badges, tarjetas de KPI).

---

## 2. Stack tecnológico

| Capa | Tecnología |
| ------ | ----------- |
| Backend | Node.js 18+, Express 4, Sequelize 6 |
| Base de datos | MySQL 8 |
| Frontend | React 18, Vite, React Router 6, Tailwind CSS 3, Lucide Icons |
| Herramientas | `sequelize-cli`, `nodemon`, `dotenv`, `cors` |

---

## 3. Estructura del proyecto

warehouse-master/
├── backend/
│ ├── config/config.js # Configuración Sequelize (lee .env)
│ ├── controllers/ # 8 controllers (uno por entidad)
│ ├── migrations/ # Migraciones versionadas
│ ├── models/ # 8 modelos Sequelize
│ ├── routes/ # 8 routers Express
│ ├── seeders/ # Datos de prueba
│ ├── validators/ # 8 validators (middlewares)
│ ├── app.js # Configura Express (sin listen)
│ ├── server.js # Conexión + listen
│ └── ...
│
├── frontend/
│ ├── src/
│ │ ├── layout/ # AppShell, Sidebar, Topbar
│ │ ├── pages/ # Dashboard, Productos, etc.
│ │ ├── ui/ # Button, Badge, Modal, DataTable, StatCard
│ │ ├── services/api.js # Cliente HTTP centralizado
│ │ ├── index.css # Variables CSS (tokens) + Tailwind
│ │ └── main.jsx
│ ├── tailwind.config.js
│ └── package.json
│
├── .env.example
├── .sequelizerc
├── package.json
└── README.md

---

## 4. Requisitos previos

- **Node.js** ≥ 18 (`node -v`)
- **npm** ≥ 9 (`npm -v`)
- **MySQL** ≥ 8 corriendo en `localhost:3306`
- **Git** (opcional, para clonar el repo)

---

## 5. Instalación paso a paso

### 5.1 Clonar el repositorio

```bash
git clone <url-del-repo>
cd warehouse-master
```

### 5.2 Configurar la base de datos y JWT

Crea el archivo local `.env` a partir de la plantilla:

```powershell
Copy-Item .env.example .env
```

En `.env`, configura `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` y `DB_PASSWORD` para tu instancia de MySQL. Genera un secreto JWT criptográficamente aleatorio:

```powershell
npm run jwt:secret
```

Copia el resultado en `JWT_SECRET` en `.env`; debe ser el mismo en cada reinicio y no debes compartirlo ni subirlo al repositorio. Cambiarlo invalida todos los tokens que ya se emitieron: inicia sesión de nuevo para obtener uno firmado con el secreto actual. La API firma los tokens con HS256 y usa `JWT_EXPIRES_IN` (por defecto, `10m`); acepta duraciones como `10m` o segundos como `600`. Al expirar la sesión, inicia sesión de nuevo para obtener un token nuevo.

Al eliminar un pedido, también se eliminan sus detalles y paquetes asociados. Eliminar un usuario lo desactiva y conserva el historial relacionado; los usuarios desactivados no aparecen en la lista ni pueden iniciar sesión. Otras eliminaciones bloqueadas por datos relacionados indican que primero debes eliminar o reasignar esos registros.

### 5.3 Instalar, migrar y ejecutar

```bash
npm install
npm run db:migrate
npm start
```

Las migraciones crean y actualizan las tablas conforme al código. Para cargar datos de demostración (incluye un usuario y un producto), ejecuta `npm run seed:all` una sola vez; la siembra es opcional.

## 6. Verificación de autenticación con Postman

También puedes importar [`postman/Warehouse-Master.postman_collection.json`](./postman/Warehouse-Master.postman_collection.json). Ajusta `baseUrl`, `email` y `password` en las variables de la colección; ejecuta **Autenticación → Login (guardar JWT)** primero. El script guarda el token en `jwt` y las solicitudes protegidas heredan automáticamente el encabezado Bearer. Usa **Usuario autenticado (probar JWT)** para validar la sesión. Si el token expira (10 minutos por defecto), vuelve a ejecutar el login. Si modificas `JWT_SECRET` o `JWT_EXPIRES_IN`, reinicia el backend y obtén un token nuevo. Las credenciales demo requieren `npm run seed:all`.

La interfaz web se abre en `http://localhost:3000`; el puerto `4000` corresponde a la API. Los tokens expiran a los 10 minutos; si la API responde **“Token inválido o expirado”**, vuelve a iniciar sesión y sustituye el token guardado por el nuevo. En Postman, obtén uno con `POST http://localhost:4000/api/auth/login`, encabezado `Content-Type: application/json` y cuerpo JSON:

   ```json
   {
     "email": "operador.demo@warehouse.local",
     "password": "WarehouseDemo123"
   }
   ```

   Estas credenciales funcionan solo después de ejecutar `npm run seed:all`. Copia el campo `token` de la respuesta.
2. Para `GET` o `POST http://localhost:4000/api/productos`, abre **Authorization**, selecciona **Bearer Token** y pega el token sin comillas ni el prefijo `Bearer`; Postman debe enviar `Authorization: Bearer <token>`. Para crear un producto, envía JSON con `nombre`, `precio`, `stock_actual`, `id_proveedor`, `id_categoria` e `id_almacen`.
3. Si la respuesta dice **“Token no proporcionado”**, revisa en **Headers** que Postman haya enviado `Authorization`. Si indica formato inválido, configura el tipo **Bearer Token**; si dice inválido o expirado, inicia sesión de nuevo y usa el token más reciente.

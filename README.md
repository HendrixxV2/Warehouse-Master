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
6. [Cómo levantar el proyecto](#6-cómo-levantar-el-proyecto)
7. [Modelo de datos](#7-modelo-de-datos)
8. [Endpoints de la API](#8-endpoints-de-la-api)
9. [Verificación con Postman](#9-verificación-con-postman)
10. [Diseño del frontend](#10-diseño-del-frontend)
11. [Scripts disponibles](#11-scripts-disponibles)
12. [Limitaciones conocidas](#12-limitaciones-conocidas)
13. [Roadmap](#13-roadmap)
14. [Licencia](#14-licencia)

---

## 1. Qué hace el sistema

- **CRUD completo** sobre 8 entidades relacionadas: usuarios, proveedores, categorías, almacenes, productos, movimientos de stock, pedidos y detalles de pedido.
- **Validación obligatoria en backend**: toda petición pasa por un `validator` antes de llegar al controller. Las peticiones inválidas devuelven `400` con un array `errores[]` y **no tocan la base de datos**.
- **Sesiones JWT persistentes**: la sesión se conserva al recargar la aplicación y expira como máximo una hora después de iniciar sesión.
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
│ ├── .env.example
│ ├── .sequelizerc
│ └── package.json
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

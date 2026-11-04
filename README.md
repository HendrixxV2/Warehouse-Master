# Warehouse Master

Sistema de gestión de almacenes con API REST en Express, Sequelize y MySQL.

## Preparar la base de datos

1. Ajusta las variables de conexión en `.env` si tu servidor MySQL usa otros valores. El archivo no se versiona; usa `.env.example` como referencia.
2. Crea la base de datos indicada por `DB_NAME` en tu servidor MySQL.
3. Desde la raíz del proyecto instala dependencias y ejecuta las migraciones:

   ```sh
   npm install
   npm run db:migrate
   npm run seed:all
   ```

4. Inicia la API:

   ```sh
   npm run dev
   ```

La API estará disponible en `http://localhost:4000`. El seeder agrega datos de demostración iniciales; no crea contraseñas ni habilita autenticación.

## Recursos de la API

Cada recurso ofrece `GET /`, `GET /:id`, `POST /`, `PUT /:id` y `DELETE /:id`.

| Ruta | Recurso | Campos principales |
| --- | --- | --- |
| `/api/productos` | Productos | `nombre`, `precio`, `stock_actual`, `id_proveedor`, `id_categoria`, `id_almacen` |
| `/api/proveedores` | Proveedores | `nombre`, `email`, `telefono`, `direccion` |
| `/api/categorias` | Categorías | `nombre`, `descripcion` |
| `/api/almacenes` | Almacenes | `nombre`, `ubicacion`, `capacidad` |
| `/api/usuarios` | Usuarios | `nombre`, `email`, `rol` |
| `/api/movimientos` | Movimientos de stock | `tipo` (`entrada`/`salida`), `cantidad`, `id_usuario`, `id_producto`, `fecha` |
| `/api/pedidos` | Pedidos | `id_usuario`, `estado`, `fecha` |
| `/api/detalles` | Detalles de pedido | `id_pedido`, `id_producto`, `cantidad` |

El stock se ajusta transaccionalmente al crear, editar o eliminar movimientos. El total del pedido se recalcula al agregar, editar o eliminar sus detalles; cada detalle guarda una copia del precio vigente cuando se crea.

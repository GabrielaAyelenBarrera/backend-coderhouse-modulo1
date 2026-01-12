# 🛒 Proyecto eCommerce (Backend + Frontend)

Este proyecto corresponde a un **eCommerce desarrollado con Node.js, Express, MongoDB y Handlebars**, que implementa una API REST completa para la gestión de **productos y carritos**, junto con una **interfaz web funcional** para navegar productos y operar un carrito de compras.

El objetivo principal del proyecto es **aprender y consolidar conceptos de backend**, persistencia en MongoDB, validaciones, manejo de rutas, DAO, y renderizado desde el servidor.

---

## 🚀 Tecnologías utilizadas

* Node.js
* Express.js
* MongoDB + Mongoose
* Express Handlebars
* JavaScript (Frontend)
* HTML / CSS

---

## 📂 Estructura general del proyecto

* `/src`

  * `/dao` → Acceso a datos (MongoDAO)
  * `/models` → Schemas de Mongoose (Products, Carts)
  * `/routes` → Rutas de Products y Carts
  * `/views` → Handlebars (products, carts)
  * `/public/js` → Lógica frontend (products.js, carts.js)
* `/seedMongo.js` → Script para generar datos de prueba

---

## ⚙️ Configuración inicial

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/GabrielaAyelenBarrera/GabrielaBarrera-ProyectoCoderHouse-BackendModulo1.git
cd GabrielaBarrera-ProyectoCoderHouse-BackendModulo1

```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Variables de entorno

⚠️ **Importante – Seguridad**


Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
PORT=8080
MONGO_URL=mongodb+srv://<USUARIO>:<PASSWORD>@<CLUSTER>/<DB>?retryWrites=true&w=majority
DB_NAME=clase15
SECRET=coderhouse
```

---

## ▶️ Cómo ejecutar el proyecto

```bash
npm run dev
```

El servidor quedará corriendo en:

👉 **[http://localhost:8080](http://localhost:8080)**

---

## 🛍️ Funcionamiento general del sistema

### 🔹 Productos

* Los productos se almacenan en MongoDB
* Se pueden crear, modificar, eliminar y listar
* Se soportan filtros por **categoría**, **límite** y **paginación**
* Se renderizan en el frontend usando Handlebars

### 🔹 Carrito de compras

* El proyecto utiliza un **carrito hardcodeado**
* Todos los productos agregados desde el frontend se almacenan en ese carrito
* El ID del carrito se define en el frontend

📍 Archivo clave:

```js
public/js/products.js
```

```js
const hardcodedCartId = "ID_DEL_CARRITO";
```

Para usar otro carrito, solo es necesario **reemplazar ese ID**.

---

## 🖥️ Frontend

### 📄 Página de Productos (`/products`)

Incluye:

* Listado de productos
* Botón **Agregar al carrito**
* Paginación
* Filtros por categoría
* Botón **Ver carrito**

### 📄 Página de Carrito (`/cart`)

Incluye:

* Listado de productos agregados
* Actualizar cantidad
* Eliminar producto
* Vaciar carrito

---

## 🔁 Seed de datos (Products y Carts)

Para generar datos de prueba:

```bash
node seedMongo.js
```

Este script:

* Genera productos
* Genera carritos
* Permite obtener IDs válidos para pruebas

---

## 📌 Endpoints – API REST

### 🛒 CARTS

1️⃣ Obtener todos los carritos

```
GET /api/carts
```

2️⃣ Obtener carrito por ID

```
GET /api/carts/:cid
```

Incluye validaciones de ID inválido o inexistente.

3️⃣ Agregar producto al carrito

```
POST /api/carts/:cid/products
```

Body:

```json
{ "product": "PRODUCT_ID", "quantity": 2 }
```

4️⃣ Crear carrito

```
POST /api/carts
```

5️⃣ Actualizar cantidad de un producto

```
PUT /api/carts/:cid/products/:pid
```

6️⃣ Reemplazar productos del carrito

```
PUT /api/carts/:cid
```

7️⃣ Eliminar producto del carrito

```
DELETE /api/carts/:cid/products/:pid
```

8️⃣ Vaciar carrito

```
DELETE /api/carts/:cid
```

Todas las rutas incluyen **validaciones completas** de IDs y estados.

---

### 📦 PRODUCTS

1️⃣ Obtener productos

```
GET /api/products
```

2️⃣ Crear producto

```
POST /api/products
```

3️⃣ Actualizar producto

```
PUT /api/products/:pid
```

4️⃣ Eliminar producto

```
DELETE /api/products/:pid
```

5️⃣ Filtros

* Por categoría:

```
GET /api/products?category=Casual
```

* Por límite:

```
GET /api/products?limit=2
```

* Por página:

```
GET /api/products?page=3
```

---

## ✅ Validaciones implementadas

* IDs inválidos o inexistentes
* Cantidades negativas o inválidas
* Productos duplicados
* Eliminaciones repetidas
* Carritos inexistentes

---

## 📌 Estado del proyecto

✔️ API REST funcional
✔️ Persistencia en MongoDB
✔️ Frontend integrado con Handlebars
✔️ Validaciones completas
✔️ Seed de datos


---

## 👩‍💻 Autora
**Gabriela Ayelén Barrera**  
📫 Contacto: gabrielaayelenbarrera1145@gmail.com  
🔗 LinkedIn: www.linkedin.com/in/gabrielabarrera-

---


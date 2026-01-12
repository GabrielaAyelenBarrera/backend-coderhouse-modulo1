import express from "express";
import mongoose from "mongoose";

import CartsMongoDAO from "../dao/CartsMongoDAO.js";

const router = express.Router();

// Ruta para obtener todos los carritos
router.get("/", async (req, res) => {
  try {
    const carts = await CartsMongoDAO.getCarts();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener un carrito por ID
router.get("/:id", async (req, res) => {
  try {
    const cartId = req.params.id;

    // Validación del formato del ObjectId
    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      return res.status(400).json({
        error:
          "ID de carrito inválido. Asegúrate de que tenga el formato correcto.",
      });
    }

    const cart = await CartsMongoDAO.getCartById(cartId);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await CartsMongoDAO.create();
    res.status(201).json({ message: "Carrito creado", id: newCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para agregar un producto a un carrito específico
router.post("/:id/products", async (req, res) => {
  const { id } = req.params; // ID del carrito
  const { product, quantity } = req.body; // Producto y cantidad desde el cuerpo de la solicitud

  // Validar que la cantidad sea mayor que 0
  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: "La cantidad debe ser mayor a 0." });
  }

  try {
    // Llamar al método para agregar el producto al carrito
    const updatedCart = await CartsMongoDAO.addProductToCart(id, {
      pid: product,
      quantity,
    });
    res.status(200).json(updatedCart); // Responder con el carrito actualizado
  } catch (error) {
    if (error.message.includes("not found")) {
      return res.status(404).json({
        error: `Carrito no encontrado: ${error.message}`,
      });
    }
    if (error.message.includes("Invalid product ID")) {
      return res.status(400).json({
        error: `Producto no válido: ${error.message}`,
      });
    }
    // Manejo de errores generales
    res.status(500).json({
      error: `Error al agregar el producto al carrito: ${error.message}`,
    });
  }
});

// Ruta para actualizar SOLO la cantidad de un producto en un carrito específico
router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const updatedCart = await CartsMongoDAO.updateProductQuantityInCart(
      cid,
      pid,
      quantity
    );
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para actualizar el carrito con un arreglo de productos
router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body; // Extraer la propiedad 'products' del cuerpo de la solicitud

  // Validar los productos antes de llamar al método DAO
  if (!Array.isArray(products)) {
    return res
      .status(400)
      .json({ error: "El campo 'products' debe ser un array." });
  }

  for (const item of products) {
    if (!item.product || !item.quantity) {
      // Asegurarse de que 'product' esté presente
      return res.status(400).json({
        error:
          "Cada objeto en 'products' debe tener propiedades 'product' y 'quantity'.",
      });
    }

    if (typeof item.quantity !== "number" || item.quantity <= 0) {
      return res.status(400).json({
        error: "La propiedad 'quantity' debe ser un número positivo.",
      });
    }
  }

  try {
    // Actualizar el carrito con los productos
    const updatedCart = await CartsMongoDAO.updateCartProducts(cid, products);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cid)) {
    return res
      .status(400)
      .json({ error: `El ID del carrito ${cid} no es válido` });
  }

  if (!mongoose.Types.ObjectId.isValid(pid)) {
    return res
      .status(400)
      .json({ error: `El ID del producto ${pid} no es válido` });
  }

  try {
    const result = await CartsMongoDAO.removeProductFromCart(cid, pid);

    // Manejo de resultados
    return res.status(200).json({ message: result.message });
  } catch (error) {
    console.error("Error en la eliminación del producto:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Ruta para eliminar todos los productos de un carrito específico
router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params; // Corregido para que coincida con el parámetro de la ruta
    const updatedCart = await CartsMongoDAO.clearCartProducts(cid);

    if (updatedCart) {
      res.json({
        message: "Todos los productos han sido eliminados del carrito",
        cart: updatedCart,
      });
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;



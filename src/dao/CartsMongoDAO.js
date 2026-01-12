import mongoose from "mongoose";
import CartsModelo from "./models/cartsModelo.js";

class CartsMongoDAO {
  // Método para obtener todos los carritos
  static async getCarts() {
    try {
      const carts = await CartsModelo.find().lean();
      console.log("Carts data:", carts); // Agrega un log aquí

      return carts.map((cart) => ({
        ...cart,
        products: cart.products.map((p) => {
          if (!p.product) {
            console.error("Undefined product:", p); // Agrega un log si p.product es undefined
          }
          return {
            product: p.product ? p.product.toString() : "undefined", // Manejar caso undefined
            quantity: p.quantity,
          };
        }),
      }));
    } catch (error) {
      console.error("Error in getCarts:", error); // Agrega un log de error
      throw error;
    }
  }
  // Método para crear un nuevo carrito
  static async create() {
    try {
      const newCart = { products: [] };
      const result = await CartsModelo.create(newCart);
      return result._id;
    } catch (error) {
      console.error("Error creating cart:", error); // Agrega el error a los logs del servidor
      throw new Error("Error creating cart: " + error.message);
    }
  }
  // Obtener un carrito por su ID y populando los productos
  static async getCartById(cid) {
    try {
      const cart = await CartsModelo.findById(cid)
        .populate("products.product")
        .lean();

      if (!cart) {
        return null; // Devuelve null si el carrito no existe
      }

      // Transformar la respuesta para que tenga la estructura deseada
      return {
        ...cart,
        products: cart.products.map((p) => ({
          product: p.product,
          quantity: p.quantity,
        })),
      };
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      throw new Error(`Error al obtener el carrito: ${error.message}`);
    }
  }

  // Método para actualizar la cantidad de un producto en el carrito
  static async updateProductQuantityInCart(cid, pid, quantity) {
    if (
      !mongoose.Types.ObjectId.isValid(cid) ||
      !mongoose.Types.ObjectId.isValid(pid)
    ) {
      throw new Error("Invalid cart or product ID");
    }

    const cart = await CartsModelo.findById(cid);
    if (!cart) {
      throw new Error(`Cart with ID ${cid} not found`);
    }

    const existingProduct = cart.products.find(
      (p) => p.product.toString() === pid
    );
    if (existingProduct) {
      existingProduct.quantity = quantity;
    } else {
      cart.products.push({
        product: new mongoose.Types.ObjectId(pid),
        quantity,
      });
    }

    const updatedCart = await cart.save();

    return {
      ...updatedCart.toObject(),
      products: updatedCart.products.map((p) => ({
        product: p.product.toString(),
        quantity: p.quantity,
      })),
    };
  }
  // Actualizar la cantidad de un producto en el carrito
  static async updateCartProducts(cid, products) {
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      throw new Error("Invalid cart ID");
    }

    // Verifica si el carrito existe
    const cart = await CartsModelo.findById(cid);
    if (!cart) {
      throw new Error(`Cart with ID ${cid} not found`);
    }

    // Verifica que products es un array
    if (!Array.isArray(products)) {
      console.error("Received products:", products); // Para depuración
      throw new Error("Products should be an array");
    }
    products.forEach((product) => {
      if (!product.product || typeof product.quantity !== "number") {
        throw new Error(
          "Each product must have a valid 'product' ID and 'quantity'"
        );
      }
    });

    // Actualizar los productos en el carrito
    cart.products = products.map((product) => ({
      product: new mongoose.Types.ObjectId(product.product),
      quantity: product.quantity,
    }));

    // Guardar el carrito actualizado
    const updatedCart = await cart.save();

    // Popula los productos para devolver los detalles completos
    const populatedCart = await CartsModelo.findById(updatedCart._id)
      .populate("products.product")
      .lean();

    // Transformar la respuesta para que tenga la estructura deseada
    const response = {
      products: populatedCart.products.map((p) => ({
        product: p.product._id.toString(),
        quantity: p.quantity,
      })),
    };

    return response;
  }
  // Método para añadir un producto al carrito
  static async addProductToCart(cid, { pid, quantity }) {
    if (!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
      throw new Error("Invalid cart or product ID");
    }
  
    const cart = await CartsModelo.findById(cid).exec();
    if (!cart) {
      throw new Error(`Cart with ID ${cid} not found`); // Lanza un error específico
    }
  
    const existingProduct = cart.products.find((p) => p.product.toString() === pid);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({
        product: new mongoose.Types.ObjectId(pid),
        quantity,
      });
    }
  
    const updatedCart = await cart.save();
    return {
      ...updatedCart.toObject(),
      products: updatedCart.products.map((p) => ({
        product: p.product.toString(),
        quantity: p.quantity,
      })),
    };
  }
  

  static async removeProductFromCart(cid, pid) {
    if (
      !mongoose.Types.ObjectId.isValid(cid) ||
      !mongoose.Types.ObjectId.isValid(pid)
    ) {
      throw new Error("Invalid cart or product ID");
    }
  
    const cart = await CartsModelo.findById(cid).lean();
    if (!cart) {
      return { message: "Carrito no encontrado" }; // Carrito no encontrado
    }
  
    // Verificar si el carrito tiene productos
    if (cart.products.length === 0) {
      return { message: "El carrito está vacío, no hay productos que eliminar." }; // Carrito vacío
    }
  
    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === pid.toString()
    );
    if (productIndex === -1) {
      return { message: "Producto no encontrado en el carrito" }; // Producto no encontrado
    }
  
    await CartsModelo.findByIdAndUpdate(
      cid,
      {
        $pull: {
          products: { product: new mongoose.Types.ObjectId(pid) },
        },
      },
      { new: true }
    ).lean();
  
    return { message: "Producto eliminado del carrito" }; // Producto eliminado
  }
  
// Método para eliminar todos los productos de un carrito específico
static async clearCartProducts(cid) {
  if (!mongoose.Types.ObjectId.isValid(cid)) {
    throw new Error("Invalid cart ID");
  }

  // Busca el carrito para verificar si existe
  const cart = await CartsModelo.findById(cid);
  if (!cart) {
    throw new Error(`Cart with ID ${cid} not found`);
  }

  // Verifica si el carrito ya está vacío
  if (cart.products.length === 0) {
    return {
      message: "El carrito ya está vacío.",
      cart: cart, // Devuelve el carrito actual sin cambios
    };
  }

  // Actualiza el carrito vaciando el arreglo de productos
  const updatedCart = await CartsModelo.findByIdAndUpdate(
    cid,
    { $set: { products: [] } }, // Vacía el array de productos
    { new: true } // Devuelve el carrito actualizado
  ).lean();

  // Devuelve el carrito actualizado con el formato correcto
  return {
    message: "Todos los productos han sido eliminados del carrito",
    cart: updatedCart,
  };
}
}

export default CartsMongoDAO;




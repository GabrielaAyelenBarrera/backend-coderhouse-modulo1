import { config } from "./src/config/config.js";
import readline from "readline";
import { connDB } from "./src/connDB.js";
import Cart from "./src/dao/models/cartsModelo.js";
import Product from "./src/dao/models/productsModelo.js";

// Define una lista de zapatillas
const famousShoes = [
  {
    title: "Air Jordan 1",
    description:
      "Iconic high-top sneakers first released in 1985. Known for their style and comfort.",
    code: "AJ1",
  },
  {
    title: "Nike Air Max 97",
    description:
      "Innovative sneakers featuring a full-length visible air unit for cushioning.",
    code: "AM97",
  },
  {
    title: "Adidas UltraBoost",
    description:
      "High-performance running shoes with responsive Boost cushioning for a comfortable run.",
    code: "UB",
  },
  {
    title: "Converse Chuck Taylor All-Star",
    description:
      "Classic canvas sneakers with a timeless design and iconic star logo.",
    code: "CTAS",
  },
  {
    title: "New Balance 990v5",
    description:
      "Premium sneakers known for their stability and comfort, designed for everyday wear.",
    code: "NB990",
  },
];

// Define una lista de categorías
const categories = ["Basketball", "Running", "Casual", "Lifestyle", "Training"];

// Genera productos con nombres y descripciones de zapatillas
const generateProducts = (count) => {
  let products = [];

  for (let i = 1; i <= count; i++) {
    // Selecciona una zapatilla al azar
    const shoe = famousShoes[Math.floor(Math.random() * famousShoes.length)];

    // Seleccionar una categoría al azar
    const category = categories[Math.floor(Math.random() * categories.length)];

    const product = {
      id: i,
      title: `${shoe.title} ${i}`, // Agrega un número al título para hacerlo único
      description: shoe.description,
      code: `${i}`, // Código secuencial
      price: 100 + Math.floor(Math.random() * 50),
      status: true,
      stock: 50 + Math.floor(Math.random() * 50),
      category: category, // Categoría aleatoria
      thumbnails: [`image${i}.jpg`],
    };
    products.push(product);
  }

  return products;
};

// Genera carritos
const generateCarts = (count, productIds) => {
  let carts = [];
  for (let i = 0; i < count; i++) {
    const randomProductId =
      productIds[Math.floor(Math.random() * productIds.length)];
const cart = {
  products: [
    { product: randomProductId, quantity: Math.floor(Math.random() * 5) + 1 }
  ]
};
    carts.push(cart);
  }
  return carts;
};

// Genera 5000 productos
const products = generateProducts(5000);
console.log(products);

// Función para crear la data
const creaData = async () => {
  try {
    // Eliminar todos los documentos existentes en ambas colecciones
    await Cart.deleteMany({});
    await Product.deleteMany({});

    // Insertar los productos generados
    const insertedProducts = await Product.insertMany(products);
    console.log("Productos insertados:", insertedProducts);

    // Mapear los IDs de los productos insertados
    const productIds = insertedProducts.map((product) => product._id);

    // Generar carritos aleatorios con los productos insertados
    const carts = generateCarts(100, productIds);
    console.log("Carritos generados:", carts);

    // Insertar los carritos generados
    await Cart.insertMany(carts);
    console.log(`Data generada correctamente...!!!`);
  } catch (error) {
    console.error(`Error generando datos: ${error.message}`);
  }
};

// Configuración del readline para la entrada del usuario
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

// Solicitar la clave al usuario que es "coderhouse"
rl.question("Por favor, introduce tu clave: ", async (clave) => {
  if (clave === config.SECRET) {
    await connDB();
    await creaData();
  } else {
    console.log(`Contraseña seed incorrecta...!!!`);
  }

  rl.close();
});


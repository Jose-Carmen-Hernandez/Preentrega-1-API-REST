/* import fs from "node:fs";

import ProductsManager from "../class/productManager.js";
import { __dirname } from "../utils.js";

const productManager = new ProductsManager(__dirname + "/data/products.json");

class CartsManager {
  constructor(path) {
    this.path = path;
    this.cartList = [];
    this.productsListToCart = [];
  }

  // Funciones para Carts
  async getAllCarts() {
    const list = await fs.promises.readFile(this.path, "utf-8");
    this.cartList = [...JSON.parse(list).carts];
    return [...this.cartList];
  }
  async addCart() {
    const newId = await productManager.setNewId();
    await this.getAllCarts();
    const newCart = { id: newId, products: [] };
    this.cartList.push(newCart);
    await fs.promises.writeFile(
      this.path,
      JSON.stringify({ carts: this.cartList })
    );
    return newId;
  }
  async getCart(id) {
    await this.getAllCarts();
    if (this.cartList.some((obj) => obj.id == id)) {
      this.cart = this.cartList.find((obj) => obj.id == id);
      console.log("Producto Encontrado");
      return this.cart;
    } else {
      console.log("ID no encontrado");
      return null;
    }
  }
  async addProductToCart(cid, pid) {
    const productsList = await productManager.getAllProducts();
    const cartsList = await this.getAllCarts();
    if (productsList.some((obj) => obj.id == pid)) {
      if (cartsList.some((obj) => obj.id == cid)) {
        const prod = productsList.find((obj) => obj.id == pid);
        const i = cartsList.findIndex((obj) => obj.id == cid);
        if (cartsList[i].products.some((obj) => obj.id == prod.id)) {
          const i2 = cartsList[i].products.findIndex((obj) => obj.id == pid);
          cartsList[i].products[i2].cuantity++;
        } else {
          cartsList[i].products.push({ id: prod.id, cuantity: 1 });
        }
        this.cartList = cartsList;
        await fs.promises.writeFile(
          this.path,
          JSON.stringify({ carts: this.cartList })
        );
      } else {
        console.log("No Existe el ID Carrito");
      }
    } else {
      console.log("No Existe el ID producto");
    }
  }
}

export default CartsManager;
 */

import fs from "node:fs";
import ProductsManager from "../class/productManager.js";
import { __dirname } from "../utils.js";

const productManager = new ProductsManager(__dirname + "/data/products.json");

class CartsManager {
  constructor(path) {
    this.path = path;
    this.cartList = [];
  }

  async getAllCarts() {
    const list = await fs.promises.readFile(this.path, "utf-8");
    this.cartList = JSON.parse(list).carts || [];
    return [...this.cartList];
  }

  async addCart() {
    const newId = await this.getNextCartId();
    const newCart = { id: newId, products: [] };
    this.cartList.push(newCart);
    await this.saveCarts();
    return newId;
  }

  async getCart(id) {
    await this.getAllCarts();
    const cart = this.cartList.find((cart) => cart.id === id);
    if (cart) {
      return cart;
    } else {
      throw new Error("ID no encontrado");
    }
  }

  /* async addProductToCart(cartId, productId) {
    await this.getAllCarts();
    const product = await productManager.getProduct(productId);
    const cart = this.cartList.find((cart) => cart.id === cartId);
    if (cart && product) {
      cart.products.push(productId);
      await this.saveCarts();
    } else {
      throw new Error("No se pudo agregar el producto al carrito");
    }
  } */

  //Se agregan productos al carrito con un id y una cantidad que por el momento es = 1:
  async addProductToCart(cid, pid) {
    //obtener la lista de productos y carritos:
    const productsList = await productManager.getAllProducts();
    const cartsList = await this.getAllCarts();
    //verificamos si el prod y el cart existen buscandolos por su id:
    if (productsList.some((obj) => obj.id == pid)) {
      if (cartsList.some((obj) => obj.id == cid)) {
        const prod = productsList.find((obj) => obj.id == pid);
        const cartIndex = cartsList.findIndex((obj) => obj.id == cid);
        const cart = cartsList[cartIndex];

        // Verificamos si el producto ya está en el carrito
        const productIndex = cart.products.findIndex((p) => p.id === pid);
        if (productIndex !== -1) {
          // Si existe, incrementar la cantidad:
          cart.products[productIndex].quantity++;
        } else {
          // Si no existe, agregar el producto con cantidad 1:
          cart.products.push({ id: pid, quantity: 1 });
        }

        // Actualizar el carrito en this.cartList
        this.cartList[cartIndex] = cart;

        // Guardar los cambios en el archivo
        await this.saveCarts();

        console.log("Producto agregado al carrito");
      } else {
        console.log("No existe el ID del carrito");
      }
    } else {
      console.log("No existe el ID del producto");
    }
  }

  //aqui se generan los id para los carritos
  async getNextCartId() {
    await this.getAllCarts(); //obtiene los carritos existentes
    const maxId = this.cartList.reduce(
      (max, cart) => (cart.id > max ? cart.id : max),
      0
    ); //obtiene el maximo id actual. Si this.cartList esta vacio, "maxId se establece en 0"
    return maxId + 1; //devuelve el sig id disponible
  }

  //Funcion para guardar la lista actualizada de carritos (this.cartList) en el archivo carts.json:
  async saveCarts() {
    try {
      //escribe el archivo en la ruta especificada:
      await fs.promises.writeFile(
        this.path,
        JSON.stringify({ carts: this.cartList })
      );
      console.log("Carritos guardados.");
    } catch (error) {
      console.error("Error al guardar los carritos:", error);
    }
  }
}

export default CartsManager;

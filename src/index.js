import express from "express";
import productsRoute from "./routes/products.router.js";
import cartsRoute from "./routes/carts.router.js";
import { __dirname } from "./utils.js";

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", productsRoute);
app.use("/api/carts", cartsRoute);

//puerto para escuchar el servidor
app.listen(8080, () => {
  console.log("Servidor escuchando en el puerto 8080");
});

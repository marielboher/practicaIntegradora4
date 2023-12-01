import { Router } from "express";
import CartManager from "../dao/cartManager.js";
import cartControllers from "../controllers/cartControllers.js";
import { authorization, passportCall } from "../../utils.js";
import { userModel } from "../models/user.models.js";

const cartsRouter = Router();
const CM = new CartManager();

cartsRouter.post("/", cartControllers.createCart.bind(cartControllers));

cartsRouter.get("/:cid", cartControllers.getCart.bind(cartControllers));

cartsRouter.post(
  "/:cid/products/:pid",
  passportCall("jwt"),
  authorization(["user"]),
  cartControllers.addProductToCart.bind(cartControllers)
);

cartsRouter.put(
  "/:cid/products/:pid",
  cartControllers.updateQuantityProductFromCart.bind(cartControllers)
);

cartsRouter.put("/:cid", cartControllers.updateCart.bind(cartControllers));

cartsRouter.delete(
  "/:cid/products/:pid",
  cartControllers.deleteProductFromCart.bind(cartControllers)
);

cartsRouter.delete(
  "/:cid",
  cartControllers.deleteProductsFromCart.bind(cartControllers)
);

cartsRouter.post(
  "/:cid/purchase",
  (req, res, next) => {
    console.log("Ruta de compra accedida");
    next();
  },
  passportCall("jwt"),
  cartControllers.createPurchaseTicket.bind(cartControllers)
);

cartsRouter.get(
  "/usuario/carrito",
  passportCall("jwt"),
  authorization(["user"]),
  async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await userModel.findById(userId);

      if (!user || !user.cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      return res.json({ id: user.cart });
    } catch (error) {
      console.error("Error obteniendo el carrito del usuario:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

export default cartsRouter;

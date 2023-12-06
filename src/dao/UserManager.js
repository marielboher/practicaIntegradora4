import { userModel } from "../models/user.models.js";
import { createHash, isValidPassword } from "../../utils.js";
import UserDTO from "./dto/user.dto.js";

class UserManager {
  async addUser({
    first_name,
    last_name,
    email,
    age,
    password,
    role,
    cart,
    last_connection,
  }) {
    try {
      console.log("Intentando agregar usuario con email:", email);

      const existingUser = await userModel.findOne({ email });
      console.log("Usuario existente encontrado:", existingUser);

      if (existingUser) {
        console.log("El usuario ya existe, no se puede crear uno nuevo");
        return null;
      }

      const hashedPassword = createHash(password);
      console.log("Creando nuevo usuario con los siguientes datos:", {
        first_name,
        last_name,
        email,
        age,
        role,
        cart,
        last_connection,
      });

      const user = await userModel.create({
        first_name,
        last_name,
        email,
        age,
        password: hashedPassword,
        role,
        cart,
        last_connection: new Date(),
      });

      console.log("Usuario agregado con éxito:", user);
      return user;
    } catch (error) {
      console.error("Error al agregar usuario:", error);
      throw error;
    }
  }
  async login(user, pass) {
    try {
      const userLogged = await userModel.findOne({ email: user });

      if (userLogged && isValidPassword(userLogged, pass)) {
        const role =
          userLogged.email === "adminCoder@coder.com" ? "admin" : "usuario";

        return userLogged;
      }
      return null;
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);
      throw error;
    }
  }

  async restorePassword(email, hashedPassword) {
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        console.log("Usuario no encontrado.");
        return false;
      }

      user.password = hashedPassword;

      await user.save();

      console.log("Contraseña restaurada correctamente.");
      return true;
    } catch (error) {
      console.error("Error restoring password:", error);
      return false;
    }
  }
}

export default UserManager;

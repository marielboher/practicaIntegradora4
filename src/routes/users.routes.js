import { Router } from "express";
import UserController from "../controllers/userController.js";
import uploadConfig from "../config/multer.config.js";

const userController = new UserController();
const usersRouter = Router();

usersRouter.post(
  "/:uid/documents",
  uploadConfig.fields([
    { name: "profiles", maxCount: 1 },
    { name: "products", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  userController.uploadFiles
);

usersRouter.post(
  "/:uid/premium-documents",
  uploadConfig.fields([
    { name: "identificationDocument", maxCount: 1 },
    { name: "domicileProofDocument", maxCount: 1 },
    { name: "accountStatementDocument", maxCount: 1 },
  ]),
  userController.uploadPremiumDocuments
);

usersRouter.post("/premium/:uid", userController.upgradeToPremium);

export default usersRouter;

import express from "express";
import MaterialsController from "../controllers/MaterialsController.js";
import TokenVerifyMiddleware from "../middlewares/TokenVerifyMiddleware.js";

const materialsRoutes = express.Router();

materialsRoutes.all("/materials/:id", TokenVerifyMiddleware, MaterialsController);
materialsRoutes.all("/materials", TokenVerifyMiddleware, MaterialsController);
materialsRoutes.get("/materials/count", TokenVerifyMiddleware, MaterialsController);

export default materialsRoutes;
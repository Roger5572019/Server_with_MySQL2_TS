import { Router } from "express";
import productRoutes from "./products.routes.ts";

const router = Router();
router.use('/v1/products', productRoutes); // /v1/products + products Routes


export default router;
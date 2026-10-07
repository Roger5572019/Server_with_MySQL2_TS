import { Router } from "express";
import { ProductController } from "../controllers/products.controller.ts";

const router = Router();
const productController = new ProductController();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductsByID);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProductById);
router.delete('/:id', productController.deleteProductById);
router.patch('/:id', productController.updatePrice);

export default router;
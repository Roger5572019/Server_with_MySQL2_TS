import  type { Request, Response } from "express";
import pool from "../conf/dbConnection.ts";
import type { ResultSetHeader } from "mysql2";
import type { RowDataPacket } from "mysql2";

export interface ProductBody {
  name: string;
  price: number;
  stock: number;
  description: string;
  brand?: string;
  img?: string;
}

export class ProductController {


  async getProducts(_req:Request, res:Response) {
    
    try {
      const [products] = await pool.execute('SELECT * FROM `products` WHERE `active` = 1');
      res.status(200).json(products);

    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getProductsByID(req:Request, res:Response){
    const id = Number(req.params.id);  
    try {
        const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM `products` WHERE `id` = ? AND `active` = 1', [id]);

        if (rows.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res.status(200).json(rows[0]);

      } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internarl server error" });
      }
    
    } 

  async createProduct(req:Request, res:Response){
      
     const { name, price, stock, description, brand, img } = req.body as ProductBody;
     const sql = 'INSERT INTO `products` (`name`, `price`, `stock`, `description`, `brand`,`img`) VALUES (?, ?, ?, ?, ?,?)';

      //campos obligatorios
      if (!name || !price || stock === undefined || !description) {
        return res.status(400).json({ message: "All fields are required" });
      }

       // price/stock numeros y mayor que cero
      if (typeof price !== 'number' || price <= 0 && typeof stock !== 'number' || stock <= 0) {
        return res.status(400).json({ message: "The price must be a number and greater than 0" });
      }

     try {
      
      await pool.execute(sql, [name, price, stock, description, brand ?? null, img ?? null]);
      return res.status(201).json({message: "Product created succesfully",});

      } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internarl server error" });
      }
   
  }



  async updateProductById(req: Request, res: Response) {
      const id = Number(req.params.id);  
      const { name, price, stock, description, brand } = req.body as ProductBody;
      const sql = 'UPDATE `products` SET `name` = ?, `price` = ?, `stock` = ?, `description` = ?, `brand` = ? WHERE `id` = ? AND `active` = 1';

      if (!Number.isInteger(id) || id <= 0) {
          return res.status(400).json({ message: "Invalid ID" });
      }

      //campos obligatorios
      if (!name || !price || stock === undefined || !description) {
          return res.status(400).json({ message: "All fields are required" });
      }

      // price/stock numeros y mayor que cero
      if (typeof price !== 'number' || price <= 0 && typeof stock !== 'number' || stock <= 0) {
          return res.status(400).json({ message: "The price and stock must be a number and greater than 0" });
      }

      try {

          const [result] = await pool.execute<ResultSetHeader>(sql, [name, price, stock, description, brand ?? null, id]);
          
          if (result.affectedRows === 0) {
              return res.status(404).json({ message: "Product not found" });
          }

          return res.status(200).json({ message: "Product updated successfully" });

      } catch (err) {
          console.log(err);
          return res.status(500).json({ message: "Internarl server error" });
      }
  }
    
    

    async deleteProductById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const sql = 'UPDATE `products` SET `active` = 0 WHERE `id` = ?';

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    try {
        const [result] = await pool.execute<ResultSetHeader>(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ message: "Product deleted successfully" });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}


async updatePrice(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { price } = req.body; 

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ message: "The price must be a number and greater than 0" });
    }

    try {

        const sql = 'UPDATE `products` SET `price` = ? WHERE `id` = ? AND `active` = 1';
        const [result] = await pool.execute<ResultSetHeader>(sql, [price, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ message: "Price updated successfully" });

    } catch (err) {
        console.log(err);
        // Ocultamos detalles sensibles del error
        return res.status(500).json({ message: "Internal server error" });
    }
}
}
import client from '../database';
import { productType } from '../types/product_type';

export class productModel {
  async create(p: productType): Promise<productType | string> {
    try {
      const connection = await client.connect();
      const sql =
        'INSERT INTO products (name, price, category, sub_category, sub_category2, product_description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING * ;';
      const result = await connection.query(sql, [
        p.name,
        p.price,
        p.category,
        p.sub_category,
        p.sub_category2,
        p.product_description,
      ]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      return `could not create a new product ${error}`;
    }
  }

  async index(): Promise<productType[] | string> {
    try {
      const connection = await client.connect();
      const sql = 'SELECT * FROM products ;';
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      return `could not show all products ${error}`;
    }
  }

  async showById(id: String): Promise<productType | string> {
    try {
      const connection = await client.connect();
      const sql = 'SELECT * FROM products WHERE id=$1 ;';
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      return `could not show product by id ${error}`;
    }
  }

  async showByPrice(
    operator: String,
    price: number
  ): Promise<productType[] | string> {
    try {
      const connection = await client.connect();
      const sql = `SELECT * FROM products WHERE price${operator}$1`;
      const result = await connection.query(sql, [price]);
      connection.release();
      return result.rows;
    } catch (error) {
      return `could not show products by price filter ${error}`;
    }
  }

  async showByPriceRange(
    min: Number,
    max: Number
  ): Promise<productType[] | string> {
    try {
      const connection = await client.connect();
      const sql = 'SELECT * FROM products WHERE price BETWEEN $1 AND $2 ;';
      const result = await connection.query(sql, [min, max]);
      connection.release();
      return result.rows;
    } catch (error) {
      return `could not show products by price range ${error}`;
    }
  }

  async showByKeyword(Keyword: String): Promise<productType[] | string> {
    try {
      const connection = await client.connect();
      const sql = `SELECT * FROM products WHERE name LIKE '%${Keyword}%' ;`;
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      return `could not show products by keyword ${error}`;
    }
  }

  async showByCategory(category: String): Promise<productType[] | string> {
    try {
      const connection = await client.connect();
      const sql = 'SELECT * FROM products WHERE category=$1 ;';
      const result = await connection.query(sql, [category]);
      connection.release();
      return result.rows;
    } catch (error) {
      return `could not show products by category ${error}`;
    }
  }

  async showByCategory2(
    category: String,
    sub_category: String
  ): Promise<productType[] | string> {
    try {
      const connection = await client.connect();
      const sql =
        'SELECT * FROM products WHERE category=$1 AND sub_category=$2 ;';
      const result = await connection.query(sql, [category, sub_category]);
      connection.release();
      return result.rows;
    } catch (error) {
      return `could not show products by category and sub category ${error}`;
    }
  }

  async showByCategory3(
    category: String,
    sub_category: String,
    sub_category2: String
  ): Promise<productType[] | string> {
    try {
      const connection = await client.connect();
      const sql =
        'SELECT * FROM products WHERE category=$1 AND sub_category=$2 AND sub_category2=$3 ;';
      const result = await connection.query(sql, [
        category,
        sub_category,
        sub_category2,
      ]);
      connection.release();
      return result.rows;
    } catch (error) {
      return `could not show products by category and sub category and extra sub category ${error}`;
    }
  }

  async update(id: String, p: productType): Promise<productType | string> {
    try {
      const connection = await client.connect();
      const sql =
        'UPDATE products SET name=$1, price=$2, category=$3, sub_category=$4, sub_category2=$5, product_description=$6 WHERE id=$7 RETURNING *;';
      const result = await connection.query(sql, [
        p.name,
        p.price,
        p.category,
        p.sub_category,
        p.sub_category2,
        p.product_description,
        id,
      ]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      return `could not update product ${error}`;
    }
  }

  async delete(id: String): Promise<productType | string> {
    try {
      const connection = await client.connect();
      const sql = 'DELETE FROM products WHERE id=$1 ;';
      const result = await connection.query(sql, [id]);
      connection.release();
      const confirmation: string = 'removed successfully';
      return confirmation;
    } catch (error) {
      return `could not delete a new product ${error}`;
    }
  }
}
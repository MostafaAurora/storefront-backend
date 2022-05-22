import client from '../database';
import { orderType } from '../types/order_type';

export class orderProductsModel {
  async addProduct(
    quantity: number,
    order_id: string,
    product_id: string
  ): Promise<orderType | string> {
    try {
      const sql =
        'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
      const conn = await client.connect();
      const result = await conn.query(sql, [quantity, order_id, product_id]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (error) {
      throw new Error(
        `Could not add product ${[product_id]} to order ${order_id}: ${error}`
      );
    }
  }

  async deleteProduct(order_id: string, product_id: string): Promise<string> {
    try {
      const sql =
        'DELETE FROM order_products WHERE order_id=$1 AND product_id=$2 ;';
      const connection = await client.connect();
      const result = await connection.query(sql, [order_id, product_id]);
      return 'deleted product from order successfully';
    } catch (error) {
      return `could not delete product: ${error}`;
    }
  }
}
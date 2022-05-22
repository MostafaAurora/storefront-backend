import client from '../database';
import { orderType } from '../types/order_type';

export class orderModel {
  async create(user_id: string): Promise<orderType | string> {
    try {
      const connection = await client.connect();
      const sql =
        'INSERT INTO orders (status, user_id) VALUES ($1, $2) RETURNING * ;';
      const result = await connection.query(sql, ['open', user_id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      return `could not create a new order ${error}`;
    }
  }

  async index(): Promise<orderType[] | string> {
    try {
      const connection = await client.connect();
      const sql = 'SELECT * FROM orders ;';
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      return `could not show all ${error}`;
    }
  }

  async showByOrderId(id: string): Promise<orderType | string> {
    try {
      const connection = await client.connect();
      const sql = 'SELECT * FROM orders WHERE id=$1 ;';
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      return `could not show order by order id ${error}`;
    }
  }

  async showByUserId(id: string): Promise<orderType[] | string> {
    try {
      const connection = await client.connect();
      const sql = 'SELECT * FROM orders WHERE user_id=$1 ;';
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows;
    } catch (error) {
      return `could not show orders by user id ${error}`;
    }
  }

  async update(id: string, status: string): Promise<orderType | string> {
    try {
      const connection = await client.connect();
      const sql = 'UPDATE orders SET status=$1 WHERE id=$2  RETURNING * ;';
      const result = await connection.query(sql, [status, id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      return `could not update order status, error: ${error}`;
    }
  }

  async deleteByOrderId(id: String): Promise<string> {
    try {
      const connection = await client.connect();
      const sql = 'DELETE FROM orders WHERE id=$1 ;';
      const result = await connection.query(sql, [id]);
      connection.release();
      const confirmation = 'removed the order successfully';
      return confirmation;
    } catch (error) {
      return `could not delete order by oder id, error: ${error}`;
    }
  }

  async deleteByUserId(id: String): Promise<string> {
    try {
      const connection = await client.connect();
      const sql = 'DELETE FROM orders WHERE user_id=$1 ;';
      const result = await connection.query(sql, [id]);
      connection.release();
      const confirmation = 'removed the orders of the user successfully';
      return confirmation;
    } catch (error) {
      return `could not delete the orders of the user, error: ${error}`;
    }
  }
}
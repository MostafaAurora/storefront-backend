import client from '../database';
import bcrypt from 'bcrypt';
import { UserType } from '../types/user_type';
import dotenv from 'dotenv';
import { authType } from '../types/auth_type';

dotenv.config();
const pepper: string = process.env.BCRYPT_PASSWORD as string;
const salt_rounds: string = process.env.SALT_ROUNDS as string;

export class UserModel {
  async authenticate(
    email: string,
    password: string
  ): Promise<string | void | boolean | authType> {
    try {
      const conn = await client.connect();
      const sql = 'SELECT id, password, role FROM users WHERE email=$1';
      const result = await conn.query(sql, [email]);
      const hash = bcrypt.hashSync(password + pepper, parseInt(salt_rounds));
      //console.log(hash)//, use it if you want to create your own user using database migrations
      // try to authenticate using the password you want to use and log it after hashing then put the hash as a password in db migrations

      if (result.rows.length > 0) {
        const user: authType = result.rows[0];
        if (bcrypt.compareSync(password + pepper, user.password)) {
          return user;
        }
      } else {
        return false;
      }
    } catch (error) {
      return `cannot  get user ${error}`;
    }
  }

  async create(u: UserType): Promise<UserType | string> {
    try {
      const hash = bcrypt.hashSync(u.password + pepper, parseInt(salt_rounds));
      const connection = await client.connect();
      const sql =
        'INSERT INTO users (first_name, last_name, email, password, role, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING * ;';
      const result = await connection.query(sql, [
        u.first_name,
        u.last_name,
        u.email,
        hash,
        u.role,
        u.phone_number,
      ]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      return `could not create new user, error: ${error}`;
    }
  }

  async index(): Promise<UserType[] | string> {
    try {
      const connection = await client.connect();
      const sql = 'SELECT * FROM users ;';
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      return `could not show all, error: ${error}`;
    }
  }

  async showById(id: String): Promise<UserType | string> {
    try {
      const connection = await client.connect();
      const sql = 'SELECT * FROM users WHERE id=$1 ;';
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      return `could not show by id, error: ${error}`;
    }
  }

  async showByPhoneNumber(number: String): Promise<UserType | string> {
    try {
      const connection = await client.connect();
      const sql = 'SELECT * FROM users WHERE phone_number=$1 ;';
      const result = await connection.query(sql, [number]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      return `could not show by phone number, error: ${error}`;
    }
  }

  async showByEmail(email: String): Promise<UserType | string> {
    try {
      const connection = await client.connect();
      const sql = 'SELECT * FROM users WHERE email=$1 ;';
      const result = await connection.query(sql, [email]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      return `could not show by email, error: ${error}`;
    }
  }

  async update(id: string, u: UserType): Promise<UserType | string> {
    try {
      const connection = await client.connect();
      const sql =
        'UPDATE users SET first_name=$1, last_name=$2, email=$3, password=$4, role=$5, phone_number=$6 WHERE id=$7  RETURNING * ;';
      const result = await connection.query(sql, [
        u.first_name,
        u.last_name,
        u.email,
        u.password,
        u.role,
        u.phone_number,
        id,
      ]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      return `could not update, error: ${error}`;
    }
  }

  async delete(id: String): Promise<UserType | string> {
    try {
      const connection = await client.connect();
      const sql = 'DELETE FROM users WHERE id=($1) ;';
      const result = await connection.query(sql, [id]);
      const confirmation = 'removed successfully';
      connection.release();
      return confirmation;
    } catch (error) {
      return `could not delete, error: ${error}`;
    }
  }
}
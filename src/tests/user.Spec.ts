import client from '../database';
import { UserModel } from '../models/user_model';

const store = new UserModel();

describe('user model', () => {
  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show by id method', () => {
    expect(store.showById).toBeDefined();
  });

  it('should have a show by email method', () => {
    expect(store.showByEmail).toBeDefined();
  });

  it('should have a show by phone number method', () => {
    expect(store.showByPhoneNumber).toBeDefined();
  });

  it('should have an update method', () => {
    expect(store.update).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(store.delete).toBeDefined();
  });

  it('create method should create a new user', async () => {
    const result = await store.create({
      first_name: 'Adam',
      last_name: 'Ahmed',
      email: 'adam_ahmed@mail.com',
      password: 'testpass',
      role: 'customer',
      phone_number: '123456789',
    });
    expect(result).toBeDefined();
  });

  it('index method should return a list of users', async () => {
    const result = await store.index();
    expect(result.length).toEqual(4);
  });

  it('show by id method should return the correct user', async () => {
    const result = await store.showById('1');
    expect(result).toEqual({
      id: 1,
      first_name: 'adam',
      last_name: 'smith',
      email: 'adam_smith1123@testmail.com',
      password: '$2b$10$3g3DtZiVdwDrR0JeYXtgh.Y5ZdWplp8vO7EYa5DWG2BR3x2ZQmUoC',
      role: 'admin',
      phone_number: '01234556789',
    });
  });

  it('show by email method should return the correct user', async () => {
    const result = await store.showByEmail('adam_smith1123@testmail.com');
    expect(result).toEqual({
      id: 1,
      first_name: 'adam',
      last_name: 'smith',
      email: 'adam_smith1123@testmail.com',
      password: '$2b$10$3g3DtZiVdwDrR0JeYXtgh.Y5ZdWplp8vO7EYa5DWG2BR3x2ZQmUoC',
      role: 'admin',
      phone_number: '01234556789',
    });
  });

  it('show by phone number method should return the correct user', async () => {
    const result = await store.showByPhoneNumber('01234556789');
    expect(result).toEqual({
      id: 1,
      first_name: 'adam',
      last_name: 'smith',
      email: 'adam_smith1123@testmail.com',
      password: '$2b$10$3g3DtZiVdwDrR0JeYXtgh.Y5ZdWplp8vO7EYa5DWG2BR3x2ZQmUoC',
      role: 'admin',
      phone_number: '01234556789',
    });
  });

  it('update method should update successfully', async () => {
    const result = await store.update('2', {
      first_name: 'samir',
      last_name: 'ahmed',
      email: 'samir_ahmed1123@testmail.com',
      password: '$2b$10$igqZXKdgco7tDtiBWRw81uixVMoAaUB1xJ.DJ7wE21dWsMSgQ6xK2',
      role: 'admin',
      phone_number: '01234546789',
    });
    expect(result).toEqual({
      id: 2,
      first_name: 'samir',
      last_name: 'ahmed',
      email: 'samir_ahmed1123@testmail.com',
      password: '$2b$10$igqZXKdgco7tDtiBWRw81uixVMoAaUB1xJ.DJ7wE21dWsMSgQ6xK2',
      role: 'admin',
      phone_number: '01234546789',
    });
  });

  it('delete method should remove the correct user successfully', async () => {
    const confirm = await store.delete('3');
    const result = await store.index();

    expect(confirm).toEqual('removed successfully');
    expect(result.length).toEqual(4);
  });
});

// commented as an alternative method of testing when not using pre created users, require changes
/*afterAll(async () => {
  try {
    const connection = await client.connect()
  const sql = 'DELETE FROM users ;\n ALTER SEQUENCE users_id_seq RESTART WITH 1;'
  await connection.query(sql)
  console.log('delete all success')
  connection.release()
  } catch (error) {
    throw new Error(` could not delete all after ${error}`)
  }
})*/
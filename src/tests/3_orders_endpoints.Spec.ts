import supertest from 'supertest';
import app from '../server';

const request = supertest(app);

describe('test app endpoints responses', () => {
  it('creates a new order successfully', async () => {
    const data_auth = {
      email: 'adam_smith1123@testmail.com',
      password: 'testpass',
    };
    const data_create = {
      user_id: '1',
    };
    const auth_response = await request
      .post('/users')
      .set('Content-type', 'application/json')
      .send(data_auth);
    expect(auth_response.status).toBe(200);

    const auth_token = auth_response.text;

    const create_response = await request
      .post('/orders')
      .set('Content-type', 'application/json')
      .set('Authorization', `bearer ${auth_token}`)
      .send(data_create);
    expect(create_response.status).toBe(200);
  });

  it('creates a new order successfully', async () => {
    const data_auth = {
      email: 'adam_smith1123@testmail.com',
      password: 'testpass',
    };
    const data_create = {
      user_id: '1',
    };
    const auth_response = await request
      .post('/users')
      .set('Content-type', 'application/json')
      .send(data_auth);
    expect(auth_response.status).toBe(200);

    const auth_token = auth_response.text;

    const create_response = await request
      .post('/orders')
      .set('Content-type', 'application/json')
      .set('Authorization', `bearer ${auth_token}`)
      .send(data_create);
    expect(create_response.status).toBe(200);
  });

  it('gets all orders for admins', async () => {
    const data_auth = {
      email: 'adam_smith1123@testmail.com',
      password: 'testpass',
    };

    const auth_response = await request
      .post('/users')
      .set('Content-type', 'application/json')
      .send(data_auth);
    expect(auth_response.status).toBe(200);

    const auth_token = auth_response.text;

    const create_response = await request
      .get('/orders')
      .set('Content-type', 'application/json')
      .set('Authorization', `bearer ${auth_token}`);
    expect(create_response.status).toBe(200);
  });

  it('gets orders by user id for admins or the users that made the order', async () => {
    const data_auth = {
      email: 'adam_smith1123@testmail.com',
      password: 'testpass',
    };
    const auth_response = await request
      .post('/users')
      .set('Content-type', 'application/json')
      .send(data_auth);
    expect(auth_response.status).toBe(200);

    const auth_token = auth_response.text;

    const create_response = await request
      .get('/orders/user_id?user_id=1')
      .set('Content-type', 'application/json')
      .set('Authorization', `bearer ${auth_token}`);
    expect(create_response.status).toBe(200);
  });

  it('gets orders by order id for authorized users', async () => {
    const data_auth = {
      email: 'adam_smith1123@testmail.com',
      password: 'testpass',
    };
    const auth_response = await request
      .post('/users')
      .set('Content-type', 'application/json')
      .send(data_auth);
    expect(auth_response.status).toBe(200);

    const auth_token = auth_response.text;

    const create_response = await request
      .get('/orders/order_id?order_id=2')
      .set('Content-type', 'application/json')
      .set('Authorization', `bearer ${auth_token}`);

    expect(create_response.status).toBe(200);
  });

  it('updates the status of orders by authorized users', async () => {
    const data_auth = {
      email: 'adam_smith1123@testmail.com',
      password: 'testpass',
    };
    const data_create = {
      order_id: '2',
      status: 'closed',
    };
    const auth_response = await request
      .post('/users')
      .set('Content-type', 'application/json')
      .send(data_auth);
    expect(auth_response.status).toBe(200);

    const auth_token = auth_response.text;

    const create_response = await request
      .put('/orders')
      .set('Content-type', 'application/json')
      .set('Authorization', `bearer ${auth_token}`)
      .send(data_create);
    expect(create_response.status).toBe(200);
  });

  it('deletes orders by user id for users who made the order', async () => {
    const data_auth = {
      email: 'adam_smith1123@testmail.com',
      password: 'testpass',
    };
    const data_create = {
      order_id: '2',
    };
    const auth_response = await request
      .post('/users')
      .set('Content-type', 'application/json')
      .send(data_auth);
    expect(auth_response.status).toBe(200);

    const auth_token = auth_response.text;

    const create_response = await request
      .delete('/orders/order_id')
      .set('Content-type', 'application/json')
      .set('Authorization', `bearer ${auth_token}`)
      .send(data_create);
    expect(create_response.status).toBe(200);
  });

  it('deletes orders by user id for users who made the order', async () => {
    const data_auth = {
      email: 'adam_smith1123@testmail.com',
      password: 'testpass',
    };
    const data_create = {
      user_id: '1',
    };
    const auth_response = await request
      .post('/users')
      .set('Content-type', 'application/json')
      .send(data_auth);
    expect(auth_response.status).toBe(200);

    const auth_token = auth_response.text;

    const create_response = await request
      .delete('/orders/user_id')
      .set('Content-type', 'application/json')
      .set('Authorization', `bearer ${auth_token}`)
      .send(data_create);
    expect(create_response.status).toBe(200);
  });
});
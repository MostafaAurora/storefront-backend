import supertest from 'supertest';
import app from '../server';

const request = supertest(app);

describe('test app endpoints responses', () => {
  it('creates a new customer user successfully', async () => {
    const data = {
      first_name: 'Adam',
      last_name: 'Ahmed',
      email: 'adam_ahmed133@mail.com',
      password: 'testpass5',
      role: 'customer',
      phone_number: '12345567389',
    };
    const response = await request
      .post('/users/new')
      .set('Content-type', 'application/json')
      .send(data);
    expect(response.status).toBe(200);
  });

  it('gets blocked from creating an admin user without being an admin', async () => {
    const data_auth = {
      email: 'adam_ahmed133@mail.com',
      password: 'testpass5',
    };
    const data_create = {
      first_name: 'Adam',
      last_name: 'Ahmed',
      email: 'adam_ahmed1332@mail.com',
      password: 'testpass5',
      role: 'admin',
      phone_number: '12344567389',
    };
    const auth_response = await request
      .post('/users')
      .set('Content-type', 'application/json')
      .send(data_auth);
    expect(auth_response.status).toBe(200);

    const auth_token = auth_response.text;

    const create_response = await request
      .post('/users/new')
      .set('Content-type', 'application/json')
      .set('Authorization', `bearer ${auth_token}`)
      .send(data_create);
    expect(create_response.status).toBe(403);
    expect(create_response.text).toBe('user does not have clearance');
  });

  it('creates a new admin user by an admin successfully', async () => {
    const data_auth = {
      email: 'adam_smith1123@testmail.com',
      password: 'testpass',
    };
    const data_create = {
      first_name: 'Adam',
      last_name: 'Ahmed',
      email: 'adam_ahmed133322@mail.com',
      password: 'testpass5',
      role: 'admin',
      phone_number: '123445677789',
    };
    const auth_response = await request
      .post('/users')
      .set('Content-type', 'application/json')
      .send(data_auth);
    expect(auth_response.status).toBe(200);

    const auth_token = auth_response.text;

    const create_response = await request
      .post('/users/new')
      .set('Content-type', 'application/json')
      .set('Authorization', `bearer ${auth_token}`)
      .send(data_create);
    expect(create_response.status).toBe(200);
  });

  it('gets all users for admins only', async () => {
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

    const get_response = await request
      .get('/users')
      .set('Content-type', 'application/json')
      .set('Authorization', `bearer ${auth_token}`);
    expect(get_response.status).toBe(200);
  });

  it('gets a user by id for admins only', async () => {
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

    const get_response = await request
      .get('/users/id?id=3')
      .set('Content-type', 'application/json')
      .set('Authorization', `bearer ${auth_token}`);
    expect(get_response.status).toBe(200);
  });

  it('gets a user by id for admins only', async () => {
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

    const get_response = await request
      .get('/users/email?email=adam_ahmed133322@mail.com')
      .set('Content-type', 'application/json')
      .set('Authorization', `bearer ${auth_token}`);
    expect(get_response.status).toBe(200);
  });

  it('gets a user by phone number for admins only', async () => {
    const data_auth = {
      email: 'adam_smith1123@testmail.com',
      password: 'testpass',
    };

    const phone_number = { phone_number: '01234546789' };

    const auth_response = await request
      .post('/users')
      .set('Content-type', 'application/json')
      .send(data_auth);
    expect(auth_response.status).toBe(200);

    const auth_token = auth_response.text;

    const get_response = await request
      .post('/users/byNumber')
      .set('Content-type', 'application/json')
      .set('Authorization', `bearer ${auth_token}`)
      .send(phone_number);
    expect(get_response.status).toBe(200);
  });

  it('updates a user account if the request was sent by that specific user', async () => {
    const data_auth = {
      email: 'adam_ahmed133322@mail.com',
      password: 'testpass5',
    };

    const update_data = {
      id: '4',
      first_name: 'Adam',
      last_name: 'Ahmed',
      email: 'adam_ahmed133322@mail.com',
      password: 'testpass5',
      role: 'customer',
      phone_number: '12346678789',
    };

    const auth_response = await request
      .post('/users')
      .set('Content-type', 'application/json')
      .send(data_auth);
    expect(auth_response.status).toBe(200);

    const auth_token = auth_response.text;

    const get_response = await request
      .put('/users')
      .set('Content-type', 'application/json')
      .set('Authorization', `bearer ${auth_token}`)
      .send(update_data);
    expect(get_response.status).toBe(200);
  });

  it('removes a user account if the request was sent by that specific user', async () => {
    const data_auth = {
      email: 'adam_ahmed133@mail.com',
      password: 'testpass5',
    };

    const delete_data = { id: '3' };

    const auth_response = await request
      .post('/users')
      .set('Content-type', 'application/json')
      .send(data_auth);
    expect(auth_response.status).toBe(200);

    const auth_token = auth_response.text;

    const get_response = await request
      .delete('/users/delete')
      .set('Content-type', 'application/json')
      .set('Authorization', `bearer ${auth_token}`)
      .send(delete_data);
    expect(get_response.status).toBe(204);
  });
});
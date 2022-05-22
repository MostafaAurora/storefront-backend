import supertest from 'supertest';
import app from '../server';

const request = supertest(app);

describe('test app endpoints responses', () => {
  it('gets all products', async () => {
    const response = await request
      .get('/products')
      .set('Content-type', 'application/json');
    expect(response.status).toBe(200);
  });

  it('gets a product bt id', async () => {
    const response = await request
      .get('/products/id?id=1')
      .set('Content-type', 'application/json');
    expect(response.status).toBe(200);
  });

  it('gets products by price filter', async () => {
    const response = await request
      .get('/products/price?price=1000&operator=<')
      .set('Content-type', 'application/json');
    expect(response.status).toBe(200);
  });

  it('gets products by price range', async () => {
    const response = await request
      .get('/products/priceRange?min=500&max=1200')
      .set('Content-type', 'application/json');
    expect(response.status).toBe(200);
  });

  it('gets products by keyword', async () => {
    const response = await request
      .get('/products/keyword?keyword=test')
      .set('Content-type', 'application/json');
    expect(response.status).toBe(200);
  });

  it('gets products by category', async () => {
    const response = await request
      .get('/products/category?category=category1')
      .set('Content-type', 'application/json');
    expect(response.status).toBe(200);
  });

  it('creates a new product by authorized users successfully', async () => {
    const data_auth = {
      email: 'adam_smith1123@testmail.com',
      password: 'testpass',
    };
    const data_create = {
      name: 'test_product_endpoint',
      price: 500,
      category: 'category1',
      sub_category: 'sub_category1',
      sub_category2: 'extra_sub_category1',
      product_description: 'test_description',
    };
    const auth_response = await request
      .post('/users')
      .set('Content-type', 'application/json')
      .send(data_auth);
    expect(auth_response.status).toBe(200);

    const auth_token = auth_response.text;

    const create_response = await request
      .post('/products')
      .set('Content-type', 'application/json')
      .set('Authorization', `bearer ${auth_token}`)
      .send(data_create);
    expect(create_response.status).toBe(200);
  });

  it('updates a product by authorized users successfully', async () => {
    const data_auth = {
      email: 'adam_smith1123@testmail.com',
      password: 'testpass',
    };
    const data_update = {
      id: '12',
      name: 'test_product_endpoint',
      price: 700,
      category: 'category1',
      sub_category: 'sub_category1',
      sub_category2: 'extra_sub_category1',
      product_description: 'test_description',
    };
    const auth_response = await request
      .post('/users')
      .set('Content-type', 'application/json')
      .send(data_auth);
    expect(auth_response.status).toBe(200);

    const auth_token = auth_response.text;

    const update_response = await request
      .put('/products')
      .set('Content-type', 'application/json')
      .set('Authorization', `bearer ${auth_token}`)
      .send(data_update);
    expect(update_response.status).toBe(200);
  });

  it('deletes a product by authorized users successfully', async () => {
    const data_auth = {
      email: 'adam_smith1123@testmail.com',
      password: 'testpass',
    };
    const data = {
      id: '12',
    };
    const auth_response = await request
      .post('/users')
      .set('Content-type', 'application/json')
      .send(data_auth);
    expect(auth_response.status).toBe(200);

    const auth_token = auth_response.text;

    const update_response = await request
      .delete('/products')
      .set('Content-type', 'application/json')
      .set('Authorization', `bearer ${auth_token}`)
      .send(data);
    expect(update_response.status).toBe(200);
  });
});
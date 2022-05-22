import { orderModel } from '../models/order_model';

const store = new orderModel();

describe('order model', () => {
  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show by order id method', () => {
    expect(store.showByOrderId).toBeDefined();
  });

  it('should have a show by user id method', () => {
    expect(store.showByUserId).toBeDefined();
  });

  it('should have an update method', () => {
    expect(store.update).toBeDefined();
  });

  it('should have a delete by order id method', () => {
    expect(store.deleteByOrderId).toBeDefined();
  });

  it('should have a delete by user id method', () => {
    expect(store.deleteByUserId).toBeDefined();
  });

  it('create method should create a new order', async () => {
    const result = await store.create('2');
    expect(result).toEqual({
      id: 4,
      status: 'open',
      user_id: '2',
    });
  });

  it('index method should return a list of orders', async () => {
    const result = await store.index();
    expect(result).toEqual([
      {
        id: 1,
        status: 'open',
        user_id: '2',
      },
      {
        id: 4,
        status: 'open',
        user_id: '2',
      },
    ]);
  });

  it('show by order id should return the correct order', async () => {
    const result = await store.showByOrderId('4');
    expect(result).toEqual({
      id: 4,
      status: 'open',
      user_id: '2',
    });
  });

  it('show by user id should return a list of orders', async () => {
    const result = await store.showByUserId('2');

    expect(result).toEqual([
      {
        id: 1,
        status: 'open',
        user_id: '2',
      },
      {
        id: 4,
        status: 'open',
        user_id: '2',
      },
    ]);
  });

  it('update method should update the correct order successfully', async () => {
    const result = await store.update('4', 'closed');
    expect(result).toEqual({
      id: 4,
      status: 'closed',
      user_id: '2',
    });
  });

  it('delete by order id should delete the correct order successfully', async () => {
    const result = await store.deleteByOrderId('2');
    expect(result).toEqual('removed the order successfully');
  });

  it('delete by user id method should delete orders that are assigned to the provided user id', async () => {
    const result = await store.deleteByUserId('2');
    expect(result).toEqual('removed the orders of the user successfully');
  });
});
import { orderProductsModel } from '../models/order_products_model';
import { orderModel } from '../models/order_model';
import { productModel } from '../models/product_model';

const store = new orderProductsModel();
const orderStore = new orderModel();
const productStore = new productModel();

beforeAll(async () => {
  await orderStore.create('2');
  await productStore.create({
    name: 'test_product',
    price: 500,
    category: 'category1',
    sub_category: 'sub_category2',
    sub_category2: 'extra_sub_category3',
    product_description: 'test_description',
  });
});

describe('order model', () => {
  it('should have an add product method', () => {
    expect(store.addProduct).toBeDefined();
  });

  it('add product method should link products and orders successfully, should be defined', async () => {
    const result = await store.addProduct(2, '1', '1');
    expect(result).toBeDefined();
  });

  it('delete product method should link products and orders successfully, should be defined', async () => {
    const result = await store.deleteProduct('1', '1');
    expect(result).toEqual('deleted product from order successfully');
  });
});
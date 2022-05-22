import client from '../database';
import { productModel } from '../models/product_model';

const store = new productModel();

describe('product model', () => {
  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show by id method', () => {
    expect(store.showById).toBeDefined();
  });

  it('should have a show by keyword method', () => {
    expect(store.showByKeyword).toBeDefined();
  });

  it('should have a show by price method', () => {
    expect(store.showByPrice).toBeDefined();
  });

  it('should have a show by price range method', () => {
    expect(store.showByPriceRange).toBeDefined();
  });

  it('should have a show by category method', () => {
    expect(store.showByCategory).toBeDefined();
  });

  it('should have a show by category2 method', () => {
    expect(store.showByCategory2).toBeDefined();
  });

  it('should have a show by category3 method', () => {
    expect(store.showByCategory3).toBeDefined();
  });

  it('should have an update method', () => {
    expect(store.update).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(store.delete).toBeDefined();
  });

  it('create method should create a new product', async () => {
    const result = await store.create({
      name: 'test_product',
      price: 500,
      category: 'category1',
      sub_category: 'sub_category2',
      sub_category2: 'extra_sub_category3',
      product_description: 'test_description',
    });
    expect(result).toEqual({
      id: 13,
      name: 'test_product',
      price: '500',
      category: 'category1',
      sub_category: 'sub_category2',
      sub_category2: 'extra_sub_category3',
      product_description: 'test_description',
    });
  });

  it('index method should return a list of products', async () => {
    const result = await store.index();
    expect(result).toEqual([
      {
        id: 1,
        name: 'test_product1',
        price: '500',
        category: 'category1',
        sub_category: 'sub_category2',
        sub_category2: 'extra_sub_category3',
        product_description: 'cherry_test_description',
      },
      {
        id: 2,
        name: 'test_product2',
        price: '1000',
        category: 'category1',
        sub_category: 'sub_category2',
        sub_category2: 'extra_sub_category2',
        product_description: 'flower_test_description',
      },
      {
        id: 3,
        name: 'test_product3',
        price: '700',
        category: 'category2',
        sub_category: 'sub_category2',
        sub_category2: 'extra_sub_category3',
        product_description: 'flower2_test_description',
      },
      {
        id: 4,
        name: 'test_product4',
        price: '1500',
        category: 'category1',
        sub_category: 'sub_category1',
        sub_category2: 'extra_sub_category5',
        product_description: 'sauce_test_description',
      },
      {
        id: 5,
        name: 'test_product5',
        price: '500',
        category: 'category3',
        sub_category: 'sub_category2',
        sub_category2: 'extra_sub_category4',
        product_description: 'juice_test_description',
      },
      {
        id: 6,
        name: 'test_product6',
        price: '600',
        category: 'category4',
        sub_category: 'sub_category3',
        sub_category2: 'extra_sub_category1',
        product_description: 'juice2_test_description',
      },
      {
        id: 7,
        name: 'test_product7',
        price: '300',
        category: 'category5',
        sub_category: 'sub_category2',
        sub_category2: 'extra_sub_category2',
        product_description: 'juice3_test_description',
      },
      {
        id: 8,
        name: 'test_product8',
        price: '1000',
        category: 'category5',
        sub_category: 'sub_category5',
        sub_category2: 'extra_sub_category1',
        product_description: 'sauce2_test_description',
      },
      {
        id: 9,
        name: 'test_product9',
        price: '550',
        category: 'category1',
        sub_category: 'sub_category4',
        sub_category2: 'extra_sub_category3',
        product_description: 'sweets_test_description',
      },
      {
        id: 10,
        name: 'test_product10',
        price: '550',
        category: 'category1',
        sub_category: 'sub_category3',
        sub_category2: 'extra_sub_category1',
        product_description: 'sweets2_test_description',
      },
      {
        id: 11,
        name: 'test_product',
        price: '500',
        category: 'category1',
        sub_category: 'sub_category2',
        sub_category2: 'extra_sub_category3',
        product_description: 'test_description',
      },
      {
        id: 13,
        name: 'test_product',
        price: '500',
        category: 'category1',
        sub_category: 'sub_category2',
        sub_category2: 'extra_sub_category3',
        product_description: 'test_description',
      },
    ]);
  });

  it('show by category method should return a list of products', async () => {
    const result = await store.showByCategory('category3');
    expect(result).toEqual([
      {
        id: 5,
        name: 'test_product5',
        price: '500',
        category: 'category3',
        sub_category: 'sub_category2',
        sub_category2: 'extra_sub_category4',
        product_description: 'juice_test_description',
      },
    ]);
  });

  it('show by category2 method should return a list of products', async () => {
    const result = await store.showByCategory2('category5', 'sub_category2');
    expect(result).toEqual([
      {
        id: 7,
        name: 'test_product7',
        price: '300',
        category: 'category5',
        sub_category: 'sub_category2',
        sub_category2: 'extra_sub_category2',
        product_description: 'juice3_test_description',
      },
    ]);
  });

  it('show by category3 method should return a list of products', async () => {
    const result = await store.showByCategory3(
      'category1',
      'sub_category2',
      'extra_sub_category2'
    );
    expect(result).toEqual([
      {
        id: 2,
        name: 'test_product2',
        price: '1000',
        category: 'category1',
        sub_category: 'sub_category2',
        sub_category2: 'extra_sub_category2',
        product_description: 'flower_test_description',
      },
    ]);
  });

  it('show by keyword method should return a list of products', async () => {
    const result = await store.showByKeyword('test');
    expect(result).toEqual([
      {
        id: 1,
        name: 'test_product1',
        price: '500',
        category: 'category1',
        sub_category: 'sub_category2',
        sub_category2: 'extra_sub_category3',
        product_description: 'cherry_test_description',
      },
      {
        id: 2,
        name: 'test_product2',
        price: '1000',
        category: 'category1',
        sub_category: 'sub_category2',
        sub_category2: 'extra_sub_category2',
        product_description: 'flower_test_description',
      },
      {
        id: 3,
        name: 'test_product3',
        price: '700',
        category: 'category2',
        sub_category: 'sub_category2',
        sub_category2: 'extra_sub_category3',
        product_description: 'flower2_test_description',
      },
      {
        id: 4,
        name: 'test_product4',
        price: '1500',
        category: 'category1',
        sub_category: 'sub_category1',
        sub_category2: 'extra_sub_category5',
        product_description: 'sauce_test_description',
      },
      {
        id: 5,
        name: 'test_product5',
        price: '500',
        category: 'category3',
        sub_category: 'sub_category2',
        sub_category2: 'extra_sub_category4',
        product_description: 'juice_test_description',
      },
      {
        id: 6,
        name: 'test_product6',
        price: '600',
        category: 'category4',
        sub_category: 'sub_category3',
        sub_category2: 'extra_sub_category1',
        product_description: 'juice2_test_description',
      },
      {
        id: 7,
        name: 'test_product7',
        price: '300',
        category: 'category5',
        sub_category: 'sub_category2',
        sub_category2: 'extra_sub_category2',
        product_description: 'juice3_test_description',
      },
      {
        id: 8,
        name: 'test_product8',
        price: '1000',
        category: 'category5',
        sub_category: 'sub_category5',
        sub_category2: 'extra_sub_category1',
        product_description: 'sauce2_test_description',
      },
      {
        id: 9,
        name: 'test_product9',
        price: '550',
        category: 'category1',
        sub_category: 'sub_category4',
        sub_category2: 'extra_sub_category3',
        product_description: 'sweets_test_description',
      },
      {
        id: 10,
        name: 'test_product10',
        price: '550',
        category: 'category1',
        sub_category: 'sub_category3',
        sub_category2: 'extra_sub_category1',
        product_description: 'sweets2_test_description',
      },
      {
        id: 11,
        name: 'test_product',
        price: '500',
        category: 'category1',
        sub_category: 'sub_category2',
        sub_category2: 'extra_sub_category3',
        product_description: 'test_description',
      },
      {
        id: 13,
        name: 'test_product',
        price: '500',
        category: 'category1',
        sub_category: 'sub_category2',
        sub_category2: 'extra_sub_category3',
        product_description: 'test_description',
      },
    ]);
  });

  it('show by price method should return a list of products', async () => {
    const result = await store.showByPrice('>', 1200);
    expect(result).toEqual([
      {
        id: 4,
        name: 'test_product4',
        price: '1500',
        category: 'category1',
        sub_category: 'sub_category1',
        sub_category2: 'extra_sub_category5',
        product_description: 'sauce_test_description',
      },
    ]);
  });

  it('show by price range method should return a list of products', async () => {
    const result = await store.showByPriceRange(1100, 1600);
    expect(result).toEqual([
      {
        id: 4,
        name: 'test_product4',
        price: '1500',
        category: 'category1',
        sub_category: 'sub_category1',
        sub_category2: 'extra_sub_category5',
        product_description: 'sauce_test_description',
      },
    ]);
  });

  it('show by id method should return the correct product', async () => {
    const result = await store.showById('11');
    expect(result).toEqual({
      id: 11,
      name: 'test_product',
      price: '500',
      category: 'category1',
      sub_category: 'sub_category2',
      sub_category2: 'extra_sub_category3',
      product_description: 'test_description',
    });
  });

  it('update method should update successfully', async () => {
    const result = await store.update('11', {
      name: 'test_product',
      price: '1000',
      category: 'category1',
      sub_category: 'sub_category3',
      sub_category2: 'extra_sub_category4',
      product_description: 'test_description',
    });
    expect(result).toEqual({
      id: 11,
      name: 'test_product',
      price: '1000',
      category: 'category1',
      sub_category: 'sub_category3',
      sub_category2: 'extra_sub_category4',
      product_description: 'test_description',
    });
  });

  it('delete method should remove the correct product successfully', async () => {
    store.delete('11');
    const result = await store.showById('11');
    expect(result).toBeUndefined();
  });
});
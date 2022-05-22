import { Request } from 'express';
import numberChecker from './number_checker';

async function productChecker(req: Request): Promise<string[]> {
  const name: string = req.body.name as string;
  const price: string = req.body.price as string;
  const category: string = req.body.category as string;
  const sub_category: string = req.body.sub_category as string;
  const sub_category2: string = req.body.sub_category2 as string;
  const product_description: string = req.body.product_description as string;
  let error_list: Array<string> = ['valid'];
  if (typeof name == 'undefined') {
    error_list.push('name is missing');
    error_list.splice(0, 1, 'invalid parameters');
  }
  if (typeof price == 'undefined') {
    error_list.push('price is missing');
    error_list.splice(0, 1, 'invalid parameters');
  }
  if (typeof category == 'undefined') {
    error_list.push('category is missing');
    error_list.splice(0, 1, 'invalid parameters');
  }
  if (typeof sub_category == 'undefined') {
    error_list.push('sub_category is missing');
  }
  if (typeof sub_category2 == 'undefined') {
    error_list.push('sub_category_2 is missing');
  }
  if (typeof product_description == 'undefined') {
    error_list.push('description is missing');
    error_list.splice(0, 1, 'invalid parameters');
  }
  if (numberChecker(price) == false) {
    error_list.push('invalid price');
    error_list.splice(0, 1, 'invalid parameters');
  }
  return error_list;
}

export default productChecker;
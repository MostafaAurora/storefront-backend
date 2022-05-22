import { Request, Response, Application, RequestHandler } from 'express';
import { productModel } from '../models/product_model';
import numberChecker from '../utilities/number_checker';
import productChecker from '../utilities/product_checker';
import { verify } from 'jsonwebtoken';
import { tokenPayload } from '../types/token_payload_type';

const store = new productModel();


const verifyAuthTokenRole: RequestHandler = (
  req: Request,
  res: Response,
  next
) => {
  try {
    // extract parameters and check for token
    // if the token gets verified successfully proceed
    const authorizationHeader: string = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    const decoded = verify(token, process.env.TOKEN_SECRET as string);
    const payload: tokenPayload = decoded as tokenPayload;

    // if the user does not have the required authorization send a feedback message and send the appropriate status code and end the connection
    if (payload.user.role !== 'moderator' && payload.user.role !== 'admin') {
      res.status(403);
      res.send('user does not have clearance');
      return;
    }
    next();
  } catch (error) {
    // if there is something wrong with the token send feedback and the appropriate status code
    res.status(401);
    res.send('invalid token');
  }
};

const create = async (req: Request, res: Response) => {
  // check for token validity
  try {
    const authorizationHeader: string = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    verify(token, process.env.TOKEN_SECRET as string);
  } catch (err) {
    // send feedback and the appropriate status code and end the connection of the token is invalid
    res.status(401);
    res.json('Access denied, invalid token');
    return;
  }

  // extract parameters to be checked
  const name: string = req.body.name as string;
  const price: string = req.body.price as string;
  const category: string = req.body.category as string;
  const sub_category: string = req.body.sub_category as string;
  const sub_category2: string = req.body.sub_category2 as string;
  const product_description: string = req.body.product_description as string;

  // check parameters validity
  const validation: Array<string> = await productChecker(req);

  // if parameters are valid create a new product
  if (validation.includes('valid')) {
    try {
      const confirm = await store.create({
        name: name,
        price: price,
        category: category,
        sub_category: sub_category,
        sub_category2: sub_category2,
        product_description: product_description,
      });
      // if successful send the product for confirmation and send the appropriate status code
      res.status(200);
      res.send(confirm);
    } catch (error) {
      // if not successful send error feedback and send the appropriate status code
      res.status(500);
      res.send(error);
    }
  }
  // if parameters are invalid send feedback about invalid parameters and the appropriate status code
  else {
    res.status(400);
    res.send(validation);
  }
};

const index = async (req: Request, res: Response): Promise<void> => {
  // try to get products
  try {
    // if successful send the products and the appropriate status code
    const products = await store.index();
    res.status(200);
    res.json(products);
  } catch (error) {
    // if something went wrong send feedback and the appropriate status code
    res.status(500);
    res.send(error);
  }
};

const showById = async (req: Request, res: Response): Promise<void> => {
  // extract parameters to be checked
  const id: string = req.query.id as string;
  const validate = numberChecker(id);

  // if id is valid proceed
  if (validate == true) {
    // try to get the product
    try {
      const product = await store.showById(id);
      // if there was no product found by the provided id, send feedback and the appropriate status code
      if (typeof product == 'undefined') {
        res.status(200);
        res.send(`no user found by id: ${id}`);
      }
      // if a product was found send the product and the appropriate status code
      else {
        res.status(200);
        res.json(product);
      }
    } catch (error) {
      // if something went wrong send feedback and the appropriate status code
      res.status(500);
      res.send(error);
    }
  }
  // if id is invalid return feedback and the appropriate status code
  else {
    res.status(400);
    res.send('invalid id');
  }
};

const showByPrice = async (req: Request, res: Response): Promise<void> => {
  // extract parameters to be checked
  const price: string = req.query.price as string;
  const operator: string = req.query.operator as string;
  const allowedOperators: Array<string> = ['<', '>', '='];
  const validateNumber = numberChecker(price);

  // if the price is valid proceed
  if (validateNumber == true) {
    // if the operator string is valid proceed
    if (allowedOperators.includes(operator)) {
      // try to get products
      try {
        const products = await store.showByPrice(operator, parseInt(price));
        // if there were no products found by the provided price filter send feedback and the appropriate status code
        if (products.length == 0) {
          res.status(200);
          res.send(
            `no product found by price filter: product price ${operator} ${price}`
          );
        }
        // if products were found send the products and the appropriate status code
        else {
          res.status(200);
          res.json(products);
        }
      } catch (error) {
        // if something went wrong send feedback and send the appropriate status code
        res.status(200);
        res.send(error);
      }
    }
    // if the operator is not valid send feedback and send the appropriate status code
    else {
      res.status(401);
      res.send('invalid operator');
    }
  }
  // if the price is not valid send feedback and send the appropriate status code
  else {
    res.status(400);
    res.send('invalid price');
  }
};

const showByPriceRange = async (req: Request, res: Response): Promise<void> => {
  // extract parameters to be checked
  const min: string = req.query.min as string;
  const max: string = req.query.max as string;
  const min_valid = numberChecker(min);
  const max_valid = numberChecker(max);

  // if the parameters are valid proceed
  if (min_valid && max_valid) {
    // try to get products
    try {
      const products = await store.showByPriceRange(
        parseInt(min),
        parseInt(max)
      );
      // if there were no products found by the provided price range send feedback and the appropriate status code
      if (products.length == 0) {
        res.status(200);
        res.send(
          `no products found in the price range between ${min} and ${max}`
        );
      }
      // if products were found send the products and the appropriate status code
      else {
        res.status(200);
        res.send(products);
      }
    } catch (error) {
      // if something went wrong send feedback and send the appropriate status code
      res.status(500);
      res.send(error);
    }
  }
};

const showByKeyword = async (req: Request, res: Response): Promise<void> => {
  // extract parameters to be checked
  const keyword: string = req.query.keyword as string;
  // check the parameters
  // if invalid send feedback and the appropriate status code
  if (keyword.length == 0) {
    res.status(400);
    res.send('keyword parameter is missing');
  }
  // if the parameters are valid proceed
  else {
    // try to get products
    try {
      const products = await store.showByKeyword(keyword);
      // if there were no products found by the provided price range send feedback and the appropriate status code
      if (products.length == 0) {
        res.status(200);
        res.send(`no results matching the search keyword: ${keyword}`);
      }
      // if products were found send the products and the appropriate status code
      else {
        res.status(200);
        res.send(products);
      }
    } catch (error) {
      // if something went wrong send feedback and send the appropriate status code
      res.status(500);
      res.send(error);
    }
  }
};

const showByCategory = async (req: Request, res: Response) => {
  // extract parameters to be checked
  const category: string = req.query.category as string;
  const sub_category: string = req.query.sub_category as string;
  const sub_category2: string = req.query.sub_category2 as string;

  // check for the main required parameter
  // if invalid send feedback and the appropriate status code
  if (category.length == undefined) {
    res.status(400);
    res.send('category parameter is missing');
  }
  // if the main parameter is valid proceed
  else {
    // if there were no extra parameters proceed with the corresponding model method
    if (sub_category == undefined && sub_category2 == undefined) {
      // try to get products
      try {
        const products = await store.showByCategory(category);
        // if there were no products found send feedback and the appropriate status code
        if (products.length == 0) {
          res.status(200);
          res.send(`no products matching this category : ${category}`);
        }
        // if products were found send the products and the appropriate status code
        else {
          res.status(200);
          res.send(products);
        }
      } catch (error) {
        // if something went wrong send feedback and send the appropriate status code
        res.send(error);
      }
    }
    // if there was one extra parameter proceed with the corresponding model method
    if (sub_category != undefined && sub_category2 == undefined) {
      // try to get products
      try {
        const products = await store.showByCategory2(category, sub_category);
        // if there were no products found send feedback and the appropriate status code
        if (products.length == 0) {
          res.status(200);
          res.send(
            `no products matching this combination of category and sub category : ${category}, ${sub_category}`
          );
        }
        // if products were found send the products and the appropriate status code
        else {
          res.status(200);
          res.send(products);
        }
      } catch (error) {
        // if something went wrong send feedback and send the appropriate status code
        res.status(200);
        res.send(error);
      }
    }
    // if there were 2 extra parameters proceed with the corresponding model method
    if (sub_category != undefined && sub_category2.length != undefined) {
      // try to get products
      try {
        const products = await store.showByCategory3(
          category,
          sub_category,
          sub_category2
        );
        // if there were no products found send feedback and the appropriate status code
        if (products.length == 0) {
          res.status(200);
          res.send(
            `no products matching this combination of category and sub category and extra sub category : ${category}, ${sub_category}, ${sub_category2}`
          );
        }
        // if products were found send the products and the appropriate status code
        else {
          res.status(200);
          res.send(products);
        }
      } catch (error) {
        // if something went wrong send feedback and send the appropriate status code
        res.status(500);
        res.send(error);
      }
    }
  }
};

const update = async (req: Request, res: Response): Promise<void> => {
  // extract parameters to be checked
  const id: string = req.body.id as string;
  const name: string = req.body.name as string;
  const price: string = req.body.price as string;
  const category: string = req.body.category as string;
  const sub_category: string = req.body.sub_category as string;
  const sub_category2: string = req.body.sub_category2 as string;
  const product_description: string = req.body.product_description as string;
  // check parameters validity
  const validation: Array<string> = await productChecker(req);

  // if valid proceed
  if (validation.includes('valid')) {
    // if id is invalid send feedback and the appropriate status code
    if (numberChecker(id) == false) {
      res.status(400);
      res.send('invalid id');
    }
    // id id is valid proceed
    else {
      // try to update the product
      try {
        const id_exists = await store.showById(id);
        // if there was no product found by the id sed feedback and the appropriate status code
        if (typeof id_exists == 'undefined') {
          res.status(200);
          res.send('id does not exist');
        }
        // if the id exists proceed
        else {
          // try to update the product
          try {
            const confirm = await store.update(id, {
              name: name,
              price: price,
              category: category,
              sub_category: sub_category,
              sub_category2: sub_category2,
              product_description: product_description,
            });
            // send update confirmation and the appropriate status code
            res.status(200);
            res.send(confirm);
          } catch (error) {
            // if something went wrong send feedback and the appropriate status code
            res.status(500);
            res.send(error);
          }
        }
      } catch (error) {
        // if something went wrong send feedback and the appropriate status code
        res.status(500);
        res.send(error);
      }
    }
  }
  // if the parameters are invalid send feedback and the appropriate status code
  else {
    res.status(400);
    res.send(validation);
  }
};

const remove = async (req: Request, res: Response): Promise<void> => {
  // extract parameters to be checked
  const id: string = req.body.id as string;
  const validate = numberChecker(id);
  // if id is invalid send feedback and the appropriate status code
  if (validate == false) {
    res.status(400);
    res.send('invalid id');
  }
  // the id is valid proceed
  else {
    try {
      // check if the id exists
      const id_exists = await store.showById(id);
      // if the id does not exist send feedback and the appropriate status code
      if (typeof id_exists == 'undefined') {
        res.status(200);
        res.send('id does not exist');
      }
      // if the id exists proceed
      else {
        // try to delete the product
        try {
          const confirm = await store.delete(id);
          // send deletion confirmation and the appropriate status code
          res.status(200);
          res.send(confirm);
        } catch (error) {
          // if something went wrong send feedback and the appropriate status code
          res.status(500);
          res.send(error);
        }
      }
    } catch (error) {
      // if something went wrong send feedback and the appropriate status code
      res.send(error);
    }
  }
};

const productRoutes = (app: Application) => {
  app.get('/products', index);
  app.get('/products/id', showById);
  app.get('/products/price', showByPrice);
  app.get('/products/priceRange', showByPriceRange);
  app.get('/products/keyword', showByKeyword);
  app.get('/products/category', showByCategory);
  app.post('/products', verifyAuthTokenRole, create);
  app.put('/products', verifyAuthTokenRole, update);
  app.delete('/products', verifyAuthTokenRole, remove);
};

export default productRoutes;
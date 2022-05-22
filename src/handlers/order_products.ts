import { Request, Response, Application, RequestHandler } from 'express';
import { verify } from 'jsonwebtoken';
import { tokenPayload } from '../types/token_payload_type';
import { orderProductsModel } from '../models/order_products_model';
import numberChecker from '../utilities/number_checker';
import { orderModel } from '../models/order_model';
import { orderType } from '../types/order_type';

const store = new orderProductsModel();
const orderStore = new orderModel();

const verifyAuthTokenId2: RequestHandler = async (
  req: Request,
  res: Response,
  next
) => {
  try {
    const id: string = req.body.order_id as string;
    const result: orderType = (await orderStore.showByOrderId(id)) as orderType;
    const user_id = result.user_id;
    const authorizationHeader: string = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    const decoded = verify(token, process.env.TOKEN_SECRET as string);
    const payload: tokenPayload = decoded as tokenPayload;

    if (payload.user.id !== user_id) {
      res.status(403);
      res.send('user does not have clearance');
      return;
    }
    next();
  } catch (error) {
    res.status(401);
    res.send(`invalid token ${error}`);
  }
};

const addProduct = async (req: Request, res: Response) => {
  const product_id: string = req.body.order_id as string;
  const order_id: string = req.body.order_id as string;
  const quantity: string = req.body.order_id as string;
  const indicator: string[] = ['valid'];

  if (numberChecker(product_id) == false) {
    indicator.splice(0, 1, 'invalid');
    indicator.push('invalid product id');
  }
  if (numberChecker(order_id) == false) {
    indicator.splice(0, 1, 'invalid');
    indicator.push('invalid order id');
  }
  if (numberChecker(quantity) == false) {
    indicator.splice(0, 1, 'invalid');
    indicator.push('invalid quantity');
  }
  if (numberChecker(quantity) == true) {
    const amount: number = parseInt(quantity);
    if (amount < 0) {
      indicator.splice(0, 1, 'invalid');
      indicator.push('invalid quantity');
    }
    if (amount > 0) {
      indicator.splice(0, 1, 'invalid');
      indicator.push('quantity exceeds the maximum quantity allowed');
    }
  }

  if (indicator.includes('invalid')) {
    res.status(400);
    res.send(indicator);
  }
  if (indicator.includes('valid')) {
    try {
      const result = await store.addProduct(
        parseInt(quantity),
        order_id,
        product_id
      );
      res.status(200);
      res.send(result);
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  }
};

const remove = async (req: Request, res: Response): Promise<void> => {
  const order_id: string = req.body.order_id as string;
  const product_id: string = req.body.product_id as string;
  try {
    const result = store.deleteProduct(order_id, product_id);
    res.status(200);
    res.send(result);
  } catch (error) {
    res.status(500);
    res.send(error);
  }
};

const orderProductsRoutes = (app: Application) => {
  app.post('/orders/products', verifyAuthTokenId2, addProduct);
  app.delete('/orders/products', verifyAuthTokenId2, remove);
};

export default orderProductsRoutes;
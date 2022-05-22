import { Request, Response, Application, RequestHandler } from 'express';
import { verify } from 'jsonwebtoken';
import { tokenPayload } from '../types/token_payload_type';
import { orderModel } from '../models/order_model';
import numberChecker from '../utilities/number_checker';
import { UserModel } from '../models/user_model';
import { orderType } from '../types/order_type';

const store = new orderModel();
const userStore = new UserModel();


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

const verifyIdOrRole: RequestHandler = (req: Request, res: Response, next) => {
  try {
    // extract parameters and check for token
    // if the token gets verified successfully proceed
    const user_id: string = req.query.user_id as string;
    const authorizationHeader: string = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    const decoded = verify(token, process.env.TOKEN_SECRET as string);
    const payload: tokenPayload = decoded as tokenPayload;

    // if the user does not have the required authorization send a feedback message and send the appropriate status code and end the connection
    if (payload.user.role !== 'admin' && payload.user.id != parseInt(user_id)) {
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


const verifyUserId: RequestHandler = (req: Request, res: Response, next) => {
  try {
    const id: string = req.body.user_id as string;
    const authorizationHeader: string = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    const decoded = verify(token, process.env.TOKEN_SECRET as string);
    const payload: tokenPayload = decoded as tokenPayload;

    if (payload.user.id != parseInt(id)) {
      res.send('user does not have clearance');
      return;
    }
    next();
  } catch (error) {
    res.status(401);
    res.send('invalid token');
  }
};

const verifyOrderUserId: RequestHandler = async (
  req: Request,
  res: Response,
  next
) => {
  try {
    const order_id: string = req.body.order_id as string;
    const result: orderType = (await store.showByOrderId(
      order_id
    )) as orderType;
    const user_id: string = result.user_id as string;
    const authorizationHeader: string = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    const decoded = verify(token, process.env.TOKEN_SECRET as string);
    const payload: tokenPayload = decoded as tokenPayload;

    if (payload.user.id != parseInt(user_id)) {
      res.status(403);
      res.send('user does not have clearance');
      return;
    }
    next();
  } catch (error) {
    res.status(401);
    res.send('invalid token');
  }
};

const verifyOrderUserIdOrRole: RequestHandler = async (
  req: Request,
  res: Response,
  next
) => {
  try {
    const order_id: string = req.query.order_id as string;
    const result: orderType = (await store.showByOrderId(
      order_id
    )) as orderType;
    const user_id: string = result.user_id as string;
    const authorizationHeader: string = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    const decoded = verify(token, process.env.TOKEN_SECRET as string);
    const payload: tokenPayload = decoded as tokenPayload;

    if (payload.user.id != parseInt(user_id) && payload.user.role !== 'admin') {
      res.status(403);
      res.send('user does not have clearance');
      return;
    }
    next();
  } catch (error) {
    res.status(401);
    res.send('invalid token');
  }
};

const create = async (req: Request, res: Response) => {
  const user_id: string = req.body.user_id as string;
  if (numberChecker(user_id) == true) {
    try {
      const result = await store.create(user_id);
      res.status(200);
      res.send(result);
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  } else {
    res.status(400);
    res.send('invalid user id');
  }
};

const index = async (req: Request, res: Response) => {
  try {
    const results = await store.index();
    res.status(200);
    res.send(results);
  } catch (error) {
    res.status(500);
    res.send(error);
  }
};

const showByUserId = async (req: Request, res: Response) => {
  const user_id: string = req.query.user_id as string;
  if (numberChecker(user_id) == true) {
    try {
      const result = await store.showByUserId(user_id);
      res.status(200);
      res.send(result);
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  } else {
    res.status(400);
    res.send('invalid user id');
  }
};

const showByOrderId = async (req: Request, res: Response) => {
  const order_id: string = req.query.order_id as string;
  if (numberChecker(order_id) == true) {
    try {
      const result = await store.showByOrderId(order_id);
      res.status(200);
      res.send(result);
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  } else {
    res.status(400);
    res.send('invalid order id');
  }
};

const update = async (req: Request, res: Response) => {
  const order_id: string = req.body.order_id as string;
  const status: string = (req.body.status as string)
    .toLocaleLowerCase()
    .replace(/\s/g, '');
  if (numberChecker(order_id) == true) {
    if (
      status == 'closed' ||
      status == 'outfordelivery' ||
      status == 'support'
    ) {
      try {
        const result = await store.update(order_id, status);
        res.status(200);
        res.send(result);
      } catch (error) {
        res.status(500);
        res.send(error);
      }
    } else {
      res.status(400);
      res.send('invalid order status');
    }
  } else {
    res.status(400);
    res.send('invalid order id');
  }
};

const deleteByOrderId = async (req: Request, res: Response) => {
  const order_id: string = req.body.order_id as string;
  if (numberChecker(order_id) == true) {
    try {
      const result = await store.deleteByOrderId(order_id);
      res.status(200);
      res.send(result);
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  } else {
    res.status(400);
    res.send('invalid order id');
  }
};

const deleteByUserId = async (req: Request, res: Response) => {
  const user_id: string = req.body.user_id as string;
  if (numberChecker(user_id) == true) {
    try {
      const result = await store.deleteByUserId(user_id);
      res.status(200);
      res.send(result);
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  } else {
    res.status(400);
    res.send('invalid user id');
  }
};

const orderRoutes = (app: Application) => {
  app.get('/orders', verifyAuthTokenRole, index);
  app.get('/orders/order_id', verifyOrderUserIdOrRole, showByOrderId);
  app.get('/orders/user_id', verifyIdOrRole, showByUserId);
  app.post('/orders', verifyUserId, create);
  app.put('/orders', verifyAuthTokenRole, update);
  app.delete('/orders/order_id', verifyOrderUserId, deleteByOrderId);
  app.delete('/orders/user_id', verifyUserId, deleteByUserId);
};

export default orderRoutes;
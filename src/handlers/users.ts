import { Request, Response, Application, RequestHandler } from 'express';
import { UserModel } from '../models/user_model';
import { sign, verify } from 'jsonwebtoken';
import emailChecker from '../utilities/email_checker';
import numberChecker from '../utilities/number_checker';
import userChecker from '../utilities/user_checker';
import dotenv from 'dotenv';
import { tokenPayload } from '../types/token_payload_type';


dotenv.config();

const store = new UserModel();

const verifyAuthTokenRole: RequestHandler = (
  req: Request,
  res: Response,
  next
) => {
  try {
    const authorizationHeader: string = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    const decoded = verify(token, process.env.TOKEN_SECRET as string);
    const payload: tokenPayload = decoded as tokenPayload;

    if (payload.user.role !== 'admin') {
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

const verifyAuthTokenRoleNew: RequestHandler = (
  req: Request,
  res: Response,
  next
) => {
  if (req.body.role == 'admin' || req.body.role == 'moderator') {
    try {
      const authorizationHeader: string = req.headers.authorization as string;
      const token = authorizationHeader.split(' ')[1];
      const decoded = verify(token, process.env.TOKEN_SECRET as string);
      const payload: tokenPayload = decoded as tokenPayload;

      if (payload.user.role !== 'admin') {
        res.status(403);
        res.send('user does not have clearance');
        return;
      }
      next();
    } catch (error) {
      res.status(401);
      res.send('invalid token');
    }
  } else {
    next();
  }
};

const verifyAuthTokenId: RequestHandler = (
  req: Request,
  res: Response,
  next
) => {
  try {
    const id: string = req.body.id as string;
    const authorizationHeader: string = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    const decoded = verify(token, process.env.TOKEN_SECRET as string);
    const payload: tokenPayload = decoded as tokenPayload;

    if (payload.user.id != parseInt(id)) {
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

const authenticate = async (req: Request, res: Response): Promise<void> => {
  const email: string = req.body.email as string;
  const password: string = req.body.password as string;
  if (emailChecker(email) == true) {
    try {
      const result = await store.authenticate(email, password);
      //console.log(result as string)
      if (result != false) {
        const token: string = sign(
          { user: result },
          process.env.TOKEN_SECRET as string
        ) as string;
        res.status(200);
        res.send(token);
      } else {
        if (result == false) {
          res.status(200);
          res.send(`no user found by email: ${email}`);
        } else {
          res.status(200);
          res.send(result);
        }
      }
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  } else {
    res.status(400);
    res.send('invalid email');
  }
};

const create = async (req: Request, res: Response): Promise<void> => {
  const first_name: string = req.body.first_name as string;
  const last_name: string = req.body.last_name as string;
  const email: string = req.body.email as string;
  const password: string = req.body.password as string;
  const phone_number: string = req.body.phone_number as string;
  const role: String = req.body.role as String;
  const validation: Array<string> = await userChecker(req);

  if (validation.includes('valid')) {
    if (role == 'admin' || role == 'moderator') {
    }
    try {
      const confirm = await store.create({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
        role: role,
        phone_number: phone_number,
      });
      res.status(200);
      res.send(confirm);
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  } else {
    res.status(400);
    res.send(validation);
  }
};

const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await store.index();
    res.status(200);
    res.json(users);
  } catch (error) {
    res.status(500);
    res.send(error);
  }
};

const showById = async (req: Request, res: Response): Promise<void> => {
  const id: string = req.query.id as string;
  const validate = numberChecker(id);
  if (validate == true) {
    try {
      const user = await store.showById(id);
      if (typeof user == 'undefined') {
        res.status(200);
        res.send(`no user found by id: ${id}`);
      } else {
        res.status(200);
        res.json(user);
      }
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  } else {
    res.status(400);
    res.send('invalid id');
  }
};

const showByEmail = async (req: Request, res: Response): Promise<void> => {
  const email: String = req.query.email as String;
  if (emailChecker(email) == true) {
    try {
      const user = await store.showByEmail(email);
      if (typeof user == 'undefined') {
        res.status(200);
        res.send(`"no user found by email: ${email}`);
      }
      res.status(200);
      res.json(user);
    } catch (error) {
      res.status(500);
      res.send(error);
    }
  } else {
    res.status(400);
    res.send('email not valid');
  }
};

const showByPhoneNumber = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const phone_number: String = req.body.phone_number as String;
    const user = await store.showByPhoneNumber(phone_number);
    res.status(200);
    res.json(user);
  } catch (error) {
    res.status(500);
    res.send(error);
  }
};

const update = async (req: Request, res: Response): Promise<void> => {
  const id: string = req.body.id as string;
  const first_name: string = req.body.first_name as string;
  const last_name: string = req.body.last_name as string;
  const email: string = req.body.email as string;
  const password: string = req.body.password as string;
  const phone_number: string = req.body.phone_number as string;
  const role: String = req.body.role as String;
  const validation: Array<string> = await userChecker(req);
  const id_exists = await store.showById(id);

  if (numberChecker(id)) {
    if (id_exists) {
      if (validation.includes('valid')) {
        try {
          const confirm = await store.update(id, {
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password,
            role: role,
            phone_number: phone_number,
          });
          res.status(200);
          res.send(confirm);
        } catch (error) {
          res.status(500);
          res.send(error);
        }
      } else {
        res.status(400);
        res.send(validation);
      }
    } else {
      res.status(200);
      res.send(`no user found by id: ${id}`);
    }
  } else {
    res.status(400);
    res.send('invalid id');
  }
};

const remove = async (req: Request, res: Response): Promise<void> => {
  const id: string = req.body.id as string;
  const validate = numberChecker(id);
  const id_exists = await store.showById(id);
  if (validate == true) {
    if (id_exists) {
      try {
        const removeCheck = await store.delete(id);
        if (removeCheck == 'removed successfully') {
          res.status(204);
          res.send(removeCheck);
        } else {
          res.status(200);
          res.send(removeCheck);
        }
      } catch (error) {
        res.status(500);
        res.send(error);
      }
    } else {
      res.status(200);
      res.send(`no user found by id: ${id}`);
    }
  } else {
    res.status(400);
    res.send('invalid id');
  }
  return;
};

const userRoutes = (app: Application) => {
  app.get('/users', verifyAuthTokenRole, index);
  app.get('/users/id', verifyAuthTokenRole, showById);
  app.get('/users/email', verifyAuthTokenRole, showByEmail);
  app.post('/users', authenticate);
  app.post('/users/new', verifyAuthTokenRoleNew, create);
  app.post('/users/byNumber', verifyAuthTokenRole, showByPhoneNumber);
  app.put('/users', verifyAuthTokenId, update);
  app.delete('/users/delete', verifyAuthTokenId, remove);
};

export default userRoutes;
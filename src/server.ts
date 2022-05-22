import express, { Request, RequestHandler, Response } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './handlers/users';
import productRoutes from './handlers/products';
import orderRoutes from './handlers/orders';
import orderProductsRoutes from './handlers/order_products';

const app: express.Application = express();
const address: string = '0.0.0.0:3000';

app.use(bodyParser.json() as RequestHandler);

app.get('/', function (req: Request, res: Response) {
  res.send('Hello World!');
});

userRoutes(app);
productRoutes(app);
orderRoutes(app);
orderProductsRoutes(app);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});

export default app;
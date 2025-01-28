import express from "express";
import cors from "cors";
import { requireAuth } from "@clerk/express";

import userRoutes from './routes/user.route';
import adminRoutes from './routes/admin.route';
import authRoutes from './routes/auth.route';
import restaurantRoutes from './routes/restaurant.route';
import userAddressRoutes from './routes/userAddress.route';
import productRoutes from './routes/product.route';
import paymentRoutes from './routes/payment.route';
import orderRoutes from './routes/order.route';
import stripeRoutes from './routes/stripe.route';
import deliveryDriverRoutes from './routes/deliveryDriver.route';

import { createServer } from "http";
import webSocketService from "./services/webSocket.service";
import { redisService } from "./services/redis.service";

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  if (req.originalUrl === "/stripe/webhook" || req.originalUrl === "/stripe/webhook2") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
  res.status(200).send('home')
});

app.get("/version", (req, res) => {
  res.send("1.0.0");
});

// TODO: Fix requireAuth() middleware
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/user-addresses', requireAuth(), userAddressRoutes);
app.use('/products', productRoutes);
app.use('/payments', paymentRoutes);
app.use('/orders', orderRoutes);
app.use('/stripe', stripeRoutes);
app.use('/delivery-drivers', deliveryDriverRoutes);

webSocketService.initialize(server);

server.listen(PORT, async () => {
  await redisService.connect();
  console.log(`Server is running on port ${PORT}`);
});

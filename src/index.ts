import express from "express";
import { requireAuth } from "@clerk/express";

import userRoutes from './routes/user.route';
import authRoutes from './routes/auth.route';
import restaurantRoutes from './routes/restaurant.route';
import userAddressRoutes from './routes/userAddress.route';
import productRoutes from './routes/product.route';
import paymentRoutes from './routes/payment.route';
import orderRoutes from './routes/order.route';
import stripeRoutes from './routes/stripe.route';

import { rabbitService } from './services/rabbit.service';

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  if (req.originalUrl === "/stripe/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('home')
});

app.get("/version", (req, res) => {
  res.send("1.0.0");
});

app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/user-addresses', requireAuth(), userAddressRoutes);
app.use('/products', productRoutes);
app.use('/payments', requireAuth(), paymentRoutes);
app.use('/orders', requireAuth(), orderRoutes);
app.use('/stripe', stripeRoutes);

const startServer = async () => {
  try {
    await rabbitService.connect();

    await rabbitService.registerConsumers();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

    process.on('SIGINT', async () => {
      console.log('Shutting down...');
      await rabbitService.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('Shutting down...');
      await rabbitService.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1); // Salir si hay un error crítico
  }
}

startServer();

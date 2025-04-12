import Stripe from "stripe";
import { Request, Response } from "express";
import { orderService } from "../services/order.service";
import dotenv from 'dotenv';
import { orderItemService } from "../services/orderItem.service";
import webSocketService from "../services/webSocket.service";
import { restaurantsService } from "../services/restaurant.service";
import { stripeService } from "../services/stripe.service";
import { RequestWithAuth } from "../types/Global.type";
import { adminService } from "../services/admin.service";
import { redisService } from "../services/redis.service";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const stripeController = {
  handleWebhook: async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature']!;
    try {
      const event = await stripe.webhooks.constructEventAsync(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
      switch (event.type) {
        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object;
          const metadata = paymentIntent.metadata;

          const {
            user_id,
            restaurant,
            total_price,
            delivery_fee,
            userLatitude,
            userLongitude,
            plaform_fee_amount,
            delivery_ptg_amount,
            cart,

            restaurantAmount,
          } = metadata;

          const order = await orderService.createOne({
            payment_intent_id: paymentIntent.id,
            status: 'pending',
            payment_status: 'completed',
            user_id: Number(user_id),
            restaurant_id: Number(restaurant),
            total_price: Number(total_price),
            latitude: Number(userLatitude),
            longitude: Number(userLongitude),

            // Restaurante
            amount: Number(restaurantAmount),

            // Delivery driver
            delivery_ptg_amount: Number(delivery_ptg_amount),
            delivery_fee: Number(delivery_fee),

            // Plataforma
            plaform_fee_amount: Number(plaform_fee_amount),
          })

          const expirationTime = Math.floor(Date.now() / 1000) + 300;
          await redisService.zadd('delayedOrders', expirationTime, order.id!.toString());

          const cartItems = JSON.parse(cart);
          const mappedCartItems = Object.keys(cartItems).map((key) => {
            const item = cartItems[key];
            return {
              order_id: order.id!,
              product_id: Number(key),
              quantity: Number(item.quantity),
              unit_price: Number(item.price),
            }
          })

          await orderItemService.createMany(mappedCartItems);

          await webSocketService.emitToRoom('new-order', `business_${order.restaurant_id.toString()}`, { type: 'new-order', order });

          break;
        }
        case 'payment_intent.canceled': {
          const paymentIntent = event.data.object;
          const orderFound = await orderService.findByPaymentIntentId(paymentIntent.id);
          if (!orderFound) throw new Error('Order not found');
          await orderService.updateOne(orderFound.id, { status: 'cancelled_by_user', payment_status: 'rejected' });
          break;
        }

        case 'checkout.session.completed': {
          const session = event.data.object;
          const businessId = session.metadata?.business_id;
          const subscriptionId = session.subscription;
          const customerId = session.customer;

          console.log({ businessId, subscriptionId, customerId });

          break;
        }
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
      res.status(200).send();
    }
    catch (err) {
      console.error(err);
      if (err instanceof Error) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
      res.status(400).send(`Webhook Error`);
    }
  },
  handleWebhook2: async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature']!;
    try {
      const event = await stripe.webhooks.constructEventAsync(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET2!);
      switch (event.type) {
        case 'account.updated': {
          const account = event.data.object;
          const { id, requirements, future_requirements } = account;
          
          const adminFound = await adminService.getAdminByStripeId(id);

          if (requirements?.disabled_reason || future_requirements?.disabled_reason) {
            if (adminFound) {
              await adminService.updateAdmin(adminFound.id!, { stripe_status: 'error' });
              await webSocketService.emitToRoom('stripe-status', `admin_${adminFound.id!.toString()}`, { type: 'stripe-status', status: 'error' });
            }
            break;
          } else {
            if (adminFound) {
              await adminService.updateAdmin(adminFound.id!, { stripe_status: 'success' });
              await webSocketService.emitToRoom('stripe-status', `admin_${adminFound.id!.toString()}`, { type: 'stripe-status', status: 'success' });
            }
          }
          break;
        }
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
      res.status(200).send();
    }
    catch (err) {
      console.error(err);
      if (err instanceof Error) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
      res.status(400).send(`Webhook Error`);
    }
  },
  getTransfers: async (req: Request, res: Response) => {
    try {
      const businessId = req.headers['x-business-id'];
      if (!businessId) throw new Error('Business Id is required');

      const business = await restaurantsService.getRestaurantById({ id: Number(businessId), includeRelations: { admins: true } });
      if (!business) throw new Error('Business not found');

      const acct = business.admins?.stripe_account;
      if (!acct) throw new Error('Account ID is required');
      const transfers = await stripeService.getTransfers(acct);
      const transfersData = transfers.data;
      res.status(200).json(transfersData);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  },
  createSession: async (req: Request, res: Response) => {
    try {
      const { id } = await stripeService.createExpressAccount();
      const accountSessions = await stripeService.createAccountSession(id);
      res.status(200).json({ client_secret: accountSessions.client_secret, id });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  getAccount: async (req: RequestWithAuth, res: Response) => {
    try {
      const { userId } = req.auth!;
      const adminFound = await adminService.getAdminByClerkId(userId);
      if (!adminFound) throw new Error('Admin not found');

      const acct = adminFound.stripe_account;
      if (!acct) throw new Error('Account ID is required');

      const account = await stripeService.getAccount(acct);
      res.status(200).json(account);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  },
  generateSignInLink: async (req: RequestWithAuth, res: Response) => {
    try {
      const { userId } = req.auth!;
      const adminFound = await adminService.getAdminByClerkId(userId);
      if (!adminFound) throw new Error('Admin not found');

      const acct = adminFound.stripe_account;
      if (!acct) throw new Error('Account ID is required');
      const link = await stripeService.generateSignInLink(acct);
      res.status(200).json({ link });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  },
  generateSubCheckoutSession: async (req: Request, res: Response) => {
    const businessId = req.headers['x-business-id'] as string;
    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: process.env.STRIPE_SUBSCRIPTION_PRICE_ID!,
            quantity: 1,
          },
        ],
        success_url: `${process.env.FRONTEND_URL}/home`,
        cancel_url: `${process.env.FRONTEND_URL}/home`,
        metadata: {
          business_id: businessId,
        },
      });
  
      res.status(200).json({ sessionId: session.id });
    } catch (error) {
      console.log({ error });
      res.status(500).json({ error: 'Error creando la sesión de pago' });
    }
  }
}
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

          const order = await orderService.createOne({
            payment_intent_id: paymentIntent.id,
            status: 'preparing',
            payment_status: 'completed',
            user_id: Number(metadata.user_id),
            restaurant_id: Number(metadata.restaurant),
            total_price: Number(metadata.total_price),
            delivery_fee: Number(metadata.delivery_fee),
            latitude: Number(metadata.userLatitude),
            longitude: Number(metadata.userLongitude),
            plaform_fee_amount: Number(metadata.plaform_fee_amount),
            delivery_ptg_amount: Number(metadata.delivery_ptg_amount),
          })

          const cartItems = JSON.parse(metadata.cart);
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

          const restaurantFound = await restaurantsService.getRestaurantById({ id: Number(metadata.restaurant), includeRelations: { admins: true } });
          
          const adminStripeAcct = restaurantFound.admins?.stripe_account;

          const totalAmount = mappedCartItems.reduce((acc, item) => acc + item.unit_price * item.quantity, 0) * 100;

          if (adminStripeAcct) {
            try {
              await stripe.transfers.create({
                amount: totalAmount,
                currency: 'mxn',
                destination: adminStripeAcct,
              });
            } catch (error) {
              console.error('Error creating transfer:', error);
            }
          }

          await webSocketService.emitToRoom('new-order', order.restaurant_id.toString(), { type: 'new-order', order });
  
          break;
        }
        case 'payment_intent.canceled': {
          const paymentIntent = event.data.object;
          const orderFound = await orderService.findByPaymentIntentId(paymentIntent.id);
          if (!orderFound) throw new Error('Order not found');
          await orderService.updateOne(orderFound.id, { status: 'cancelled', payment_status: 'rejected' });
          break;
        }
        case 'account.updated': {
          const account = event.data.object;
          const { id, requirements, future_requirements } = account;

          const adminFound = await adminService.getAdminByStripeId(id);
          if (!adminFound) throw new Error('Admin not found');

          if (requirements?.disabled_reason || future_requirements?.disabled_reason) {
            await adminService.updateAdmin(adminFound.id!, { stripe_status: 'error' });
            break;
          } else {
            await adminService.updateAdmin(adminFound.id!, { stripe_status: 'success' });
          }

          break;
        }
        default:
          console.log(`Unhandled event type ${event.type}`);
        // case 'charge.updated': {
        //   const charge = event.data.object;
        //   // const orderFound = await orderService.findByPaymentIntentId(charge.payment_intent?.toString()!);
        //   // if (!orderFound) throw new Error('Order not found');
        //   // const balanceTransaction = await stripe.balanceTransactions.retrieve(charge.balance_transaction?.toString()!);
        //   // console.log({ balanceTransaction });
        //   if (charge.status === 'succeeded') {
        //     console.log('Charge was successful!');
        //   }
        //   break;
        // }
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
  }
}
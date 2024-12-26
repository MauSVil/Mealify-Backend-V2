import Stripe from "stripe";
import { Request, Response } from "express";
import { orderService } from "../services/order.service";
import { rabbitService } from "../services/rabbit.service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const stripeController = {
  handleWebhook: async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature']!;
    try {
      const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
      switch (event.type) {
        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object;
          const orderFound = await orderService.findByPaymentIntentId(paymentIntent.id);
          if (!orderFound) throw new Error('Order not found');

          await rabbitService.publishMessage('payments', 'order.payment.success', {
            orderId: orderFound.id,
            userId: orderFound.user_id,
            status: 'in_progress',
            paymentStatus: 'completed',
          });

          await orderService.updateOne(orderFound.id, { status: 'in_progress', payment_status: 'completed' });
          break;
        }
        case 'payment_intent.canceled': {
          const paymentIntent = event.data.object;
          const orderFound = await orderService.findByPaymentIntentId(paymentIntent.id);
          if (!orderFound) throw new Error('Order not found');
          await orderService.updateOne(orderFound.id, { status: 'cancelled', payment_status: 'rejected' });
          break;
        }
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
    }
    catch (err) {
      if (err instanceof Error) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
      res.status(400).send(`Webhook Error`);
    }
  },
}
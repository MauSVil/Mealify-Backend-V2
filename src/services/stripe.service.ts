import Stripe from "stripe";
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const stripeService = {
  getTransfers: async (acct: string) => {
    const transfers = await stripe.transfers.list({
      destination: acct,
    });
    return transfers;
  }
};
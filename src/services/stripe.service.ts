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
  },
  createExpressAccount: async () => {
    const account = await stripe.accounts.create({
      type: "express",
      country: 'MX',
      capabilities: {
        card_payments: {
          requested: true,
        },
        transfers: {
          requested: true,
        },
      },
      email: 'maujr10@hotmail.com',
      business_type: 'individual',
      individual: {
        first_name: 'Mauricio',
        last_name: 'Sanchez Vilchis',
        email: 'maujr10@hotmail.com',
        address: {
          city: 'NAUCALPAN DE JUAREZ',
          country: 'MX',
          line1: 'Cto Novelistas #24',
          postal_code: '53100',
          state: 'ESTADO DE MEXICO',
        },
        phone: '+525535209307',
        
      },
      business_profile: {
        name: 'Mauricio',
        product_description: 'Negocio prestando servicio a Mealify'
      }
    });
    return account;
  },
  createAccountSession: async (connectedAccountId: string) => {
    const accountLink = await stripe.accountSessions.create({
      account: connectedAccountId,
      components: {
        account_onboarding: {
          enabled: true,
          features: {
            external_account_collection: true,
          },
        },
      },
    });
    return accountLink;
  }
};
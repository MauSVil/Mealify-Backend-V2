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
  },
  deleteAccounts: async () => {
    const accounts = await stripe.accounts.list();
    accounts.data.forEach(async (account) => {
      if (account.requirements?.disabled_reason || account.future_requirements?.disabled_reason) {
        await stripe.accounts.del(account.id);
      } else {
        console.log(`Account ${account.id} is enabled`);
      }
    });
  },
  getAccount: async (accountId: string) => {
    const account = await stripe.accounts.retrieve(accountId);
    return account;
  },
  generateSignInLink: async (accountId: string) => {
    const link = await stripe.accounts.createLoginLink(accountId);
    return link;
  },
  createCustomer: async ({ email, metadata }: { email: string; metadata?: Record<string, string> }) => {
    const customers = await stripe.customers.list();
    let customer = customers.data.find((customer) => customer.email === email);
    if (!customer) {
      customer = await stripe.customers.create({
        email,
        metadata
      });
    }
    return customer;
  },
  refundPayment: async ({ paymentIntentId, amount }: { paymentIntentId: string, amount?: number }) => {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      ...(amount && { amount }),
    });
    return refund;
  },
};
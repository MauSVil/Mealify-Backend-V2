import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const paymentService = {
  getTotal: (amount: number, shippingCostPerKm: number) => {
    const stripeComission = 7;
    const platformFee = 15;
    const plaformFeeAmount = amount * (platformFee / 100);

    const baseShippingCost = 15;
    const shippingCost = shippingCostPerKm + baseShippingCost;

    const desiredNetAmount = amount + plaformFeeAmount + shippingCost;
    const stripePercentage = stripeComission / 100;

    const totalFinal = Math.ceil(desiredNetAmount / (1 - stripePercentage));

    console.log('------ Desglose ------');
    console.log(`Monto neto deseado: ${desiredNetAmount.toFixed(2)} MXN`);
    console.log(`Monto total a cobrar: ${totalFinal.toFixed(2)} MXN`);
    console.log(`Costo de envio: ${shippingCost.toFixed(2)} MXN`);
    console.log('--------------------------------');

    return totalFinal;
  },
  createCustomer: async (name: string, email: string) => {
    let customer;
    const existingCustomer = await stripe.customers.list({ email });
    if (existingCustomer.data.length > 0) customer = existingCustomer.data[0];
    else {
      const newCustomer = await stripe.customers.create({ email, name });
      customer = newCustomer;
    }
    return customer;
  },
  createPaymentIntent: async (amount: number, shippingCostPerKm: number, customer?: Stripe.Customer) => {
    const totalFinal = paymentService.getTotal(amount, shippingCostPerKm);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalFinal * 100),
      currency: "mxn",
      customer: customer?.id,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    return {
      paymentIntent,
      customer: customer?.id,
    }
  },
  pay: async (payment_method_id: string, payment_intent_id: string, customer_id: string) => {
    const paymentMethod = await stripe.paymentMethods.attach(
      payment_method_id,
      {
        customer: customer_id,
      },
    );

    const result = await stripe.paymentIntents.confirm(payment_intent_id, {
      payment_method: paymentMethod.id,
    });

    return result;
  }
}
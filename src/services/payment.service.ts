import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const paymentService = {
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
  createPaymentIntent: async (amount: number, distanceInKm: number, customer?: Stripe.Customer) => {
    const stripeComission = 7;
    const platformFee = 15;
    const plaformFeeAmount = amount * (platformFee / 100);

    const costPerKm = 5;
    const baseShippingCost = 15;
    const shippingCost = (distanceInKm * costPerKm) + baseShippingCost;

    const desiredNetAmount = amount + plaformFeeAmount + shippingCost;
    const stripePercentage = stripeComission / 100;

    const totalFinal = Math.ceil(desiredNetAmount / (1 - stripePercentage));

    console.log('------ Desglose corregido ------');
    console.log(`Monto neto deseado: ${desiredNetAmount.toFixed(2)} MXN`);
    console.log(`Monto total a cobrar: ${totalFinal.toFixed(2)} MXN`);
    console.log(`Costo de envio: ${shippingCost.toFixed(2)} MXN`);
    console.log('--------------------------------');

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
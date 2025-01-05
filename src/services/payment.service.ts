import Stripe from 'stripe';
import dotenv from 'dotenv';
import { userService } from './user.service';

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
  },
  generateParams: async (
    { email, amount, shippingCostPerKm, restaurant, userLatitude, userLongitude, clerkId, cart }:
    { email: string, amount: number, shippingCostPerKm: number, restaurant: string, userLatitude: string, userLongitude: string, clerkId: string, cart: Record<string, any> }
  ) => {
    const customers = await stripe.customers.list();
    const userFound = await userService.getUserByClerkId(clerkId)

    if (!userFound) throw new Error('User not found');

    let customer = customers.data.find((customer) => customer.email === email);
    if (!customer) {
      customer = await stripe.customers.create({ email });
    }

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2020-08-27' },
    );

    const totalFinal = paymentService.getTotal(amount, shippingCostPerKm);

    const finalCart = Object.keys(cart).reduce((prev, curr) => {
      const item = cart[curr];
      const {
        description,
        is_available,
        created_at,
        updated_at,
        image_max,
        image_min,
        image_med,
        ...rest
      } = item;
      prev[curr] = { ...rest };
      return prev;
    }, {} as Record<string, any>);


    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.ceil(totalFinal * 100),
      currency: 'mxn',
      customer: customer.id,
      payment_method_types: ['card'],
      metadata: {
        email,
        restaurant,
        userLatitude: userLatitude,
        userLongitude: userLongitude,
        total_price: totalFinal,
        delivery_fee: shippingCostPerKm,
        user_id: userFound.id!,
        cart: JSON.stringify(finalCart),
      },
    });

    return {
      paymentIntent: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    };
  }
}
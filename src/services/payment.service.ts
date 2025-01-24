import Stripe from 'stripe';
import dotenv from 'dotenv';
import XLSX from 'xlsx';
import { userService } from './user.service';
import moment from 'moment';
import { OrderRepository } from '../repositories/Order.repository';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const paymentService = {
  getTotal: (amount: number, shippingCostPerKm: number, deliveryPtg: string) => {
    const platformFee = 15;
    const plaformFeeAmount = amount * (platformFee / 100);

    const baseShippingCost = 15;
    const shippingCost = shippingCostPerKm + baseShippingCost;

    const deliveryPtgAmount = amount * (Number(deliveryPtg) / 100);

    const desiredNetAmount = amount + plaformFeeAmount + shippingCost + deliveryPtgAmount;

    const stripeComission = 7;
    const stripePercentage = stripeComission / 100;

    const totalFinal = Math.ceil(desiredNetAmount / (1 - stripePercentage));

    return {
      totalFinal,
      plaformFeeAmount,
      shippingCost,
      deliveryPtgAmount,
    };
  },
  generateParams: async (
    { email, amount, shippingCostPerKm, restaurant, userLatitude, userLongitude, clerkId, cart, deliveryPtg }:
      { email: string, amount: number, shippingCostPerKm: number, restaurant: string, userLatitude: string, userLongitude: string, clerkId: string, cart: Record<string, any>, deliveryPtg: string }
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

    const { totalFinal, plaformFeeAmount, shippingCost, deliveryPtgAmount } = paymentService.getTotal(amount, shippingCostPerKm, deliveryPtg);

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
        user_id: userFound.id!,
        cart: JSON.stringify(finalCart),
        email,
        restaurant,
        userLatitude: userLatitude,
        userLongitude: userLongitude,
        // restaurant
        restaurantAmount: amount,
        // delivery
        delivery_fee: shippingCost,
        delivery_ptg_amount: deliveryPtgAmount,
        // platform
        plaform_fee_amount: plaformFeeAmount,

        // total
        total_price: totalFinal,
      },
    });

    return {
      paymentIntent: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    };
  },
  generatePaymentReport: async ({ startDate, endDate }: { startDate: string, endDate: string }) => {
    if (!startDate || !endDate) throw new Error('Invalid date range');

    const start = moment(startDate, 'DD/MM/YYYY').startOf('day').toDate();
    const end = moment(endDate, 'DD/MM/YYYY').endOf('day').toDate();

    const orders = await OrderRepository.find({ created_at: { gte: start, lte: end } }, { restaurants: { include: { admins: true } }, delivery_drivers: true });

    const parsedOrders = orders.map((order) => {
      return {
        'Fecha de creación': moment(order.created_at).format('DD/MM/YYYY HH:mm:ss'),
        'Fecha de actualización': moment(order.updated_at).format('DD/MM/YYYY HH:mm:ss'),
        'ID de la orden': order.id,
        'Administrador': order.restaurants.admins?.stripe_account,
        'Monto a pagar al restaurante': Number(order.amount),
        'Repartidor': order.delivery_drivers?.name,
        'Costo de envío': Number(order.delivery_fee),
        'Propina repartidor': Number(order.delivery_ptg_amount),
        'Monto a pagar al repartidor': Number(order.delivery_fee) + Number(order.delivery_ptg_amount),
        'Monto total': Number(order.total_price),
      };
    });

    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(parsedOrders);

    XLSX.utils.book_append_sheet(workBook, workSheet, 'Reporte de pagos');
    const date = new Date();
    const fileName = `Reporte de pagos ${date.toISOString()}.xlsx`;
    const buffer = XLSX.write(workBook, { bookType: 'xlsx', type: 'buffer' });

    return {
      buffer,
      fileName,
    }
  }
}
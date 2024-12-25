"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeController = void 0;
const stripe_1 = __importDefault(require("stripe"));
const order_service_1 = require("../services/order.service");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
exports.stripeController = {
    handleWebhook: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const sig = req.headers['stripe-signature'];
        try {
            const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
            switch (event.type) {
                case 'payment_intent.succeeded': {
                    const paymentIntent = event.data.object;
                    const orderFound = yield order_service_1.orderService.findByPaymentIntentId(paymentIntent.id);
                    if (!orderFound)
                        throw new Error('Order not found');
                    yield order_service_1.orderService.updateOne(orderFound.id, { status: 'in_progress', payment_status: 'completed' });
                    break;
                }
                case 'payment_intent.canceled': {
                    const paymentIntent = event.data.object;
                    const orderFound = yield order_service_1.orderService.findByPaymentIntentId(paymentIntent.id);
                    if (!orderFound)
                        throw new Error('Order not found');
                    yield order_service_1.orderService.updateOne(orderFound.id, { status: 'cancelled', payment_status: 'rejected' });
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
    }),
};

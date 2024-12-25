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
exports.paymentService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
exports.paymentService = {
    getTotal: (amount, shippingCostPerKm) => {
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
    createCustomer: (name, email) => __awaiter(void 0, void 0, void 0, function* () {
        let customer;
        const existingCustomer = yield stripe.customers.list({ email });
        if (existingCustomer.data.length > 0)
            customer = existingCustomer.data[0];
        else {
            const newCustomer = yield stripe.customers.create({ email, name });
            customer = newCustomer;
        }
        return customer;
    }),
    createPaymentIntent: (amount, shippingCostPerKm, customer) => __awaiter(void 0, void 0, void 0, function* () {
        const totalFinal = exports.paymentService.getTotal(amount, shippingCostPerKm);
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: Math.round(totalFinal * 100),
            currency: "mxn",
            customer: customer === null || customer === void 0 ? void 0 : customer.id,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never",
            },
        });
        return {
            paymentIntent,
            customer: customer === null || customer === void 0 ? void 0 : customer.id,
        };
    }),
    pay: (payment_method_id, payment_intent_id, customer_id) => __awaiter(void 0, void 0, void 0, function* () {
        const paymentMethod = yield stripe.paymentMethods.attach(payment_method_id, {
            customer: customer_id,
        });
        const result = yield stripe.paymentIntents.confirm(payment_intent_id, {
            payment_method: paymentMethod.id,
        });
        return result;
    })
};

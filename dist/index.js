"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_2 = require("@clerk/express");
const user_route_1 = __importDefault(require("./routes/user.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const restaurant_route_1 = __importDefault(require("./routes/restaurant.route"));
const userAddress_route_1 = __importDefault(require("./routes/userAddress.route"));
const product_route_1 = __importDefault(require("./routes/product.route"));
const payment_route_1 = __importDefault(require("./routes/payment.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const stripe_route_1 = __importDefault(require("./routes/stripe.route"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((req, res, next) => {
    if (req.originalUrl === "/stripe/webhook") {
        next();
    }
    else {
        express_1.default.json()(req, res, next);
    }
});
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('home');
});
app.get("/version", (req, res) => {
    res.send("1.0.0");
});
app.use('/users', user_route_1.default);
app.use('/auth', auth_route_1.default);
app.use('/restaurants', restaurant_route_1.default);
app.use('/user-addresses', (0, express_2.requireAuth)(), userAddress_route_1.default);
app.use('/products', product_route_1.default);
app.use('/payments', (0, express_2.requireAuth)(), payment_route_1.default);
app.use('/orders', order_route_1.default);
app.use('/stripe', stripe_route_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailService = void 0;
exports.mailService = {
    sendMail: (to, subject, message) => {
        console.log(`Sending email to ${to} with subject ${subject} and message ${message}`);
    },
    sendWelcomeMail: (to) => {
        exports.mailService.sendMail(to, 'Welcome to our platform', 'Welcome to our platform');
    },
    sendPasswordResetMail: (to) => {
        exports.mailService.sendMail(to, 'Reset your password', 'Reset your password');
    },
    sendOrderConfirmationMail: (to) => {
        exports.mailService.sendMail(to, 'Order confirmation', 'Order confirmation');
    }
};

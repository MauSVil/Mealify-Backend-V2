export const mailService = {
  sendMail: (to: string, subject: string, message: string) => {
    console.log(`Sending email to ${to} with subject ${subject} and message ${message}`);
  },

  sendWelcomeMail: (to: string) => {
    mailService.sendMail(to, 'Welcome to our platform', 'Welcome to our platform');
  },

  sendPasswordResetMail: (to: string) => {
    mailService.sendMail(to, 'Reset your password', 'Reset your password');
  },

  sendOrderConfirmationMail: (to: string) => {
    mailService.sendMail(to, 'Order confirmation', 'Order confirmation');
  }
}
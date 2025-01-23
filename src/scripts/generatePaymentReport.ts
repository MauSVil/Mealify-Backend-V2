import { paymentService } from "src/services/payment.service";

const main = async () => {
  try {
    const file = await paymentService.generatePaymentReport({ startDate: '2021-01-01', endDate: '2021-01-31' });
    console.log(file);
  }
  catch (error) {
    console.error(error);
  }
}

main();
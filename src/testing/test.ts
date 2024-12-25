import { orderService } from "src/services/order.service"

const init = async () => {
  const orderFound = await orderService.findByPaymentIntentId('pi_3QZkncBV9Ssjkt8C1pEJQ1HQ');
  console.log({ orderFound });
}

init();
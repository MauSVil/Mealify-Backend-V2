import webSocketService from "../../services/webSocket.service";
import { deliveryDriverService } from "../../services/deliveryDriver.service";
import { orderService } from "../../services/order.service";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const handlePaymentSuccess = async (msg: any) => {
  const { orderId } = msg;
  const orderFound = await orderService.findById({ id: Number(orderId), includeRelations: { restaurants: true } });
  if (!orderFound?.id) throw new Error('Order not found');

  // Notify Restaurant
  await orderService.updateOne(Number(orderId), { status: 'preparing', payment_status: 'completed' });
  webSocketService.emitToRoom('message', `order_${orderId}`, { type: 'order_status_change', payload: { status: 'preparing' } });
}
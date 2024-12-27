import webSocketService from "../../services/webSocket.service";
import { deliveryDriverService } from "../../services/deliveryDriver.service";
import { orderService } from "../../services/order.service";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const handlePaymentSuccess = async (msg: any) => {
  const { orderId } = msg;
  const orderFound = await orderService.findById({ id: Number(orderId), includeRelations: { restaurants: true } });
  if (!orderFound?.id) throw new Error('Order not found');

  await orderService.updateOne(Number(orderId), { status: 'in_progress', payment_status: 'completed' });

  const candidates = await deliveryDriverService.findCandidates(
    { longitude: orderFound.restaurants.longitude, latitude: orderFound.restaurants.latitude },
    { longitude: orderFound.longitude, latitude: orderFound.latitude }
  )

  const randomIndex = Math.floor(Math.random() * candidates.length);
  const driver = candidates[randomIndex];

  await orderService.updateOne(Number(orderId), { driver_id: driver.id });

  await sleep(10000);

  webSocketService.emitToRoom(orderId, { type: 'order_assigned' })

}
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
  webSocketService.emitToRoom(orderId, { type: 'order_status_change', payload: { status: 'preparing' } });

  // await sleep(15000);
  // await orderService.updateOne(Number(orderId), { status: 'ready_for_pickup' });
  // webSocketService.emitToRoom(orderId, { type: 'order_status_change', payload: { status: 'ready_for_pickup' } });
  // await sleep(15000);

  // const candidates = await deliveryDriverService.findCandidates(
  //   { longitude: orderFound.restaurants.longitude, latitude: orderFound.restaurants.latitude },
  //   { longitude: orderFound.longitude, latitude: orderFound.latitude }
  // )

  // const randomIndex = Math.floor(Math.random() * candidates.length);
  // const driver = candidates[randomIndex];

  // await orderService.updateOne(Number(orderId), { driver_id: driver.id, status: 'in_progress' });
  // webSocketService.emitToRoom(orderId, { type: 'order_assigned', payload: { driverId: driver.id, status: 'in_progress' } });
  // await sleep(15000);
}
import { Decimal } from "@prisma/client/runtime/library";
import { deliveryDriverService } from "src/services/deliveryDriver.service";
import { restaurantsService } from "src/services/restaurant.service";

const init = async () => {
  const restaurants = await restaurantsService.getRestaurants();
  const restaurant = restaurants[0];

  const deliveryCandidates = await deliveryDriverService.findCandidates(
    { longitude: restaurant.longitude, latitude: restaurant.latitude },
    { longitude: new Decimal(-99.239338), latitude: new Decimal(19.502275) }
  )

  console.log(deliveryCandidates, 'deliveryCandidates');
}

init();
import { deliveryDriverService } from "src/services/deliveryDriver.service";
import { restaurantsService } from "src/services/restaurant.service";

const init = async () => {
  const restaurants = await restaurantsService.getRestaurants();
  const restaurant = restaurants[0];

  const deliveryCandidates = await deliveryDriverService.findCandidates(
    { longitude: restaurant.longitude.toNumber(), latitude: restaurant.latitude.toNumber() },
    { longitude: -99.239338, latitude: 19.502275 }
  )

  console.log(deliveryCandidates, 'deliveryCandidates');
}

init();
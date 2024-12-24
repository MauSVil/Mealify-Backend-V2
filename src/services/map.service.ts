import axios from "axios";
import { GoogleMapsDirectionsResponse } from "../types/GoogleMaps.type";

export const mapService = {
  getEstimatedTime: (origin: { lat: number, lon: number }, destination: { lat: number, lon: number }) => {
    // Call Google Maps API to get the estimated time
  },
  getDistance: (origin: { lat: number, lon: number }, destination: { lat: number, lon: number }) => {
    const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

    const R = 6371;
    const dLat = toRadians(destination.lat - origin.lat);
    const dLon = toRadians(destination.lon - origin.lon);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(origin.lat)) *
        Math.cos(toRadians(destination.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },
  getRoute: (origin: { lat: number, lon: number }, destination: { lat: number, lon: number }) => {
    // Call Google Maps API to get the route
  },
  getRealDistance: async (origin: { lat: number, lon: number }, destination: { lat: number, lon: number }) => {
    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json`;
    const directionsParams = {
      origin: `${origin.lat},${origin.lon}`,
      destination: `${destination.lat},${destination.lon}`,
      key: process.env.MAPS_KEY!,
      mode: 'driving',
    };

    const { data }: { data: GoogleMapsDirectionsResponse } = await axios.get(directionsUrl, { params: directionsParams });

    if (data.status !== 'OK') throw new Error('Error getting directions');
    const route = data.routes[0].legs[0];
    const distanceInMeters = route.distance.value;
    const durationInSeconds = route.duration.value;

    const distanceInKm = distanceInMeters / 1000;

    return {
      distanceInKm,
      durationInSeconds,
      distance: route.distance.text,
      duration: route.duration.text,
    }
  }
};
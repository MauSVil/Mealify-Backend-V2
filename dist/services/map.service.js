"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapService = void 0;
const axios_1 = __importDefault(require("axios"));
exports.mapService = {
    getEstimatedTime: (origin, destination) => {
        // Call Google Maps API to get the estimated time
    },
    getDistance: (origin, destination) => {
        const toRadians = (degrees) => degrees * (Math.PI / 180);
        const R = 6371;
        const dLat = toRadians(destination.lat - origin.lat);
        const dLon = toRadians(destination.lon - origin.lon);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(origin.lat)) *
                Math.cos(toRadians(destination.lat)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    },
    getRoute: (origin, destination) => {
        // Call Google Maps API to get the route
    },
    getRealDistance: (origin, destination) => __awaiter(void 0, void 0, void 0, function* () {
        const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json`;
        const directionsParams = {
            origin: `${origin.lat},${origin.lon}`,
            destination: `${destination.lat},${destination.lon}`,
            key: process.env.MAPS_KEY,
            mode: 'driving',
        };
        const { data } = yield axios_1.default.get(directionsUrl, { params: directionsParams });
        if (data.status !== 'OK')
            throw new Error('Error getting directions');
        const route = data.routes[0].legs[0];
        const distanceInMeters = route.distance.value;
        const durationInSeconds = route.duration.value;
        const distanceInKm = distanceInMeters / 1000;
        return {
            distanceInKm,
            durationInSeconds,
            distance: route.distance.text,
            duration: route.duration.text,
        };
    })
};

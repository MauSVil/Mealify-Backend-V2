import { Request, Response } from 'express';
import { mapBoxService } from '../services/mapbox.service';

export const mapController = {
  getRoute: async (req: Request, res: Response) => {
    try {
      const { origin, destination } = req.query as { origin: string, destination: string };
      if (!origin || !destination) throw new Error('Origin and destination are required');
      
      const originCoords = origin.split(",").map(Number);
      const destinationCoords = destination.split(",").map(Number);

      if (originCoords.length !== 2 || destinationCoords.length !== 2) throw new Error('Invalid coordinates');
      
      const route = await mapBoxService.getRoute({ lat: originCoords[0], long: originCoords[1] }, { lat: destinationCoords[0], long: destinationCoords[1] });
      return res.json(route);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
        return
      }
      res.status(500).send('Internal Server Error');
    }
  },
}
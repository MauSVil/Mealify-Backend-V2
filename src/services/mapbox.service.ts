export const mapBoxService = {
  getRoute: async (origin: { lat: number, long: number }, destination: { lat: number, long: number }) => {
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.long},${origin.lat};${destination.long},${destination.lat}?geometries=geojson&access_token=${process.env.MAPBOX_ACCESS_TOKEN!}`;
  
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.routes.length > 0) {
        const coordinates = data.routes[0].geometry.coordinates.map(([lng, lat]: any[]) => ({
          latitude: lat,
          longitude: lng,
        }));
        return coordinates;
      }
      return [];
    } catch (error) {
      console.error("Error obteniendo la ruta:", error);
      return [];
    }
  },
}
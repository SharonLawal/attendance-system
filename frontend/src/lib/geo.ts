export function generateGeoJSONCircle(center: [number, number], radiusInMeters: number, points = 32) {
  const longitude = center[0];
  const latitude = center[1];
  const ret: [number, number][] = [];
  const distanceX = radiusInMeters / (111320 * Math.cos(latitude * Math.PI / 180));
  const distanceY = radiusInMeters / 110574;

  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);
    ret.push([longitude + x, latitude + y]);
  }

  // Close the polygon
  ret.push(ret[0]);

  return {
    type: 'Polygon',
    coordinates: [ret]
  };
}

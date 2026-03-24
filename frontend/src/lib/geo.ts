/**
 * @fileoverview Contextual execution boundary for frontend/src/lib/geo.ts
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
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

  ret.push(ret[0]);

  return {
  };
}

export function getGeolocationErrorMessage(error: any): string {
    if (error && typeof error.code === 'number') {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                return "Location access is required to sign attendance. Please enable it in your browser settings.";
            case error.POSITION_UNAVAILABLE:
                return "Location information is unavailable.";
            case error.TIMEOUT:
                return "The request to get user location timed out.";
            default:
                return "An unknown error occurred while requesting location.";
        }
    }
    return "Failed to establish location.";
}

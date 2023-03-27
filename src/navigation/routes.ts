export type Routes = {
  Main: string;
  Physics: string;
  WeatherAsync: string;
  Weather: string;
  Clock: string;
  Knife: string;
  Box: string;
}

export const BASE_ROUTE = process.env.PUBLIC_URL;

export const ROUTES: Routes = {
  Main: '/',
  Physics: '/physics',
  WeatherAsync: '/weather-async',
  Weather: '/weather',
  Clock: '/clock',
  Knife: '/knife',
  Box: '/box',
}

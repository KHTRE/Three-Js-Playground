export type Routes = {
  Main: string;
  Physics: string;
  WeatherAsync: string;
  Weather: string;
  Clock: string;
  Knife: string;
  Box: string;
}

const baseRoute = '/Three-Js-Playground'

export const ROUTES: Routes = {
  Main: baseRoute,
  Physics: baseRoute + '/physics',
  WeatherAsync: '/weather-async',
  Weather: '/weather',
  Clock: '/clock',
  Knife: '/knife',
  Box: '/box',
}

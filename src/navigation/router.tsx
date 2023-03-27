import {createBrowserRouter} from "react-router-dom";
import Box from "../components/Box";
import Clock from "../components/Clock";
import Knife from "../components/Knife";
import Main from "../components/Main";
import Physics from "../components/Physics";
import Weather from "../components/Weather";
import WeatherAsync from "../components/WeatherAsync";
import { ROUTES } from "./routes";

export const router = createBrowserRouter([
  {path: ROUTES.Main, element: <Main/>},
  {path: ROUTES.Physics, element: <Physics />},
  {path: ROUTES.Weather, element: <Weather />},
  {path: ROUTES.WeatherAsync, element: <WeatherAsync />},
  {path: ROUTES.Knife, element: <Knife />},
  {path: ROUTES.Clock, element: <Clock />},
  {path: ROUTES.Box, element: <Box />},
]);
import { createRef, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ROUTES } from '../navigation/routes';


type Props = {};


const Main: React.FC<Props> = () => {
  

  return <ul>
    <li><a href={ROUTES.Physics}>Physics</a></li>
    <li><a href={ROUTES.Box}>Box</a></li>
    <li><a href={ROUTES.Clock}>Clock</a></li>
    <li><a href={ROUTES.Weather}>Weather</a></li>
    <li><a href={ROUTES.WeatherAsync}>WeatherAsync</a></li>
    <li><a href={ROUTES.Knife}>Knife</a></li>
  </ul>;
}

export default Main;
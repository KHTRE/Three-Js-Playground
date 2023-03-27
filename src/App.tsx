import React from 'react';
import Box from './components/Box';
import Clock from './components/Clock';
import Knife from './components/Knife';
import Physics from './components/Physics';
import Weather from './components/Weather';
import WeatherAsync from './components/WeatherAsync';
import {Routes, Route} from "react-router-dom";
import { ROUTES } from './navigation/routes';
import Main from './components/Main';

function App() {
  return (
    <Routes>
      <Route path={ROUTES.Main} element={<Main />}/>
      <Route path={ROUTES.Physics} element={<Physics />}/>
      <Route path={ROUTES.Box} element={<Box />}/>
      <Route path={ROUTES.Clock} element={<Clock />}/>
      <Route path={ROUTES.Weather} element={<Weather />}/>
      <Route path={ROUTES.WeatherAsync} element={<WeatherAsync />}/>
      <Route path={ROUTES.Knife} element={<Knife />}/>
    </Routes>
  );
}

export default App;

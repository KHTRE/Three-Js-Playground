import React from 'react';
import Box from './components/Box';
import Clock from './components/Clock';
import Knife from './components/Knife';
import Physics from './components/Physics';
import Weather from './components/Weather';
import WeatherAsync from './components/WeatherAsync';
import {RouterProvider} from "react-router-dom";
import { router } from './navigation/router';


function App() {
  return (
    <>   
      <RouterProvider router={router} />
    </>
  );
}

export default App;

import React from 'react';
import Box from './components/Box';
import Clock from './components/Clock';
import Knife from './components/Knife';
import Physics from './components/Physics';
import Weather from './components/Weather';
import WeatherAsync from './components/WeatherAsync';
import {RouterProvider, BrowserRouter, Routes, Route} from "react-router-dom";
import { router } from './navigation/router';
import { BASE_ROUTE, ROUTES } from './navigation/routes';
import Main from './components/Main';

console.log(process.env.PUBLIC_URL);

function App() {
  return (
    // <>   
    //   <RouterProvider router={router} />
    // </>
    <div>
      <BrowserRouter basename={BASE_ROUTE}>
        <Routes>
          <Route path={ROUTES.Main} element={<Main />}/>
          <Route path={ROUTES.Physics} element={<Physics />}/>
          <Route path={ROUTES.Box} element={<Box />}/>
          <Route path={ROUTES.Clock} element={<Clock />}/>
          <Route path={ROUTES.Weather} element={<Weather />}/>
          <Route path={ROUTES.WeatherAsync} element={<WeatherAsync />}/>
          <Route path={ROUTES.Knife} element={<Knife />}/>
        </Routes>      
      </BrowserRouter>
    </div>
  );
}

export default App;

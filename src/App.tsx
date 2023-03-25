import React from 'react';
import Box from './components/Box';
import Clock from './components/Clock';
import Knife from './components/Knife';
import Weather from './components/Weather';
import WeatherAsync from './components/WeatherAsync';

function App() {
  return (
    <>   
      <WeatherAsync />
      {/* <Weather /> */}
      {/* <Clock /> */}
      {/* <Knife /> */}
      {/* <Box /> */}
    </>
  );
}

export default App;

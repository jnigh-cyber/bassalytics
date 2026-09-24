import type { Request, Response } from 'express';
import express from 'express';

const app = express();
const PORT = process.env.PORT ?? 3000;
const omURL = 'https://api.open-meteo.com/v1/forecast';
const params = new URLSearchParams({
  latitude: '36.1593',
  longitude: '-79.8891',
  current: 'temperature_2m,weather_code',
});

type CurrentWeather = {
  current: {
    temperature_2m: number;
    weather_code: number;
  };
};

//Health check.
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

//Grabs current weather data.
app.get('/api/weather', async (req: Request, res: Response) => {
  try {
    const api_url = `${omURL}?${params}`;
    const omRes = await fetch(api_url);
    if (!omRes.ok) {
      throw new Error(`Open-Meteo responded ${omRes.status}`);
    }
    const data: CurrentWeather = await omRes.json();
    res.json({
      current: {
        tempC: data.current.temperature_2m,
        weatherCode: data.current.weather_code,
      },
    });
  } catch (err) {
    console.log(err);
    res
      .status(502)
      .json({ status: 'error', message: 'Weather service unavailable.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

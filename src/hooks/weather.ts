import { useState, useEffect } from "react";
import axios from "axios";
import { WeatherData } from "../types/WeatherTypes";

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const useWeather = (lat: number, lon: number) => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lat || !lon) return;

    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [currentRes] = await Promise.all([
          axios.get(`${BASE_URL}/weather`, {
            params: {
              lat,
              lon,
              appid: API_KEY,
              units: "metric",
              lang: "kr",
            },
          }),
        ]);
        const currentData = currentRes.data;
        setCurrentWeather({
          temp: currentData.main.temp,
          description: currentData.weather[0].description,
          humidity: currentData.main.humidity,
          windSpeed: currentData.wind.speed,
          icon: `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`,
        });
      } catch (err) {
        setError("오류 발생");
      } finally {
        setLoading(false);
      }
    };
    fetchWeatherData();
  }, [lat, lon]);
  return { currentWeather, loading, error };
};

export default useWeather;

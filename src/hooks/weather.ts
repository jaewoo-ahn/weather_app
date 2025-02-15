import { useState, useEffect } from "react";
import axios from "axios";
import {
  WeatherData,
  HourlyWeather,
  DailyWeather,
} from "../types/WeatherTypes";

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const useWeather = (lat: number, lon: number) => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );
  const [hourlyWeather, setHourlyWeather] = useState<HourlyWeather[]>([]);
  const [dailyWeather, setDailyWeather] = useState<DailyWeather[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lat || !lon) return;

    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [currentRes, forecastRes] = await Promise.all([
          axios.get(`${BASE_URL}/weather`, {
            params: {
              lat,
              lon,
              appid: API_KEY,
              units: "metric",
              lang: "kr",
            },
          }),
          axios.get(`${BASE_URL}/forecast`, {
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
        const hourlyData = forecastRes.data.list.map((item: any) => ({
          time: new Date(item.dt * 1000).getHours() + "시",
          temp: item.main.temp,
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
          icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
        }));
        setHourlyWeather(hourlyData);
        const dailyData = forecastRes.data.list
          .filter((item: any) => new Date(item.dt * 1000).getHours() === 12)
          .map((item: any) => ({
            date: new Date(item.dt * 1000).toLocaleDateString("ko-KR", {
              month: "numeric",
              day: "numeric",
              weekday: "short",
            }),
            minTemp: item.main.temp_min,
            maxTemp: item.main.temp_max,
            icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
          }));
        setDailyWeather(dailyData);
      } catch (err) {
        setError("오류 발생");
      } finally {
        setLoading(false);
      }
    };
    fetchWeatherData();
  }, [lat, lon]);
  return { currentWeather, hourlyWeather, dailyWeather, loading, error };
};

export default useWeather;

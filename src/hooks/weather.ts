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
        // console.log(forecastRes);
        const getWindDirection = (deg: number) => {
          if (deg >= 337.5 || deg < 22.5) return "북풍";
          if (deg >= 22.5 && deg < 67.5) return "북동풍";
          if (deg >= 67.5 && deg < 112.5) return "동풍";
          if (deg >= 112.5 && deg < 157.5) return "남동풍";
          if (deg >= 157.5 && deg < 202.5) return "남풍";
          if (deg >= 202.5 && deg < 247.5) return "남서풍";
          if (deg >= 247.5 && deg < 292.5) return "서풍";
          return "북서풍";
        };

        const formatTime = (timestamp: number): string => {
          const date = new Date(timestamp * 1000); // 초를 밀리초로 변환
          const hours = date.getHours().toString().padStart(2, "0"); // 두 자리 시간
          const minutes = date.getMinutes().toString().padStart(2, "0"); // 두 자리 분
          return `${hours}:${minutes}`;
        };
        const currentData = currentRes.data;
        setCurrentWeather({
          temp: currentData.main.temp,
          description: currentData.weather[0].description,
          humidity: currentData.main.humidity,
          windSpeed: currentData.wind.speed,
          icon: `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`,
          fillLike: currentData.main.feels_like,
          sunset: formatTime(currentData.sys.sunset),
          windDirection: getWindDirection(currentData.wind.deg),
        });
        const hourlyData = forecastRes.data.list.map((item: any) => ({
          time: new Date(item.dt * 1000).getHours() + "시",
          temp: item.main.temp,
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
          icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
          pop: item.pop,
          rain: item.rain?.["1h"] || 0,
        }));
        setHourlyWeather(hourlyData);

        const dailyData = forecastRes.data.list.reduce(
          (acc: DailyWeather[], item: any) => {
            const date = new Date(item.dt * 1000);
            const day = date.toLocaleDateString("ko-KR", {
              month: "numeric",
              day: "numeric",
              weekday: "short",
            });

            const hour = date.getHours();
            const existing = acc.find((d) => d.date === day);

            if (!existing) {
              acc.push({
                date: day,
                minTemp: item.main.temp_min,
                maxTemp: item.main.temp_max,
                morningTemp: hour === 9 ? item.main.temp : 0,
                afternoonTemp: hour === 15 ? item.main.temp : 0,
                iconMorning:
                  hour === 9
                    ? `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
                    : "",
                iconAfternoon:
                  hour === 15
                    ? `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`
                    : "",
                morningRain: hour === 9 ? item.pop * 100 : 0,
                afternoonRain: hour === 15 ? item.pop * 100 : 0,
              });
            } else {
              if (hour === 9) {
                existing.morningTemp = item.main.temp;
                existing.iconMorning = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
                existing.morningRain = item.pop * 100;
              }
              if (hour === 15) {
                existing.afternoonTemp = item.main.temp;
                existing.iconAfternoon = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
                existing.afternoonRain = item.pop * 100;
              }
            }
            return acc;
          },
          []
        );

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

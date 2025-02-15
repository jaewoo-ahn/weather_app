export interface WeatherData {
  temp: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface HourlyWeather {
  time: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface DailyWeather {
  date: string;
  minTemp: number;
  maxTemp: number;
  icon: string;
}

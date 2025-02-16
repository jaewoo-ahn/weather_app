export interface WeatherData {
  temp: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  fillLike: number;
  sunset: string;
  windDirection: string;
}

export interface HourlyWeather {
  time: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  icon: string;
  pop: number;
  rain: number;
}
export interface DailyWeather {
  date: string;
  minTemp: number;
  maxTemp: number;
  morningTemp: number;
  afternoonTemp: number;
  iconMorning: string;
  iconAfternoon: string;
  morningRain: number;
  afternoonRain: number;
}

import { useEffect } from "react";
import { fetchWeatherData } from "../hooks/useWeather";

const Home = () => {
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;

      fetchWeatherData(lat, lon);
    });
  }, []);

  return (
    <div>
      <section>현재날씨</section>
      <section>시간별 날씨</section>
      <section>주간날씨</section>
    </div>
  );
};

export default Home;

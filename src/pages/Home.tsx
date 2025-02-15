import { useEffect, useState } from "react";
import useWeather from "../hooks/weather";

const Home = () => {
  const [lat, setLat] = useState<number>(0);
  const [lon, setLon] = useState<number>(0);

  const currentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLat(lat);
          setLon(lon);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  useEffect(() => {
    currentLocation();
  }, [lat, lon]);

  const { currentWeather, hourlyWeather, loading, error } = useWeather(
    lat,
    lon
  );
  console.log(hourlyWeather);

  return (
    <div>
      <section>
        현재날씨
        <button
          onClick={() => {
            currentLocation();
          }}
        >
          현재위치
        </button>
      </section>
      <section>시간별 날씨</section>
      <section>주간날씨</section>
    </div>
  );
};

export default Home;

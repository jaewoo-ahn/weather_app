import { useEffect, useState } from "react";
import { fetchWeatherData } from "../api/useWeather";

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
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    currentLocation();
    fetchWeatherData(lat, lon);
  }, [lat, lon]);

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

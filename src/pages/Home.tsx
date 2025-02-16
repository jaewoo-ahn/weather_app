import { useEffect, useState } from "react";
import useWeather from "../hooks/weather";
import axios from "axios";
import { MdOutlineLocationSearching } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";

const Home = () => {
  const [lat, setLat] = useState<number>(0);
  const [lon, setLon] = useState<number>(0);
  const [location, setLocation] = useState<any>({});
  const { currentWeather, hourlyWeather, dailyWeather, loading, error } =
    useWeather(lat, lon);

  const currentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLon(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const fetchLocationName = async (lat: number, lon: number) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse`,
        {
          params: { lat, lon, format: "json", addressdetails: 1 },
        }
      );
      setLocation(response.data.address);
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  useEffect(() => {
    currentLocation();
    fetchLocationName(lat, lon);
  }, [lat, lon]);

  if (loading)
    return <p className="text-center text-lg">Loading weather data...</p>;
  if (error)
    return (
      <p className="text-center text-lg text-red-500">Error fetching data</p>
    );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <section className="bg-blue-300 p-5 rounded-3xl">
        <div className="flex items-center">
          <FaRegStar size={30} className="text-gray-400" />
          <div className="text-3xl ml-2 font-bold flex">
            <p>{location?.borough}</p>
            <p className="ml-2">{location?.suburb}</p>
          </div>
          <MdOutlineLocationSearching
            size={30}
            className="ml-2 text-gray-400 cursor-pointer"
            onClick={currentLocation}
          />
        </div>
        <div className="w-full md:w-3/4 flex justify-between items-center p-4 bg-gray-100 rounded-2xl mt-3">
          <div className="flex items-center">
            <img
              src={currentWeather?.icon}
              alt="weather"
              className="w-16 h-16"
            />
            <p className="ml-4 text-2xl font-bold">{currentWeather?.temp}°</p>
            <p className="ml-4 text-lg font-bold">
              {currentWeather?.description}
            </p>
          </div>
          <div className="text-sm md:text-base font-bold">
            <p>습도: {currentWeather?.humidity}%</p>
            <p>체감: {currentWeather?.fillLike}°</p>
            <p>
              {currentWeather?.windDirection} {currentWeather?.windSpeed}m/s
            </p>
          </div>
        </div>
      </section>
      <section className="overflow-x-auto flex mt-4">
        <div className="min-w-[10rem] flex flex-col justify-between items-center text-center px-4 py-8 font-bold border-r-2 border-2">
          <p className="w-16">오늘</p>
          <div className="mt-10 md:mt-32">
            <p>강수확률</p>
            <p>강수량</p>
            <p>바람</p>
            <p>습도</p>
          </div>
        </div>
        <div className="flex">
          {hourlyWeather.map((res, idx) => (
            <div
              key={idx}
              className="w-[8rem] flex flex-col justify-between items-center text-center px-4 py-8 font-bold border-2 transition-transform duration-300 ease-in-out transform hover:scale-105 hover:translate-y-[-10px]"
            >
              <p>{res.time}</p>
              <img src={res.icon} alt="weather-icon" className="w-10 h-10" />
              <p className="mt-10">{res.temp}</p>
              <div className="mt-10 md:mt-32">
                <p>{res.pop}</p>
                <p>{res.rain}</p>
                <p>{res.windSpeed}</p>
                <p>{res.humidity}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-white p-5 rounded-xl shadow-md mt-4">
        <h2 className="text-lg font-bold mb-3">주간예보</h2>
        <div className="flex overflow-x-auto">
          {dailyWeather.map((day, idx) => (
            <div
              key={idx}
              className="min-w-[100px] text-center border rounded-lg p-2 mx-1 bg-gray-100"
            >
              <p className="text-sm font-semibold">{day.date}</p>
              <div className="flex justify-center my-2">
                <img
                  src={day.iconMorning}
                  alt="morning"
                  className="w-8 h-8 mx-1"
                />
                <img
                  src={day.iconAfternoon}
                  alt="afternoon"
                  className="w-8 h-8 mx-1"
                />
              </div>
              <p className="text-lg font-bold">
                <span className="text-blue-500">{day.minTemp}°</span> /{" "}
                <span className="text-red-500">{day.maxTemp}°</span>
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

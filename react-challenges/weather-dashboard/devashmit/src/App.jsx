import { useState } from "react";
import { useWeather } from "./hooks/useWeather";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastList from "./components/ForecastList";
import Skeleton from "./components/Skeleton";

export default function App() {
  const [city, setCity] = useState("");
  const [unit, setUnit] = useState("C");
  const { weather, forecast, loading, error } = useWeather(city);

  return (
    <div className="app">
      <header className="app__header">
        <h1>🌤️ Weather Dashboard</h1>
        <p>Real-time weather powered by OpenWeatherMap</p>
      </header>
      <SearchBar onSearch={setCity} loading={loading} />
      {loading && <Skeleton />}
      {!loading && error && (
        <div className="error-card" role="alert">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}
      {!loading && weather && (
        <>
          <WeatherCard weather={weather} unit={unit} onToggle={() => setUnit(u => u === "C" ? "F" : "C")} />
          {forecast && <ForecastList forecast={forecast} unit={unit} />}
        </>
      )}
      {!loading && !weather && !error && (
        <div className="empty-state">
          <span>🔍</span>
          <p>Search for a city to see the weather</p>
        </div>
      )}
    </div>
  );
}

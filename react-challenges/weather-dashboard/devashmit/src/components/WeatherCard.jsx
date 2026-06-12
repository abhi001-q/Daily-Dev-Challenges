export default function WeatherCard({ weather, unit, onToggle }) {
  const temp = unit === "C" ? weather.main.temp : (weather.main.temp * 9/5 + 32);
  const feels = unit === "C" ? weather.main.feels_like : (weather.main.feels_like * 9/5 + 32);
  const icon = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

  return (
    <div className="weather-card">
      <div className="weather-card__top">
        <div>
          <h2 className="weather-card__city">{weather.name}, {weather.sys.country}</h2>
          <p className="weather-card__desc">{weather.weather[0].description}</p>
        </div>
        <img src={icon} alt={weather.weather[0].description} width={80} height={80} />
      </div>
      <div className="weather-card__temp">
        {Math.round(temp)}°{unit}
        <button className="unit-toggle" onClick={onToggle} aria-label="Toggle unit">
          °{unit === "C" ? "F" : "C"}
        </button>
      </div>
      <div className="weather-card__stats">
        <div className="stat"><span>💧</span>{weather.main.humidity}%<small>Humidity</small></div>
        <div className="stat"><span>🌡️</span>{Math.round(feels)}°<small>Feels like</small></div>
        <div className="stat"><span>💨</span>{Math.round(weather.wind.speed)} m/s<small>Wind</small></div>
        <div className="stat"><span>👁️</span>{(weather.visibility / 1000).toFixed(1)} km<small>Visibility</small></div>
      </div>
    </div>
  );
}

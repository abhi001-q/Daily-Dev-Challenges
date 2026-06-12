export default function ForecastList({ forecast, unit }) {
  // Get one entry per day (noon-ish)
  const days = forecast.list
    .filter(f => f.dt_txt.includes("12:00:00"))
    .slice(0, 5);

  return (
    <div className="forecast">
      <h3 className="forecast__title">5-Day Forecast</h3>
      <div className="forecast__row">
        {days.map(day => {
          const temp = unit === "C" ? day.main.temp : (day.main.temp * 9/5 + 32);
          const date = new Date(day.dt * 1000);
          const label = date.toLocaleDateString("en", { weekday: "short" });
          const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
          return (
            <div key={day.dt} className="forecast__day">
              <p className="forecast__day-label">{label}</p>
              <img src={icon} alt={day.weather[0].description} width={40} height={40} />
              <p className="forecast__temp">{Math.round(temp)}°</p>
              <p className="forecast__desc">{day.weather[0].main}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

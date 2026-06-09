import{useState}from"react";import{useWeather}from"./hooks/useWeather";

function SearchBar({onSearch,loading}){
  const[val,setVal]=useState("");
  return(<form className="search-bar" onSubmit={e=>{e.preventDefault();if(val.trim())onSearch(val.trim());}}>
    <input value={val} onChange={e=>setVal(e.target.value)} placeholder="Search city…" autoFocus aria-label="City name"/>
    <button disabled={loading||!val.trim()}>{loading?"…":"Search"}</button>
  </form>);
}

function WeatherCard({weather,unit,onToggle}){
  const t=v=>unit==="C"?v:Math.round(v*9/5+32);
  const icon=`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
  return(<div className="weather-card">
    <div className="weather-card__top">
      <div><h2 className="weather-card__city">{weather.name}, {weather.sys.country}</h2>
        <p className="weather-card__desc">{weather.weather[0].description}</p></div>
      <img src={icon} alt={weather.weather[0].description} width={80} height={80}/>
    </div>
    <div className="weather-card__temp">{t(Math.round(weather.main.temp))}°{unit}
      <button className="unit-toggle" onClick={onToggle}>°{unit==="C"?"F":"C"}</button>
    </div>
    <div className="weather-card__stats">
      <div className="stat"><span>💧</span>{weather.main.humidity}%<small>Humidity</small></div>
      <div className="stat"><span>🌡️</span>{t(Math.round(weather.main.feels_like))}°<small>Feels like</small></div>
      <div className="stat"><span>💨</span>{Math.round(weather.wind.speed)} m/s<small>Wind</small></div>
      <div className="stat"><span>👁️</span>{(weather.visibility/1000).toFixed(1)} km<small>Visibility</small></div>
    </div>
  </div>);
}

function ForecastList({forecast,unit}){
  const t=v=>unit==="C"?v:Math.round(v*9/5+32);
  const days=forecast.list.filter(f=>f.dt_txt.includes("12:00:00")).slice(0,5);
  return(<div className="forecast">
    <h3 className="forecast__title">5-Day Forecast</h3>
    <div className="forecast__row">
      {days.map(d=>{
        const label=new Date(d.dt*1000).toLocaleDateString("en",{weekday:"short"});
        const icon=`https://openweathermap.org/img/wn/${d.weather[0].icon}.png`;
        return(<div key={d.dt} className="forecast__day">
          <p className="forecast__day-label">{label}</p>
          <img src={icon} alt={d.weather[0].description} width={40} height={40}/>
          <p className="forecast__temp">{t(Math.round(d.main.temp))}°</p>
          <p className="forecast__desc">{d.weather[0].main}</p>
        </div>);
      })}
    </div>
  </div>);
}

function Skeleton(){
  return(<div className="skeleton-wrap" aria-busy="true">
    <div className="skeleton skeleton--card"/><div className="skeleton skeleton--forecast"/>
  </div>);
}

export default function App(){
  const[city,setCity]=useState("");const[unit,setUnit]=useState("C");
  const{weather,forecast,loading,error}=useWeather(city);
  return(<div className="app">
    <div className="app__header"><h1>🌤️ Weather Dashboard</h1><p>Real-time weather powered by OpenWeatherMap</p></div>
    <SearchBar onSearch={setCity} loading={loading}/>
    {loading&&<Skeleton/>}
    {!loading&&error&&<div className="error-card" role="alert"><span>⚠️</span><p>{error}</p></div>}
    {!loading&&weather&&<><WeatherCard weather={weather} unit={unit} onToggle={()=>setUnit(u=>u==="C"?"F":"C")}/>{forecast&&<ForecastList forecast={forecast} unit={unit}/>}</>}
    {!loading&&!weather&&!error&&<div className="empty-state"><span>🔍</span><p>Search for a city to see the weather</p></div>}
  </div>);
}

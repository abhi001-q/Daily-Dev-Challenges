import { useState, useEffect } from "react";
import { BASE_URL, OPENWEATHER_API_KEY } from "../config";

export function useWeather(city) {
  const [weather, setWeather]   = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!city) return;
    let cancelled = false;

    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      setWeather(null);
      setForecast(null);
      try {
        const [wRes, fRes] = await Promise.all([
          fetch(`${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`),
          fetch(`${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`),
        ]);
        if (!wRes.ok) throw new Error(wRes.status === 404 ? "City not found" : "API error");
        const [wData, fData] = await Promise.all([wRes.json(), fRes.json()]);
        if (!cancelled) { setWeather(wData); setForecast(fData); }
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchAll();
    return () => { cancelled = true; };
  }, [city]);

  return { weather, forecast, loading, error };
}

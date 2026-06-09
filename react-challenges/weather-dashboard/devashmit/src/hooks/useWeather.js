import{useState,useEffect}from"react";
import{BASE_URL,OPENWEATHER_API_KEY}from"../config";
export function useWeather(city){
  const[weather,setWeather]=useState(null);const[forecast,setForecast]=useState(null);
  const[loading,setLoading]=useState(false);const[error,setError]=useState(null);
  useEffect(()=>{
    if(!city)return;let cancelled=false;
    setLoading(true);setError(null);setWeather(null);setForecast(null);
    const fetchAll=async()=>{
      try{
        const[wR,fR]=await Promise.all([
          fetch(`${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`),
          fetch(`${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`),
        ]);
        if(!wR.ok)throw new Error(wR.status===404?"City not found":`API error`);
        const[w,f]=await Promise.all([wR.json(),fR.json()]);
        if(!cancelled){setWeather(w);setForecast(f);}
      }catch(e){if(!cancelled)setError(e.message);}
      finally{if(!cancelled)setLoading(false);}
    };
    fetchAll();return()=>{cancelled=true;};
  },[city]);
  return{weather,forecast,loading,error};
}

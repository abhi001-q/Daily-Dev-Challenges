import{useState,useEffect}from"react";
export function useFetch(url){
  const[data,setData]=useState(null);const[loading,setLoading]=useState(false);const[error,setError]=useState(null);
  useEffect(()=>{
    if(!url)return;let cancelled=false;
    setLoading(true);setError(null);setData(null);
    fetch(url).then(r=>{if(!r.ok)throw new Error(r.status===404?"User not found":`API error ${r.status}`);return r.json();})
      .then(d=>{if(!cancelled)setData(d);})
      .catch(e=>{if(!cancelled)setError(e.message);})
      .finally(()=>{if(!cancelled)setLoading(false);});
    return()=>{cancelled=true;};
  },[url]);
  return{data,loading,error};
}

import{useState,useEffect}from"react";
export function useFetch(url){
  const[data,setData]=useState(null);const[loading,setLoading]=useState(false);const[error,setError]=useState(null);
  useEffect(()=>{
    if(!url)return;let c=false;setLoading(true);setError(null);setData(null);
    fetch(url).then(r=>{if(!r.ok)throw new Error(r.status===404?"User not found":`API error`);return r.json();})
      .then(d=>{if(!c)setData(d);}).catch(e=>{if(!c)setError(e.message);}).finally(()=>{if(!c)setLoading(false);});
    return()=>{c=true;};
  },[url]);
  return{data,loading,error};
}

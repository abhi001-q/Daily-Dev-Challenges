# ⚛️ Real-time Weather Dashboard [REACT] — Day 5

**Issue:** [#246](https://github.com/abhishek-goswami1/Daily-Dev-Challenges/issues/246) | Week 1 | Intermediate

## 📋 Description

A real-time weather dashboard built with React. Fetches current weather and 5-day forecast from OpenWeatherMap API. Shows temperature, humidity, wind speed, weather icon, and a 5-day forecast chart.

## ✨ Features

- Current weather: temp, humidity, wind, condition icon
- 5-day forecast display
- Search by city name
- Loading skeleton while fetching
- Error handling for invalid cities
- Celsius / Fahrenheit toggle
- Custom `useWeather` hook

## 🧠 Concepts Practiced

`useEffect` · `Custom hooks` · `Fetch API` · `Conditional rendering`

## 🚀 How to Run

```bash
npm install
npm run dev
```

Get a free API key at [openweathermap.org](https://openweathermap.org/api) and set it in `src/config.js`.

## 🗂 Project Structure

```
devashmit/
├── src/
│   ├── hooks/useWeather.js
│   ├── components/
│   │   ├── SearchBar.jsx
│   │   ├── WeatherCard.jsx
│   │   ├── ForecastList.jsx
│   │   └── Skeleton.jsx
│   ├── config.js
│   ├── App.jsx
│   └── index.css
├── index.html
├── package.json
└── README.md
```

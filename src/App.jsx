import { useState } from 'react';
import axios from 'axios';
import './index.css';

export default function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const API_KEY = 'bb60a37ba6d01f853b6bcd5f5899b110';

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
      setHistory(prev => [...new Set([cityName, ...prev])].slice(0, 5));
    } catch (err) {
      setError(err.response?.status === 404 ? 'City not found' : 'Weather service error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) fetchWeather(city);
  };

  return (
    <div className="app-container">
      <div className="weather-app">
        <header>
          <h1>Weather App</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
            />
            <button>Search</button>
          </form>
        </header>

        <main>
          {loading && (
            <div className="loading-animation">
              <div className="loader"></div>
              <p>Fetching weather data...</p>
            </div>
          )}

          {error && <div className="error">{error}</div>}

          {weather && (
            <div className="weather-card">
              <div className="location">
                <h2>{weather.name}</h2>
                <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              </div>
              
              <div className="current-weather">
                <img 
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} 
                  alt={weather.weather[0].main} 
                />
                <div>
                  <span className="temp">{Math.round(weather.main.temp)}°C</span>
                  <p className="description">{weather.weather[0].description}</p>
                </div>
              </div>

              <div className="details">
                <div className="detail-item">
                  <span>Humidity</span>
                  <span className="value">{weather.main.humidity}%</span>
                </div>
                <div className="detail-item">
                  <span>Wind</span>
                  <span className="value">{weather.wind.speed} m/s</span>
                </div>
                <div className="detail-item">
                  <span>Feels Like</span>
                  <span className="value">{Math.round(weather.main.feels_like)}°C</span>
                </div>
              </div>
            </div>
          )}

          {history.length > 0 && (
            <div className="recent-searches">
              <h3>Recent searches:</h3>
              <div className="history">
                {history.map((city, i) => (
                  <button 
                    key={i} 
                    onClick={() => {
                      setCity(city);
                      fetchWeather(city);
                    }}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

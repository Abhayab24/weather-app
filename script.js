document.addEventListener("DOMContentLoaded", function () {
  // Handle login
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email && password) {
      // Show weather app, hide login
      document.getElementById("loginSection").style.display = "none";
      document.getElementById("weatherSection").style.display = "block";
    } else {
      alert("Please enter valid credentials.");
    }
  });
});

// Weather fetch function
async function getWeather() {
  const city = document.getElementById("cityInput").value;

  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  document.getElementById("weatherResult").innerHTML = "Loading...";

  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;

  try {
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      document.getElementById("weatherResult").innerHTML = "City not found.";
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    const weather = weatherData.current_weather;

    // Optional: weather code meaning
    const weatherDescriptions = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow",
      73: "Moderate snow",
      75: "Heavy snow",
      95: "Thunderstorm",
    };

    const weatherText = weatherDescriptions[weather.weathercode] || "Unknown";

    const result = `
      <h3>${name}, ${country}</h3>
      <p><strong>Temperature:</strong> ${weather.temperature} °C</p>
      <p><strong>Wind Speed:</strong> ${weather.windspeed} km/h</p>
      <p><strong>Condition:</strong> ${weatherText}</p>
    `;

    document.getElementById("weatherResult").innerHTML = result;
  } catch (error) {
    document.getElementById("weatherResult").innerHTML = "Error fetching weather data.";
    console.error(error);
  }
}

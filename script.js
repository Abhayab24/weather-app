async function getWeather() {
  const city = document.getElementById("cityInput").value;

  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  // Step 1: Get latitude and longitude from city name
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

  try {
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      document.getElementById("weatherResult").innerHTML = "City not found.";
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // Step 2: Get weather using coordinates
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    const result = `
      <h2>${name}, ${country}</h2>
      <p><strong>Temperature:</strong> ${weatherData.current_weather.temperature} °C</p>
      <p><strong>Wind Speed:</strong> ${weatherData.current_weather.windspeed} km/h</p>
      <p><strong>Weather Code:</strong> ${weatherData.current_weather.weathercode}</p>
    `;

    document.getElementById("weatherResult").innerHTML = result;
  } catch (error) {
    document.getElementById("weatherResult").innerHTML = "Error fetching weather data.";
  }
}

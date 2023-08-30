

const apiKey = "5a9aafa6dd5712de098327d4a402571c";

async function getWeatherForecast(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather forecast:", error);
  }
}

function celsiusToFahrenheit(celsius) {
  return (celsius * 9/5) + 32;
}

function updateWeatherForecast(forecastData) {
  const weatherForecast = document.getElementById("weather-forecast");
  let forecastHTML = `<h2>${forecastData.city.name} 5-Day Weather Forecast</h2>`;

  // Group forecast data by day
  const groupedForecast = {};

  forecastData.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = date.toDateString();

    if (!groupedForecast[day]) {
      groupedForecast[day] = [];
    }

    groupedForecast[day].push({
      time: date.toLocaleTimeString(),
      temperatureCelsius: item.main.temp,
      temperatureFahrenheit: celsiusToFahrenheit(item.main.temp),
      weatherDescription: item.weather[0].description,
      iconCode: item.weather[0].icon,
      windSpeed: item.wind.speed // Wind speed in meters per second
    });
  });

  // Create cards for each day
  for (const day in groupedForecast) {
    forecastHTML += `
      <div class="forecast-day">
        <h3>${day}</h3>
        <div class="forecast-cards">
    `;

    groupedForecast[day].forEach(item => {
      const iconUrl = `http://openweathermap.org/img/w/${item.iconCode}.png`;
      forecastHTML += `
        <div class="forecast-card">
          <p class="forecast-time">${item.time}</p>
          <img src="${iconUrl}" alt="${item.weatherDescription}">
          <p class="forecast-temperature">${item.temperatureFahrenheit}°F</p>
          <p class="forecast-wind">Wind Speed: ${item.windSpeed} m/s</p>
          <p class="forecast-description">${item.weatherDescription}</p>
          <p class="forecast-city">${forecastData.city.name}</p>
        </div>
      `;
    });

    forecastHTML += `
        </div>
      </div>
    `;
  }

  weatherForecast.innerHTML = forecastHTML;
}

function searchWeather() {
  const cityInput = document.getElementById("city-input");
  const city = cityInput.value.trim();

  if (city !== "") {
    getWeatherForecast(city)
      .then(forecastData => {
        updateWeatherForecast(forecastData);
      })
      .catch(error => {
        console.error("Error searching weather:", error);
      });
  }
}

function initialize() {
  const initialCity = "Oceanside"; 
  getWeatherForecast(initialCity)
    .then(forecastData => {
      updateWeatherForecast(forecastData);
    })
    .catch(error => {
      console.error("Error fetching initial weather:", error);
    });
}

document.getElementById("search-button").addEventListener("click", searchWeather);

window.onload = initialize;

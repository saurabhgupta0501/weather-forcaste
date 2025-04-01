const apiKey = "51cce3dde9cec62268228e474bdc69c8"; // Replace with your OpenWeatherMap API key
validateKey('{{APP_ID}}')
const defaultCity = "New Delhi";


// Fetch weather data
async function fetchWeather() {
    const city = document.getElementById("city-input").value || defaultCity;
    document.getElementById("error-message").classList.add("hidden");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) throw new Error("City not found");

        const data = await response.json();
        updateWeatherUI(data);
        fetchForecast(data.name);
    } catch (error) {
        document.getElementById("error-message").textContent = error.message;
        document.getElementById("error-message").classList.remove("hidden");
    }
}

// Fetch 5-day forecast
async function fetchForecast(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) throw new Error("Error fetching forecast");

        const data = await response.json();
        updateForecastUI(data);
    } catch (error) {
        document.getElementById("error-message").textContent = error.message;
        document.getElementById("error-message").classList.remove("hidden");
    }
}

// Update current weather UI
function updateWeatherUI(data) {
    document.getElementById("weather-info").classList.remove("hidden");
    document.getElementById("city-name").textContent = `${data.name} (${new Date().toISOString().split("T")[0]})`;
    document.getElementById("temperature").textContent = `Temperature: ${data.main.temp}°C`;
    document.getElementById("wind").textContent = `Wind: ${data.wind.speed} M/S`;
    document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById("weather-condition").textContent = `Condition: ${data.weather[0].description}`;
}

// Update 5-day forecast UI
function updateForecastUI(data) {
    const forecastEl = document.getElementById("forecast");
    forecastEl.innerHTML = "";

    const dailyData = {};
    data.list.forEach((entry) => {
        const date = entry.dt_txt.split(" ")[0];
        if (!dailyData[date]) {
            dailyData[date] = entry;
        }
    });

    Object.values(dailyData).slice(0, 5).forEach((day) => {
        forecastEl.innerHTML += `
            <div class="bg-gray-200 p-3 rounded-md text-center">
                <p>${day.dt_txt.split(" ")[0]}</p>
                <p>Temp: ${day.main.temp}°C</p>
                <p>Wind: ${day.wind.speed} M/S</p>
                <p>Humidity: ${day.main.humidity}%</p>
            </div>
        `;
    });
}

// Get user's location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
                if (!response.ok) throw new Error("Error fetching location weather");

                const data = await response.json();
                updateWeatherUI(data);
                fetchForecast(data.name);
            } catch (error) {
                document.getElementById("error-message").textContent = error.message;
                document.getElementById("error-message").classList.remove("hidden");
            }
        });
    } else {
        document.getElementById("error-message").textContent = "Geolocation is not supported.";
        document.getElementById("error-message").classList.remove("hidden");
    }
}

// Load default city on page load
fetchWeather();

const API_KEY = "0133cc5316757ac730cc46ae342334e4";

const form = document.querySelector('#weather-form');
const weatherInfo = document.querySelector("#weatherBox");
const cityInput = document.querySelector("#city");
const history = document.querySelector("#history");

const consoleBox = document.querySelector("#consoleBox");

function log(message) {
  if (consoleBox) {
    consoleBox.innerHTML += message + "<br>";
    consoleBox.scrollTop = consoleBox.scrollHeight;
  }
}


let historydata = JSON.parse(localStorage.getItem("history")) || [];

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (consoleBox) consoleBox.innerHTML = "";
  log("1️⃣ Sync Start");

  const data = cityInput.value.trim();

  log("2️⃣ Sync End");

  if (data) {

    log("[ASYNC] Start fetching");

    setTimeout(() => {
      log("4️⃣ setTimeout (Macrotask)");
    }, 0);

    getData(data);

  } else {
    weatherInfo.innerHTML = `<p>Please enter a city name.</p>`;
  }
});


async function getData(data) {
  try {

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${data}&appid=${API_KEY}`
    );

    Promise.resolve().then(() => {
      log("3️⃣ Promise.then (Microtask)");
    });

    const WeatherData = await response.json();
    console.log(WeatherData);

    log("[ASYNC] Data received");

    if (WeatherData.cod === "404") {
      weatherInfo.innerHTML = `<p>City not found. Please try again.</p>`;
    } else {
      weatherInfo.innerHTML = `
        <p><strong>City:</strong> ${WeatherData.name}</p>
        <p><strong>Temperature:</strong> ${(WeatherData.main.temp - 273.15).toFixed(1)} °C</p>
        <p><strong>Weather:</strong> ${WeatherData.weather[0].main}</p>
        <p><strong>Humidity:</strong> ${WeatherData.main.humidity}%</p>
        <p><strong>Wind:</strong> ${WeatherData.wind.speed} m/s</p>
      `;

      if (historydata.includes(data) == false) {
        historydata.push(data);
        localStorage.setItem("history", JSON.stringify(historydata));
      }
    }

    showHistory();

  } catch (error) {
    console.log(error);
  }
}


function showHistory() {
  history.innerHTML = "";

  if (localStorage.getItem("history")) {
    historydata = JSON.parse(localStorage.getItem("history"));

    historydata.forEach((ele) => {
      const li = document.createElement("button");
      li.textContent = ele;
      history.appendChild(li);

      li.addEventListener("click", () => {
        getData(ele);
      });
    });
  }
}

historydata = [];
localStorage.setItem("history", JSON.stringify(historydata));
showHistory();
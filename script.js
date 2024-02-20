document.addEventListener("DOMContentLoaded", function() {
    const cardContainer = document.getElementById('cardContainer');
    
    fetch('https://restcountries.com/v3.1/all')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
        
      })
      .then(data => {
        data.slice(0, 3).forEach(country => { // Limiting to the first 3 countries
          createCard(country);
          console.log(country);
        });
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
      
    function createCard(country) {
      const card = document.createElement('div');
      card.classList.add('card');
      
      card.innerHTML = `
        <div class="card-content">
          <h2 class="country-name">${country.name.common}</h2>
          <p><img src="${country.flags.png}" alt="Country Flag"></p>
          <p>Capital: <span>${country.capital}</span></p>
          <p>Region: <span>${country.region}</span></p>
          <p>Country Code: <span>${country.altSpellings[0]}</span></p>
          <button class="button" data-lat="${country.latlng[0]}" data-lon="${country.latlng[1]}">Check for Weather</button>
          <div class="weather-report"></div>
        </div>
      `;
      
      cardContainer.appendChild(card);
    }

    cardContainer.addEventListener("click", function(event) {
        if (event.target.classList.contains("button")) {
          const latitude = event.target.getAttribute("data-lat");
          const longitude = event.target.getAttribute("data-lon");
        //   console.log(latitude);
        //   console.log(longitude);
          fetchWeather(latitude, longitude, event.target.nextElementSibling); // fuction call
        }
      });
      
      function fetchWeather(latitude, longitude, weatherReportElement) {
          const API_key = '3c6bc76af475f23faf83848dddf38eb3'

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_key}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            const weatherDescription = data.weather[0].description;
            const temperature = (data.main.temp - 273.15).toFixed(2); // Convert temperature from Kelvin to Celsius
            const weatherHTML = `<p>Weather: ${weatherDescription}</p><p>Temperature: ${temperature}°C</p>`;
            weatherReportElement.innerHTML = weatherHTML;
          })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
      }
  });
  
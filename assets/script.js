// TODO: when a city is entered in the search bar
//          create a fetch request for that city
//          use current weather api for city lat lon
//          if the city is not a valid input show a modal saying that it is not valid
//          take the lat lon and put it into the one call api
//          put the current date in the main header with the city name, weather icon, temp, wind, humidity, and uv index
//          put the data for future days in the cards with weather icon, temp wind, and humidity
//          manipulate the dom to put all info in the correct places
//          add a button with the searched city to the bar below
//          place all searched cities into local storage 
//          on page load: show most recently searched city, if none a default
//                      populate buttons with recently searched cities
console.log('hello')

const cityInput = document.querySelector('#city-input');
const searchBtn = document.querySelector('#search-btn');
var cityUrl// = $('api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}')
var cityLat
var cityLon
var cityName
var forecastCards = document.getElementsByClassName("forecast");
var forecastTemps = document.getElementsByClassName("future-temp"); 
var forecastWinds = document.getElementsByClassName("future-wind"); 
var forecastHums = document.getElementsByClassName("future-hum");
var forecastIcons =  document.getElementsByClassName("future-icon");
const cityNameEl = document.querySelector('#city-name');
const currentIcon = document.querySelector('#current-icon');
// const 
var currentDate = moment().format('MM/DD/YYYY');
const currTempEl = document.querySelector('#current-temp');
const currWindEl = document.querySelector('#current-wind');
const currHumEl = document.querySelector('#current-hum');
const currUvEl = document.querySelector('#current-uv');
console.log(forecastTemps)
function fetchWeatherInfo() {
    var weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=hourly,minutely&units=imperial&appid=d3c9308138fcb4ca55018280479e6be8`;
    fetch(weatherUrl).then(function (response) {
    return response.json();    
    })
    .then(function (data) {
    console.log(data);
    currTempEl.innerHTML = data.current.temp
    currWindEl.innerHTML = data.current.wind_speed
    currHumEl.innerHTML = data.current.humidity
    currUvEl.innerHTML = data.current.uvi
    console.log(data.current.weather[0].icon)
    currentIcon.src = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}.png`
    for (let i = 0; i < forecastCards.length; i++) {
        forecastTemps[i].innerHTML = data.daily[i+1].temp.day
        forecastWinds[i].innerHTML = data.daily[i+1].wind_speed
        forecastHums[i].innerHTML = data.daily[i+1].humidity
        forecastIcons[i].src = `http://openweathermap.org/img/wn/${data.daily[i+1].weather[0].icon}.png`
    }

    })};

function fillWeatherInfo() {
    
    cityNameEl.textContent = `${cityName} (${currentDate})`
    for (let i = 0; i < forecastCards.length; i++) {
        forecastCards[i].innerHTML = moment().add(forecastCards[i].dataset.date, 'd').format('l')
        
    }

}

searchBtn.addEventListener('click', function(event) {
    event.preventDefault();
    cityUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityInput.value + '&appid=d3c9308138fcb4ca55018280479e6be8'
    console.log(cityUrl);
    fetch(cityUrl)
    .then(function (response) {
    if (!response.ok) {
        window.alert('no') // change this to modal
        return;
    }
    return response.json();
    })
    .then(function (data) {
    console.log(data);
    console.log(data.coord.lat)
    console.log(data.coord.lon)
    cityLon = data.coord.lon
    cityLat = data.coord.lat
    cityName = data.name
    fetchWeatherInfo();
    fillWeatherInfo();
  });
})


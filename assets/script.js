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
    if (data.current.uvi <= 2) {
        currUvEl.classList.add('low')
    } else if (data.current.uvi < 6) {
        currUvEl.classList.add('moderate')
    } else if (data.current.uvi < 8) { 
        currUvEl.classList.add('high')
    } else if (data.current.uvi < 11) {
        currUvEl.classList.add('very-high')
    } else {
        currUvEl.classList.add('extreme')
    }
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
    for (let j = 0; j < searched.length; j++) {
        if (searched[j] === cityName) {
            searched.splice(j, 1);
        }
        
    }
}

// add the last searched city to the list of buttons and add to the local storage
var searched = []
var cityList = document.querySelector('#city-list') 

function addButton() {
    var searchedCity = cityName;
    searched.unshift(searchedCity);
    var newestCity = document.createElement('button');
    newestCity.innerHTML = searchedCity;
    newestCity.classList.add('btn', 'btn-primary', 'col-12', 'my-1')
}

// function sortCities(a, b) {
//     a.getAttribute('data-order') - b.getAttribute('data-order')
// }
let historyBtns = []

function historyClick (e) {
    let history = e.target
    cityInput.value = history.textContent
    search()
}

function renderCities() { // create city list
    // searched.sort(sortCities);
    cityList.innerHTML = '';
    for (let i = 0; i < searched.length; i++) { 
        let savedCity = searched[i]
        let cityBtn = document.createElement("button");
        cityBtn.addEventListener('click', historyClick)
        cityBtn.classList.add('btn', 'btn-secondary', 'col-12', 'my-1', 'rounded', 'history-btn');
        cityBtn.textContent = `${savedCity}`;
        cityList.prepend(cityBtn);
    }
    // historyBtns = document.getElementsByClassName("history-btn")
    // console.log(historyBtns)
}

function init() {
    let storedCities = JSON.parse(localStorage.getItem("cities")); // pull any stored cities from local storage

    if (storedCities !== null) {
        searched = storedCities;
        cityInput.value = searched[searched.length-1] //most recent in history is pulled up
        search()
    } else { 
        cityInput.value = "Seattle" // if there is no history search for seattle weather
        search()
    }
    renderCities();
}

function storeCities() { // store scores in local storage
    localStorage.setItem("cities", JSON.stringify(searched));
}

function search() {
    cityUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityInput.value + '&appid=d3c9308138fcb4ca55018280479e6be8'
    console.log(cityUrl);
    fetch(cityUrl)
    .then(function (response) {
    if (!response.ok) {
        var myModal = new bootstrap.Modal(document.getElementById('modal-alert'))
        myModal.show()
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
    currUvEl.classList.remove('low', 'moderate', 'high', 'very-high', 'extreme')
    searched.push(cityName); // add the submitted city to the cities list
    storeCities();
    renderCities();
    cityInput.value = ""
    })
};

let cityListEl = $('#city-list')
console.log(cityListEl.children())
searchBtn.addEventListener('click', search)
cityInput.onkeydown = function(e){
    if(e.keyCode === 13){
    search()
    } 
}

init();
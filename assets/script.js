// Document element Variables
const cityInput = document.querySelector('#city-input');
const searchBtn = document.querySelector('#search-btn');
var forecastCards = document.getElementsByClassName("forecast");
var forecastTemps = document.getElementsByClassName("future-temp"); 
var forecastWinds = document.getElementsByClassName("future-wind"); 
var forecastHums = document.getElementsByClassName("future-hum");
var forecastIcons =  document.getElementsByClassName("future-icon");
const cityNameEl = document.querySelector('#city-name');
const currentIcon = document.querySelector('#current-icon'); 
var currentDate = moment().format('MM/DD/YYYY');
const currTempEl = document.querySelector('#current-temp');
const currWindEl = document.querySelector('#current-wind');
const currHumEl = document.querySelector('#current-hum');
const currUvEl = document.querySelector('#current-uv');

var cityUrl// = $('api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}')
var cityLat
var cityLon
var cityName

// Pull weather information from weather api based on lat and lon data  from the city lookup
function fetchWeatherInfo() {
    var weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=hourly,minutely&units=imperial&appid=d3c9308138fcb4ca55018280479e6be8`;
    fetch(weatherUrl).then(function (response) {
    return response.json();    
    })
    .then(function (data) {
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
    currentIcon.src = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}.png`
    for (let i = 0; i < forecastCards.length; i++) {
        forecastTemps[i].innerHTML = data.daily[i+1].temp.day
        forecastWinds[i].innerHTML = data.daily[i+1].wind_speed
        forecastHums[i].innerHTML = data.daily[i+1].humidity
        forecastIcons[i].src = `http://openweathermap.org/img/wn/${data.daily[i+1].weather[0].icon}.png`
    }

    })};

    // fills out information from fetched data and prompts a modal if the city is not found
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


let historyBtns = []

function historyClick (e) {
    let history = e.target
    cityInput.value = history.textContent
    search()
}

function renderCities() { // create city list
    cityList.innerHTML = '';
    for (let i = 0; i < searched.length; i++) { 
        let savedCity = searched[i]
        let cityBtn = document.createElement("button");
        cityBtn.addEventListener('click', historyClick)
        cityBtn.classList.add('btn', 'btn-secondary', 'col-12', 'my-1', 'rounded', 'history-btn');
        cityBtn.textContent = `${savedCity}`;
        cityList.prepend(cityBtn);
    }
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
    fetch(cityUrl)
    .then(function (response) {
    if (!response.ok) {
        var myModal = new bootstrap.Modal(document.getElementById('modal-alert'))
        myModal.show()
    }
    return response.json();
    })
    .then(function (data) {
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

// event listener for search button and pressing enter in text input
let cityListEl = $('#city-list')

searchBtn.addEventListener('click', search)
cityInput.onkeydown = function(e){
    if(e.keyCode === 13){
    search()
    } 
}

init();
// TODO: when a city is entered in the search bar
//          create a fetch request for that city
//          if the city is not a valid input show a modal saying that it is not valid
//          put the current date in the main header with the city name, weather icon, temp, wind, humidity, and uv index
//          put the data for future days in the cards with weather icon, temp wind, and humidity
//          manipulate the dom to put all info in the correct places
//          add a button with the searched city to the bar below
//          place all searched cities into local storage 
//          on page load: show most recently searched city, if none a default
//                      populate buttons with recently searched cities


const cityInput = $('#city-input')

$('#search-btn').submit
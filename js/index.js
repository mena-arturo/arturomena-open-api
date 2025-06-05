/*--------------------------------- HANDLING GLOBAL VARIABLES ---------------------------------*/
// INITIALIZING VARIABLES TO ITS DEFAULT VALUE
const link = document.querySelectorAll('.navlink');
const cityName = document.getElementById('cityName');
const cityDate = document.getElementById('dateTime');
const cityWmoCode = document.getElementById('cityWmoCode');
const currentTemp = document.getElementById('currentTemp');
const currentMinTemp = document.getElementById('minTempVal');
const currentMaxTemp = document.getElementById('maxTempVal');
const currentFeelsTemp = document.getElementById('feelsTempVal');
const toggleLink = document.querySelectorAll('.togglelink');
const weatherCndtnsSection = document.getElementById('weatherConditions');
const getWeatherConditionsBtn = document.getElementById('getWeatherConditionsBtn');
const buttonForm = document.getElementById('getWeatherConditions');
const weatherCodeValue = document.getElementById('weatherCodeValue');
const uvIndexValue = document.getElementById('uvIndexValue');
const humidityValue = document.getElementById('humidityValue');
const rainProbabilityValue = document.getElementById('rainProbabilityValue');
const forecastDate = document.querySelectorAll(".forecastDate");
const forecastMinTemp = document.querySelectorAll(".forecastMinTempVal");
const forecastMaxTemp = document.querySelectorAll(".forecastMaxTempVal");
const forecastImage = document.querySelectorAll(".forecastImage");

const today = new Date();
let currentCity = {
    lat : 0,
    long : 0
};
let request ="";
const requestH = "https://api.open-meteo.com/v1/forecast?"; 
const requestB = "&daily=temperature_2m_max,temperature_2m_min,weather_code&current=temperature_2m,apparent_temperature,weather_code,is_day&timezone=America%2FNew_York&timeformat=unixtime&wind_speed_unit=mph&temperature_unit=fahrenheit"; 

let request2 ="";
const request2H = "https://api.open-meteo.com/v1/forecast?";
const request2B = "&daily=uv_index_max,precipitation_probability_max&current=relative_humidity_2m,weather_code&timezone=America%2FNew_York&forecast_days=1&timeformat=unixtime&wind_speed_unit=mph&temperature_unit=fahrenheit"; 

const cities = {
    "city0" : [42.3547,-71.0562],
    "city1" : [40.7130,-73.9870],
    "city2" : [37.7740,-122.4179],
    "city3" : [34.0551,-118.2517],
    "city4" : [40.7199,-74.0429],
    "city5" : [38.9065,-77.0375],
    "city6" : [41.8783,-87.6279]
}
const wmoCodes ={
    '0' : ["0","Clear sky"],
    '1' : ["1","Mainly clear"],
    '2' : ["2","Partly cloudy"],
    '3' : ["3","Overcast"],
    '45': ["45","Fog"],
    '48': ["48","Deposing rime fog"],
    '51': ["51","Light drizzle"],
    '53': ["53","Moderate drizzle"],
    '55': ["55","Dense drizzle"],
    '56': ["56","Freezing light drizzle"],
    '57': ["57","Freezing dense drizzle"],
    '61': ["61","Slight rain"],
    '63': ["63","Moderate rain"],
    '65': ["65","Heavy rain"],
    '66': ["66","Freezing light rain"],
    '67': ["67","Freezing heavy rain"],
    '71': ["71","Slight Snow fall"],
    '73': ["73","Moderate Snow fall"],
    '75': ["75","Heavy Snow fall"],
    '77': ["77","Snow grains"],
    '80': ["80","Slight rain showers"],
    '81': ["81","Moderate rain showers"],
    '82': ["82","Violent rain showers"],
    '85': ["85","Slight snow showers"],
    '86': ["86","Heavy snow showers"],
    '95': ["95","Thunderstorm"],
    '96': ["96","Thunderstorm with slight hail"],
    '99': ["99","Thunderstorm with heavy hail"]
}

//ADJUSTING THE STATUS OF THE WEATHER SECTION TO HIDE
weatherCndtnsSection.style.display = 'none';

function convertUnixTimestampToDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${month}/${day}/${year}`;
}

/*--- ASSIGN AN EVENT HANDLER TO CALL FECTH WHEN USER CLICKS ON THE CITY'S LINK ---------------*/
//FIRST GET
for (let i =0; i< link.length; i++){
    link[i].addEventListener('click', function(event){
    event.preventDefault();
    //PREPARE THE STRING TO CALL OPEN-METEO'S APPI
    request = requestH + `latitude=${cities[link[i].id][0]}` + "&" + `longitude=${cities[link[i].id][1]}` + requestB;
    currentCity.lat = cities[link[i].id][0];
    currentCity.long = cities[link[i].id][1];
    //USING FETCH TO CALL THE APPI
    fetch(request)
    //HANDLING THE RESPONSE
    .then(response =>{
        if(!response.ok){ //IF THERE IS A PROBLEM FETCHING THE INFO THEN THROW AN ERROR
                throw new Error(`Request for information about weather failed: ${response.status}`);
        }
            return response.json(); //PARSING JSON RESPONSE INTO A JS OBJECT
    })
    //HANDLING THE PARSED DATA
    .then(data => {
        //UNCOMENT FOR DEBUGGING PURSOSES ONLY: SEEING WHAT DATA LOOKS LIKE
        //console.log(data.latitude);
        
        //HIDE THE WEATHER CONDITION BOX
        weatherCndtnsSection.style.display = 'none';
        getWeatherConditionsBtn.innerHTML = "Show weather conditions";

        //GETTING THE CITY NAME FROM THE LINK
        cityName.innerHTML = link[i].innerHTML;
        //SETTING THE IMAGE THAT REPRESENT THE CURRENT WEATHER STATUS
        cityWmoCode.src = `img/${data.current.weather_code}.png`;
        cityWmoCode.alt = wmoCodes[data.current.weather_code][1];
        //SETTING THE INFO FROM THE JSON-DATA SENT BY THE API
        //FILLING THE MAIN SECTION    
        cityDate.innerHTML =  `${today.toLocaleDateString()} ${today.toLocaleTimeString()}`;           
        currentTemp.innerHTML = data.current.temperature_2m + "&deg" + " F";
        currentMinTemp.innerHTML = data.daily.temperature_2m_min[0] + "&deg" + " F";
        currentMaxTemp.innerHTML = data.daily.temperature_2m_max[0] + "&deg" + " F";
        currentFeelsTemp.innerHTML = data.current.apparent_temperature + "&deg" + " F";
        //FILLING THE FORCAST SECTIONS
        //SETTING DATE
        for(let j=0; j< data.daily.time.length; j++){
            forecastDate[j].innerHTML = convertUnixTimestampToDate(data.daily.time[j]); 
        }
        //SETTING IMAGE    
        for(let j=0; j< data.daily.weather_code.length; j++){
            forecastImage[j].src = `img/${data.daily.weather_code[j]}.png`;
            forecastImage[j].alt =  wmoCodes[data.daily.weather_code[j]][1];
        }
        //SETTING MIN TEMPERATURE
        for(let j=0; j< data.daily.temperature_2m_min.length; j++){
            forecastMinTemp[j].innerHTML = data.daily.temperature_2m_min[j] + "&deg" + " F"; 
        }
        //SETTING MAX TEMPERATURE
        for(let j=0; j< data.daily.temperature_2m_max.length; j++){
            forecastMaxTemp[j].innerHTML = data.daily.temperature_2m_max[j] + "&deg" + " F"; 
        }
    })
    //HANDLING ERRORS WHILE FETCHING DATA FROM OPEN-METEO
    .catch(error => console.error(error));
    })
}

/*---- ADD A SUBMIT-EVENT LISTENER TO CALL FETCH AND DISPLAY WEATHER CONDITIONS ---------------*/
//SECOND GET
buttonForm.addEventListener('submit', event =>{
    event.preventDefault();
    //SETTING THE INITIAL STATE OF THE WEATHER-CONDITON SECTION
    if (currentCity.lat === 0 && currentCity.long === 0){
        if(weatherCndtnsSection.style.display === "none"){
            weatherCndtnsSection.style.display ='';
            getWeatherConditionsBtn.innerHTML = "Hide weather conditions";
        }
        else {
            weatherCndtnsSection.style.display = 'none';
            getWeatherConditionsBtn.innerHTML = "Show weather conditions";
        }
    }
    //SENDING THE SECOND REQUEST TO THE API LOOKING FOR THE WEATHER CONDITIONS 
    else {
        if(weatherCndtnsSection.style.display === "none"){
            //PREPARE THE STRING TO CALL OPEN-METEO'S APPI
            request2 = request2H +  `latitude=${currentCity.lat}` + "&" + `longitude=${currentCity.long}` + request2B;
            //USING FETCH TO CALL THE API
            fetch(request2)
            //HANDLING THE RESPONSE
            .then(response =>{
                if(!response.ok){ //IF THERE IS A PROBLEM FETCHING THE INFO THEN THROW AN ERROR
                    throw new Error(`Request for information about weather failed: ${response.status}`);
                }
                return response.json(); //PARSING JSON RESPONSE INTO A JS OBJECT
            })
            //HANDLING THE PARSED DATA
            .then(data => {
                //FILLING THE INFO IN THE WEATHER-CONDITIONS SECTION
                weatherCodeValue.innerHTML = wmoCodes[data.current.weather_code][1];
                uvIndexValue.innerHTML = data.daily.uv_index_max[0];
                humidityValue.innerHTML = data.current.relative_humidity_2m + "%";
                rainProbabilityValue.innerHTML = data.daily.precipitation_probability_max[0] + "%";;
            })
            //HANDLING ERRORS WHILE FETCHING DATA FROM OPEN METEO
            .catch(error => console.error(error));
            //ADJUSTING THE STATUS OF THE WEATHER SECTION TO SHOW AND THE BUTTON'S TEXT
            weatherCndtnsSection.style.display ='';
            getWeatherConditionsBtn.innerHTML = "Hide weather conditions";
        }
        else{
            //ADJUSTING THE STATUS OF THE WEATHER SECTION TO HIDE AND THE BUTTON'S TEXT
            weatherCndtnsSection.style.display = 'none';
            getWeatherConditionsBtn.innerHTML = "Show weather conditions";
        }
    }
})

/*--------------------------------- HANDLING FOOTER -------------------------------------------*/
/*-------- ADDING A PARAGRAPH TO OUR FOOTER ELEMENT --------------------*/

//CREATE A VARIABLE TO STORE MY NAME
const author = "Arturo Mena";

//GETTING THE CURRENT DATE FROM THE SYSTEM AND STORE THE YEAR IN ANOTHER VARIABLE
const thisYear = today.getFullYear();

//GET THE FOOTER ELEMENT
const footer = document.querySelector('footer');

//CREATE A NEW PARAGRAPH
const copyright = document.createElement('p');

//ADDING MY NAME, UTFCODE FOR COPYRIGHT SYMBOL, AND THE YEAR TO THE PARAGRAPH I JUST CREATED
copyright.innerHTML =  author + ' \u00A9 ' + thisYear;

//ADDING THE NEW PARAGRAPH TO THE FOOTER
footer.appendChild(copyright);

let cityName=document.querySelector(".cityInput");
let searchBtn=document.querySelector("#searchBtn");
let apiKey='91072731db9a387f80223a00c2aa8ae4';
let notFoundPage=document.querySelector(".not-found-container");
let searchPage=document.querySelector(".search-city-container");
let weatherInfoPage=document.querySelector(".totalInfo");

// individual entity
let countryTxt=document.querySelector(".location-name");
let dateTimeTxt=document.querySelector(".dateAndTime");
let tempTxt=document.querySelector(".tempText");
let condTxt=document.querySelector(".cloudText");
let humiTxt=document.querySelector(".humiValue");
let windSpeedTxt=document.querySelector(".windValue");
let weatherSummaryPic=document.querySelector(".weatherSummaryPic");
let CurrDateTime=document.querySelector(".dateAndTime");
let forecastContainer=document.querySelector(".forecast-container");

searchBtn.addEventListener("click",()=> {
    if(cityName.value.trim()!='') {
       getWeatherInfo();
    }

})

cityName.addEventListener("keydown",(event)=> {
    if(event.key=="Enter" && cityName.value.trim()!='') {
        getWeatherInfo(cityName.value);
  
    }
})

 const fetchApi=async (city)=> {
let BASEURL=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=91072731db9a387f80223a00c2aa8ae4&units=metric`
let response= await fetch(BASEURL);
return response.json();


}
function showDisplay(section,indicator) {
[weatherInfoPage,notFoundPage,searchPage]
.forEach(section=> {
    section.style.display='none';
})
if(indicator==0) section.style.display='flex';
else section.style.display='block';

}

function changeWeatherIcon(id) {
    if(id<=232) return '/thunderstorm.svg';
    else if(id<=321) return '/drizzle.svg';
    else if(id<=531	) return '/rain.svg';
    else if(id<=622	) return '/snow.svg';
    else if(id<=781) return '/atmosphere.svg';
    else if(id<=800	) return '/clear.svg';
    else  return '/clouds.svg';

}
function getDateAndTime() {
    const dateAndTimeInfo=new Date();
    options ={
        day:'short',
        month:'short',
        day:'2-digit'
    };
    return dateAndTimeInfo.toLocaleDateString('en-GB',options);
}
async function getFetchDataForecast(city) {
    let response=await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=91072731db9a387f80223a00c2aa8ae4&units=metric`);
    return response.json();
}
 async function updateForecastInfo(city) {
    let forecastData=await getFetchDataForecast(city);

    const timeTaken="12:00:00";
    const todayDate=new Date().toISOString().split('T')[0];
    forecastContainer.innerHTML='';


    forecastData.list.forEach(forecastWeather=> {
        if(forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)) {
            updateForecastItems(forecastWeather);
        }
    })
}

function updateForecastItems(weatherData) {
const {
dt_txt:date,
weather:[{id}],
main: {temp},

}=weatherData;

const dates=new Date(date);
const optionsDate= {
    month:'short',
    day:'2-digit'
}
const dateResult=dates.toLocaleDateString('en-US',optionsDate);


const forecastItem= `
     <div class="forecast-items">
            <h5 class="forecast-date ">${dateResult}</h5>
            <img src="/assets/assets/weather/${changeWeatherIcon(id)}" >
            <h5 class="forecast-temp">${Math.round(temp)} °C</h5>
        </div>

    `
    forecastContainer.insertAdjacentHTML('beforeend',forecastItem);

}

async function getWeatherInfo(city) {
 let info=await fetchApi(city);
if(info.cod!=200) {
    showDisplay(notFoundPage,0);
    return ;
}

const {
    name:country,
    main: {temp ,humidity},
    weather:[{id, main}],
    wind:{speed}
}=info

    countryTxt.textContent=country;
    tempTxt.textContent=Math.round(temp) + '°C';
    condTxt.textContent=main;
    humiTxt.textContent=humidity+'%';
    windSpeedTxt.textContent=speed+' m/s ';    
    weatherSummaryPic.src=`/assets/assets/weather/${changeWeatherIcon(id)}`;
    dateTimeTxt.textContent= getDateAndTime();
    await updateForecastInfo(city);
    showDisplay(weatherInfoPage,1);
   
   
}

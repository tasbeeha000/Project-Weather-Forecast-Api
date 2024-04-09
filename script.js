
// current weather inputs

let CountryNameData = document.getElementById('countryName');
let CountryDateData= document.getElementById('CountryDate');
let CountryTimeData= document.getElementById('CountryTime');
let CelciusTemp = document.getElementById('TemperatureMain');
let feelsLike = document.getElementById('feelsLike');
let iconWeather= document.getElementById('iconWeather');
let iconWeatherText = document.getElementById('iconWeatherText');

//humidity etc inputs
let HumidityText = document.getElementById('HumidityText');
let  WindSpeedText = document.getElementById('windText');
let  VisibilityText =document.getElementById('visibilityText');
let PressureText = document.getElementById('pressureText');

//air quality index inputs

let carbonText= document.getElementById('carbonText');
let sulphurText = document.getElementById('sulphurText');
let NitrogenText= document.getElementById('NitrogenText');
let OzoneText = document.getElementById('OzoneText');

//hourly forecast inputs
let HourlyForecastTime = document.querySelectorAll('.time-hour');
let HourlyTemperatureForecast = document.querySelectorAll('.temp-Hour') ;
let HourlyForecastImageIcon = document.querySelectorAll('.image-icon-hour');
let HourlyForecastWindSpeed = document.querySelectorAll('.wind-speed-hour');
let HourlyForecastIconDes = document.querySelectorAll('.icon-des-hour');

//days forecast inputs

let DaysForecastDate = document.querySelectorAll('.time-day');
let DaysTemperatureForecast = document.querySelectorAll('.temp-day') ;
let DaysForecastImageIcon = document.querySelectorAll('.image-icon-day');
let DaysForecastIconText = document.querySelectorAll('.image-text-day');
let  DaysDayName = document.querySelectorAll('.day-name-forecast')
let DayBlock = document.querySelectorAll('.Days-block-container');

//buttons inputs
  let searchButton = document.
getElementById('searchBtn');
let UserLocationBtn = document.getElementById('LocationBtn')
const suggestionsContainer = document.getElementById('suggestions');


let api_key = "0c2a344d16a4fc0b6d98142875dd95a1";

suggestionsContainer.classList.add("hide");
//get city lat long function by geo api
function  getCityLatLong(){

  let cityName = document.getElementById('citySearchInput').value;

  if(cityName === ""||  cityName === null || cityName === undefined){
    suggestionsContainer.classList.remove('hide')
    suggestionsContainer.classList.add("show");
  
    suggestionsContainer.innerHTML=" Please Enter A City Name !";
   
  }
  else{
    let api_url_geo = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=15&appid=${api_key}`;
  
    fetch(api_url_geo).then(response => response.json()).then((data) =>{
      if(data.length === 0){
     
        suggestionsContainer.classList.remove('hide');
        suggestionsContainer.classList.add('show');
        suggestionsContainer.innerHTML=" Please Enter Correct City Name !";
      }else { console.log(data);
        displaySuggestions(data);}
        //send data to display function to presnt suggestions
       
    })

  }
 

  
}

//handle the data clicks from displaysuggestion func()
function handleSuggestionClick(data){
  console.log(data);
  let lon = data.lon;
  let lat =  data.lat;
  console.log(lon, lat);
  //send lat and long of selected city to all the functions
  getCurrent(lat,lon);
  getAirQuality(lat,lon);
  getHourlyData(lat,lon);
  get5daysForecast(lat,lon);
  suggestionsContainer.classList.add("hide");
 

}
//get current weather of city
function getCurrent(lati,long){
  
  let api_URL_current = `https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${long}&units=metric&appid=${api_key}`;

 
 
  fetch(api_URL_current).then(response=> response.json()).then((data)=>{
    console.log(data);
    let weatherIcon =  data.weather[0].icon;

    let api_url_icon = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
    console.log(api_url_icon);
    iconWeather.src = api_url_icon;
    
    const timestamp = data.dt*1000;
    const timezoneOffsetSeconds = data.timezone*1000;
  
    const localTime = timestamp+timezoneOffsetSeconds;
    const date = new Date(localTime);
    const formattedDate = date.toLocaleDateString('en-US', { timeZone: 'UTC' });
    const formattedTime = date.toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric'});

    CountryNameData.innerHTML = data.name +','+ " "+data.sys.country;
   
    CountryDateData.innerHTML = formattedDate;
    CountryTimeData.innerHTML = formattedTime;
    CelciusTemp.innerHTML = Math.round(data.main.temp)+ '' + '°C' ;
    feelsLike.innerHTML ='Feels Like:'+ " "+ Math.round(data.main.feels_like) + '' + '°C';
    iconWeatherText.innerHTML = data.weather[0].description;
    HumidityText.innerHTML =data.main.humidity + '%';
    let  windSpeed= data.wind.speed;
    WindSpeedText.innerHTML=windSpeed   + 'm/s';

    PressureText.innerHTML= (data.main.pressure) + "hPa";
   
    VisibilityText.innerHTML =(data.visibility)/1000 +".0"+'km';
  })
}

//get air quality of city
function getAirQuality(latitude,longitude){
  let api_URL_air_quality = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${api_key}`;
  fetch(api_URL_air_quality).then(response => response.json()).then((data)=>{
    console.log(data);
    carbonText.innerHTML ="CO:"+ " " + data.list[0].components.co ;
    NitrogenText.innerHTML = "NO2:"+ " " + data.list[0].components.no2 ;
    OzoneText.innerHTML = " O3:"+ " " + data.list[0].components.o3;
    sulphurText.innerHTML = "SO2:"+ " " + data.list[0].components.so2;

    if(data.list[0].main.aqi = 1){
      airQualityIndex.innerHTML = 'Good';

    }
    else if(data.list[0].main.aqi = 2){
      airQualityIndex.innerHTML = 'Fair';
    }
    else if(data.list[0].main.aqi = 3){
      airQualityIndex.innerHTML = 'Moderate';
    }
    else if(data.list[0].main.aqi = 4){
      airQualityIndex.innerHTML = 'Poor';
    }
    else if(data.list[0].main.aqi = 5){
      airQualityIndex.innerHTML = 'Very Poor';
    }
    else {
      airQualityIndex.innerHTML = 'None';
    }

  })
  

}

//get hourly forecast function
function getHourlyData(lati,long){
  let api_URL_forecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lati}&lon=${long}&units=metric&appid=${api_key}`;

fetch(api_URL_forecast).then(response => response.json()).then((data)=>{
  console.log(data);
  data.list.forEach(function (item, index) {
   
    let HourlyTime = item.dt_txt.split(" ")[1];

    // console.log(HourlyTime);
    let convertedTime = convertTime12Hr(HourlyTime);
    let weatherIconHourly =  item.weather[0].icon;

    let api_url_icon_hourly = `https://openweathermap.org/img/wn/${weatherIconHourly}@2x.png`;
    console.log(api_url_icon_hourly);

    HourlyForecastWindSpeed[index].innerHTML = item.wind.speed +" "+ "m/s";
    HourlyForecastTime[index].innerHTML = convertedTime;
    HourlyTemperatureForecast[index].innerHTML =  Math.round(item.main.temp) +" "+ "°C";
   

    HourlyForecastImageIcon[index].src = api_url_icon_hourly;

    HourlyForecastIconDes[index].innerHTML = item.weather[0].description;

    

  });
})


}

//get 5 days forecast
function get5daysForecast(lati, long) {

  let api_URL_Days_forecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lati}&lon=${long}&units=metric&appid=${api_key}`;

  fetch(api_URL_Days_forecast).then(response => response.json()).then((data) => {
      console.log(data);
      let currentDayIndex = 0;
      const organizedData = {};

      data.list.forEach(function (item) {
          let weatherIconDays = item.weather[0].icon;
          let WeatherDes = item.weather[0].description;
          let api_url_icon_Days = `https://openweathermap.org/img/wn/${weatherIconDays}@2x.png`;
          let date = item.dt_txt.split(" ")[0];

          if (!organizedData[date]) {
              organizedData[date] = {
                  temperatures: [],
                  dayName: '',
                  icon: '',
                  des: ''
              };
          }
          organizedData[date].temperatures.push(item.main.temp);

          // Get the day name for the date
          if (!organizedData[date].dayName) {
              let dateParts = date.split("-");
              let dateForDay = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
              organizedData[date].dayName = dateForDay.toLocaleDateString('en-US', { weekday: 'short' });
          }

          // Check if the time matches the target time
          let targetTime = '12:00:00';
          let hourlyTime = item.dt_txt.split(" ")[1].trim();
          if (targetTime === hourlyTime) {
              organizedData[date].icon = api_url_icon_Days;
              organizedData[date].des=WeatherDes;
          }
      });

      for (const date in organizedData) {
          const temperatureData = organizedData[date].temperatures;
          const dayName = organizedData[date].dayName;
          const dateOfTemp = date;
          const icon = organizedData[date].icon;
          const des = organizedData[date].des;
          DaysForecastDate[currentDayIndex].innerHTML = dateOfTemp;
          DaysDayName[currentDayIndex].innerHTML = dayName;
         
          console.log(temperatureData);
          let max = temperatureData[0];
          let min = temperatureData[0];

          for (let i = 1; i < temperatureData.length; i++) {
              if (temperatureData[i] > max) {
                  max = temperatureData[i];
              }
              if (temperatureData[i] < min) {
                  min = temperatureData[i];
              }
          }
         
          DaysTemperatureForecast[currentDayIndex].innerHTML = Math.round(max) + '°C' + "/" + Math.round(min) + '°C';

          // Display the weather icon
          if (icon !== '') {

              DaysForecastImageIcon[currentDayIndex].src = icon;
              DaysForecastIconText[currentDayIndex].innerHTML = des;
          }
          else{
            // DaysTemperatureForecast[currentDayIndex].innerHTML = '';
            // DaysDayName[currentDayIndex].innerHTML = '';
            // DaysForecastDate[currentDayIndex].innerHTML = '';
            // DaysForecastImageIcon[currentDayIndex].classList.add('hide');
            DaysForecastImageIcon[currentDayIndex].src = 'images/weather-forecast (1).png';
            DaysForecastIconText[currentDayIndex].innerHTML= "No data available";
            
          }

          currentDayIndex++;
      }
  })
}
//Previous fucntions  of get5daysforecast please ignore
// function get5daysForecast(lati, long) {
//   let api_URL_Days_forecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lati}&lon=${long}&units=metric&appid=${api_key}`;

//   fetch(api_URL_Days_forecast).then(response => response.json()).then((data) => {
//       console.log(data);
     
//       let currentDayIndex = 0;
//       let CurrentIndexIcon =0
//       const organizedData = {};
//       data.list.forEach(function (item) {
//           let weatherIconDays = item.weather[0].icon;
//           let api_url_icon_Days = `https://openweathermap.org/img/wn/${weatherIconDays}@2x.png`;
        
     
//           let date = item.dt_txt.split(" ")[0];
//           // let targetTime=  '12:00:00';
//           // let HourlyTime = item.dt_txt.split(" ")[1];
         
//           console.log(date);
//           if (!organizedData[date]) {
//               organizedData[date] = {
//                   temperatures: [],
//                   dayName: ''
//               };
//           }
//           organizedData[date].temperatures.push(item.main.temp);

//           // Get the day name for the date
//           if (!organizedData[date].dayName) {
//               let dateParts = date.split("-");
//               let dateForDay = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
//               organizedData[date].dayName = dateForDay.toLocaleDateString('en-US', { weekday: 'short' });
//           }
//       });

//       for (const date in organizedData) {
//           const temperatureData = organizedData[date].temperatures;
//           const dayName = organizedData[date].dayName;
//           const dateOfTemp = date;

//           DaysForecastDate[currentDayIndex].innerHTML = dateOfTemp;
//           DaysDayName[currentDayIndex].innerHTML = dayName;
//           console.log(temperatureData);
//           let max = temperatureData[0];
//           let min = temperatureData[0];

//           for (let i = 1; i < temperatureData.length; i++) {
//               if (temperatureData[i] > max) {
//                   max = temperatureData[i];
//               }
//               if (temperatureData[i] < min) {
//                   min = temperatureData[i];
//               }
//           }
        
//           DaysTemperatureForecast[currentDayIndex].innerHTML = Math.round(max) + '°C' + "/" + Math.round(min) + '°C';
//           currentDayIndex++;
//       }
//   })
// }

// function get5daysForecast(lati,long){
  
//   let api_URL_Days_forecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lati}&lon=${long}&units=metric&appid=${api_key}`;

//   fetch(api_URL_Days_forecast).then(response => response.json()).then((data)=>{
//     console.log(data);
//     let currentDayIndex = 0;
//     const organizedData = {};
//     data.list.forEach(function (item) 
//     {
//     //   let dateParts = item.dt_txt.split(" ")[0].split("-");
//     //   let dateForDay = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]); 
//     //   let dayName = dateForDay.toLocaleDateString('en-US', { weekday: 'short' });
//     //  DaysDayName[currentDayIndex].innerHTML = dayName;

//       let weatherIconDays =  item.weather[0].icon;
//       let api_url_icon_Days = `https://openweathermap.org/img/wn/${weatherIconDays}@2x.png`;
//       console.log(api_url_icon_Days);  
// let date = item.dt_txt.split(" ")[0];

// if (!organizedData[date]) {
//   organizedData[date] = [];
// }
//  organizedData[date].push(item.main.temp);
 
   
//     });
     

//     const temperatureData = [];
//     for (const date in organizedData) {
     
//         const temperatureData = organizedData[date];
//         const dateOfTemp = date;
        
//         // let dateForDay = new Date(date[0], date[1] - 1, date[2]); 
//         // let dayName =  dateForDay.toLocaleDateString('en-US', { weekday: 'short' });
//         // console.log(date);
//         // DaysDayName[currentDayIndex].innerHTML =dayName;
//         DaysForecastDate[currentDayIndex].innerHTML = dateOfTemp;
//         console.log(temperatureData);
//         let max = temperatureData[0];
//         let min = temperatureData[0];
//         console.log(max);
//         for (let i = 1; i < temperatureData.length; i++) {
         
//           if (temperatureData[i] > max) {
//             max =temperatureData[i];
//           }
          
         
//           if (temperatureData[i] < min) {
//             min = temperatureData[i];
//           }
//         }
//         DaysTemperatureForecast[currentDayIndex].innerHTML = Math.round(max)+ '°C'+ "/" + Math.round(min) + '°C' ;
//         console.log("Maximum value:", max);
//         console.log("Minimum value:", min);
//         currentDayIndex++;
//     }
 

    
//       // let targetTime=  '00:00:00';
//       // let HourlyTime = item.dt_txt.split(" ")[1].trim();
//       // console.log("hour" + HourlyTime);
     
//       // if(targetTime === HourlyTime){
//       //   let dateParts = item.dt_txt.split(" ")[0].split("-");
//       //     let date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]); 
//       //     let dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
//       //   DaysForecastDate[currentDayIndex].innerHTML = item.dt_txt.split(" ")[0];
//       //   DaysTemperatureForecast[currentDayIndex].innerHTML = Math.round(item.main.temp) + '°C' ;
//       //   DaysForecastIconText[currentDayIndex].innerHTML = item.weather[0].description;
//       //   DaysDayName[currentDayIndex].innerHTML = dayName;
//       //  DaysForecastImageIcon[currentDayIndex].src = api_url_icon_Days;
//       //   currentDayIndex++;


//       // }
  
   
//   })
  
  

// }
// function get5daysForecast(lati, long) {

//   let api_URL_Days_forecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lati}&lon=${long}&units=metric&appid=${api_key}`;

//   fetch(api_URL_Days_forecast)
//       .then(response => response.json())
//       .then((data) => {
//           console.log(data);
//           let currentDayIndex = 0;
//           const organizedData = {};
//           data.list.forEach(function (item) {


//               let weatherIconDays = item.weather[0].icon;
//               let api_url_icon_Days = `https://openweathermap.org/img/wn/${weatherIconDays}@2x.png`;
//               console.log(api_url_icon_Days);
//               let date = item.dt_txt.split(" ")[0].split("-");
//               let dateOfTemp = item.dt_txt.split(" ")[0]; // Get the date

//               // Convert date to a JavaScript Date object
//               let dateObject = new Date(date[0], date[1] - 1, date[2]);

//               // Get the day name (e.g., "Monday", "Tuesday", etc.)
//               let dayName = dateObject.toLocaleString('en-US', { weekday: 'long' });
// console.log(dayName);
//               if (!organizedData[dateOfTemp]) {
//                   organizedData[dateOfTemp] = [];
                  
//               }
//               organizedData[dateOfTemp].push(item.main.temp);
             

             
//           });


//           const temperatureData = [];
//           for (const date in organizedData) {

//               const temperatureData = organizedData[date];
//               const dateOfTemp = date;

//               DaysForecastDate[currentDayIndex].innerHTML = dateOfTemp;
//               console.log(temperatureData);
//               let max = temperatureData[0];
//               let min = temperatureData[0];
//               console.log(max);
//               for (let i = 1; i < temperatureData.length; i++) {

//                   if (temperatureData[i] > max) {
//                       max = temperatureData[i];
//                   }


//                   if (temperatureData[i] < min) {
//                       min = temperatureData[i];
//                   }
//               }
              
//               DaysTemperatureForecast[currentDayIndex].innerHTML = Math.round(max) + '°C' + "/" + Math.round(min) + '°C';
//               console.log("Maximum value:", max);
//               console.log("Minimum value:", min);
//               currentDayIndex++;
//           }

//       })

// }

//get user locations
function UserCurrentLocation(){
  suggestionsContainer.classList.add('hide');
navigator.geolocation.getCurrentPosition((Position)=>{
  console.log(Position);
let lat = Position.coords.latitude;
let long =  Position.coords.longitude;

getCurrent(lat,long);
document.getElementById('citySearchInput').value = '';
document.getElementById('suggestions').innerHTML = '';
getAirQuality(lat,long);
getHourlyData(lat,long);
get5daysForecast(lat,long);

},error=>{
  console.log(error);
});


}
function convertTime12Hr(HourlyTime){
  var timeComponents = HourlyTime.split(":");
  var hours = parseInt(timeComponents[0]);
  var minutes = parseInt(timeComponents[1]);
  var seconds = parseInt(timeComponents[2]);

  var meridiem = (hours >= 12) ? "PM" : "AM";

  hours = (hours > 12) ? hours - 12 : hours;
  hours = (hours == 0) ? 12 : hours;

  var formattedTime = hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0') + " " + meridiem;
  return formattedTime;


}



function displaySuggestions(data) {

  suggestionsContainer.innerHTML = '';
  if (data.length === 0) {
    suggestionsContainer.innerHTML = 'No matching cities found';
    return;
  }
  suggestionsContainer.classList.add("show");
  suggestionsContainer.classList.remove("hide");
  // const suggestions = document.createElement('ul');
  data.forEach(data => {
    const listItem = document.createElement('p');
    const hr = document.createElement('hr');
    listItem.style.cursor = 'pointer';
    listItem.style.lineHeight = '16px' ;
    listItem.style.paddingTop='5px';
    listItem.style.alignItems="center";
    listItem.style.cssText += `display: flex;`;
    listItem.style.textWrap = "wrap";
    listItem.style.textOverflow= "ellipsis";
    listItem.style.transition = 'font-weight 0.2s ease';

// Define the styles for the hover effect
listItem.addEventListener('mouseenter', function() {
 
  this.style.fontWeight = 'bold'; // Bold the text on hover
});

// Define the styles to revert back on mouse leave
listItem.addEventListener('mouseleave', function() {
  
  this.style.fontWeight = 'normal'; // Bold the text on hover
});
    if (data.state) {
      // If data.state is available
      listItem.textContent = `${data.name}, ${data.country}, ${data.state}`;
    } else {
      // If data.state is not available
      listItem.textContent = `${data.name}, ${data.country}`;
    }
   
    listItem.addEventListener('click', () => handleSuggestionClick(data));
   
    suggestions.appendChild(listItem);
    suggestions.appendChild(hr);
  });
  
  
}


searchButton.addEventListener('click',getCityLatLong);
UserLocationBtn.addEventListener('click',UserCurrentLocation)




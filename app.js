const userTab = document.querySelector("[data-userWeather]");
const back = document.querySelector("#wrapper");
const error_search = document.querySelector(".search-error");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessCont = document.querySelector(".grant-location-conatiner");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");


let currentTab = userTab;
let API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");
getFormSessionStorage();

function switchTab(clickedTab) {
  if (currentTab != clickedTab) {
    back.style.backgroundColor = "black";
    currentTab.classList.remove("current-tab");
    error_search.classList.remove("active")
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    if (!searchForm.classList.contains("active")) {
      
      userInfoContainer.classList.remove("active");
      grantAccessCont.classList.remove("active");
      searchForm.classList.add("active");
    }
     else {
     
      searchForm.classList.remove("active");
     
      userInfoContainer.classList.remove("active");
    
      getFormSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => {
  // jispr click kro wo paas krna h
  switchTab(userTab);
});
searchTab.addEventListener("click", () => {
  // jispr click kro wo paas krna h
  switchTab(searchTab);
});

function getFormSessionStorage() {
  const localCoord = sessionStorage.getItem("user-coordinates");
  if (!localCoord) {
    grantAccessCont.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoord);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  // grant location ko invisble krde
  grantAccessCont.classList.remove("active");
  // make loader visible
  loadingScreen.classList.add("active");

  //  api call

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();
    console.log(data);

    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
  }
}

function renderWeatherInfo(weatherInfo) {
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[ data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  //place all the values on the page

  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

  temp.innerText = weatherInfo?.main?.temp;
  temp.insertAdjacentHTML( 'beforeend', " °C" );
  // console.log(temp.innerText);

  function changetheme(temp) {
    const taap = parseInt(temp);
    if (taap < 10) back.style.backgroundColor = "#00ffff";
    else if (taap < 20) back.style.backgroundColor = "#00ff80";
    else if (taap < 30) back.style.backgroundColor = "#ffbf00";
    else if (taap < 40) back.style.backgroundColor = "#ff8000";
    else back.style.backgroundColor = "#ff4000";
  }

  changetheme(temp.innerText);

  windspeed.innerText = weatherInfo?.wind?.speed;
  windspeed.insertAdjacentHTML( 'beforeend', "m/s" );
  humidity.innerText = weatherInfo?.main?.humidity;
  humidity.insertAdjacentHTML( 'beforeend', "%" );
  cloudiness.innerText = weatherInfo?.clouds?.all;
  cloudiness.insertAdjacentHTML( 'beforeend', "%" );

  if(cityName.innerText!='undefined')
  {
    error_search.classList.remove("active")
    userInfoContainer.classList.add("active");
  }
  else{
    back.style.backgroundColor = "black";
      error_search.classList.add("active")

  }
}
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    // error for no location found
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

let searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (searchInput.value === "") return;

  fetchSearchWeatherInfo(searchInput.value);
});

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessCont.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();
    loadingScreen.classList.remove("active");
    renderWeatherInfo(data);
    //  userInfoContainer.classList.add("active");
  } catch (err) {
    // errr
  }
}

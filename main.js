let api, apiKey;
apiKey = `1fe5f98f629555d1d41da29cc9705334`;
const wrapper_div = document.querySelector(".wrapper");
const backBtn = document.querySelector("#back-btn");
const inputPortion_div = document.querySelector("#input_portion");
const weatherPortion_div = document.querySelector("#weather_portion");
const msg_div = document.querySelector("#msg")
const city_input = document.querySelector("#input_city");
const location_btn = document.querySelector("#btn_location");
let img = document.getElementById("weather_img");
let weather_element = document.querySelector("#weather");
let loc_element = document.querySelector("#location");
let temp_element = document.querySelector("#temp")
let humidity_element = document.querySelector("#humidity")
let feels_like_element = document.querySelector("#temp2")

backBtn.addEventListener("click", () => {
    inputPortion_div.classList.remove('hidden');
    weatherPortion_div.classList.add('hidden');
    inputPortion_div.classList.add('input-portion')
    msg_div.classList.add("hidden")
    msg_div.classList.remove("pending")
    backBtn.classList.add("hidden")
})

city_input.addEventListener("keyup", e => {
    //if user press enter key and value of input field is not null
    if (e.key == "Enter" && city_input.value != "" && city_input.value != null) {
        requestAPI(city_input.value);
    }
})

function requestAPI(cityName) {
    apiKey = `1fe5f98f629555d1d41da29cc9705334`
    api = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
    fetchData()
}



location_btn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser does not support geolocation api")
    }
})

function onSuccess(position) {
    let { latitude: lat, longitude: long } = position.coords; //object destructuring
    console.log("calling fetch data function");
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${apiKey}`;
    fetchData();

}

function onError(error) {
    msg_div.innerHTML = error.message;
    msg_div.classList.remove("hidden");
    msg_div.classList.remove("pending")
    msg_div.classList.add("error");
}

function fetchData() {
    msg_div.innerHTML = "Getting weather details..."
    msg_div.classList.remove("hidden");
    msg_div.classList.remove("error");
    msg_div.classList.add("pending");
    fetch(api).then((response) => {
        const res = response.json();
        return res;
    }).then((data) => weatherDetails(data))
}

function weatherDetails(data) {
    if (data.cod == '404') {
        msg_div.innerHTML = "Please enter a valid city name"
        msg_div.classList.remove("hidden");
        msg_div.classList.remove("pending")
        msg_div.classList.add("error");
    } else {
        console.log(data);
        inputPortion_div.classList.add('hidden');
        weatherPortion_div.classList.remove('hidden');
        weatherPortion_div.classList.add('weather-portion')
        backBtn.classList.add("bx", "bx-left-arrow-alt")
        backBtn.classList.remove("hidden");
        const city = data.name;
        const country = data.sys.country;
        const { description, id } = data.weather[0];
        const { feels_like, humidity, temp } = data.main;
        loc_element.innerHTML = `${city}, ${country}`
        temp_element.innerHTML = Math.floor(temp);
        weather_element.innerHTML = description;
        humidity_element.innerHTML = humidity;
        feels_like_element.innerHTML = Math.floor(feels_like);
        if (id == 800) {
            img.src = "static/clear-sky.png"
        } else if (id >= 200 && id <= 232) {
            img.src = "static/storm.png"
        } else if (id == 500) {
            img.src = "static/rain.png"
        } else if (id >= 600 && id <= 622) {
            img.src = "static/snow.png"
        } else if (id >= 701 && id <= 781) {
            img.src = "static/dust.png"
        } else if (id >= 801 && id <= 804) {
            img.src = "static/cloud.png"
        } else {
            img.src = "static/sunny.png"
        }
    }
}
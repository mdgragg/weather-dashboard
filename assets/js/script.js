var locations = [];

function getIcon(condition) {
    console.log(condition);
    if (condition === "Rain")
        return "<img src='assets/images/rain.png'>";

    if (condition === "Clouds")
        return "<img src='assets/images/clouds.png'>";

    if (condition === "Clear")
        return "<img src='assets/images/sun.png'>";

    if (condition === "Drizzle")
        return "<img src='assets/images/drizzle.png'>";

    if (condition === "Snow")
        return "<img src='assets/images/snow.png'>";

    if (condition === "Mist")
        return "<img src='assets/images/mist.png'>";

    if (condition === "Fog")
        return "<img src='assets/images/fog.png'>";

}


function renderCurrentWeather(location, temperature, humidity, windSpeed, uv, condition) {    
    
    $("#location").empty();
    $("#location").append(location);
    $("#location").append(" ");

    var date = moment().format("MMMM" + " D" + "," + " YYYY");
    $("#date-main").empty();
    $("#date-main").append(date);
    $("#date-main").append(" ");

    var icon = $("<span>");
    icon.append(getIcon(condition));
    icon.addClass("weather-main");
    $("#location").prepend(icon);

    $("#temperature").empty();
    $("#temperature").append(temperature);
    $("#temperature").append(" °F");
    $("#temperature").addClass("weather-value");

    $("#humidity").empty();
    $("#humidity").append(humidity);
    $("#humidity").append("%");
    $("#humidity").addClass("weather-value");

    $("#windSpeed").empty();
    $("#windSpeed").append(windSpeed);
    $("#windSpeed").append(" MPH");
    $("#windSpeed").addClass("weather-value");

    $("#uv").empty();
    if (uv < 3)
        $("#uv").css("background-color", "green");
    else if (uv < 6)
        $("#uv").css("background-color", "yellow");
    else if (uv < 8)
        $("#uv").css("background-color", "orange");
    else if (uv < 11)
        $("#uv").css("background-color", "red");
    else
        $("#uv").css("background-color", "purple");

    $("#uv").append(uv);
    $("#uv").addClass("weather-value");

}

$("#searchLocation").on("click", function () {
    event.preventDefault();
    var location = $("#locationInput").val().trim();
    $("#locationInput").val("");

    query(location);
    queryForecast(location)

    addButton(location);

    $("#currentWeather").css("display", "block");
    $("#forecast").css("display", "flex");

});

$(document).on("click", ".city-button", function () {
    var location = $(this).attr("data-city");
    query(location);
    queryForecast(location);
    $("#currentWeather").css("display", "block");
    $("#forecast").css("display", "flex");
});

function formatDate(forecastDates) {
    var forecastDates = moment().format(("MMMM" + " D" + "," + " YYYY", "MMMM" + " D" + "," + " YYYY"));
    return forecastDates;
}





function queryForecast(location) {

    var APIKey = "ef44665854f55183eee5b200931c4f01";
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + location + "&units=imperial&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(queryURL);
        console.log(response);
        var forecast = response.list;
        for (var i = 0; i < forecast.length; i++) {
            var cardNumber = 0;
            if (i === 0)
                cardNumber = 0;
            if (i === 6)
                cardNumber = 1;
            if (i === 14)
                cardNumber = 2;
            if (i === 22)
                cardNumber = 3;
            if (i === 30)
                cardNumber = 4;

            if (i === 0 || i === 6 || i === 14 || i === 22 || i === 30) {
                var date = forecast[i].dt_txt;
                var temperature = forecast[i].main.temp;
                var humidity = forecast[i].main.humidity;
                var condition = forecast[i].weather[0].main;
                addBoxes(cardNumber, date, temperature, humidity, condition);
            }
        }
    });
}

function query(location) {
    var APIKey = "ef44665854f55183eee5b200931c4f01";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&units=imperial&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(queryURL);
        console.log(response);
        var lat = response.coord.lat;
        var lon = response.coord.lon;

        APIKey = "ef44665854f55183eee5b200931c4f01";
        queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (uvIndex) {
            renderCurrentWeather(response.name, response.main.temp, response.main.humidity, response.wind.speed, uvIndex.value, response.weather[0].main);
        });


    });

}

function addBoxes(index, date, temperature, humidity, condition) {

    var dayBox = $("<div>");

    var icon = $("<span>");
    icon.append(getIcon(condition));
    icon.addClass("weather-icon");

    var title = $("<h5>");
    title.addClass("card-title");
    date = formatDate(date);
    title.text(date);

    var boxTemperature = $("<p>");
    boxTemperature.addClass("card-text");
    boxTemperature.text("Temperature");
    boxTemperature.prepend("<span>" + "°F" + "<br>");
    boxTemperature.prepend("<span> " + temperature);

    var boxHumidity = $("<p>");
    boxHumidity.addClass("card-text");
    boxHumidity.text("Humidity");
    boxHumidity.prepend("<span>" + "%" + "<br>");
    boxHumidity.prepend("<span> " + humidity);
    
    dayBox.append(icon);
    dayBox.append(title);
    dayBox.append(boxTemperature);
    dayBox.append(boxHumidity);

    $("#" + index).empty();
    $("#" + index).append(dayBox);
}

function addButton(location) {

    var button = $("<button>");
    button.addClass("city-button");
    button.attr("type", "button");
    button.attr("data-city", location);
    button.text(location)
    $("#history").append(button);

    if (localStorage.getItem("locations")) {

        locations = JSON.parse(localStorage.getItem("locations"));
        var index = 0;
        for (var i = 0; i < locations.length; i++) {
            if (locations[i] === location) {
                index = i;
            }
        }
        if (index === -1) {
            locations.push(location);
        } else {
            locations[index] = location;
        }
    } else {
        locations.push(location);
    }

    localStorage.setItem("locations", JSON.stringify(locations));
}

function setUp() {
    if (localStorage.getItem("locations")) {
        locations = JSON.parse(localStorage.getItem("locations"));
        for (var i = 0; i < locations.length; i++) {
            var location = locations[i];
            addButton(location);
        }
    }

}


$(document).ready(function(){ 
    setUp();
}); 

API_KEY = "b93957a1ad3f9522ab0d22703527d61b"

function getData(){
    if(document.getElementById('city').value=="")
    {
        document.getElementById('show_alert').innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Empty field!</strong> Search city cannot be empty
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        `
    }
    else
    {
        let LOCATION = document.getElementById('city').value+",IN";
        let url_realtime = "http://api.openweathermap.org/data/2.5/weather?q=" + LOCATION + "&appid=" + API_KEY + "&units=metric";
        fetch(url_realtime)
            .then((response) => {
                return response.json();
            }).then((data) => {
                console.log(data)
                let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                let today_date = (new Date()).getDate();
                let today_month = month[(new Date()).getMonth()];
                let today_hour = (new Date()).getHours();
                let today_minute = (new Date()).getMinutes();

                let lat = data["coord"]["lat"];
                let lon = data["coord"]["lon"];
                document.getElementById('date_time').innerHTML = `${today_date} ${today_month}, ${today_hour}:${today_minute}`;
                document.getElementById('city_country').innerHTML = `${data["name"]}, ${data["sys"]["country"]}`;
                document.getElementById('temperature').innerHTML = `${data["main"]["temp"]}&deg;C`;
                document.getElementById('temperature_feel').innerHTML = `Feels like ${data["main"]["feels_like"]}&deg;C`;
                document.getElementById('humidity').innerHTML = `${data["main"]["humidity"]}%`;
                document.getElementById('windS').innerHTML = `${data["wind"]["speed"]}m/s`;
                document.getElementById('windD').innerHTML = `${data["wind"]["deg"]}&deg;`;
                document.getElementById('pressure').innerHTML = `${data["main"]["pressure"]}mm`;
            let url_pollution = "http://api.openweathermap.org/data/2.5/air_pollution?lat=" + lat + "&lon=" + lon + "&appid=" + API_KEY;
            fetch(url_pollution)
                .then((response) => {
                    return response.json();
            }).then((data) => {
                // console.log(data);
                let aqi = data["list"][0]["main"]["aqi"];
                let aqi_comment = ""
                let bg_color = ""
                if(aqi == 5)
                {
                    aqi_comment = "Very Poor"
                    bg_color = "#ff0000"
                }
                else if(aqi == 4)
                {
                    aqi_comment = "Poor"
                    bg_color = "#ffA500"
                }
                else if(aqi == 3)
                {
                    aqi_comment = "Moderate"
                    bg_color = "#ffaf30"
                }
                else if(aqi == 2)
                {
                    aqi_comment = "Fair"
                    bg_color = "#0000ff"
                }
                else if(aqi == 1)
                {
                    aqi_comment = "Good"
                    bg_color = "#00ff00"
                }

                document.getElementById('aqi_holder').style = `background-color: ${bg_color}`;
                document.getElementById('aqi').innerHTML = `${aqi} (${aqi_comment})`;

            });

            let time_labels = []
            let temp_data = []
            let desc_labels = []
            let url_forecast = "http://api.openweathermap.org/data/2.5/forecast?q=" + LOCATION + "&appid=" + API_KEY + "&units=metric";
            fetch(url_forecast)
                .then((response) => {
                    return response.json();
            }).then((data) => {
                // console.log(data);
                output = ``
                data["list"].forEach(element => {
                    // console.log(element["dt_txt"]);
                    if(element["dt_txt"].split(" ")[1] == "00:00:00")
                    {
                        time_labels.push(element["dt_txt"].split(" ")[0]);
                    }
                    else
                    {
                        time_labels.push(element["dt_txt"].split(" ")[1]);
                    }
                    temp_data.push(element["main"]["temp_max"]);
                    desc_labels.push(element["weather"]["0"]["description"]);
                    output+=`
                    <tr>
                        <td class="h6">${element["dt_txt"].split(" ")[0]}</td>
                        <td>${element["dt_txt"].split(" ")[1]}</td>
                        <td>${element["main"]["temp_max"]} / ${element["main"]["temp_min"]}&deg;C</td>
                        <td>${element["weather"]["0"]["description"]}  </td>
                    </tr>
                    `
                });

                document.getElementById('forecast_table').innerHTML = output;

                make_graph(time_labels, temp_data, desc_labels);
            });
        });
    }
}

function make_graph(time_labels, temp_data, desc_labels)
{
    console.log("Calling", temp_data)
    document.getElementById('chart_area').innerHTML = ``;
    let chart = document.createElement('canvas')
    chart.id = "myChart"
    chart.width = "400"
    chart.height = "180"
    document.getElementById('chart_area').appendChild(chart)
    const ctx = chart.getContext('2d');
            setTimeout(() => {
                const myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: time_labels,
                        datasets: [{
                            label: 'Tempature variation',
                            data: temp_data,
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            tension: 0.1
                        }]
                    },
                    options: {
                        
                      }
                });

                time_labels = []
    temp_data = []
    desc_labels = []
            }, 500);
    
}

getData();
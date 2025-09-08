import React, { Component } from 'react';

const openWeatherURL = "http://api.openweathermap.org/data/2.5/weather?zip=94066&appid=f71dae67a7c7e02ea4aaac1ce3d779a2";

export default class Weather extends Component {
    state = {
        weatherId: '',
        description: '',
        temp: '',
        humidity: '',
        windSpeed: '',
        city: '',
        iconUrl: ''
    }

    componentDidMount() {
        fetch(openWeatherURL)
          .then((response) => (response).json()) 
          .then((weatherData) => this.setState({
            weatherId: weatherData.weather[0].id,
            description: weatherData.weather[0].description,
            temp: weatherData.main.temp,
            humidity: weatherData.main.humidity,
            windSpeed: weatherData.wind.speed,
            city: weatherData.name,
            iconUrl: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
          }))
    }

    render() {
        return (
            <div className="dashboard-weather-content">
                <img className="dashboard-weather-icon" src={this.state.iconUrl} alt="weather icon" />
                <div className="dashboard-weather-temp">{Math.round((this.state.temp - 273.15) * 1.8 + 32)}°F</div>
                <p className="dashboard-weather-condition">{this.state.description}</p>
            </div>
        )
    }
}

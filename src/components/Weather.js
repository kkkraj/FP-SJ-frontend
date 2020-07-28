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
            <div id="weather">
                <h5 className="text" style={{fontWeight: 'bold', color: 'coral'}}>{this.state.city}</h5>
                <img style={{borderRadius: '100px'}} src={this.state.iconUrl} alt="weather icon" />
                <p style={{fontSize: '17px'}} className="text">{this.state.description}</p>
                <h5 className="text" style={{fontWeight: 'bold', color: 'dimgray'}}>{Math.round((this.state.temp - 273.15) * 1.8 + 32)} °F</h5>
                <br/>
                <h6 className="text">humidity {this.state.humidity} % | wind {this.state.windSpeed} mph</h6>
            </div>
        )
    }
}

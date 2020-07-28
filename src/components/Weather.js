import React, { Component } from 'react';
import moment from 'moment';

const openWeatherURL = "http://api.openweathermap.org/data/2.5/weather?zip=94066&appid=f71dae67a7c7e02ea4aaac1ce3d779a2";

export default class Weather extends Component {
    state = {
        weatherData: ""
    }

    componentDidMount() {
        fetch(openWeatherURL)
          .then((response) => (response).json()) 
          .then((weatherData) => this.setState({ weatherData: weatherData}))
    }

    render() {
        return (
            <div id="weather">
                <div className="text" id="datetime">{moment().format('dddd LL, LT')}</div>
                <h4>{this.state.weatherData.name}</h4>
                
            </div>
        )
    }
}

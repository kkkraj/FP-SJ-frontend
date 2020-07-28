import React, {Component} from 'react';
import Calendar from 'react-calendar';
import bnn from '../images/bn2.png';
import '../Calendar.css';
import Weather from './Weather'

export default class About extends Component {
    state = {
        date: new Date()
    }

    onChange = (date) => {
        this.setState({ date })
    }

    render () {
        return (
            <div id="about">
                <div>
                    {/* <img id="aboutimg" src={bnn} alt="hi astronaut" /> */}
                    <h3 id="hello">{`Hello, ${this.props.currentUser.name}`}</h3>
                </div>
                <div id="calendar">
                    <Calendar onChange={this.onChange} value={this.state.date} />
                </div><br/>
                <div><Weather /></div>
            </div>
        )
    }
}
import React, {Component} from 'react';
import Calendar from 'react-calendar';
import '../Calendar.css';

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
                <h2 id="hello">{`Hello, ${this.props.currentUser.name}`}</h2>
                <div className="split left">
                    <div className="centered">
                        <Calendar style={{border: 'solid black 10px'}} onChange={this.onChange} value={this.state.date} />
                    </div>
                </div>
                <div className="split right">
                    <div className="centered">
                        <Calendar style={{border: 'solid black 10px'}} onChange={this.onChange} value={this.state.date} />
                    </div>
                </div>
            </div>
        )
    }
}
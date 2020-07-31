import React, { Component } from 'react';
import Clock from 'react-clock';
import '../Clock.css';

export default class MyClock extends Component {
    state = {
        date: new Date(),
    }

    componentDidMount() {
        setInterval(
          () => this.setState({ date: new Date() }),
          1000
        );
    }

    render() {
        return (
            <div>
                <Clock id='myclock' value={this.state.date} /> 
            </div>
        )
    }
}

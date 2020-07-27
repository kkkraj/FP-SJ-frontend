import React, {Component} from 'react';
import greeting from '../images/bnn.png';

export default class About extends Component {
    render () {
        return (
            <div id="about">
                    {/* <img id="greeting" src={greeting} alt="greeting"/> */}
                    <h2 id="hello">{`Hello, ${this.props.currentUser.name}`}</h2>
            </div>
        )
    }
}
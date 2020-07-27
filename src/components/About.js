import React, {Component} from 'react';
import greeting from '../images/bnn.png';
import 'materialize-css/dist/css/materialize.min.css';

export default class About extends Component {
    render () {
        return (
            <div>
                <div id="about" className="col s12">
                    {/* <img id="greeting" src={greeting} alt="greeting"/> */}
                    <h2 id="hello">{`Hello, ${this.props.currentUser.name}`}</h2>
                </div>
            </div>
        )
    }
}
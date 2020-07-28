import React, {Component} from 'react';
import Calendar from 'react-calendar';
import '../Calendar.css';
import Weather from './Weather';
import MyClock from './MyClock';
import moment from 'moment';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col} from 'react-bootstrap';

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
                <h3 id="hello">{`Hello, ${this.props.currentUser.name}`}</h3>
                <br/>
                <Container>
                    <Row>
                        <Col xs={12} md={5}></Col>
                        <Col xs={12} md={2}><MyClock /></Col>
                        <Col xs={12} md={5}></Col>
                    </Row>
                </Container>
                <br/>
                <Container>
                    <Row>
                        <Col xs={12} md={1}></Col>
                        <Col id="calendar" xs={12} md={5}>
                            <Calendar onChange={this.onChange} value={this.state.date} />
                        </Col>
                        <Col xs={12} md={5}>
                            <Weather />
                        </Col>
                        <Col xs={12} md={1}></Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
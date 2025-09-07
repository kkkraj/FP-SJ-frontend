import React from 'react';
import Weather from './Weather';
import MyClock from './MyClock';
import moment from 'moment';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col} from 'react-bootstrap';

const day = moment().format('dddd');
const date = moment().format('D');
const month = moment().format('MMMM');
const year = moment().format('YYYY');
const time = moment().format('LT');

export default function About(props) {
    console.log('About component rendered with currentUser:', props.currentUser);
    
    return (
        <div id="about">
            <h4 id="hello">{`Hello, ${props.currentUser.name}!`}</h4>
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
                        <Col xs={12} md={5}>
                            <div className="text" id="datetime">
                            <h5 style={{fontWeight: 'bold', color: 'rgb(88, 153, 150)', letterSpacing: '2px'}}>{day}</h5>
                            <p style={{fontSize: '60px', fontWeight: 'bold', color: 'coral', letterSpacing: '2px', marginBottom: '15px'}}>{date}</p>
                            <h5 style={{fontWeight: 'bold', color: 'rgb(88, 153, 150)'}}>{month}, {year}</h5><br/><br/>
                            <h6 style={{color: 'rgb(41, 41, 41'}}>{time}</h6>
                            </div>
                        </Col>
                        <Col xs={12} md={5}>
                            <Weather />
                        </Col>
                        <Col xs={12} md={1}></Col>
                    </Row>
                </Container>
            </div>
        );
    }
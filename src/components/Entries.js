import React, { Component } from 'react'
import Diarybook from './Diarybook';
import Calendar from 'react-calendar';
import '../Calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col} from 'react-bootstrap';

export default class Entries extends Component {
    state = {
        date: new Date()
    }

    HandleChange = (date) => {
        this.setState({ date })
    }

    handleClick = () => {
        console.log()
    }

    render() {
        return (
            <div id="entries" className="text">
                <Container>
                    <Row>
                        <Col xs={12} md={4}><Calendar onChange={this.HandleChange} onClick={() => this.handleClick()} value={this.state.date} /></Col>
                        <Col xs={12} md={1}></Col>
                        <Col xs={12} md={6}>
                            <h4 style={{fontWeight: 'bold', letterSpacing: '1px'}}>All Entries</h4>
                            <Diarybook currentUser={this.props.currentUser}/>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

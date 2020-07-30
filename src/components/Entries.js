import React, { Component } from 'react'
import Diarybook from './Diarybook';
import Calendar from 'react-calendar';
import '../Calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col} from 'react-bootstrap';

export default class Entries extends Component {
    state = {
        date: new Date(),
        formatDate: '',
        displayDate: ''
    }

    HandleChange = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const ddate = date.getDate();
        const formatted = `${year}-${month}-${ddate}`;
        const weekDay = date.toLocaleString('en-us', {  weekday: 'long' });
        const monthName = date.toLocaleString('en-us', {  month: 'long' });
        const forDisplay = `${weekDay} ${monthName} ${ddate}, ${year}`
        this.setState({ 
            date, 
            formatDate: formatted,
            displayDate: forDisplay
        })
    }

    render() {
        return (
            <div id="entries" className="text">
                <Container>
                    <Row>
                        <Col xs={12} md={4} style={{textAlign: 'center'}}>
                            <Calendar onChange={this.HandleChange} onClick={this.handleClick} value={this.state.date} />
                            <br/><br/>
                            <p style={{color: 'DarkSalmon'}}>Pick a Date to Display</p>
                        </Col>
                        <Col xs={12} md={1}></Col>
                        <Col xs={12} md={6}>
                            <h4 style={{fontWeight: 'bold', letterSpacing: '1px', color: "rgb(17, 81, 146)"}}>{this.state.displayDate}</h4>
                            <br/>
                            <Diarybook currentUser={this.props.currentUser} selectedDate={this.state.formatDate}/>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

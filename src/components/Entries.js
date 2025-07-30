import React, { useState, useEffect } from 'react';
import Diarybook from './Diarybook';
import Calendar from 'react-calendar';
import '../Calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col} from 'react-bootstrap';

export default function Entries(props) {
    const [date, setDate] = useState(new Date());
    const [formatDate, setFormatDate] = useState('');
    const [displayDate, setDisplayDate] = useState('');

    // Function to format date for display and API
    const formatDateForDisplay = (selectedDate) => {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const ddate = selectedDate.getDate();
        const formatted = `${year}-${month}-${ddate}`;
        const weekDay = selectedDate.toLocaleString('en-us', {  weekday: 'long' });
        const monthName = selectedDate.toLocaleString('en-us', {  month: 'long' });
        const forDisplay = `${weekDay} ${monthName} ${ddate}, ${year}`;
        
        return { formatted, forDisplay };
    };

    // Set today's date as default when component mounts
    useEffect(() => {
        const today = new Date();
        const { formatted, forDisplay } = formatDateForDisplay(today);
        setDate(today);
        setFormatDate(formatted);
        setDisplayDate(forDisplay);
    }, []);

    const handleChange = (selectedDate) => {
        const { formatted, forDisplay } = formatDateForDisplay(selectedDate);
        
        setDate(selectedDate);
        setFormatDate(formatted);
        setDisplayDate(forDisplay);
    };

    return (
        <div id="entries" className="text">
            <Container>
                <Row>
                    <Col xs={12} md={4} style={{textAlign: 'center'}}>
                        <Calendar onChange={handleChange} value={date} />
                        <br/><br/>
                        <p style={{color: 'DarkSalmon'}}>Pick a Date to Display</p>
                    </Col>
                    <Col xs={12} md={1}></Col>
                    <Col xs={12} md={6}>
                        <h4 style={{fontWeight: 'bold', letterSpacing: '1px', color: "rgb(17, 81, 146)"}}>{displayDate}</h4>
                        <br/>
                        <Diarybook currentUser={props.currentUser} selectedDate={formatDate}/>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

import React, { Component } from 'react';
import MoodsChart from './MoodsChart';
import ActivityChart from './ActivityChart';
import {Container, Row, Col} from 'react-bootstrap';

export default class Charts extends Component {
    render() {
        return (
            <div className="charts">
                <Container>
                    <Row>
                        <Col xs={12} md={5}><MoodsChart /></Col>
                        <Col xs={12} md={1}></Col>
                        <Col xs={12} md={5}><ActivityChart /></Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

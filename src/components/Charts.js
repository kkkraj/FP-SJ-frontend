import React from 'react';
import MoodsChart from './MoodsChart';
import ActivityChart from './ActivityChart';
import {Container, Row, Col} from 'react-bootstrap';

export default function Charts({ currentUserId }) {
    return (
        <div className="charts">
            <Container>
                <Row>
                    <Col xs={12} md={4}></Col>
                    <Col xs={12} md={4}><h4 id="monthly">Monthly</h4></Col>
                    <Col xs={12} md={4}></Col>
                </Row> <br/>
                
                {/* Chart Headers - Side by Side */}
                <Row>
                    <Col xs={12} md={6}>
                        <h4 className="chart-header">Mood Tracker</h4>
                    </Col>
                    <Col xs={12} md={6}>
                        <h4 className="chart-header">Activity Tracker</h4>
                    </Col>
                </Row>
                
                {/* Charts - Side by Side */}
                <Row>
                    <Col xs={12} md={6}>
                        <MoodsChart currentUserId={currentUserId} />
                    </Col>
                    <Col xs={12} md={6}>
                        <ActivityChart currentUserId={currentUserId} />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

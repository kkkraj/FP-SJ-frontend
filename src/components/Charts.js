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
                
                {/* Mood Chart - Full Width */}
                <Row>
                    <Col xs={12}>
                        <h4 className="chart-header">Mood Tracker</h4>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <MoodsChart currentUserId={currentUserId} />
                    </Col>
                </Row>
                
                {/* Activity Chart - Full Width */}
                <Row style={{ marginTop: '40px' }}>
                    <Col xs={12}>
                        <h4 className="chart-header">Activity Tracker</h4>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <ActivityChart currentUserId={currentUserId} />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

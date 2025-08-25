import React, { useState, useEffect, useRef } from 'react';
import MoodsChart from './MoodsChart';
import ActivityChart from './ActivityChart';
import {Container, Row, Col, Button} from 'react-bootstrap';

export default function Charts({ currentUserId }) {
    const [selectedMonth, setSelectedMonth] = useState('');
    const previousMonthRef = useRef('');
    
    useEffect(() => {
        // Set default to current month
        const currentDate = new Date();
        const currentMonth = currentDate.toISOString().slice(0, 7);
        setSelectedMonth(currentMonth);
        previousMonthRef.current = currentMonth;
    }, []);

    const handleMonthChange = (newMonth) => {
        if (newMonth && /^\d{4}-\d{2}$/.test(newMonth)) {
            // Only update if it's actually a different month
            if (newMonth !== previousMonthRef.current) {
                previousMonthRef.current = newMonth;
                setSelectedMonth(newMonth);
            }
        }
    };

    const goToPreviousMonth = () => {
        if (selectedMonth) {
            const [year, month] = selectedMonth.split('-');
            const currentDate = new Date(parseInt(year), parseInt(month) - 2, 1); // -2 because month is 0-indexed
            const newMonth = currentDate.toISOString().slice(0, 7);
            handleMonthChange(newMonth);
        }
    };

    const goToNextMonth = () => {
        if (selectedMonth) {
            const [year, month] = selectedMonth.split('-');
            const currentDate = new Date(parseInt(year), parseInt(month), 1); // month is already 0-indexed
            const newMonth = currentDate.toISOString().slice(0, 7);
            handleMonthChange(newMonth);
        }
    };

    const getCurrentMonthLabel = () => {
        if (!selectedMonth) return '';
        const [year, month] = selectedMonth.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return date.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
        });
    };

    // Check if we can go to previous/next month
    const canGoPrevious = () => {
        if (!selectedMonth) return false;
        const [year, month] = selectedMonth.split('-');
        const currentDate = new Date();
        const selectedDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const twelveMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 11, 1);
        return selectedDate > twelveMonthsAgo;
    };

    const canGoNext = () => {
        if (!selectedMonth) return false;
        const [year, month] = selectedMonth.split('-');
        const currentDate = new Date();
        const selectedDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        // Don't allow going beyond current month
        const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        return selectedDate < currentMonthStart;
    };

    return (
        <div className="charts">
            <Container>
                <Row>
                    <Col xs={12} md={4}></Col>
                    <Col xs={12} md={4}>
                        <div className="d-flex align-items-center justify-content-center">
                            <Button 
                                variant="outline-secondary" 
                                size="sm"
                                onClick={goToPreviousMonth}
                                disabled={!canGoPrevious()}
                                className="month-nav-btn me-2"
                            >
                                ❮
                            </Button>
                            <h4 id="monthly" className="mb-0 mx-3">
                                {getCurrentMonthLabel()}
                            </h4>
                            <Button 
                                variant="outline-secondary" 
                                size="sm"
                                onClick={goToNextMonth}
                                disabled={!canGoNext()}
                                className="month-nav-btn ms-2"
                            >
                                ❯
                            </Button>
                        </div>
                    </Col>
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
                        <MoodsChart currentUserId={currentUserId} selectedMonth={selectedMonth} />
                    </Col>
                    <Col xs={12} md={6}>
                        <ActivityChart currentUserId={currentUserId} selectedMonth={selectedMonth} />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

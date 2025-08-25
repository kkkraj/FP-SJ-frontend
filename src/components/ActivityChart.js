import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import api from '../services/api';

export default function ActivityChart({ currentUserId, selectedMonth }) {
    const [activitiesList, setActivitiesList] = useState([]);
    const [userActivityData, setUserActivityData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const svgRef = useRef();

    // Process user activity data to count occurrences of each activity
    const processActivityData = useCallback(() => {
        if (!userActivityData || userActivityData.length === 0) {
            // Check if the selected month is in the future
            if (selectedMonth) {
                const [year, month] = selectedMonth.split('-');
                const selectedDate = new Date(parseInt(year), parseInt(month) - 1, 1);
                const currentDate = new Date();
                const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                
                if (selectedDate >= currentMonthStart) {
                    // Return empty data for future months
                    return activitiesList.map((activity) => ({
                        ...activity,
                        count: 0
                    }));
                }
            }
            
            // Use mock data only for past months
            return activitiesList.map((activity, index) => ({
                ...activity,
                count: Math.floor(Math.random() * 30) + 1
            }));
        }

        // Count occurrences of each activity
        const activityCounts = {};
        activitiesList.forEach(activity => {
            activityCounts[activity.id] = 0;
        });

        userActivityData.forEach(userActivity => {
            if (activityCounts.hasOwnProperty(userActivity.activity_id)) {
                activityCounts[userActivity.activity_id]++;
            }
        });

        // Convert to array with counts
        return activitiesList.map(activity => ({
            ...activity,
            count: activityCounts[activity.id] || 0
        }));
    }, [activitiesList, userActivityData]);

    const createBubbleChart = useCallback(() => {
        const data = processActivityData();
        
        // Clear previous chart
        d3.select(svgRef.current).selectAll("*").remove();

        // Set up dimensions - smaller for side-by-side layout
        const margin = { top: 20, right: 20, bottom: 60, left: 20 };
        const width = 400 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Create SVG
        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Create color scale based on frequency (lightest to darkest rgb(104, 187, 183))
        const colorScale = d3.scaleSequential()
            .domain([0, d3.max(data, d => d.count)])
            .interpolator(d3.interpolateRgb("#E0F6FF", "#2E8B57"));

        // Create size scale - all bubbles same size since color represents frequency
        const sizeScale = d3.scaleSqrt()
            .domain([0, d3.max(data, d => d.count)])
            .range([20, 20]);

        // Create simulation
        const simulation = d3.forceSimulation(data)
            .force("charge", d3.forceManyBody().strength(5))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide().radius(d => sizeScale(d.count) + 5));

        // Create bubbles
        const bubbles = svg.selectAll(".bubble")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "bubble")
            .style("cursor", "pointer");

        // Add bubble circles
        bubbles.append("circle")
            .attr("r", d => sizeScale(d.count))
            .style("fill", d => {
                const color = colorScale(d.count);
                console.log(`Activity: ${d.activity_name}, Count: ${d.count}, Color: ${color}`);
                return color;
            })
            .style("opacity", 0.7)
            .on("mouseover", function(event, d) {
                console.log("Mouse over bubble:", d.activity_name, "count:", d.count);
                d3.select(this)
                    .style("opacity", 1)
                    .transition()
                    .duration(200)
                    .attr("r", sizeScale(d.count) * 1.2);
                
                // Show tooltip
                showTooltip(event, d);
            })
            .on("mouseout", function(event, d) {
                d3.select(this)
                    .style("opacity", 0.7)
                    .transition()
                    .duration(200)
                    .attr("r", sizeScale(d.count));
                
                // Hide tooltip
                hideTooltip();
            })
            .on("click", function(event, d) {
                // Add click animation
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("r", sizeScale(d.count) * 1.2)
                    .transition()
                    .duration(200)
                    .attr("r", sizeScale(d.count));
            });

        // Update positions on simulation tick
        simulation.on("tick", () => {
            bubbles.attr("transform", d => `translate(${d.x},${d.y})`);
        });

    }, [processActivityData]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Only fetch data if we have a valid month and userId
                if (!selectedMonth || !/^\d{4}-\d{2}$/.test(selectedMonth)) {
                    setLoading(false);
                    return;
                }
                
                // Fetch both activities list and user activity data
                const [activitiesData, userActivityData] = await Promise.all([
                    api.activities.getAll(),
                    currentUserId ? api.activities.getUserActivitiesForMonth(currentUserId, selectedMonth) : Promise.resolve([])
                ]);
                
                setActivitiesList(activitiesData);
                setUserActivityData(userActivityData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching activity data:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUserId, selectedMonth]);

    useEffect(() => {
        if (!loading && activitiesList.length > 0) {
            createBubbleChart();
        }
    }, [loading, activitiesList, userActivityData, createBubbleChart]);

    // Tooltip functions
    const showTooltip = (event, d) => {
        console.log("Creating tooltip for:", d.activity_name, "count:", d.count);
        
        // Remove any existing tooltips first
        d3.selectAll(".tooltip").remove();
        
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("position", "fixed")
            .style("background", "white")
            .style("color", "#878f99")
            .style("padding", "8px 12px")
            .style("border-radius", "15px")
            .style("font-family", "Raleway, sans-serif")
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .style("letter-spacing", "1px")
            .style("pointer-events", "none")
            .style("z-index", "99999")
            .style("box-shadow", "0 2px 8px rgba(0,0,0,0.2)")
            .style("min-width", "100px")
            .style("text-align", "center")
            .style("opacity", "1");

        tooltip.html(`
            <div style="margin-bottom: 3px; text-align: center;">
                <img src="${d.activity_url}" alt="${d.activity_name}" style="width: 30px; height: 30px; margin-bottom: 2px;" />
            </div>
            <div style="margin-bottom: 2px; font-size: 12px; font-weight: bold;">${d.activity_name}</div>
            <div style="font-size: 11px;">Selected ${d.count} time${d.count !== 1 ? 's' : ''}</div>
        `);

        tooltip.style("left", (event.clientX + 20) + "px")
            .style("top", (event.clientY - 20) + "px");
            
        console.log("Tooltip created and positioned");
    };

    const hideTooltip = () => {
        d3.selectAll(".tooltip").remove();
    };

    if (loading) {
        return <div>Loading activities chart...</div>;
    }

    if (error) {
        return <div>Error loading activities chart: {error}</div>;
    }

    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <p style={{ 
                    color: 'rgb(98, 104, 110)', 
                    fontSize: '14px',
                    fontFamily: 'Raleway, sans-serif'
                }}>
                    Bubble size represents how often you selected each activity
                </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <svg ref={svgRef}></svg>
            </div>
        </div>
    );
}
